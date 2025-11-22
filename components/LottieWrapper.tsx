"use client";

import Lottie from "lottie-react";

export default function LottieWrapper({
  animation,
  className,
  loop = true,
  onComplete,
}: {
  animation: any;
  className?: string;
  loop?: boolean;
  onComplete?: () => void;
}) {
  return (
    <Lottie
      animationData={animation}
      className={className}
      loop={loop}
      autoplay={true}
      onComplete={onComplete}
      style={{ overflow: "visible" }}
    />
  );
}
