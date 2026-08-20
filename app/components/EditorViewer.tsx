"use client";

import * as THREE from "three";
import { useState, useRef, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import EditorModel from "./EditorModel";

// Configured with your exact material names
const EARBUD_MATERIALS = [
  { id: "plastic_tws", label: "Body Plastic", matNames: ["plastic_tws"] },
  { id: "leather_tws", label: "Leather Accent", matNames: ["leather_tws"] },
  { id: "silicone_tws", label: "Ear Tips (Silicone)", matNames: ["silicone_tws"] },
  { id: "metal_tws", label: "Metal Contacts/Stem", matNames: ["metal_tws"] },
  { id: "inner_mesh_tws", label: "Inner Mesh", matNames: ["innermesh_tws"] },
  { id: "logo_material", label: "Earbud Logo", matNames: ["Material"] },
];

const CASE_MATERIALS = [
  { id: "case_plastic", label: "Outer Shell", matNames: ["case_plastic"] },
  { id: "case_inner", label: "Inner Tray", matNames: ["case_glossinner", "case_innerplastic"] },
  { id: "case_logo", label: "Case Logo", matNames: ["case_logo.001"] },
];

// Presets for the 2x2 Texture Grid
const TEXTURE_PRESETS = [
  { id: "leather", label: "Leather", color: "#2b231d", rough: 0.7, metal: 0.1 },
  { id: "carbon", label: "Carbon Fiber", color: "#1a1a1a", rough: 0.3, metal: 0.5 },
  { id: "metal", label: "Brushed Metal", color: "#a8a8a8", rough: 0.25, metal: 0.9 },
  { id: "plastic", label: "Matte Plastic", color: "#3a3a3a", rough: 0.5, metal: 0.0 },
];

// 3 Curated Background Environment Presets
const BG_PRESETS = [
  {
    id: "emerald",
    label: "Emerald",
    value: "radial-gradient(circle at 50% 45%, #1d4034 0%, #0c1c16 55%, #030805 100%)",
    color: "#1d4034",
  },
  {
    id: "charcoal",
    label: "Charcoal",
    value: "radial-gradient(circle at center, #2a2d32 0%, #111215 70%, #0a0b0d 100%)",
    color: "#2a2d32",
  },
  {
    id: "light",
    label: "Light",
    value: "radial-gradient(circle at 50% 35%, #f8f9fa 0%, #e2e4e8 65%, #c8cbd1 100%)",
    color: "#e2e4e8",
  },
];

export default function EditorViewer() {
  const [show, setShow] = useState<"earbuds" | "case">("earbuds");
  const [selectedMeshes, setSelectedMeshes] = useState<THREE.Mesh[]>([]);

  // Viewport Background State (Defaults to Emerald)
  const [bgGradient, setBgGradient] = useState<string>(BG_PRESETS[0].value);

  // Retraction toggle state for right sidebar (closed by default on devices below md)
  const [isRightOpen, setIsRightOpen] = useState(false);

  // One-time floating helper overlay message state
  const [hasSelectedComponentOnce, setHasSelectedComponentOnce] = useState(false);

  // Dynamic material adjustment state
  const [roughness, setRoughness] = useState<number>(0.5);
  const [metalness, setMetalness] = useState<number>(0.5);
  const [hexColor, setHexColor] = useState<string>("#ffffff");

  // Track active texture preset selection
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Group>(null);

  // Handle default sidebar visibility based on screen width on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 768) {
        setIsRightOpen(true);
      }
    }
  }, []);

  // Sync state whenever selected meshes change
  useEffect(() => {
    if (selectedMeshes.length > 0) {
      setHasSelectedComponentOnce(true);

      const targetMesh =
        selectedMeshes.find(
          (m) => (m.material as THREE.MeshStandardMaterial)?.name === "case_innerplastic"
        ) || selectedMeshes[0];

      const mat = targetMesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        if (mat.roughness !== undefined) setRoughness(mat.roughness);
        if (mat.metalness !== undefined) setMetalness(mat.metalness);
        if (mat.color) setHexColor(`#${mat.color.getHexString()}`);
      }
    } else {
      setActivePresetId(null);
    }
  }, [selectedMeshes]);

  // Traverses scene graph to find and select matching active meshes
  const handleSelectMaterial = useCallback((targetMatNames: string[]) => {
    if (!sceneRef.current) return;

    const matchingMeshes: THREE.Mesh[] = [];
    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.visible) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat && targetMatNames.includes(mat.name)) {
          matchingMeshes.push(child);
        }
      }
    });

    if (matchingMeshes.length > 0) {
      setIsRightOpen(true);
      setHasSelectedComponentOnce(true);
    }

    setSelectedMeshes((prev) => {
      const prevNames = prev
        .map((m) => (m.material as THREE.MeshStandardMaterial).name)
        .sort()
        .join(",");
      const nextNames = matchingMeshes
        .map((m) => (m.material as THREE.MeshStandardMaterial).name)
        .sort()
        .join(",");

      if (prevNames === nextNames) return prev;
      return matchingMeshes;
    });
  }, []);

  // Update Material Properties across selected meshes
  const updateMaterialProperty = (
    key: "roughness" | "metalness" | "color",
    val: number | string
  ) => {
    selectedMeshes.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      if (key === "roughness") {
        if (mat.name !== "case_glossinner") {
          mat.roughness = val as number;
        }
        setRoughness(val as number);
      } else if (key === "metalness") {
        mat.metalness = val as number;
        setMetalness(val as number);
      } else if (key === "color") {
        mat.color.set(val as string);
        setHexColor(val as string);
      }
      mat.needsUpdate = true;
    });
  };

  const activeMaterialList = show === "earbuds" ? EARBUD_MATERIALS : CASE_MATERIALS;

  const activeMaterialName =
    selectedMeshes.length > 0
      ? (selectedMeshes[0].material as THREE.MeshStandardMaterial).name
      : "";

  const activeComponent = activeMaterialList.find((item) =>
    item.matNames.includes(activeMaterialName)
  );
  const activeComponentId = activeComponent ? activeComponent.id : "";

  const isEarbudLogo = activeMaterialName === "Material";
  const isCaseLogo = activeMaterialName === "case_logo.001";
  const isLogoSelected = isEarbudLogo || isCaseLogo;

  const isSilicone = activeMaterialName === "silicone_tws";
  const isInnerMesh = activeMaterialName === "innermesh_tws";
  const isSiliconeOrMesh = isSilicone || isInnerMesh;

  const isCaseInnerTray =
    activeMaterialName === "case_glossinner" ||
    activeMaterialName === "case_innerplastic";

  const isMetallicDisabled =
    activePresetId === "leather" ||
    activePresetId === "carbon" ||
    isSiliconeOrMesh ||
    isCaseInnerTray;

  return (
    <div
      className="relative h-screen w-full overflow-hidden text-white transition-all duration-500"
      style={{ background: bgGradient }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            preserveDrawingBuffer: true,
          }}
          dpr={[1, 2]}
          onPointerMissed={() => setSelectedMeshes([])}
        >
          <Environment files="/hdr/dancing_hall_2k.hdr" environmentIntensity={0.8} />

          <group ref={sceneRef}>
            <EditorModel
              show={show}
              selectedMeshes={selectedMeshes}
              setSelectedMeshes={(meshes) => {
                setSelectedMeshes(meshes);
                if (meshes.length > 0) {
                  setIsRightOpen(true);
                  setHasSelectedComponentOnce(true);
                }
              }}
            />
          </group>

          <OrbitControls minDistance={0.2} />
        </Canvas>
      </div>

      {/* --- ONE-TIME INITIAL HELPER MESSAGE (TOP OF SCREEN) --- */}
      {!hasSelectedComponentOnce && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-lg text-center pointer-events-none">
          <div className="rounded-2xl bg-black/60 px-4 py-3 backdrop-blur-xl border border-white/10 shadow-2xl text-xs sm:text-sm text-white/80 font-medium">
            Choose a component from the sidebar on the right or click directly on the 3D model.
          </div>
        </div>
      )}

      {/* --- FLOATING VIEW TOGGLE --- */}
      <div className="absolute bottom-6 sm:bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 z-20 flex rounded-xl sm:rounded-2xl bg-black/60 p-1 sm:p-2 backdrop-blur-xl border border-white/10 shadow-2xl transition-all">
        <button
          onClick={() => {
            setShow("earbuds");
            setSelectedMeshes([]);
            setActivePresetId(null);
          }}
          className={`rounded-lg sm:rounded-xl px-3.5 py-1.5 sm:px-6 sm:py-2.5 text-xs sm:text-base font-medium transition-all ${
            show === "earbuds"
              ? "bg-white text-black shadow-lg"
              : "text-white/70 hover:text-white"
          }`}
        >
          Earbuds
        </button>

        <button
          onClick={() => {
            setShow("case");
            setSelectedMeshes([]);
            setActivePresetId(null);
          }}
          className={`rounded-lg sm:rounded-xl px-3.5 py-1.5 sm:px-6 sm:py-2.5 text-xs sm:text-base font-medium transition-all ${
            show === "case"
              ? "bg-white text-black shadow-lg"
              : "text-white/70 hover:text-white"
          }`}
        >
          Case
        </button>
      </div>

      {/* --- RIGHT SIDEBAR TRIGGER (When retracted) --- */}
      {!isRightOpen && (
        <button
          onClick={() => setIsRightOpen(true)}
          className="absolute right-4 top-6 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 text-white/80 transition-all hover:bg-black/90 hover:text-white hover:scale-105 shadow-xl"
          title="Expand Right Sidebar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* --- RIGHT SIDEBAR INSPECTOR --- */}
      <aside
        className={`absolute right-4 sm:right-6 top-6 bottom-6 w-80 max-w-[calc(100vw-32px)] rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex flex-col z-30 overflow-hidden transition-all duration-300 ease-in-out ${
          isRightOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-[calc(100%+24px)] opacity-0 pointer-events-none"
        }`}
      >
        {/* FIXED HEADER WITH CLOSE BUTTON */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-white/10 shrink-0 bg-black/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Material Inspector
          </span>
          <button
            onClick={() => setIsRightOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            title="Retract Sidebar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* SCROLLABLE BODY CONTENT (Clean wrapper without trailing padding) */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Viewport Environment Background Switcher */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Background Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BG_PRESETS.map((preset) => {
                const isActive = bgGradient === preset.value;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setBgGradient(preset.value)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      isActive
                        ? "bg-white/15 border-cyan-400 text-white shadow-md"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-white/30"
                      style={{ backgroundColor: preset.color }}
                    />
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Component Selection Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Active Component
            </label>
            <div className="relative">
              <select
                value={activeComponentId}
                onChange={(e) => {
                  const selected = activeMaterialList.find(
                    (item) => item.id === e.target.value
                  );
                  if (selected) {
                    handleSelectMaterial(selected.matNames);
                  } else {
                    setSelectedMeshes([]);
                  }
                }}
                className="w-full appearance-none rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
              >
                <option value="" className="bg-neutral-900 text-white/60">
                  -- Select a component --
                </option>
                {activeMaterialList.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className="bg-neutral-900 text-white"
                  >
                    {item.label}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/60">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {selectedMeshes.length > 0 ? (
            <div className="flex flex-col gap-6">
              {/* Texture Presets (2x2 Grid) */}
              <div
                className={`flex flex-col gap-3 transition-opacity ${
                  isSiliconeOrMesh ? "opacity-30 pointer-events-none" : "opacity-100"
                }`}
              >
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Texture Presets
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {TEXTURE_PRESETS.map((preset) => {
                    const isPresetDisabled =
                      isSiliconeOrMesh ||
                      (isLogoSelected && (preset.id === "leather" || preset.id === "carbon")) ||
                      (isCaseInnerTray && preset.id !== "plastic");

                    const isSelected = activePresetId === preset.id;

                    return (
                      <button
                        key={preset.id}
                        disabled={isPresetDisabled}
                        onClick={() => {
                          setActivePresetId(preset.id);
                          updateMaterialProperty("roughness", preset.rough);
                          updateMaterialProperty("metalness", preset.metal);
                          updateMaterialProperty("color", preset.color);
                        }}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all group ${
                          isPresetDisabled
                            ? "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                            : isSelected
                            ? "bg-cyan-500/10 border-cyan-400 shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                        }`}
                      >
                        <div
                          className="h-10 w-10 rounded-full border border-white/20 shadow-inner group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: preset.color }}
                        />
                        <span className="text-xs text-white/80 font-medium">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material Configurator Sliders */}
              <div className="flex flex-col gap-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Material Configurator
                </label>

                {/* Roughness Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-white/70">
                    <span>Roughness</span>
                    <span>{Math.round(roughness * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={roughness}
                    onChange={(e) => updateMaterialProperty("roughness", parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 bg-white/20 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Metallic Slider */}
                <div
                  className={`flex flex-col gap-1.5 transition-opacity ${
                    isMetallicDisabled ? "opacity-30 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="flex justify-between text-xs text-white/70">
                    <span>Metallic</span>
                    <span>{Math.round(metalness * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    disabled={isMetallicDisabled}
                    value={metalness}
                    onChange={(e) => updateMaterialProperty("metalness", parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 bg-white/20 h-1.5 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Color Section with Color Wheel & HEX Input */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Color
                </label>
                <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <input
                    type="color"
                    value={hexColor}
                    onChange={(e) => updateMaterialProperty("color", e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className="h-10 w-10 shrink-0 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-white/40 uppercase font-semibold">HEX Code</span>
                    <input
                      type="text"
                      value={hexColor}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHexColor(val);
                        if (/^#[0-9A-F]{6}$/i.test(val)) {
                          updateMaterialProperty("color", val);
                        }
                      }}
                      className="bg-transparent text-sm font-mono text-white focus:outline-none uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-xs text-white/40">
              Choose a component from the dropdown above or click directly on the 3D model.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}