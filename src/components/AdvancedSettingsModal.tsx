import { Icon } from "@/components";
import { useState } from "react";
import { Modal, useModal } from "./Modal";
import { NumberInput, useNumberInput } from "./NumberInput";
import { RadioDropdown } from "./RadioDropdown";

type Props = {
  snapshotSpaceUrl: string;
};

export function useAdvancedSettingsModal(props: Props) {
  const modalProps = useModal();
  return {
    ...modalProps,
    ...props,
  };
}

export type AdvancedSettingsModalProps = ReturnType<
  typeof useAdvancedSettingsModal
>;

const currencyOptions = [
  {
    label: "USDC",
    value: "USDC",
  },
  {
    label: "WETH",
    value: "WETH",
  },
];

const second = 1;
const minute = 60 * second;
const hour = 60 * minute;

const challengePeriodOptions = [
  {
    label: "2 hours",
    value: 2 * hour,
  },
  {
    label: "8 hours",
    value: 8 * hour,
  },
  {
    label: "24 hours",
    value: 24 * hour,
  },
  {
    label: "48 hours",
    value: 48 * hour,
  },
];

export function AdvancedSettingsModal(props: AdvancedSettingsModalProps) {
  const [challengePeriod, setChallengePeriod] = useState(
    challengePeriodOptions[0],
  );
  const [currency, setCurrency] = useState(currencyOptions[0]);
  const bondInputProps = useNumberInput({
    label: "Bond amount",
  });
  const quorumInputProps = useNumberInput({
    label: "Voting Quorum",
    isWholeNumber: true,
    min: 1,
    placeholder: "5",
  });

  return (
    <Modal {...props}>
      <div className="max-w-[520px]">
        <h1 className="mb-4 text-lg font-semibold">Advanced settings</h1>
        <p className="mb-6 rounded-lg  border bg-warning-50 px-3 py-2 text-sm text-warning-700">
          Note that these are advanced settings that should be adjusted with
          caution.
        </p>
        <Heading>Snapshot Space URL</Heading>
        <p className="mb-6 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-500 shadow-xs">
          {props.snapshotSpaceUrl}
        </p>
        <form action="">
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2">
            <RadioDropdown
              label="Currency"
              items={currencyOptions}
              selected={currency}
              onSelect={setCurrency}
            />
            <NumberInput {...bondInputProps} />
            <RadioDropdown
              label="Challenge period"
              items={challengePeriodOptions}
              selected={challengePeriod}
              onSelect={setChallengePeriod}
            />
            <NumberInput {...quorumInputProps} />
          </div>
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
