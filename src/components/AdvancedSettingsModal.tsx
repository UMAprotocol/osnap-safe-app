import { Icon } from "@/components";
import { useCallback } from "react";
import { useImmer } from "use-immer";
import { Modal, useModal } from "./Modal";

export function useAdvancedSettingsModal() {
  const [errors, setErrors] = useImmer(new Set<string>());

  const addError = useCallback(
    (error: string) => {
      setErrors((errors) => {
        errors.add(error);
      });
    },
    [setErrors],
  );

  const removeError = useCallback(
    (error: string) => {
      setErrors((errors) => {
        errors.delete(error);
      });
    },
    [setErrors],
  );

  const clearErrors = useCallback(() => {
    setErrors((errors) => {
      errors.clear();
    });
  }, [setErrors]);
  return useModal();
}

export type AdvancedSettingsModalProps = ReturnType<
  typeof useAdvancedSettingsModal
>;

export function AdvancedSettingsModal(props: AdvancedSettingsModalProps) {
  return (
    <Modal {...props}>
      <div className="max-w-[520px]">
        <h1 className="font-semibold text-lg mb-4">Advanced settings</h1>
        <p className="text-sm text-warning-700  rounded-lg bg-warning-50 border px-3 py-2 mb-6">
          Note that these are advanced settings that should be adjusted with
          caution.
        </p>
        <Heading>Snapshot Space URL</Heading>
      </div>
    </Modal>
  );
}

const Heading = (props: { children: React.ReactNode }) => (
  <h2 className="font-semibold flex gap-1 items-center">
    {props.children}
    <Icon name="help" className="text-gray-400 w-4 h-4 inline" />
  </h2>
);
