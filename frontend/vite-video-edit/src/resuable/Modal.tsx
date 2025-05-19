import React, { type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: ReactNode;
  header: string;
  open: boolean;
  type?: "small" | string;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({ children, header, open, type, onClose }) => {
  const modalRoot = document.querySelector("#modal-root");

  if (!modalRoot) {
    console.error("Element with id #modal-root not found.");
    return null;
  }

  let className = open ? "mdl" : "mdl u-display-none";
  if (type === "small") className += " mdl-sm";

  return createPortal(
    <div className={className}>
      <div className="mdl__content">
        <div className="mdl__header">
          <span className="mdl__close" onClick={onClose}>
            &times;
          </span>
          <h3 className="heading-tertiary">{header}</h3>
        </div>
        <div className="mdl__body">{children}</div>
      </div>
    </div>,
    modalRoot
  );
};
export default Modal
