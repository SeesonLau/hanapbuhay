import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loaderCat from "@/assets/Loadercat.json";
import rocketBye from "@/assets/Rocketbye.json";

// Preloader message variants
export const PreloaderMessages = {
  LOADING_PROFILE: "Loading profile",
  LOADING_PROJECTS: "Loading projects",
  SAVING_PROFILE: "Saving profile",
  SAVING_PROJECT: "Saving project",
  UPLOADING_IMAGE: "Uploading image",
  DELETING_PROJECT: "Deleting project",
  PROCESSING: "Processing",
  LOADING: "Loading",
  GOODBYE: "Goodbye! See you soon 🚀"
};

interface PreloaderProps {
  message: string;
  isVisible: boolean;
  variant?: "default" | "goodbye";
}

export const Preloader: React.FC<PreloaderProps> = ({
  message,
  isVisible,
  variant = "default"
}) => {
  const [show, setShow] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      // Delay hiding for smooth fade-out
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    if (variant === "goodbye" || !isVisible) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [variant, isVisible]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center 
        bg-white transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Lottie Loader */}
      <div className="w-64 h-64 md:w-96 md:h-96 -mb-8 md:-mb-12">
        <Lottie
          animationData={variant === "goodbye" ? rocketBye : loaderCat}
          loop={variant !== "goodbye"} 
          autoplay
        />
      </div>

      {/* Message */}
      <p className="font-inter text-xl md:text-2xl font-semibold text-gray-neutral700 text-center">
        {message}
        {variant !== "goodbye" && <span className="inline-block w-8 text-left">{dots}</span>}
      </p>
    </div>
  );
};