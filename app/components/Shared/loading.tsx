"use client";
import animationData from "@/assets/loader.json";
import Lottie from "lottie-react";

export default function Loader(): JSX.Element {
  return <Lottie animationData={animationData} loop={true} />;
}
