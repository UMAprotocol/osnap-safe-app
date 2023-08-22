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
import { useState, type FormEventHandler } from "react";
import { useImmer, type Updater } from "use-immer";

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
  const { disabled = false } = props;
  const [challengePeriod, setChallengePeriod] = useImmer(
    props.config.challengePeriod,
  );
  const [collateralCurrency, setCollateralCurrency] = useState(
    currencyOptions[0],
  );
  const bondInputProps = useNumberInput({
    label: "Bond amount",
    initialValue: props.config.bondAmount,
    required: true,
  });
  const quorumInputProps = useNumberInput({
    label: "Voting Quorum",
    initialValue: props.config.quorum,
    isWholeNumber: true,
    min: 1,
    placeholder: "5",
    required: true,
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!bondInputProps.valid || !quorumInputProps.valid) return;
    props.setConfig((draft) => {
      draft.challengePeriod = challengePeriod;
      draft.collateralCurrency = collateralCurrency.value;
      draft.bondAmount = bondInputProps.value;
      draft.quorum = quorumInputProps.value;
    });
    props.closeModal();
  };

  return (
    <Modal {...props}>
      <div className="max-w-[520px] p-6">
        <h1 className="mb-4 text-lg font-semibold">Advanced settings</h1>
        {!disabled && (
          <p className="mb-6 rounded-lg  border bg-warning-50 px-3 py-2 text-sm text-warning-700">
            Note that these are advanced settings that should be adjusted with
            caution.
          </p>
        )}
        <Heading>Snapshot Space URL</Heading>
        <p className="mb-6 rounded-lg border border-gray-300 bg-white px-3 py-2 opacity-50 shadow-xs">
          {props.config.spaceUrl}
        </p>
        <form action="" method="dialog" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2">
            <RadioDropdown
              label="Currency"
              items={currencyOptions}
              selected={collateralCurrency}
              onSelect={setCollateralCurrency}
              disabled
            />
            <NumberInput {...bondInputProps} disabled />
            <RadioDropdown
              label="Challenge period"
              items={challengePeriodOptions}
              selected={challengePeriodToDropdownOption(challengePeriod)}
              onSelect={(item) => {
                setChallengePeriod(challengePeriodFromDropdownOption(item));
              }}
              disabled
            />
            <NumberInput {...quorumInputProps} disabled />
          </div>
          {!disabled && (
            <button
              type="submit"
              formMethod="dialog"
              disabled={!bondInputProps.valid || !quorumInputProps.valid}
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
