import React from "react";
import { useDraggableResizable } from "../hooks/useDraggableResizable.js";

const Window = ({ id, title, children, zIndex, onClose, onFocus, isActive }) => {
  const { ref, position, size, onMouseDownDrag, onMouseDownResize } =
    useDraggableResizable();

  return (
    <div
      ref={ref}
      className={`window default${isActive ? " active" : ""}`}
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex
      }}
      onMouseDown={onFocus}
    >
      <div className="window-header" onMouseDown={onMouseDownDrag}>
        <span className="title">{title}</span>
        <span className="close-btn" onClick={onClose} aria-label="Close window">
          &times;
        </span>
      </div>
      <div className="window-content">{children}</div>
      <div className="resize-handle" onMouseDown={onMouseDownResize}></div>
    </div>
  );
};

export default Window;
