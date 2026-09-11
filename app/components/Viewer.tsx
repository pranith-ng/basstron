"use client"

import * as THREE from "three";
import { useState, useEffect } from "react";
import { gsap } from "gsap";

import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, OrthographicCamera } from "@react-three/drei"
import Model from "./Model"

export default function Viewer() {

  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setScrollValue(e.clientX);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);


  return (
    <div className="absolute w-full h-svh inset-0 z-20">
      <Canvas

        gl={{
          antialias: true,
          powerPreference: "high-performance",

        }}
        dpr={[1, 2]}
      >
        {/* <OrthographicCamera
          makeDefault
          position={[0, 0.118, 1]}
          zoom={6000}
        /> */}
        <Environment
          files={"/hdr/dancing_hall_1k.exr"}
          environmentIntensity={1}
        // background={true}

        />
        {/* <mesh>
                <boxGeometry />
                <meshNormalMaterial />
            </mesh> */}
        <Model scrollValue={scrollValue} />
        {/* <OrbitControls
                minDistance={0.2}
            /> */}
      </Canvas>
    </div>
  )
}