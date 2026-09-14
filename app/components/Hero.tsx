"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAppContext } from "../context/Context";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {

  const { setHeroLoaded } = useAppContext()

  const [heropause, setHeroPause] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null);


  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0 });
  const pixelRef = useRef<HTMLDivElement>(null);


  const [fontSize, setFontSize] = useState<number>(100);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      // -------------------------
      // Font size — your original
      // -------------------------
      const longestWord = "TRON";
      const factor = 0.72;

      const size =
        (containerWidth * 0.7) /
        (longestWord.length * factor);

      setFontSize(Math.min(size, 370));

      // -------------------------
      // Detect portrait
      // -------------------------
      setIsPortrait(containerHeight > containerWidth);
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateLayout);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [heropause]);



  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set PIXEL_SIZE based on Tailwind breakpoints
    let pixelSize = 30; // Default (smaller than sm)

    if (width >= 1024) {
      pixelSize = 60; // lg and above
    } else if (width >= 768) {
      pixelSize = 50; // md and above
    } else if (width >= 640) {
      pixelSize = 40; // sm and above
    }

    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);

    setGridDimensions({ cols, rows });
  }, []);



  useGSAP(() => {
    if (!pixelRef.current || pixelRef.current.children.length === 0) return;

    gsap.to(pixelRef.current.children, {
      opacity: 0,
      duration: 0.2,
      stagger: {
        each: 0.0025,
        from: "random",
      },
      ease: "power2.inOut",
      onStart: () => {
        setHeroPause(true);
      },
      onComplete: () => {
        setHeroLoaded(true);
        // Remove element completely from the DOM layout
        if (pixelRef.current) {
          pixelRef.current.style.display = "none";
        }
      },
    });
  }, [gridDimensions]);

  return (
    <>
      <div
        ref={pixelRef}
        className="absolute inset-0 z-15 grid pointer-events-none overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`,
        }}
      >
        {Array.from({ length: gridDimensions.cols * gridDimensions.rows }).map(
          (_, index) => (
            <div
              key={index}
              className="bg-black w-full h-full"
            />
          )
        )}
      </div>

      {heropause &&
        <div
          ref={containerRef}
          className="gradientimg bgimg relative z-10 h-svh w-full flex flex-col items-center justify-between"
        >
          {/* <Link href="/" className="pt-3 self-center">
            <Image
              src="/logo_final.svg"
              alt="Basstron logo"
              width={60}
              height={60}
            />
          </Link> */}

          {/* BASS + TRON */}
          <div
            className={`text-black absolute inset-0 flex flex-col items-center opacity-60 ${isPortrait
              ? "justify-center"
              : "justify-between"
              }`}
          >

            <h1
              className={`boxing-font font-bold leading-none whitespace-nowrap ${isPortrait ? "" : ""
                }`}
              style={{
                fontSize: `${fontSize}px`,
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 50%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 50%, transparent 100%)",
                transform: isPortrait
                  ? "translateY(-135%)"
                  : "none",
              }}
            >
              BASS
            </h1>


            <h1
              className="boxing-font font-bold leading-none whitespace-nowrap"
              style={{
                fontSize: `${fontSize}px`,
                WebkitMaskImage:
                  "linear-gradient(to top, black 50%, transparent 100%)",
                maskImage:
                  "linear-gradient(to top, black 50%, transparent 100%)",
                transform: isPortrait
                  ? "translateY(125%)"
                  : "none",
              }}
            >
              TRON
            </h1>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5 pointer-events-none xl:hidden">
            <span className="text-xs uppercase tracking-widest text-black font-medium animate-pulse">
              Scroll Down
            </span>
            <svg
              className="w-8 h-8 text-black animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v8m0 0l-3-3m3 3l3-3"
              />
            </svg>
          </div>

        </div>
      }

    </>
  );
};

export default Hero;