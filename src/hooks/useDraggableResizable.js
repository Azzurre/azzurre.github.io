import { useRef, useState } from "react";

export const useDraggableResizable = (defaultPos = { x: 200, y: 100 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState(defaultPos);
  const [size, setSize] = useState({ width: 520, height: 320 });

  const onMouseDownDrag = e => {
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = position;

    const handleMove = moveEvent => {
      setPosition({
        x: x + (moveEvent.clientX - startX),
        y: y + (moveEvent.clientY - startY)
      });
    };

    const stop = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", stop);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", stop);
  };

  const onMouseDownResize = e => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const { width, height } = size;

    const handleMove = moveEvent => {
      setSize({
        width: Math.max(320, width + (moveEvent.clientX - startX)),
        height: Math.max(200, height + (moveEvent.clientY - startY))
      });
    };

    const stop = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", stop);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", stop);
  };

  return { ref, position, size, onMouseDownDrag, onMouseDownResize };
};
