import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loaderCat from "@/assets/loader cat.json";
import rocketBye from "@/assets/Rocket bye.json";

// Preloader message variants
export const PreloaderMessages = {
  LOADING_PROFILE: "Loading profile...",
  LOADING_PROJECTS: "Loading projects...",
  SAVING_PROFILE: "Saving profile...",
  SAVING_PROJECT: "Saving project...",
  UPLOADING_IMAGE: "Uploading image...",
  DELETING_PROJECT: "Deleting project...",
  PROCESSING: "Processing...",
  LOADING: "Loading...",
  GOODBYE: "Goodbye! See you soon 🚀"
};

interface PreloaderProps {
  message: string;
  isVisible: boolean;
  variant?: "default" | "goodbye"; // add new variant
}

export const Preloader: React.FC<PreloaderProps> = ({
  message,
  isVisible,
  variant = "default"
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      // Delay hiding for smooth fade-out
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center 
        bg-white/80 backdrop-blur-sm transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Lottie Loader */}
      <div className="w-64 h-64 md:w-96 md:h-96">
        <Lottie
          animationData={variant === "goodbye" ? rocketBye : loaderCat}
          loop={variant !== "goodbye"} // goodbye animation usually plays once
          autoplay
        />
      </div>

      {/* Message */}
      <p className="mt-6 font-inter text-xl md:text-2xl font-semibold text-gray-neutral700 text-center">
        {message}
      </p>
    </div>
  );
};
