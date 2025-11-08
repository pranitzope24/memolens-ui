"use client";
import Lottie from "lottie-react";

export default function LottieWrapper({
  animation,
  loop = true,
  className = "w-48 h-48",
}: {
  animation: object;
  loop?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Lottie animationData={animation} loop={loop} />
    </div>
  );
}
