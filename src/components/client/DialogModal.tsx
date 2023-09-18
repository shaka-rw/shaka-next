'use client';
import React, { PropsWithChildren } from 'react';

const DialogModal = ({
  open,
  isPending = false,
  children,
  onClose,
}: PropsWithChildren<{
  isPending?: boolean;
  open: boolean;
  onClose: () => void;
}>) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = React.useState(open);

  const handleClose = () => {
    setIsOpen(false);
    dialogRef.current?.close();
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (open) {
      setIsOpen(true);
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">{children}</div>
      <form method="dialog" className={isPending ? '' : 'modal-backdrop'}>
        <button disabled={isPending} onClick={handleClose}>
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-lg" />
            </>
          ) : (
            <>Close</>
          )}
        </button>
      </form>
    </dialog>
  );
};

export default DialogModal;
