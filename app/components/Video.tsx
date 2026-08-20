"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 353;

const getFrameSrc = (index: number) =>
  `/frames/${String(index).padStart(4, "0")}.jpg`;

export default function Video() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const features = [
    "Powered by the second-generation H2 processor, engineered for greater power and efficiency, enabling superior noise control and high-fidelity audio processing.",
    "Featuring a 12mm titanium driver, engineered for crystal-clear highs, rich mids, and deep, powerful bass.",
    "IPX7 water resistance, engineered to withstand sweat, splashes, and rain while keeping your listening experience uninterrupted.",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // -------------------------
    // FRAME
    // -------------------------

    const frame = {
      current: 0,
    };

    // -------------------------
    // IMAGES
    // -------------------------

    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      images.push(img);
    }

    // -------------------------
    // CANVAS SIZE
    // -------------------------

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      render();
    };

    // -------------------------
    // RENDER
    // -------------------------

    const render = () => {
      const img = images[Math.round(frame.current)];

      if (!img || !img.complete) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);

      const imageRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;

      let drawWidth;
      let drawHeight;

      if (imageRatio > canvasRatio) {
        drawWidth = width;
        drawHeight = width / imageRatio;
      } else {
        drawHeight = height;
        drawWidth = height * imageRatio;
      }

      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      ctx.drawImage(
        img,
        x,
        y,
        drawWidth,
        drawHeight
      );
    };

    // Initial canvas size
    resizeCanvas();

    // -------------------------
    // FIRST FRAME
    // -------------------------

    images[0].onload = render;

    // -------------------------
    // SCROLL ANIMATION
    // -------------------------

    const animation = gsap.to(frame, {
      current: TOTAL_FRAMES - 1,

      ease: "none",

      snap: {
        current: 1,
      },

      onUpdate: render,

      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=28000",
        scrub: true,
        pin: true,
        pinSpacing: true,
      },
    });

    // -------------------------
    // RESIZE
    // -------------------------

    const handleResize = () => {
      resizeCanvas();

      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    // -------------------------
    // TAB SWITCH
    // -------------------------

    const handleVisibility = () => {
      if (!document.hidden) {
        resizeCanvas();
        ScrollTrigger.refresh();
        render();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    // -------------------------
    // CLEANUP
    // -------------------------

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      animation.kill();

      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-black"
    >
      {/* CANVAS */}

      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="
            block
            h-[160vh]
            w-[160vw]
            lg:h-screen
            lg:w-screen
            pointer-events-none
          "
        />
      </div>

      {/* TEXT */}

      <div
        className="
          absolute
          bottom-15
          left-0
          z-10
          flex
          w-full
          justify-center
        "
      >
        <p
          className="
            txt
            px-6
            py-6
            text-center
            text-sm
            italic
            text-gray-400
            md:px-32
            md:text-xl
          "
        >
          {features[0]}
        </p>
      </div>
    </section>
  );
}