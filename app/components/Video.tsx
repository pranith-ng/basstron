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
    "IPX7 water resistance, engineered to withstand sweat, splashes, and rain while keeping your listening experience uninterrupted."
  ]

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    // ============================================
    // FRAME STATE
    // ============================================

    const frame = {
      current: 0,
    };

    // ============================================
    // LOAD IMAGES
    // ============================================

    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();

      img.src = getFrameSrc(i);

      images.push(img);
    }

    // ============================================
    // RENDER
    // ============================================

    const render = () => {
      const img = images[Math.round(frame.current)];

      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (!width || !height) return;

      context.clearRect(0, 0, width, height);

      // Keep original image aspect ratio

      const imageRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;

      let drawWidth: number;
      let drawHeight: number;

      if (imageRatio > canvasRatio) {
        // Image is wider

        drawWidth = width;
        drawHeight = width / imageRatio;
      } else {
        // Image is taller

        drawHeight = height;
        drawWidth = height * imageRatio;
      }

      // Center image inside canvas

      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      context.drawImage(
        img,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight
      );
    };

    // ============================================
    // RESIZE
    // ============================================
    //
    // IMPORTANT:
    // CSS controls the visible canvas size.
    //
    // JS ONLY controls internal resolution.
    // ============================================

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      render();
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    // ============================================
    // FIRST FRAME
    // ============================================

    images[0].onload = render;

    // ============================================
    // GSAP + SCROLLTRIGGER
    // ============================================

    const ctx = gsap.context(() => {
      gsap.to(frame, {
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
    }, container);

    // ============================================
    // CLEANUP
    // ============================================

    return () => {
      ctx.revert();

      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-black"
    >
      {/* ============================================
          CANVAS AREA
          
          80vw × 80vh
          
          Flex keeps canvas horizontally centered.
          No translate-x.
          ============================================ */}

      <div className="absolute top-0 left-0 flex h-[80vh] w-full justify-center">
        <canvas
          ref={canvasRef}
          className="
            block
            h-[90vh]
            w-[90vw]
            pointer-events-none
          "
        />
      </div>

      {/* ============================================
          TEXT AREA
          
          Bottom 20vh
          ============================================ */}

      <div
        className="
          absolute
          bottom-[5vh]
          left-0
          z-10
          flex
          w-full
          items-center
          justify-center
        "
      >
        <p className="txt text-sm italic text-gray-400 text-center md:px-32 py-6 md:text-xl">
          {features[0]}
        </p>
      </div>
    </section>
  );
}