"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";

export type MaterialPreset = {
  id: string;
  label: string;
  color?: string;
  rough?: number;
  metal?: number;
  textureUrl?: string;
  normalUrl?: string;
};

export type MaterialState = {
  presetId: string | null;
  rough: number;
  metal: number;
  color: string;

  presetValues: Record<
    string,
    {
      rough?: number;
      metal?: number;
    }
  >;
};

type EditorModelProps = {
  show: "earbuds" | "case";
  selectedMeshes: THREE.Mesh[];
  setSelectedMeshes: (meshes: THREE.Mesh[]) => void;
  lidstatus: boolean;
  activeMaterialState: MaterialState | null;
  activePreset: MaterialPreset | null;
};

// Singleton texture loader
const textureLoader = new THREE.TextureLoader();

export default function EditorModel({
  show,
  selectedMeshes,
  setSelectedMeshes,
  lidstatus,
  activeMaterialState,
  activePreset,
}: EditorModelProps) {
  const { scene } = useGLTF("/model/tws_threejs.glb");

  const animFrameRef = useRef<number | null>(null);

  const pointerDownPos = useRef({
    x: 0,
    y: 0,
  });

  const leftTws = scene.getObjectByName("left_tws");
  const chargingCase = scene.getObjectByName("chargingcase");
  const chargingCaseLid = scene.getObjectByName("chargingcase_lid");

  // ---------------------------------------------------------
  // APPLY ACTIVE MATERIAL STATE
  // ---------------------------------------------------------

  useEffect(() => {
    if (!activeMaterialState || selectedMeshes.length === 0) return;

    selectedMeshes.forEach((mesh) => {
      if (!(mesh.material instanceof THREE.MeshStandardMaterial)) return;

      const mat = mesh.material;

      // -----------------------------------------------------
      // INNER CASE MATERIALS
      // They act as ONE component for COLOR only.
      // Keep each material's original roughness + metalness.
      // -----------------------------------------------------

      if (
        mat.name === "case_glossinner" ||
        mat.name === "case_innerplastic"
      ) {
        mat.color.set(activeMaterialState.color);

        // Remove preset textures if reset
        if (
          !activeMaterialState.presetId ||
          activeMaterialState.presetId === "reset"
        ) {
          mat.map = null;
          mat.normalMap = null;
        }

        mat.needsUpdate = true;
        return;
      }

      // -----------------------------------------------------
      // NORMAL MATERIALS
      // -----------------------------------------------------

      mat.roughness = activeMaterialState.rough;
      mat.metalness = activeMaterialState.metal;
      mat.color.set(activeMaterialState.color);

      // RESET
      if (
        !activeMaterialState.presetId ||
        activeMaterialState.presetId === "reset"
      ) {
        mat.map = null;
        mat.normalMap = null;
        mat.needsUpdate = true;
        return;
      }

      // -----------------------------------------------------
      // APPLY PRESET TEXTURE
      // -----------------------------------------------------

      if (activePreset?.textureUrl) {
        const textureUrl = activePreset.textureUrl;

        textureLoader.load(textureUrl, (texture) => {
          if (
            !activeMaterialState.presetId ||
            activeMaterialState.presetId !== activePreset.id
          ) {
            return;
          }

          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(2, 2);
          texture.colorSpace = THREE.SRGBColorSpace;

          mat.map = texture;
          mat.needsUpdate = true;
        });
      } else {
        mat.map = null;
      }

      // -----------------------------------------------------
      // APPLY NORMAL TEXTURE
      // -----------------------------------------------------

      if (activePreset?.normalUrl) {
        const normalUrl = activePreset.normalUrl;

        textureLoader.load(normalUrl, (texture) => {
          if (
            !activeMaterialState.presetId ||
            activeMaterialState.presetId !== activePreset.id
          ) {
            return;
          }

          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(2, 2);

          mat.normalMap = texture;
          mat.needsUpdate = true;
        });
      } else {
        mat.normalMap = null;
      }

      mat.needsUpdate = true;
    });
  }, [activeMaterialState, activePreset, selectedMeshes]);

  // ---------------------------------------------------------
  // VISIBILITY
  // ---------------------------------------------------------

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if (!(child instanceof THREE.Mesh)) return;

      const material = child.material as THREE.MeshStandardMaterial;

      const isCaseMaterial = [
        "case_plastic",
        "port_plastic",
        "port_metal",
        "case_glossinner",
        "case_innerplastic",
        "led_light",
        "case_logo.001",
      ].includes(material.name);

      const isEarbudMaterial =
        child.parent?.name === "left_tws" ||
        child.parent?.name === "right_tws";

      if (show === "earbuds") {
        if (isCaseMaterial) {
          child.visible = false;
          child.raycast = () => null;
        }

        if (child.parent?.name === "left_tws") {
          child.visible = true;
          child.raycast = THREE.Mesh.prototype.raycast;
        }

        if (child.parent?.name === "right_tws") {
          child.visible = false;
          child.raycast = () => null;
        }
      }

      if (show === "case") {
        if (isCaseMaterial) {
          child.visible = true;
          child.raycast = THREE.Mesh.prototype.raycast;
        }

        if (isEarbudMaterial) {
          child.visible = false;
          child.raycast = () => null;
        }
      }
    });
  }, [show, scene]);

  // ---------------------------------------------------------
  // CASE LID ANIMATION
  // ---------------------------------------------------------

  useEffect(() => {
    if (!chargingCaseLid) return;

    const targetZ = lidstatus
      ? THREE.MathUtils.degToRad(-100)
      : 0;

    gsap.to(chargingCaseLid.rotation, {
      z: targetZ,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, [lidstatus, chargingCaseLid]);

  // ---------------------------------------------------------
  // MODEL TRANSFORMS
  // ---------------------------------------------------------

  if (chargingCase) {
    chargingCase.rotation.y = THREE.MathUtils.degToRad(90);
  }

  if (leftTws) {
    leftTws.rotation.x = THREE.MathUtils.degToRad(-90);
    leftTws.position.y = 0.06;
    leftTws.position.z = 0.04;
    leftTws.scale.set(2, 2, 2);
  }

  // ---------------------------------------------------------
  // SELECTION PULSE
  // ---------------------------------------------------------

  useEffect(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Remove old highlight
    scene.traverse((child: THREE.Object3D) => {
      if (!(child instanceof THREE.Mesh)) return;

      const mat = child.material as THREE.MeshStandardMaterial;

      if (mat) {
        mat.emissive.set("#000000");
        mat.emissiveIntensity = 0;
      }
    });

    if (selectedMeshes.length === 0) return;

    const targetMaterials: THREE.MeshStandardMaterial[] = [];

    selectedMeshes.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;

      if (mat && !targetMaterials.includes(mat)) {
        mat.emissive.set("#00ffff");
        mat.emissiveIntensity = 20;

        targetMaterials.push(mat);
      }
    });

    const startTime = performance.now();

    const speed = 12;
    const totalPulses = 3;

    const totalDurationMs =
      ((totalPulses * Math.PI * 2) / speed) * 1000;

    const animatePulse = (now: number) => {
      const elapsedTimeSec = (now - startTime) / 1000;
      const elapsedMs = now - startTime;

      if (elapsedMs < totalDurationMs) {
        const pulse =
          (Math.sin(elapsedTimeSec * speed - Math.PI / 2) + 1) /
          2;

        const currentIntensity = pulse * 0.6;

        targetMaterials.forEach((mat) => {
          mat.emissiveIntensity = currentIntensity;
        });

        animFrameRef.current =
          requestAnimationFrame(animatePulse);
      } else {
        targetMaterials.forEach((mat) => {
          mat.emissiveIntensity = 0;
          mat.emissive.set("#000000");
        });

        animFrameRef.current = null;
      }
    };

    animFrameRef.current =
      requestAnimationFrame(animatePulse);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [selectedMeshes, scene]);

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0.015, 1]}
        fov={10}
        near={0.1}
        far={20}
      />

      <primitive
        object={scene}
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          pointerDownPos.current = {
            x: e.clientX,
            y: e.clientY,
          };
        }}
        onPointerUp={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();

          const deltaX = Math.abs(
            e.clientX - pointerDownPos.current.x
          );

          const deltaY = Math.abs(
            e.clientY - pointerDownPos.current.y
          );

          // Ignore OrbitControls dragging
          if (deltaX > 3 || deltaY > 3) return;

          const clickedMesh = e.object as THREE.Mesh;

          const material =
            clickedMesh.material as THREE.MeshStandardMaterial;

          if (!material) return;

          // Non-selectable materials
          if (
            material.name === "port_plastic" ||
            material.name === "port_metal" ||
            material.name === "led_light"
          ) {
            return;
          }

          // Inner case materials act as one component
          const isInnerCaseClicked =
            material.name === "case_glossinner" ||
            material.name === "case_innerplastic";

          const targetMaterialNames = isInnerCaseClicked
            ? [
              "case_glossinner",
              "case_innerplastic",
            ]
            : [material.name];

          const matchingMeshes: THREE.Mesh[] = [];

          scene.traverse((child: THREE.Object3D) => {
            if (!(child instanceof THREE.Mesh)) return;

            if (!child.visible) return;

            const childMat =
              child.material as THREE.MeshStandardMaterial;

            if (
              childMat &&
              targetMaterialNames.includes(childMat.name)
            ) {
              matchingMeshes.push(child);
            }
          });

          setSelectedMeshes(matchingMeshes);
        }}
      />
    </>
  );
}