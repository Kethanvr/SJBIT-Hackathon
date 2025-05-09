import React from "react";

export default function ModalContainer({ modalRef, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg w-[95%] max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
      >
        {children}
      </div>
    </div>
  );
}
