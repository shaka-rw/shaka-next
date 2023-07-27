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
}: PropsWithChildren<{
  btn?: ReactNode;
  primary?: boolean;
  modalId: string;
}>) => {
  return btn ? (
    <div
      className="inline-flex"
      tabIndex={0}
      onClick={() => (window[modalId as any] as any).showModal()}
    >
      {btn}
    </div>
  ) : (
    <button
      className={`btn ${primary ? 'btn-primary' : ''}`}
      onClick={() => (window[modalId as any] as any).showModal()}
    >
      {children}
    </button>
  );
};

export default ModalBtn;
