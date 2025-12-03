import React, { useEffect, useState } from "react";

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMove = e => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x - 40,
        top: pos.y - 40,
        width: 80,
        height: 80,
        pointerEvents: "none",
        borderRadius: "50%",
        boxShadow: "0 0 40px rgba(0, 209, 178, 0.6)",
        opacity: 0.2,
        zIndex: 5,
        transition: "transform 0.08s linear",
        transform: "translate3d(0,0,0)"
      }}
    />
  );
};

export default CursorGlow;
