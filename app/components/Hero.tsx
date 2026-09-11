"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="gradientimg bgimg relative z-10 h-svh w-full flex flex-col items-center justify-between"
      >
        <Link href="/" className="pt-3 self-center">
          <Image
            src="/logo_final.svg"
            alt="Basstron logo"
            width={60}
            height={60}
          />
        </Link>

        {/* BASS + TRON */}
        <div
          className={`text-black absolute inset-0 flex flex-col items-center opacity-60 ${
            isPortrait
              ? "justify-center"
              : "justify-between"
          }`}
        >
         
          <h1
            className={`boxing-font font-bold leading-none whitespace-nowrap ${
              isPortrait ? "" : ""
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
      </div>

      {/* Reveal animation */}
      {/*
      <div
        ref={revealRef}
        className="absolute bottom-0 left-0 z-50 w-full bg-black pointer-events-none"
      />
      */}
    </>
  );
};

export default Hero;