import Link from "next/link";
import { Icon } from ".";
import { Modal, ModalProps, useModal } from "./Modal";

export function useConfigureOsnapModal() {
  return useModal();
}

type Props = ModalProps & {
  action: "activate" | "deactivate";
};

export function ConfigureOsnapModal(props: Props) {
  return (
    <Modal {...props}>
      <div>
        <h1>Configure oSnap</h1>
        <p>
          <Icon name="info" className="w-4 h-4" />
          oSnap seamlessly integrates with Snapshot and your treasury,
          automatically executing governance votes on-chain. Bypass the need for
          privileged signers to create a DAO that&apos;s more efficient and
          truly decentralized.
        </p>
        <Link href="todo">Learn more <Icon name="external-link" /></Link>
        <Link
          href="todo"
        >
          {props.action === "activate" ? "Activate" : "Deactivate"} oSnap
        </Link>
        <p>Note that the { props.action === "activate" ? "activation" : "deactivation"} process takes place in the Safe app</p>
      </div>
    </Modal>
  );
}
