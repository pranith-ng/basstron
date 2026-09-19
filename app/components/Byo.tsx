"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const images = [
  "/byo/1.webp",
  "/byo/2.webp",
  "/byo/3.webp",
  "/byo/4.webp",
  "/byo/5.webp",
];

export default function Byo() {
  const [currentImage, setCurrentImage] = useState(0);

  // Pause cycle when section is off-screen
  const { ref, inView } = useInView({
    threshold: 0.1,
    initialInView: true,
  });

  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section ref={ref} className="relative w-full max-w-[1920px] mx-auto bg-black overflow-hidden z-10">
      {/* Image Stack Container */}
      <div className="relative w-full h-[140vw] sm:h-[100vw] md:h-[90vw] lg:h-[700px] xl:h-[800px]">
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Build your own earbuds step ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${index === currentImage
                ? "opacity-100 z-10"
                : "opacity-0 z-0"
              }`}
          />
        ))}
      </div>

      {/* Floating Overlay Button */}
      <div className="absolute bottom-10 sm:bottom-15 md:bottom-20 lg:bottom-10 xl:bottom-20 left-1/2 z-20 -translate-x-1/2">
        <Link
          href="/editor"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center rounded-full bg-white px-4 sm:px-8 py-3.5 text-sm font-semibold tracking-wide text-black antialiased transition-all duration-300 ease-out will-change-transform hover:scale-105 hover:bg-gray-100 active:scale-95 shadow-[0_4px_25px_rgba(255,255,255,0.45),0_10px_45px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_35px_rgba(255,255,255,0.7),0_18px_60px_rgba(255,255,255,0.4)]"
        >
          <span className="relative z-10 flex items-center gap-2 leading-none transform-gpu">
            <span>Build Your Own</span>
            <svg
              className="h-4 w-4 transform-gpu transition-transform duration-300 ease-out group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}