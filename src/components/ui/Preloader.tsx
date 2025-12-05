import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Lottie from "lottie-react";
import loaderCat from "@/assets/Loadercat.json";

// Preloader message variants
export const PreloaderMessages = {
  LOADING_PROFILE: "Loading profile",
  LOADING_PROJECTS: "Loading projects",
  LOADING_JOBS: "Loading jobs",
  LOADING_CHAT: "Loading chats",
  SAVING_PROFILE: "Saving profile",
  SAVING_PROJECT: "Saving project",
  UPLOADING_IMAGE: "Uploading image",
  DELETING_PROJECT: "Deleting project",
  PROCESSING: "Processing",
  GOODBYE: "Logging out..."
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
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client side for portal
  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!show || !mounted) return null;

  const preloaderContent = (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center 
        bg-white transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Lottie Loader */}
      <div className="w-64 h-64 md:w-96 md:h-96 -mb-8 md:-mb-12">
        <Lottie
          animationData={loaderCat}
          loop={variant !== "goodbye"}
          autoplay
        />
      </div>

      {/* Message */}
      <p className={`font-inter text-xl md:text-2xl font-semibold ${variant === "goodbye" ? "text-primary-primary500" : "text-white"} text-center`}>
        {message}
        {variant !== "goodbye" && <span className="inline-block w-8 text-left">{dots}</span>}
      </p>
    </div>
  );

  // Use portal to render outside of parent stacking context
  return createPortal(preloaderContent, document.body);
};
