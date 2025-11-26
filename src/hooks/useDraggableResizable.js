import { useRef, useState } from "react";

export const useDraggableResizable = (defaultPos = { x: 200, y: 100 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState(defaultPos);
  const [size, setSize] = useState({ width: 520, height: 320 });

  const clampToViewport = (x, y, width, height) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let nx = x;
    let ny = y;
    const edge = 20;

    if (nx < edge) nx = 10;
    if (vw - (nx + width) < edge) nx = vw - width - 10;
    if (ny < edge) ny = 10;
    if (vh - (ny + height) < edge) ny = vh - height - 10;

    nx = Math.max(0, Math.min(nx, vw - width));
    ny = Math.max(0, Math.min(ny, vh - height));
    return { x: nx, y: ny };
  };

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
      setPosition(prev =>
        clampToViewport(prev.x, prev.y, size.width, size.height)
      );
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
      const newWidth = Math.max(320, width + (moveEvent.clientX - startX));
      const newHeight = Math.max(200, height + (moveEvent.clientY - startY));
      setSize({
        width: newWidth,
        height: newHeight
      });
    };

    const stop = () => {
      setPosition(prev =>
        clampToViewport(prev.x, prev.y, size.width, size.height)
      );
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", stop);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", stop);
  };

  return { ref, position, size, onMouseDownDrag, onMouseDownResize };
};
