import { MouseEvent, ReactNode, useRef } from "react";
import { Icon } from ".";

export function useModal() {
  const modalRef = useRef<HTMLDialogElement>(null);

  function showModal() {
    if (!modalRef.current) return;
    document.body.classList.add("overflow-hidden");
    modalRef.current.showModal();
  }

  function closeModal() {
    if (!modalRef.current) return;
    document.body.classList.remove("overflow-hidden");
    modalRef.current.close();
  }

  return { modalRef, showModal, closeModal };
}

export type ModalProps = ReturnType<typeof useModal>;

type Props = { children: ReactNode } & ModalProps;

export function Modal({
  children,
  modalRef,
  showModal,
  closeModal,
  ...dialogProps
}: Props) {
  function onClick(event: MouseEvent) {
    if (!modalRef.current) return;
    if (!isClickOnModalContent(event)) closeModal();
  }

  function isClickOnModalContent(event: MouseEvent) {
    if (!modalRef.current) return false;
    const boundingRect = modalRef.current.getBoundingClientRect();
    return (
      event.clientX < boundingRect.right &&
      event.clientX > boundingRect.left &&
      event.clientY > boundingRect.top &&
      event.clientY < boundingRect.bottom
    );
  }

  return (
    <dialog
      ref={modalRef}
      onClick={onClick}
      {...dialogProps}
      className="relative rounded-2xl p-6  shadow-[0px_4px_56px_0px_rgba(0,0,0,0.25)]"
    >
      <button
        onClick={closeModal}
        className="p-3 absolute right-1 top-1 hover:opacity-50 transition"
        aria-label="Close modal"
      >
        <Icon name="x" className="w-5 h-5"></Icon>
      </button>
      {children}
    </dialog>
  );
}
