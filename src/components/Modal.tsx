import { PropsWithChildren, ReactNode } from 'react';
import { ModalBtn2 } from './ModalBtn';

export const Modal = ({
  btnContent,
  btnPrimary,
  btn,
  children,
}: PropsWithChildren<{
  btnPrimary?: boolean;
  btn?: ReactNode;
  btnContent: React.ReactNode;
}>) => {
  const modalId = `${Math.random()}`.replace('.', '_');
  return (
    <>
      <ModalBtn2 btn={btn} primary={!!btnPrimary} modalId={modalId}>
        {btnContent}
      </ModalBtn2>
      <dialog id={modalId} className="modal">
        <div className="modal-box ">
          {children}

          <div
            dangerouslySetInnerHTML={{
              __html: `<button class="btn" onclick="window['${modalId}'].close()">Close</button>`,
            }}
            className="modal-action mt-1"
          >
            {/* if there is a button in form, it will close the modal */}
          </div>
        </div>
      </dialog>
    </>
  );
};
