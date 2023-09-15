'use client';
import { PropsWithChildren, ReactNode } from 'react';
import { ModalBtn2 } from '../ModalBtn';
import { MdClose } from 'react-icons/md';

const modalId = 'modal-100'; //`${Math.random()}`.replace('.', '_');

export function closeModal(modalId: string) {
  const modal = document.getElementById(modalId) as HTMLDialogElement;
  if (modal) modal.close();
}

export function openModal(modalId: string) {
  const modal = document.getElementById(modalId) as HTMLDialogElement;
  if (modal) modal.showModal();
}

export const ClientModal = ({
  btnContent,
  btnPrimary,
  modalId: customId,
  btn,
  lg = false,
  onClose,
  className = '',
  children,
}: PropsWithChildren<{
  btnPrimary?: boolean;
  btn?: ReactNode;
  btnContent: React.ReactNode;
  className?: string;
  lg?: boolean;
  modalId?: string;
  onClose?: () => void;
}>) => {
  const handleClose = () => {
    onClose && onClose();
    const dialog = document.querySelector(
      `#${customId ?? modalId}`
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  return (
    <>
      <ModalBtn2 btn={btn} primary={!!btnPrimary} modalId={customId ?? modalId}>
        {btnContent}
      </ModalBtn2>
      <dialog id={customId ?? modalId} className="modal">
        <div className={`modal-box ${lg ? ' max-w-3xl ' : ''} ${className}`}>
          {children}
          <div className="modal-action mt-1">
            <button onClick={handleClose} className="btn btn-secondary">
              <MdClose />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
