import { animate, motion, useMotionValue } from "framer-motion";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { useGesture } from "@use-gesture/react";
import map from "./assets/images/map.svg";

export default function Home() {
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });

  return (
    <>
      <p className="image-cropper">Image Cropper</p>
      <div className="container">
        <ImageCropper src={map} crop={crop} onCropChange={setCrop} />
        <div className="crop-details">
          <p>Crop X: {Math.round(crop.x)}</p>
          <p>Crop Y: {Math.round(crop.y)}</p>
          <p>Crop Scale: {Math.round(crop.scale * 100) / 100}</p>
        </div>
      </div>
    </>
  );
}

type ImageCropperProps = {
  src: string;
  crop: { x: number; y: number; scale: number };
  onCropChange: Dispatch<
    SetStateAction<{ x: number; y: number; scale: number }>
  >;
};

function ImageCropper({ src, crop, onCropChange }: ImageCropperProps) {
  const x = useMotionValue(crop.x);
  const y = useMotionValue(crop.y);
  const scale = useMotionValue(crop.scale);
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);

  const imageRef = useRef();
  const imageContainerRef = useRef();

  useEffect(() => {
    x.set(crop.x);
    y.set(crop.y);
    scale.set(crop.scale);
  }, [crop, x, y, scale]);

  useGesture(
    {
      onDrag: ({ dragging, offset: [ox, oy] }) => {
        setIsDragging(dragging);
        if (isPinching) return; // Prevent handling drag events during a pinch gesture

        x.stop();
        y.stop();

        const newCropX = dampen(ox, getDragBounds().x);
        const newCropY = dampen(oy, getDragBounds().y);

        x.set(newCropX);
        y.set(newCropY);
      },
      onPinch: ({
        pinching,
        event,
        memo,
        origin: [pinchOriginX, pinchOriginY],
        offset: [d],
      }) => {
        event.preventDefault();
        setIsPinching(pinching);
        x.stop();
        y.stop();

        memo ??= {
          bounds: imageRef.current.getBoundingClientRect(),
          crop: { x: x.get(), y: y.get(), scale: scale.get() },
        };

        const transformOriginX = memo.bounds.x + memo.bounds.width / 2;
        const transformOriginY = memo.bounds.y + memo.bounds.height / 2;

        const displacementX =
          (transformOriginX - pinchOriginX) / memo.crop.scale;
        const displacementY =
          (transformOriginY - pinchOriginY) / memo.crop.scale;

        const initialOffsetDistance = (memo.crop.scale - 1) * 200;
        const movementDistance = d - initialOffsetDistance;

        const newScale = 1 + d / 200;
        const newCropX = memo.crop.x + (displacementX * movementDistance) / 200;
        const newCropY = memo.crop.y + (displacementY * movementDistance) / 200;

        scale.set(newScale);
        x.set(newCropX);
        y.set(newCropY);

        return memo;
      },
      onPinchEnd: () => {
        // Use setTimeout to delay the transition from pinch to drag
        setTimeout(() => {
          setIsPinching(false);
          maybeAdjustImage();
        }, 100); // Adjust the delay time as needed
      },
      onDragEnd: maybeAdjustImage,
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
      },
      pinch: {
        distanceBounds: { min: 0 },
      },
      target: imageRef,
      eventOptions: { passive: false },
    }
  );

  function getDragBounds() {
    const imageBounds = imageRef.current.getBoundingClientRect();
    const containerBounds = imageContainerRef.current.getBoundingClientRect();
    const originalWidth = imageRef.current.clientWidth;
    const widthOverhang = (imageBounds.width - originalWidth) / 2;
    const originalHeight = imageRef.current.clientHeight;
    const heightOverhang = (imageBounds.height - originalHeight) / 2;

    return {
      x: [
        -(imageBounds.width - containerBounds.width) + widthOverhang,
        widthOverhang,
      ],
      y: [
        -(imageBounds.height - containerBounds.height) + heightOverhang,
        heightOverhang,
      ],
    };
  }

  function maybeAdjustImage() {
    const newCrop = { x: x.get(), y: y.get(), scale: scale.get() };
    const bounds = getDragBounds();

    if (newCrop.x > bounds.x[1]) {
      newCrop.x = bounds.x[1];
    } else if (newCrop.x < bounds.x[0]) {
      newCrop.x = bounds.x[0];
    }

    if (newCrop.y > bounds.y[1]) {
      newCrop.y = bounds.y[1];
    } else if (newCrop.y < bounds.y[0]) {
      newCrop.y = bounds.y[0];
    }

    animate(x, newCrop.x, {
      type: "tween",
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    });
    animate(y, newCrop.y, {
      type: "tween",
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    });
    onCropChange(newCrop);
  }

  return (
    <div
      className={`cropper-wrapper ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div ref={imageContainerRef} className="image-container">
        <motion.img
          src={src}
          ref={imageRef}
          style={{
            x: x,
            y: y,
            scale: scale,
            touchAction: "none",
            userSelect: "none",
            MozUserSelect: "none",
          }}
          className="cropping-image"
        />
        <div
          className={`overlay ${
            isDragging || isPinching ? "visible" : "hidden"
          }`}
        >
          <div className="grid">
            <div className="row"></div>
            <div className="row"></div>
            <div className="row"></div>
          </div>
          <div className="grid">
            <div className="column"></div>
            <div className="column"></div>
            <div className="column"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function dampen(val, [min, max]) {
  if (val > max) {
    const extra = val - max;
    const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return max + dampenedExtra * 2;
  } else if (val < min) {
    const extra = val - min;
    const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return min + dampenedExtra * 2;
  } else {
    return val;
  }
}
