'use client';
import { PropsWithChildren, ReactNode } from 'react';
import { ModalBtn2 } from '../ModalBtn';

const modalId = 'mod-100'; //`${Math.random()}`.replace('.', '_');

const NonDialogModal = ({
  btnContent,
  btnPrimary,
  modalId: customId,
  btn,
  lg = false,
  className = '',
  children,
  nonDialog = true,
}: PropsWithChildren<{
  btnPrimary?: boolean;
  btn?: ReactNode;
  btnContent: React.ReactNode;
  className?: string;
  lg?: boolean;
  nonDialog?: boolean;
  modalId?: string;
}>) => {
  const handleCloseModal = () => {
    if (nonDialog) {
      const modal = document.getElementById(customId ?? modalId);
      modal?.classList.remove('modal-open');
      modal?.classList.remove('hidden');
      modal?.removeAttribute('open');
    } else {
      //   (window[(customId ?? modalId) as any] as any).close();
      (
        document.getElementById(customId ?? modalId) as HTMLDialogElement | null
      )?.close();
    }
  };

  return (
    <>
      <ModalBtn2
        nonDialog={nonDialog}
        btn={btn}
        primary={!!btnPrimary}
        modalId={customId ?? modalId}
      >
        {btnContent}
      </ModalBtn2>
      <dialog id={customId ?? modalId} className="modal">
        <div className={`modal-box ${lg ? ' max-w-3xl ' : ''} ${className}`}>
          {children}
          <div className="modal-action mt-1">
            <button className="btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NonDialogModal;
