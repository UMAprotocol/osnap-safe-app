import { MouseEvent, ReactNode, useRef } from "react";

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

type Props = { children: ReactNode } & ReturnType<typeof useModal>;

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
    <dialog ref={modalRef} onClick={onClick} {...dialogProps}>
      {children}
    </dialog>
  );
}
