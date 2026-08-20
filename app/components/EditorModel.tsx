"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";

type EditorModelProps = {
    show: "earbuds" | "case";
    selectedMeshes: THREE.Mesh[];
    setSelectedMeshes: (meshes: THREE.Mesh[]) => void;
};

export default function EditorModel({
    show,
    selectedMeshes,
    setSelectedMeshes,
}: EditorModelProps) {
    const { scene } = useGLTF("/model/tws_threejs.glb");
    const animFrameRef = useRef<number | null>(null);

    const leftTws = scene.getObjectByName("left_tws");
    const chargingCase = scene.getObjectByName("chargingcase");

    // Handle visibility rules based on show prop
    useEffect(() => {
        if (show === "earbuds") {
            scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    const material = child.material as THREE.MeshStandardMaterial;

                    if (
                        material.name === "case_plastic" ||
                        material.name === "port_plastic" ||
                        material.name === "port_metal" ||
                        material.name === "case_glossinner" ||
                        material.name === "case_innerplastic" ||
                        material.name === "led_light" ||
                        material.name === "case_logo.001"
                    ) {
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
            });
        }

        if (show === "case") {
            scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    const material = child.material as THREE.MeshStandardMaterial;

                    if (
                        material.name === "case_plastic" ||
                        material.name === "port_plastic" ||
                        material.name === "port_metal" ||
                        material.name === "case_glossinner" ||
                        material.name === "case_innerplastic" ||
                        material.name === "led_light" ||
                        material.name === "case_logo.001"
                    ) {
                        child.visible = true;
                        child.raycast = THREE.Mesh.prototype.raycast;
                    }

                    if (
                        child.parent?.name === "left_tws" ||
                        child.parent?.name === "right_tws"
                    ) {
                        child.visible = false;
                        child.raycast = () => null;
                    }
                }
            });
        }
    }, [show, scene]);

    if (chargingCase) {
        chargingCase.rotation.y = THREE.MathUtils.degToRad(90);
    }

    if (leftTws) {
        leftTws.rotation.x = THREE.MathUtils.degToRad(-90);
        leftTws.position.y = 0.06;
        leftTws.position.z = 0.04;
        leftTws.scale.set(2, 2, 2);
    }

    // --- 3-Pulse and Turn Off Animation ---
    useEffect(() => {
        // Cancel any active running pulse sequence
        if (animFrameRef.current !== null) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }

        // 1. Reset all scene materials
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const mat = child.material as THREE.MeshStandardMaterial;
                if (mat) {
                    mat.emissive.set("#000000");
                    mat.emissiveIntensity = 0;
                }
            }
        });

        if (selectedMeshes.length === 0) return;

        // 2. Setup target materials
        const targetMaterials: THREE.MeshStandardMaterial[] = [];
        selectedMeshes.forEach((mesh) => {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && !targetMaterials.includes(mat)) {
                mat.emissive.set("#00ffff"); // Cyan highlight
                mat.emissiveIntensity = 0;
                targetMaterials.push(mat);
            }
        });

        // 3. Run self-terminating 3-pulse animation
        const startTime = performance.now();
        const speed = 12; // Frequency / pulse speed
        const totalPulses = 3;
        const totalDurationMs = ((totalPulses * Math.PI * 2) / speed) * 1000;

        const animatePulse = (now: number) => {
            const elapsedTimeSec = (now - startTime) / 1000;
            const elapsedMs = now - startTime;

            if (elapsedMs < totalDurationMs) {
                // Active pulse cycle (oscillates between 0 and 0.6 intensity)
                const pulse = (Math.sin(elapsedTimeSec * speed - Math.PI / 2) + 1) / 2;
                const currentIntensity = pulse * 0.6;

                targetMaterials.forEach((mat) => {
                    mat.emissiveIntensity = currentIntensity;
                });

                animFrameRef.current = requestAnimationFrame(animatePulse);
            } else {
                // Done 3 pulses -> turn off completely (0)
                targetMaterials.forEach((mat) => {
                    mat.emissiveIntensity = 0;
                    mat.emissive.set("#000000");
                });
                animFrameRef.current = null;
            }
        };

        animFrameRef.current = requestAnimationFrame(animatePulse);

        return () => {
            if (animFrameRef.current !== null) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [selectedMeshes, scene]);

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
                onClick={(e: any) => {
                    e.stopPropagation();

                    const clickedMesh = e.object as THREE.Mesh;
                    const material = clickedMesh.material as THREE.MeshStandardMaterial;

                    if (
                        material.name === "port_plastic" ||
                        material.name === "port_metal" ||
                        material.name === "led_light"
                    ) {
                        return;
                    }

                    const isInnerCaseClicked =
                        material.name === "case_glossinner" ||
                        material.name === "case_innerplastic";

                    const targetMaterialNames = isInnerCaseClicked
                        ? ["case_glossinner", "case_innerplastic"]
                        : [material.name];

                    const matchingMeshes: THREE.Mesh[] = [];
                    scene.traverse((child) => {
                        if (child instanceof THREE.Mesh && child.visible) {
                            const childMat = child.material as THREE.MeshStandardMaterial;
                            if (targetMaterialNames.includes(childMat.name)) {
                                matchingMeshes.push(child);
                            }
                        }
                    });

                    setSelectedMeshes(matchingMeshes);
                }}
            />
        </>
    );
}