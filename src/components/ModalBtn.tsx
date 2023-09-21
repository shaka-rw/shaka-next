'use client';

import React, { PropsWithChildren, ReactNode } from 'react';
import { MdAdd } from 'react-icons/md';

const ModalBtn = ({ modalId }: { modalId: string }) => {
  return (
    <button
      className="btn"
      onClick={() => (window[modalId as any] as any).showModal()}
    >
      <MdAdd /> Add category
    </button>
  );
};
export const ModalBtn2 = ({
  modalId,
  primary = false,
  btn,
  children,
  nonDialog = false,
}: PropsWithChildren<{
  btn?: ReactNode;
  primary?: boolean;
  modalId: string;
  nonDialog?: boolean;
}>) => {
  const handleShowModal = () => {
    if (nonDialog) {
      const modal = document.getElementById(modalId);
      modal?.classList.add('modal-open');
      modal?.classList.add('hidden');
      modal?.setAttribute('open', 'true');
    } else {
      (window[modalId as any] as any).showModal();
    }
  };
  return btn ? (
    <div
      className="inline-flex items-center justify-center"
      tabIndex={0}
      onClick={handleShowModal}
    >
      <template className="modal-open" />
      {btn}
    </div>
  ) : (
    <button
      className={`btn ${primary ? 'btn-primary' : ''}`}
      onClick={handleShowModal}
    >
      {children}
    </button>
  );
};

export default ModalBtn;
