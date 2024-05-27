import React, { useState } from "react";
import "../../App.css";

type CoordinatesType = { x: number | null; y: number | null };

interface PointCoordinatesProps {
  onPointPlacement: (coordinates: {
    x: number | null;
    y: number | null;
  }) => CoordinatesType;
}

function PointCoordinates({ onPointPlacement }: PointCoordinatesProps) {
  const handleClick = (e: { clientX: number; clientY: number }) => {
    const x = e.clientX;
    const y = e.clientY;
    console.log(x, y);
    onPointPlacement({ x, y });
  };

  return (
    <>
      <div className="point-placement" onClick={handleClick}></div>
    </>
  );
}

function PointPlacement() {
  const [dotPosition, setDotPosition] = useState({ x: null, y: null });
  const predefinedPoint = { x: 100, y: 100 };

  const calculateDistance = () => {
    if (!dotPosition.x || !dotPosition.y) {
      alert("Please place the dot first.");
      return;
    }

    const distance = Math.sqrt(
      Math.pow(dotPosition.x - predefinedPoint.x, 2) +
        Math.pow(dotPosition.y - predefinedPoint.y, 2)
    );
    alert(
      `Distance between the dot and predefined point: ${distance.toFixed(2)}`
    );
  };

  const handlePointPlacement = (
    coordinates: React.SetStateAction<{ x: null; y: null }>
  ) => {
    setDotPosition(coordinates);
  };

  return (
    <div className="app">
      <div className="square">
        <PointCoordinates onPointPlacement={handlePointPlacement} />
        {dotPosition.x !== null && dotPosition.y !== null && (
          <>
            <div
              className="dot"
              style={{ top: dotPosition.y, left: dotPosition.x }}
            ></div>
            <div className="dot" style={{ top: "100px", left: "100px" }}></div>
          </>
        )}
      </div>
      <button onClick={calculateDistance}>Calculate Distance</button>
    </div>
  );
}

export default PointPlacement;
