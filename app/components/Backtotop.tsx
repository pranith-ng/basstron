"use client";

import { useEffect, useState } from "react";
import { lenis } from "./SmoothScroll";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    lenis?.scrollTo(0);
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`
        fixed
        right-6
        top-6
        z-[100]
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-white
        text-black
        shadow-[0_4px_25px_rgba(255,255,255,0.3)]
        transition-all
        duration-300
        hover:scale-110
        active:scale-95
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }
      `}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12l7-7 7 7M12 19V5"
        />
      </svg>
    </button>
  );
}