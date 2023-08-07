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
        <h1 className="mb-4 text-lg font-semibold">Advanced settings</h1>
        <p className="mb-6 rounded-lg  border bg-warning-50 px-3 py-2 text-sm text-warning-700">
          Note that these are advanced settings that should be adjusted with
          caution.
        </p>
        <Heading>Snapshot Space URL</Heading>
      </div>
    </Modal>
  );
}

const Heading = (props: { children: React.ReactNode }) => (
  <h2 className="flex items-center gap-1 font-semibold">
    {props.children}
    <Icon name="help" className="inline h-4 w-4 text-gray-400" />
  </h2>
);
