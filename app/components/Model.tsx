"use client";

import * as THREE from "three"
import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import { useMemo } from "react";
import { useGSAP } from '@gsap/react';
import { useAppContext } from "../context/Context";





export default function Model({ ...props }) {

  const { setViewerLoaded } = useAppContext();

  const [baseZoom, setbaseZoom] = useState(0)

  const { scene } = useGLTF("/model/tws_threejs.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const scrollvalue = props.scrollValue
  const { camera } = useThree();
  const orthoCamera = camera as THREE.OrthographicCamera;
  const target = new THREE.Vector3();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);


  // useEffect(() => {
  //   console.log(scrollvalue)
  //   console.log(orthoCamera);
  // }, [scrollvalue])

  useGSAP(() => {

    const camera = cameraRef.current;
    const lid = model.getObjectByName("chargingcase_lid");
    const plane = model.getObjectByName('Plane')
    const chargingcaseobj = model.getObjectByName('chargingcase')
    const lefttws = model.getObjectByName('left_tws')
    const righttws = model.getObjectByName('right_tws')
    const chargingcase = model.getObjectByName('chargingcase')
    const chargingcaselid = model.getObjectByName('chargingcase_lid')
    const target = new THREE.Vector3();
    const offset = { y: 0.021 };

    const width = window.innerWidth;
    console.log(width)

    const t = THREE.MathUtils.clamp((width - 344) / (1536 - 344), 0, 1);

    const baseZoom = THREE.MathUtils.lerp(15, 8, t);
    setbaseZoom(baseZoom)
    const finalZoom = THREE.MathUtils.lerp(9.5, 3.8, t);

    // const color2 = "#90A8BF"; important color metla tws mat.color.set("#5F7894");

    const color = "#641E2C";

    let metalMaterial: THREE.Material | null = null;

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      if (child.isMesh) {
        console.log(child.name, child.material.name);
      }

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

          // Save reference to this material
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

    // Make the logos use the exact same material instance
    if (metalMaterial) {
      model.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          (child.name === "Curve" || child.name === "Curve002")
        ) {
          child.material = metalMaterial;
        }
      });
    }

    if (chargingcase) {
      chargingcase.rotation.y = Math.PI / 2
    }

    if (plane) {
      plane.visible = false  // hide it
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

    tl.to(lid.rotation, {
      z: THREE.MathUtils.degToRad(-90),
      duration: 1,
      ease: "power2.inOut",
    }, 0.4)

      .to(lefttws.position, {
        y: lefttws.position.y + 0.07,
        duration: 0.5,
        // ease: "power2.out",
      })

      .to(offset,
        {
          y: -0.021,
          duration: 0.2,
        }, "<")

      .to(lefttws.position, {
        y: lefttws.position.y + 0.2,
        duration: 1,
        // ease: "power3.out",
      })

      .to(lefttws.rotation, {
        x: THREE.MathUtils.degToRad(-90),
        z: THREE.MathUtils.degToRad(40),
        duration: 0.8,
        ease: "power2.out",
      }, "<")

      .to(righttws.position, {
        y: righttws.position.y + 0.07,
        duration: 0.5,
        // ease: "power2.out",
      })

      .to(righttws.position, {
        y: righttws.position.y + 0.197,
        duration: 0.5,
        // ease: "power3.out",
      })

      .to(righttws.rotation, {
        x: THREE.MathUtils.degToRad(90),
        z: THREE.MathUtils.degToRad(-50),
        duration: 0.5,
        ease: "power2.out",
      }, "<");

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
    )

    tl.eventCallback("onComplete", () => {

      setViewerLoaded(true)
      // LEFT TWS
      gsap.to(lefttws.position, {
        y: "+=0.005",
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(lefttws.rotation, {
        y: `+=${THREE.MathUtils.degToRad(5)}`,
        // x: `+=${THREE.MathUtils.degToRad(8)}`,
        z: `+=${THREE.MathUtils.degToRad(3.5)}`,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // RIGHT TWS
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
        // z: `+=${THREE.MathUtils.degToRad(-10.5)}`,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.15,
      });
    });

  }, {
    dependencies: [model],
  });

  return <>
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[-0.002, 0.18, 1]}
      fov={baseZoom}
      near={0.1}
      far={20}
    />
    <primitive object={model} {...props} />;
  </>
}
