import { PropsWithChildren, ReactNode } from 'react';
import { ModalBtn2 } from './ModalBtn';

const modalId = '100'; //`${Math.random()}`.replace('.', '_');

export const Modal = ({
  btnContent,
  btnPrimary,
  modalId: customId,
  btn,
  children,
}: PropsWithChildren<{
  btnPrimary?: boolean;
  btn?: ReactNode;
  btnContent: React.ReactNode;
  modalId?: string;
}>) => {
  return (
    <>
      <ModalBtn2 btn={btn} primary={!!btnPrimary} modalId={customId ?? modalId}>
        {btnContent}
      </ModalBtn2>
      <dialog id={customId ?? modalId} className="modal">
        <div className="modal-box ">
          {children}

          <div
            dangerouslySetInnerHTML={{
              __html: `<button class="btn" onclick="window['${
                customId ?? modalId
              }'].close()">Close</button>`,
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
