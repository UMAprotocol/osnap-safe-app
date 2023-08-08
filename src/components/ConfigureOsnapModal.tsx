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
  const activateBackgroundStyle = "bg-[#3D3EED]";
  const deactivateBackgroundStyle = "bg-[#D53654]";
  const backgroundStyle =
    props.action === "activate"
      ? activateBackgroundStyle
      : deactivateBackgroundStyle;
  return (
    <Modal {...props}>
      <div className="max-w-[464px]">
        <h1 className="text-lg font-semibold text-center mb-6">
          Configure oSnap
        </h1>
        <div className="grid grid-cols-[auto,1fr] items-baseline gap-2 mb-6">
          <Icon name="info" className="w-4 h-4" />
          <p>
            oSnap seamlessly integrates with Snapshot and your treasury,
            automatically executing governance votes on-chain. Bypass the need
            for privileged signers to create a DAO that&apos;s more efficient
            and truly decentralized.
            <Link
              href="todo"
              className="flex mt-3 items-center gap-1 hover:opacity-75 transition text-[#3D3EED] font-medium"
            >
              Learn more <Icon name="external-link" className="w-4 h-4" />
            </Link>
          </p>
        </div>
        <Link
          className={`flex items-center justify-center gap-1 hover:opacity-75 transition text-white font-medium rounded-full h-[40px] mb-4 ${backgroundStyle}`}
          href="todo"
        >
          {props.action === "activate" ? "Activate" : "Deactivate"} oSnap{" "}
          <Icon name="external-link" className="w-4 h-4" />
        </Link>
        <p className="text-center text-sm font-medium opacity-50">
          Note that the{" "}
          {props.action === "activate" ? "activation" : "deactivation"} process
          takes place in the Safe app
        </p>
      </div>
    </Modal>
  );
}
