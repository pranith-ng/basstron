"use client";

import * as THREE from "three";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { useState, useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SkeletonUtils } from "three-stdlib";
import { useAppContext } from "../context/Context";

export default function Model(props: React.ComponentPropsWithoutRef<"group">) {
  const { setViewerLoaded } = useAppContext();

  const [baseZoom, setBaseZoom] = useState(15);

  const groupRef = useRef<THREE.Group>(null!);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  // 1. Load GLTF base scene
  const { scene } = useGLTF("/model/tws_threejs.glb");

  // 2. Clone using SkeletonUtils to safely isolate mesh & material instances
  const clonedScene = useMemo(() => {
    return SkeletonUtils.clone(scene);
  }, [scene]);

  // 3. GSAP animation scoped to groupRef
  useGSAP(
    () => {
      if (!clonedScene || !cameraRef.current) return;

      const camera = cameraRef.current;
      const lid = clonedScene.getObjectByName("chargingcase_lid");
      const plane = clonedScene.getObjectByName("Plane");
      const lefttws = clonedScene.getObjectByName("left_tws");
      const righttws = clonedScene.getObjectByName("right_tws");
      const chargingcase = clonedScene.getObjectByName("chargingcase");

      if (chargingcase) {
        chargingcase.rotation.y = Math.PI / 2;
      }

      if (plane) {
        plane.visible = false;
      }

      // Calculate initial zoom levels based on screen width
      const width = window.innerWidth;
      const t = THREE.MathUtils.clamp((width - 344) / (1536 - 344), 0, 1);
      const calculatedBaseZoom = THREE.MathUtils.lerp(15, 8, t);
      const finalZoom = THREE.MathUtils.lerp(9.5, 3.8, t);

      setBaseZoom(calculatedBaseZoom);

      // Material overrides setup
      const color = "#641E2C";
      let metalMaterial: THREE.Material | null = null;

      clonedScene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat) => {
          if (mat.name === "leather_tws") {
            mat.color.set(color);
            mat.roughness = 0.45;
            mat.metalness = 0.0;
          }

          if (mat.name === "metal_tws") {
            mat.roughness = 0.22;
            mat.metalness = 0.8;
            mat.color.set("#5C758E");
            metalMaterial = mat;
          }

          if (mat.name === "plastic_tws") {
            mat.color.set(color);
            mat.roughness = 0.4;
            mat.metalness = 0.0;
          }

          if (mat.name === "silicone_tws") {
            mat.color.set("#8A9099");
            mat.roughness = 0.85;
            mat.metalness = 0.0;
          }

          if (mat.name === "innermesh_tws") {
            mat.color.set("#757B84");
            mat.roughness = 0.2;
            mat.metalness = 1;
          }

          if (mat.name === "case_plastic") {
            mat.roughness = 0.4;
            mat.metalness = 0;
            mat.color.set(color);
          }
        });
      });

      // Synchronize material for logos
      if (metalMaterial) {
        clonedScene.traverse((child) => {
          if (
            child instanceof THREE.Mesh &&
            (child.name === "Curve" || child.name === "Curve002")
          ) {
            child.material = metalMaterial;
          }
        });
      }

      if (!lid || !lefttws || !righttws) return;

      // Initial state
      lid.rotation.z = 0;

      lefttws.position.y = 0;
      lefttws.rotation.x = 0;
      lefttws.rotation.z = 0;

      righttws.position.y = 0;
      righttws.rotation.x = 0;
      righttws.rotation.z = 0;

      const target = new THREE.Vector3();
      const offset = { y: 0.021 };

      // Main GSAP Sequence Timeline
      const tl = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },
        onUpdate: () => {
          lefttws.getWorldPosition(target);
          target.y += offset.y;
          camera.lookAt(target);
        },
      });

      tl.to(
        lid.rotation,
        {
          z: THREE.MathUtils.degToRad(-90),
          duration: 1,
          ease: "power2.inOut",
        },
        0.4
      )
        .to(lefttws.position, {
          y: lefttws.position.y + 0.07,
          duration: 0.5,
        })
        .to(
          offset,
          {
            y: -0.021,
            duration: 0.2,
          },
          "<"
        )
        .to(lefttws.position, {
          y: lefttws.position.y + 0.2,
          duration: 1,
        })
        .to(
          lefttws.rotation,
          {
            x: THREE.MathUtils.degToRad(-90),
            z: THREE.MathUtils.degToRad(40),
            duration: 0.8,
            ease: "power2.out",
          },
          "<"
        )
        .to(righttws.position, {
          y: righttws.position.y + 0.07,
          duration: 0.5,
        })
        .to(righttws.position, {
          y: righttws.position.y + 0.197,
          duration: 0.5,
        })
        .to(
          righttws.rotation,
          {
            x: THREE.MathUtils.degToRad(90),
            z: THREE.MathUtils.degToRad(-50),
            duration: 0.5,
            ease: "power2.out",
          },
          "<"
        );

      tl.to(
        camera,
        {
          fov: finalZoom,
          duration: tl.totalDuration() - 0.5,
          ease: "expo.out",
          onUpdate: () => {
            camera.updateProjectionMatrix();
          },
        },
        1.5
      );

      tl.eventCallback("onComplete", () => {
        setViewerLoaded(true);

        // LEFT TWS floating effect
        gsap.to(lefttws.position, {
          y: "+=0.005",
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(lefttws.rotation, {
          y: `+=${THREE.MathUtils.degToRad(5)}`,
          z: `+=${THREE.MathUtils.degToRad(3.5)}`,
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // RIGHT TWS floating effect
        gsap.to(righttws.position, {
          y: "+=0.005",
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 0.15,
        });

        gsap.to(righttws.rotation, {
          y: `+=${THREE.MathUtils.degToRad(-5)}`,
          x: `+=${THREE.MathUtils.degToRad(-5)}`,
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 0.15,
        });
      });
    },
    { scope: groupRef, dependencies: [clonedScene] }
  );

  return (
    <group ref={groupRef} {...props}>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[-0.002, 0.18, 1]}
        fov={baseZoom}
        near={0.1}
        far={20}
      />
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/model/tws_threejs.glb");