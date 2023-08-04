import { Modal, useModal } from "./Modal";

export function useAdvancedSettingsModal() {
  return useModal();
}

export type AdvancedSettingsModalProps = ReturnType<
  typeof useAdvancedSettingsModal
>;

export function AdvancedSettingsModal(props: AdvancedSettingsModalProps) {
  return (
    <Modal {...props}>
      <div className="max-w-[464px]"></div>
    </Modal>
  );
}
