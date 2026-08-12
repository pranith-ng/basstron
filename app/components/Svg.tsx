"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Video from "./Video";

gsap.registerPlugin(ScrollTrigger);

const clipPaths: Record<string, string> = {
  piece1:
    "M -8.8485555,228.58191 150.52415,125.00012 -8.8485555,21.417814 Z",

  piece2:
    "M 150.08438 -4.935616 L -9.3777222 -4.935616 L -9.3777222 21.417814 L 149.99498 125.00012 L 250.00024 60.003056 L 150.08438 -4.935616 z",

  piece3:
    "M 150.08438,-4.4064493 250.00024,60.532223 349.91611,-4.4064493 Z",

  piece4:
    "M 250.00024 60.003056 L 350.00499 125.00012 L 508.86248 21.753194 L 508.86248 -4.935616 L 349.91611 -4.935616 L 250.00024 60.003056 z",

  piece5:
    "M 349.47582,125.00012 508.33331,228.24705 V 21.753194 Z",

  piece6:
    "M 350.00499 125.00012 L 249.99973 189.99667 L 353.31642 257.14606 L 508.86248 257.14606 L 508.86248 228.24705 L 350.00499 125.00012 z",

  piece7:
    "M 353.31642,256.61689 249.99973,189.4675 146.68304,256.61689 Z",

  piece8:
    "M 146.68304 257.14606 L 249.99973 189.99667 L 149.99498 125.00012 L -9.3777222 228.58191 L -9.3777222 257.14606 L 146.68304 257.14606 z",

  diamond:
    "M 250.00024,59.612359 148.48567,125.00012 249.99973,190.38737 351.5143,125.00012 Z",
};

const Svg = () => {

  const [videopage, setvideopage] = useState(true)

  useEffect(() => {
    const directions: Record<string, [number, number]> = {
      piece1: [-30, 0],
      piece2: [-10, -50],
      piece3: [0, -60],
      piece4: [10, -50],
      piece5: [30, 0],
      piece6: [10, 50],
      piece7: [0, 60],
      piece8: [-10, 50],
    };

    const ctx = gsap.context(() => {
      gsap.set("#diamond-group", {
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({
       
        scrollTrigger: {
          trigger: "#svgsection",

          start: "top top",

          end: "+=5000",

          scrub: 1.5,

          pin: true,

          pinSpacing: true,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          markers: true,

        },

        onComplete: () => {
          setvideopage(false)
        }
      });

      // Scatter pieces
      Object.entries(directions).forEach(([id, [x, y]]) => {
        tl.to(
          `#${id}-group`,
          {
            x,
            y,

            scale: 1.03,
          },
          0
        );
      });

      // Rotate diamond
      tl.to(
        "#diamond-group",
        {
          rotation: -45,

          duration: 0.6,
        },
        0.4
      );

      // Scale diamond
      tl.to(
        "#diamond-group",
        {
          scale: 8,

          duration: 2,
        },
        0.7
      );

      // Reveal black overlay
      tl.to(
        ".piece-white",
        {
          opacity: 1,

          duration: 0.7,
        },
        0.7
      );

      tl.to(
        ".piece-white2",
        {
          opacity: 1,

          duration: 0.4,
        },
        0.7
      );
    });

    return () => ctx.revert();
  }, []);

  const pieces = [
    "piece1",
    "piece2",
    "piece3",
    "piece4",
    "piece5",
    "piece6",
    "piece7",
    "piece8",
    "diamond",
  ] as const;

  return (      
          <section
            id="svgsection"
            className="w-screen h-screen overflow-hidden bg-white"
            style={{
              isolation: "isolate",
            }}
          >
            <svg
              viewBox="0 0 500 250"
              preserveAspectRatio="xMidYMid slice"
              className="w-full h-full block"
            >
              <defs>
                {pieces.map((id) => (
                  <clipPath
                    key={id}
                    id={id}
                    clipPathUnits="userSpaceOnUse"
                  >
                    <path d={clipPaths[id]} />
                  </clipPath>
                ))}
              </defs>

              {pieces
                .filter((id) => id !== "diamond")
                .map((id) => (
                  <g
                    key={id}
                    id={`${id}-group`}
                  >
                    <image
                      href="/hero.png"
                      width="500"
                      height="250"
                      x="0"
                      y="0"
                      clipPath={`url(#${id})`}
                      preserveAspectRatio="xMidYMid slice"
                    />

                    <rect
                      x="0"
                      y="0"
                      width="500"
                      height="250"
                      fill="black"
                      clipPath={`url(#${id})`}
                      opacity="0"
                      className="piece-white"
                    />
                  </g>
                ))}

              <g id="diamond-group">
                <image
                  href="/hero.png"
                  width="500"
                  height="250"
                  x="0"
                  y="0"
                  clipPath="url(#diamond)"
                  preserveAspectRatio="xMidYMid slice"
                />

                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="250"
                  fill="black"
                  clipPath="url(#diamond)"
                  opacity="0"
                  className="piece-white2"
                />
              </g>
            </svg>
          </section>
  );
};

export default Svg;