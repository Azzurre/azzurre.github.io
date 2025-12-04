import React, { useState } from "react";

const VolumeControl = () => {
  const [volume, setVolume] = useState(0.1);
  return (
    <div id="volume-control-container">
      Volume:
      <input
        type="range"
        id="volume-control"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={e => setVolume(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default VolumeControl;
