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

  useEffect(() => {
    const updateFontSize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      // Longest word determines the size
      const longestWord = "TRON";
      const factor = 0.72;

      const size = (containerWidth * 0.7) / (longestWord.length * factor);
      setFontSize(Math.min(size, 370))
    };

    updateFontSize();

    const resizeObserver = new ResizeObserver(updateFontSize);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateFontSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateFontSize);
    };
  }, []);


  // useGSAP(() => {
  //   gsap.fromTo(
  //     revealRef.current,
  //     {
  //       height: "0vh",
  //     },
  //     {
  //       height: "100vh",
  //       ease: "none",

  //       scrollTrigger: {
  //         trigger: containerRef.current,
  //         start: "bottom bottom",
  //         end: "+=100vh",
  //         scrub: true,
  //         markers: true,
  //       },
  //     }
  //   );
  // }, {
  //   scope: containerRef,
  // });

  return (
    <>
      <div
        ref={containerRef}
        className="gradientimg relative h-full w-full flex flex-col items-center justify-between"
      >

        <Link href="/" className="pt-3 self-center">
          <Image
            src="/logo_final.svg"
            alt="Basstron logo"
            width={60}
            height={60}
          />
        </Link>

        <div className="text-gray-500 absolute inset-0 flex flex-col justify-between items-center opacity-40">
          <h1
            className="boxing-font font-bold leading-none whitespace-nowrap "
            style={{
              fontSize: `${fontSize}px`,
              WebkitMaskImage:
                "linear-gradient(to bottom, black 50%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 50%, transparent 100%)",
            }}
          >
            BASS
          </h1>

          <h1
            className="boxing-font font-bold leading-none whitespace-nowrap -mt-[5%]"
            style={{
              fontSize: `${fontSize}px`,
              WebkitMaskImage:
                "linear-gradient(to top, black 50%, transparent 100%)",
              maskImage:
                "linear-gradient(to top, black 50%, transparent 100%)",
            }}
          >
            TRON
          </h1>
        </div>
      </div>

      {/* <div
        ref={revealRef}
        className="absolute bottom-0 left-0 z-50 w-full bg-black pointer-events-none"
      /> */}

    </>

  );
};

export default Hero;