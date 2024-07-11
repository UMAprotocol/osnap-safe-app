"use client";

import {
  Icon,
  Modal,
  NumberInput,
  RadioDropdown,
  useModal,
  useNumberInput,
  type DropdownItem,
} from "@/components";
import {
  ChallengePeriod,
  ChallengePeriodSeconds,
  ChallengePeriodText,
  challengePeriods,
  currencies,
} from "@/constants";
import { type OgDeployerConfig } from "@/types";
import { useState, type FormEventHandler, useEffect } from "react";
import { useImmer, type Updater } from "use-immer";
import { useGetMinimumBond, useLoadOgDeployerConfig } from "@/hooks";
import { StandardConfigFormWarning } from "./StandardConfigWarning";
import { formatUnits } from "viem";

type Props = {
  config: OgDeployerConfig;
  setConfig: Updater<OgDeployerConfig>;
  disabled?: boolean | undefined;
};

export type AdvancedSettingsModalProps = ReturnType<
  typeof useAdvancedSettingsModal
>;

export function useAdvancedSettingsModal(props: Props) {
  const modalProps = useModal();
  return {
    ...modalProps,
    ...props,
  };
}

const currencyOptions = currencies.map((currency) => ({
  label: currency,
  value: currency,
}));

const challengePeriodOptions = challengePeriods.map(
  challengePeriodToDropdownOption,
);

export function AdvancedSettingsModal(props: AdvancedSettingsModalProps) {
  const loadedConfig = useLoadOgDeployerConfig(props.config);

  const [loaded, setLoaded] = useState(false);

  const { disabled = false } = props;
  const [challengePeriod, setChallengePeriod] = useImmer(
    props.config.challengePeriod,
  );
  const [collateralCurrency, setCollateralCurrency] = useState(
    currencyOptions[0],
  );

  const { data: minBondWeth } = useGetMinimumBond({
    tokenSymbol: "WETH",
  });
  const { data: minBondUsdc } = useGetMinimumBond({
    tokenSymbol: "USDC",
  });

  // as bigint
  const minimumBondAmount = (() => {
    if (collateralCurrency.value === "USDC") {
      return minBondUsdc ? Number(formatUnits(minBondUsdc, 6)) : 0;
    }
    return minBondWeth ? Number(formatUnits(minBondWeth, 18)) : 0;
  })();

  const bondInputProps = useNumberInput({
    label: "Bond amount",
    initialValue: props.config.bondAmount,
    required: true,
    min: minimumBondAmount,
  });

  const quorumInputProps = useNumberInput({
    label: "Voting Quorum",
    initialValue: props.config.quorum,
    isWholeNumber: true,
    min: parseInt(loadedConfig.data?.quorum ?? props.config.quorum),
    placeholder: parseInt(
      loadedConfig.data?.quorum ?? props.config.quorum,
    ).toString(),
    required: true,
  });
  const votingPeriodInputProps = useNumberInput({
    label: "Voting Period hours",
    initialValue: props.config.votingPeriodHours,
    isWholeNumber: true,
    min: parseInt(
      loadedConfig.data?.votingPeriodHours ?? props.config.votingPeriodHours,
    ),
    placeholder: parseInt(props.config.votingPeriodHours).toString(),
    required: true,
  });

  // we have data that loads from snapshot and on chain, so we need to update our inputs when this comes in.
  // we only do it once we see everything is loaded, and never again.
  useEffect(() => {
    if (loaded) return;
    if (loadedConfig.isLoading) return;
    if (loadedConfig.error) {
      console.error("Error loading snapshot settings:", loadedConfig.error);
      return;
    }
    if (!loadedConfig.data) return;

    setLoaded(true);

    const votingPeriodHours = loadedConfig.data.votingPeriodHours;
    const bondAmount = loadedConfig.data.bondAmount;
    const quorum = loadedConfig.data.quorum;
    const collateralCurrency = {
      label: loadedConfig.data.collateralCurrency,
      value: loadedConfig.data.collateralCurrency,
    };
    const challengePeriod = loadedConfig.data.challengePeriod;

    votingPeriodInputProps.setValue(votingPeriodHours);
    bondInputProps.setValue(bondAmount);
    quorumInputProps.setValue(quorum);
    setCollateralCurrency(collateralCurrency);
    setChallengePeriod(challengePeriod);
  }, [
    props,
    loadedConfig,
    loaded,
    setLoaded,
    votingPeriodInputProps,
    bondInputProps,
    quorumInputProps,
    setChallengePeriod,
  ]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (
      !bondInputProps.valid ||
      !quorumInputProps.valid ||
      !votingPeriodInputProps.valid
    )
      return;
    props.setConfig((draft) => {
      draft.challengePeriod = challengePeriod;
      draft.collateralCurrency = collateralCurrency.value;
      draft.bondAmount = bondInputProps.value;
      draft.quorum = quorumInputProps.value;
      draft.votingPeriodHours = votingPeriodInputProps.value;
    });
    props.closeModal();
  };

  /**
   * Use this to check the form for auto execution
   */
  const configIsStandard = (() => {
    const isWeth = collateralCurrency.value === "WETH";
    let isCorrectAmount = false;
    try {
      isCorrectAmount = Number(bondInputProps.value) === 2;
    } catch (err) {
      console.warn("Error parsing bondInputProps as a number:", err);
      isCorrectAmount = false;
    }

    return isWeth && isCorrectAmount;
  })();

  return (
    <Modal {...props}>
      <div className="max-w-[520px] p-6">
        <h1 className="mb-4 text-lg font-semibold">Advanced settings</h1>
        <StandardConfigFormWarning isStandard={configIsStandard} />
        <Heading>Snapshot Space URL</Heading>
        <p className="mb-6 rounded-lg border border-gray-300 bg-white px-3 py-2 opacity-50 shadow-xs">
          {props.config.spaceUrl}
        </p>
        <form action="" method="dialog" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2">
            <RadioDropdown
              label="Bond Currency"
              items={currencyOptions}
              selected={collateralCurrency}
              onSelect={setCollateralCurrency}
              disabled={disabled}
            />
            <NumberInput {...bondInputProps} disabled={disabled} />
            <NumberInput {...quorumInputProps} disabled={disabled} />
            <NumberInput {...votingPeriodInputProps} disabled={disabled} />
            <RadioDropdown
              label="Challenge period"
              items={challengePeriodOptions}
              selected={challengePeriodToDropdownOption(challengePeriod)}
              onSelect={(item) => {
                setChallengePeriod(challengePeriodFromDropdownOption(item));
              }}
              disabled={disabled}
            />
          </div>
          {!disabled && (
            <button
              type="submit"
              formMethod="dialog"
              disabled={
                !bondInputProps.valid ||
                !quorumInputProps.valid ||
                !votingPeriodInputProps.valid
              }
              className="mt-6 grid w-full place-items-center rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:brightness-200 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:brightness-100"
            >
              Save
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
}

const Heading = (props: { children: React.ReactNode }) => (
  <h2 className="mb-1 flex items-center gap-1 font-semibold">
    {props.children}
    <Icon name="help" className="inline h-4 w-4 text-gray-400" />
  </h2>
);

function challengePeriodToDropdownOption(
  challengePeriod: ChallengePeriod | undefined,
) {
  if (!challengePeriod) challengePeriod = challengePeriods[0];

  return {
    label: challengePeriod.text,
    value: challengePeriod.seconds,
  };
}

function challengePeriodFromDropdownOption(
  item: DropdownItem<ChallengePeriodSeconds, ChallengePeriodText>,
) {
  return {
    seconds: item.value,
    text: item.label,
  } as ChallengePeriod;
}
