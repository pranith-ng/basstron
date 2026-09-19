"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 355;

const getFrameSrc = (index: number) =>
  `/frames/${String(index).padStart(4, "0")}.webp`;

export default function Video() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const features = [
    "Powered by the second-generation H2 processor, engineered for greater power and efficiency, enabling superior noise control and high-fidelity audio processing.",
    "Featuring a 12mm titanium driver, engineered for crystal-clear highs, rich mids, and deep, powerful bass.",
    "IPX7 water resistance, engineered to withstand sweat, splashes, and rain while keeping your listening experience uninterrupted.",
  ];

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const text = textRef.current;

      if (!canvas || !container || !text) return;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // --------------------------------
      // FRAME
      // --------------------------------

      const frame = {
        current: 0,
      };

      // --------------------------------
      // IMAGES
      // --------------------------------

      const images: HTMLImageElement[] = [];

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();

        img.src = getFrameSrc(i);

        images.push(img);
      }

      // --------------------------------
      // TEXT
      // --------------------------------

      let currentText = "";

      const getTextForFrame = (currentFrame: number) => {
        if (currentFrame >= 71 && currentFrame <= 150) {
          return features[0];
        }

        if (currentFrame >= 206 && currentFrame <= 305) {
          return features[1];
        }

        if (currentFrame >= 312 && currentFrame <= 355) {
          return features[2];
        }

        return "";
      };

      const updateText = () => {
        const currentFrame = Math.round(frame.current);
        const nextText = getTextForFrame(currentFrame);

        if (nextText === currentText) return;

        currentText = nextText;

        // Kill any text animation currently running.
        gsap.killTweensOf(text);

        // Fade current text out.
        gsap.to(text, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",

          onComplete: () => {
            // Make sure the text hasn't changed again
            // while the fade-out was happening.
            if (getTextForFrame(Math.round(frame.current)) !== nextText) {
              updateText();
              return;
            }

            text.textContent = nextText;

            // Fade new text in only when there is text.
            if (nextText) {
              gsap.to(text, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
              });
            }
          },
        });
      };

      // --------------------------------
      // RENDER
      // --------------------------------

      const render = () => {
        const currentFrame = Math.round(frame.current);
        const img = images[currentFrame];

        if (!img || !img.complete || !img.naturalWidth) {
          return;
        }

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (!width || !height) return;

        ctx.clearRect(0, 0, width, height);

        const imageRatio =
          img.naturalWidth / img.naturalHeight;

        const canvasRatio = width / height;

        let drawWidth: number;
        let drawHeight: number;

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

        updateText();
      };

      // --------------------------------
      // CANVAS RESIZE
      // --------------------------------

      const resizeCanvas = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (!width || !height) return;

        const dpr = Math.min(
          window.devicePixelRatio || 1,
          2
        );

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );

        render();
      };

      // --------------------------------
      // INITIAL CANVAS SIZE
      // --------------------------------

      resizeCanvas();

      // --------------------------------
      // FIRST FRAME
      // --------------------------------

      images[0].onload = render;

      // --------------------------------
      // SCROLL ANIMATION
      // --------------------------------

      const animation = gsap.to(frame, {
        current: TOTAL_FRAMES - 1,

        ease: "none",

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

      // --------------------------------
      // RESIZE
      // --------------------------------

      let resizeTimeout: ReturnType<
        typeof setTimeout
      >;

      const handleResize = () => {
        resizeCanvas();

        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
          ScrollTrigger.refresh();
          render();
        }, 150);
      };

      window.addEventListener(
        "resize",
        handleResize
      );

      // --------------------------------
      // TAB VISIBILITY
      // --------------------------------

      const handleVisibility = () => {
        if (document.hidden) return;

        requestAnimationFrame(() => {
          resizeCanvas();

          ScrollTrigger.refresh();

          render();
        });
      };

      document.addEventListener(
        "visibilitychange",
        handleVisibility
      );

      // --------------------------------
      // CLEANUP
      // --------------------------------

      return () => {
        window.removeEventListener(
          "resize",
          handleResize
        );

        document.removeEventListener(
          "visibilitychange",
          handleVisibility
        );

        clearTimeout(resizeTimeout);

        gsap.killTweensOf(text);

        animation.kill();

        images.forEach((img) => {
          img.onload = null;
        });
      };
    },
    {
      scope: containerRef,
    }
  );

  return (
    <section
      ref={containerRef}
      className="
        relative
        z-10
        h-screen
        w-full
        overflow-hidden
        bg-black
      "
    >
      {/* CANVAS */}

      <div
        className="
          absolute
          inset-0
          w-full
          h-screen
          z-10
          flex
          items-center
          justify-center
        "
      >
        <canvas
          ref={canvasRef}
          className="
            pointer-events-none
            block
            h-[160vh]
            w-[160vw]
            lg:h-[90vh]
            lg:w-[90vw]
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
          ref={textRef}
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
        />
      </div>
    </section>
  );
}