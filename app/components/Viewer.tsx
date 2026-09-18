"use client";

import { useInView } from "react-intersection-observer";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Model from "./Model";

export default function Viewer() {
  const { ref, inView } = useInView({
    threshold: 0.05,
    initialInView: true,
  });

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-20 h-svh w-full">
      <Canvas
        // Pauses 100% of rendering when off-screen, preserving animation state
        frameloop={inView ? "always" : "never"}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
          precision: "mediump",
        }}
        dpr={[1, typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 1.5]}
      >
        <Environment
          files="/hdr/dancing_hall_1k.exr"
          environmentIntensity={0.8}
        />
        <Model />
      </Canvas>
    </div>
  );
}