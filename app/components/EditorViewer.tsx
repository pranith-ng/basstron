"use client";

import * as THREE from "three";
import gsap from "gsap";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
} from "@react-three/drei";

import EditorModel, {
  MaterialPreset,
  MaterialState,
} from "./EditorModel";


// ---------------------------------------------------------
// COMPONENT LISTS
// ---------------------------------------------------------

const EARBUD_MATERIALS = [
  
  {
    id: "leather_tws",
    label: "Back Panel",
    matNames: ["leather_tws"],
  },
   {
    id: "metal_tws",
    label: "Stem",
    matNames: ["metal_tws"],
  },
  {
    id: "plastic_tws",
    label: "Main Body",
    matNames: ["plastic_tws"],
  },
  {
    id: "silicone_tws",
    label: "Silicone Ear Tips",
    matNames: ["silicone_tws"],
  },
  {
    id: "inner_mesh_tws",
    label: "Inner Mesh",
    matNames: ["innermesh_tws"],
  },
  {
    id: "logo_material",
    label: "Earbud Logo",
    matNames: ["Material"],
  },
];

const CASE_MATERIALS = [
  {
    id: "case_plastic",
    label: "Outer Shell",
    matNames: ["case_plastic"],
  },
  {
    id: "case_inner",
    label: "Inner Tray",
    matNames: [
      "case_glossinner",
      "case_innerplastic",
    ],
  },
  {
    id: "case_logo",
    label: "Case Logo",
    matNames: ["case_logo.001"],
  },
];

// ---------------------------------------------------------
// TEXTURE PRESETS
// ---------------------------------------------------------

const TEXTURE_PRESETS: MaterialPreset[] = [
  {
    id: "reset",
    label: "Reset / None",
  },
  {
    id: "leather",
    label: "Leather",
    color: "#2b231d",
    rough: 0.8,
    metal: 0,
    image: "/texture_ball/leather.png",
    textureUrl: "/textures/leather/diffuse.jpg",
    normalUrl: "/textures/leather/normal.jpg",
  },
  {
    id: "carbon",
    label: "Carbon Fiber",
    color: "#1a1a1a",
    rough: 0.3,
    metal: 0.5,
    image: "/texture_ball/carbon.png",
    textureUrl: "/textures/carbon/diffuse.jpg",
    normalUrl: "/textures/carbon/normal.jpg",
  },
  {
    id: "metal",
    label: "Brushed Metal",
    color: "#a8a8a8",
    rough: 0.18,
    metal: 0.9,
    image: "/texture_ball/metal.png",

  },
  {
    id: "wood-finish",
    label: "Wood",
    color: "#8b5a2b",
    rough: 0.6,
    metal: 0.0,
    image: "/texture_ball/wood.png",
    textureUrl: "/textures/wood/diffuse.jpg",
    normalUrl: "/textures/wood/normal.jpg",
  },
  {
    id: "plastic",
    label: "Matte Plastic",
    color: "#3a3a3a",
    rough: 0.5,
    metal: 0.0,
    image: "/texture_ball/plastic.png",

  },
];

// ---------------------------------------------------------
// BACKGROUND PRESETS
// ---------------------------------------------------------

const BG_PRESETS = [
  {
    id: "emerald",
    label: "Emerald",
    value:
      "radial-gradient(circle at 50% 45%, #1d4034 0%, #0c1c16 55%, #030805 100%)",
  },
  {
    id: "charcoal",
    label: "Charcoal",
    value:
      "radial-gradient(circle at center, #2a2d32 0%, #111215 70%, #0a0b0d 100%)",
  },
  {
    id: "light",
    label: "Light",
    value:
      "radial-gradient(circle at 50% 35%, #f8f9fa 0%, #e2e4e8 65%, #c8cbd1 100%)",
  },
];

// ---------------------------------------------------------
// ORIGINAL MATERIAL TYPE
// ---------------------------------------------------------

type OriginalMaterial = {
  color: string;
  rough: number;
  metal: number;
};

// ---------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------

export default function EditorViewer() {

  ///////////camera panning ref for orbit controls
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  //////////////////

  const [show, setShow] =
    useState<"earbuds" | "case">("earbuds");

  const [selectedMeshes, setSelectedMeshes] =
    useState<THREE.Mesh[]>([]);

  const [bgGradient, setBgGradient] =
    useState<string>(BG_PRESETS[0].value);

  const [isRightOpen, setIsRightOpen] =
    useState(false);

  const [isLidOpen, setIsLidOpen] =
    useState(true);

  const [hasSelectedComponentOnce, setHasSelectedComponentOnce] =
    useState(false);


  // draghelper popup Component state
  const [showpopup, setShowpopup] = useState<boolean>(true);

  //// dropdown state
  const [isComponentDropdownOpen, setIsComponentDropdownOpen] =
    useState<boolean>(false);


  // -------------------------------------------------------
  // color copy mechanism 
  // 
  const [copiedColor, setCopiedColor] = useState<string>("");
  const [colorMessage, setColorMessage] = useState<string>("");

  // -------------------------------------------------------
  // MATERIAL STATE PER MATERIAL
  // -------------------------------------------------------

  const [materialStates, setMaterialStates] =
    useState<Record<string, MaterialState>>({});


  // -------------------------------------------------------
  // ORIGINAL MATERIALS
  // Captured only once
  // -------------------------------------------------------

  const originalMaterialsRef =
    useRef<Record<string, OriginalMaterial>>({});

  const sceneRef =
    useRef<THREE.Group>(null);

  // -------------------------------------------------------
  // GET MATERIAL NAME
  // -------------------------------------------------------

  const getMaterialName = (
    mesh: THREE.Mesh
  ) => {
    const mat =
      mesh.material as THREE.MeshStandardMaterial;

    return mat.name;
  };

  // -------------------------------------------------------
  // CAPTURE ORIGINAL MATERIAL
  // -------------------------------------------------------

  const captureOriginalMaterial = useCallback(
    (mesh: THREE.Mesh) => {
      const mat =
        mesh.material as THREE.MeshStandardMaterial;

      if (!mat || !mat.name) return;

      if (!originalMaterialsRef.current[mat.name]) {
        originalMaterialsRef.current[mat.name] = {
          color: `#${mat.color.getHexString()}`,
          rough: mat.roughness,
          metal: mat.metalness,
        };
      }
    },
    []
  );

  // -------------------------------------------------------
  // SELECT MATERIAL
  // -------------------------------------------------------

  const handleSelectMaterial = useCallback(
    (targetMatNames: string[]) => {
      if (!sceneRef.current) return;

      const matchingMeshes: THREE.Mesh[] = [];

      sceneRef.current.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        if (!child.visible) return;

        const mat =
          child.material as THREE.MeshStandardMaterial;

        if (
          mat &&
          targetMatNames.includes(mat.name)
        ) {
          captureOriginalMaterial(child);
          matchingMeshes.push(child);
        }
      });

      if (matchingMeshes.length === 0) return;

      setIsRightOpen(true);
      setHasSelectedComponentOnce(true);

      setSelectedMeshes((prev) => {
        const prevNames = prev
          .map((m) => getMaterialName(m))
          .sort()
          .join(",");

        const nextNames = matchingMeshes
          .map((m) => getMaterialName(m))
          .sort()
          .join(",");

        if (prevNames === nextNames) {
          return prev;
        }

        return matchingMeshes;
      });
    },
    [captureOriginalMaterial]
  );

  // -------------------------------------------------------
  // CREATE MATERIAL STATE WHEN SELECTED
  // -------------------------------------------------------

  useEffect(() => {
    if (selectedMeshes.length === 0) return;

    selectedMeshes.forEach((mesh) => {
      captureOriginalMaterial(mesh);
    });

    const targetMesh =
      selectedMeshes.find(
        (m) =>
          getMaterialName(m) ===
          "case_innerplastic"
      ) || selectedMeshes[0];

    const materialName =
      getMaterialName(targetMesh);

    const original =
      originalMaterialsRef.current[
      materialName
      ];

    if (!original) return;

    setMaterialStates((prev) => {
      // IMPORTANT:
      // If state already exists, DON'T overwrite it.
      if (prev[materialName]) {
        return prev;
      }

      return {
        ...prev,
        [materialName]: {
          presetId: null,
          rough: original.rough,
          metal: original.metal,
          color: original.color,
          presetValues: {},
        },
      };

    });
  }, [
    selectedMeshes,
    captureOriginalMaterial,
  ]);

  // -------------------------------------------------------
  // CURRENT MATERIAL
  // -------------------------------------------------------

  const activeMaterialName =
    selectedMeshes.length > 0
      ? getMaterialName(selectedMeshes[0])
      : "";

  const activeMaterialList =
    show === "earbuds"
      ? EARBUD_MATERIALS
      : CASE_MATERIALS;

  const activeComponent =
    activeMaterialList.find((item) =>
      item.matNames.includes(
        activeMaterialName
      )
    );

  const activeComponentId =
    activeComponent?.id ?? "";

  // -------------------------------------------------------
  // CURRENT MATERIAL STATE
  // -------------------------------------------------------

  const activeMaterialState =
    activeMaterialName
      ? materialStates[activeMaterialName] ?? null
      : null;

  // -------------------------------------------------------
  // CURRENT PRESET
  // -------------------------------------------------------

  const activePreset =
    TEXTURE_PRESETS.find(
      (preset) =>
        preset.id ===
        activeMaterialState?.presetId
    ) ?? null;

  // -------------------------------------------------------
  // CURRENT UI VALUES
  // -------------------------------------------------------

  const roughness =
    activeMaterialState?.rough ?? 0.5;

  const metalness =
    activeMaterialState?.metal ?? 0;

  const hexColor =
    activeMaterialState?.color ?? "#ffffff";

  // -------------------------------------------------------
  // MANUAL ROUGHNESS
  // -------------------------------------------------------

  const updateRoughness = (value: number) => {
    if (!activeMaterialName) return;

    setMaterialStates((prev) => {
      const current = prev[activeMaterialName];

      if (!current) return prev;

      const presetId = current.presetId;

      return {
        ...prev,

        [activeMaterialName]: {
          ...current,

          rough: value,

          presetValues: presetId
            ? {
              ...current.presetValues,

              [presetId]: {
                ...current.presetValues?.[presetId],
                rough: value,
              },
            }
            : current.presetValues,
        },
      };
    });
  };

  // -------------------------------------------------------
  // MANUAL METALNESS
  // -------------------------------------------------------

  const updateMetalness = (value: number) => {
    if (!activeMaterialName) return;

    setMaterialStates((prev) => {
      const current = prev[activeMaterialName];

      if (!current) return prev;

      const presetId = current.presetId;

      return {
        ...prev,

        [activeMaterialName]: {
          ...current,

          metal: value,

          presetValues: presetId
            ? {
              ...current.presetValues,

              [presetId]: {
                ...current.presetValues?.[presetId],
                metal: value,
              },
            }
            : current.presetValues,
        },
      };
    });
  };

  // -------------------------------------------------------
  // COLOR
  // -------------------------------------------------------

  const updateColor = (value: string) => {
    if (!activeMaterialName) return;

    setMaterialStates((prev) => ({
      ...prev,
      [activeMaterialName]: {
        ...prev[activeMaterialName],
        color: value,
      },
    }));
  };

  // -------------------------------------------------------
  // APPLY PRESET
  // -------------------------------------------------------

  const applyPreset = (preset: MaterialPreset) => {
    if (!activeMaterialName) return;
    // RESET
    if (preset.id === "reset") {
      const original =
        originalMaterialsRef.current[activeMaterialName];

      if (!original) return;

      setMaterialStates((prev) => {
        const current = prev[activeMaterialName];

        if (!current) return prev;

        return {
          ...prev,
          [activeMaterialName]: {
            ...current,
            presetId: null,
            rough: original.rough,
            metal: original.metal,
            color: original.color,
            presetValues: {},
          },
        };
      });

      return;
    }

    setMaterialStates((prev) => {
      const current = prev[activeMaterialName];

      if (!current) return prev;

      // Check if this preset already has saved slider values
      const saved = current.presetValues?.[preset.id];

      const rough =
        saved?.rough ??
        preset.rough ??
        current.rough;

      const metal =
        saved?.metal ??
        preset.metal ??
        current.metal;

      return {
        ...prev,
        [activeMaterialName]: {
          ...current,

          presetId: preset.id,

          rough,
          metal,

          presetValues: {
            ...current.presetValues,

            [preset.id]: {
              rough,
              metal,
            },
          },
        },
      };
    });
  };

  // -------------------------------------------------------
  // PRESET DISABLE RULES
  // -------------------------------------------------------

  const isEarbudLogo =
    activeMaterialName === "Material";

  const isCaseLogo =
    activeMaterialName ===
    "case_logo.001";

  const isLogoSelected =
    isEarbudLogo ||
    isCaseLogo;

  const isSilicone =
    activeMaterialName ===
    "silicone_tws";

  const isInnerMesh =
    activeMaterialName ===
    "innermesh_tws";

  const isSiliconeOrMesh =
    isSilicone ||
    isInnerMesh;

  const isCaseInnerTray =
    activeMaterialName ===
    "case_glossinner" ||
    activeMaterialName ===
    "case_innerplastic";

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <div
      className="relative h-svh w-full overflow-hidden text-white transition-all duration-500"
      style={{
        background: bgGradient,
      }}
    >
      {/* =====================================================
          CANVAS
      ===================================================== */}

      <div className="w-full h-full overflow-hidden">
        <Canvas
          gl={{
            antialias: true,
            powerPreference:
              "high-performance",
            toneMapping:
              THREE.ACESFilmicToneMapping,
            preserveDrawingBuffer: true,
          }}
          dpr={[1, 2]}
        >
          <Environment
            files="/hdr/dancing_hall_1k.exr"
            environmentIntensity={1}
          />

          <group ref={sceneRef}>
            <EditorModel
              show={show}
              cameraRef={cameraRef}
              controlsRef={controlsRef}
              selectedMeshes={
                selectedMeshes
              }
              lidstatus={isLidOpen}
              activeMaterialState={
                activeMaterialState
              }
              activePreset={activePreset}
              setSelectedMeshes={(
                meshes
              ) => {
                meshes.forEach(
                  captureOriginalMaterial
                );

                setSelectedMeshes(
                  meshes
                );

                if (
                  meshes.length > 0
                ) {
                  setIsRightOpen(true);

                  setHasSelectedComponentOnce(
                    true
                  );
                }
              }}
            />
          </group>

          <OrbitControls
            ref={controlsRef}
            target={[0, 0.015, 0]}
            minDistance={0.2}
            maxDistance={3}
            enablePan={false}

          />
        </Canvas>
      </div>

      {/* =====================================================
          HELPER
      ===================================================== */}

      {!hasSelectedComponentOnce && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 md:w-11/12 max-w-lg text-center pointer-events-none">
          <div className="rounded-2xl bg-white/80 px-4 py-3 backdrop-blur-xl border border-white/10 shadow-2xl text-xs sm:text-sm text-black font-medium">
            Choose a component from the sidebar on the right or click directly on the 3D model.
          </div>
        </div>
      )}

      /////////////////drag and zoom helper

      {showpopup && (
        <div className="touch-none absolute inset-0 z-50 w-full h-full overflow-hidden bg-black/40 backdrop-blur-md flex items-end justify-center pb-25 sm:pb-30">

          <div className="relative flex flex-col items-center gap-2 sm:gap-3 bg-white text-black backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl px-3 py-2 sm:px-5 sm:py-3 text-[10px] sm:text-xs shadow-xl max-w-[calc(100%-2rem)]">

            {/* Rotate + Zoom */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* Rotate */}
              <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 "
                >
                  <path d="M12 4v5" />
                  <path d="m9.5 6.5 2.5-2.5 2.5 2.5" />

                  <path d="M12 20v-5" />
                  <path d="m9.5 17.5 2.5 2.5 2.5-2.5" />

                  <path d="M4 12h5" />
                  <path d="m6.5 9.5-2.5 2.5 2.5 2.5" />

                  <path d="M20 12h-5" />
                  <path d="m17.5 9.5 2.5 2.5-2.5 2.5" />
                </svg>
                <span>Drag to rotate</span>
              </div>

              {/* Divider */}
              <div className="h-3 sm:h-4 w-px bg-black shrink-0" />

              {/* Zoom */}
              <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <img
                  src="/mouse_scroll/mouse_scroll.svg"
                  alt="Scroll"
                  className="w-5 h-5"
                />
                <span>Scroll to zoom</span>
              </div>

            </div>

            {/* Continue message */}
            <span className="text-[9px] sm:text-[10px] text-black/50 text-center whitespace-nowrap">
              Close the popup to continue
            </span>

            {/* X */}
            <button
              type="button"
              onClick={() => setShowpopup(false)}
              title="Close instructions"
              className="absolute -top-3 -right-3 text-xl sm:text-2xl h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-red-600 border-2 sm:border-3 border-red-600 text-black hover:text-3xl hover:text-white transition"
            >
              ×
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      <div className="touch-none absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center rounded-4xl bg-black/60 p-2 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300">

        <div className="flex bg-white/5 rounded-4xl">

          <button
            onClick={() => {
              setShow("earbuds");
              setSelectedMeshes([]);
            }}
            className={`rounded-4xl px-5 py-2 text-sm font-medium transition-all ${show === "earbuds"
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
            }}
            className={`rounded-4xl px-5 py-2 text-sm font-medium transition-all ${show === "case"
              ? "bg-white text-black shadow-lg"
              : "text-white/70 hover:text-white"
              }`}
          >
            Case
          </button>

        </div>

        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out ${show === "case"
            ? "max-w-[170px] opacity-100 ml-2"
            : "max-w-0 opacity-0 ml-0 pointer-events-none"
            }`}
        >

          <div className="h-4 w-[1px] bg-white/15 my-auto shrink-0" />

          <button
            onClick={() =>
              setIsLidOpen(
                (prev) => !prev
              )
            }
            className={`flex items-center gap-1.5 rounded-4xl px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-all ${isLidOpen
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30"
              : "bg-white/10 text-white hover:bg-white/20"
              }`}
          >
            <span>
              {isLidOpen
                ? "Close Lid"
                : "Open Lid"}
            </span>
          </button>

        </div>
      </div>

      {/* =====================================================
          SIDEBAR OPEN BUTTON
      ===================================================== */}

      {!isRightOpen && (
        <button
          onClick={() =>
            setIsRightOpen(true)
          }
          className="touch-none absolute right-4 top-6 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 text-white/80 transition-all hover:bg-black/90 hover:text-white hover:scale-105 shadow-xl"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`overscroll-contain absolute right-4 sm:right-6 top-6 h-[calc(100svh-48px)] w-80 max-w-[calc(100vw-32px)] rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex flex-col z-30 overflow-hidden transition-all duration-300 ease-in-out ${isRightOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
          }`}
      >

        {/* HEADER */}

        <div className="flex items-center justify-between p-5 pb-3 border-b border-white/10 shrink-0 bg-black/20">

          <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Material Inspector
          </span>

          <button
            onClick={() =>
              setIsRightOpen(false)
            }
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

        </div>

        {/* BODY */}

        <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-hide ">

          {/* BACKGROUND */}

          <div className="flex flex-col gap-2">

            <label className="text-xs mb-2 font-semibold uppercase tracking-wider text-white/40">
              Background Theme
            </label>

            <div className="flex rounded-4xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl">

              {BG_PRESETS.map(
                (preset) => {
                  const isActive =
                    bgGradient ===
                    preset.value;

                  return (
                    <button
                      key={preset.id}
                      onClick={() =>
                        setBgGradient(
                          preset.value
                        )
                      }
                      className={`flex-1 rounded-4xl px-3 py-3 text-xs font-medium transition-all ${isActive
                        ? "bg-white text-black shadow-lg"
                        : "text-white/70 hover:text-white"
                        }`}
                    >
                      {preset.label}
                    </button>
                  );
                }
              )}

            </div>
          </div>

          <hr className="border-white/10" />

          {/* COMPONENT SELECT */}

          <div className="flex flex-col gap-2">

            <label className="text-xs mb-2 font-semibold uppercase tracking-wider text-white/40">
              Active Component
            </label>

            <div className="relative">

              {/* Selected component / trigger */}
              <button
                type="button"
                onClick={() => setIsComponentDropdownOpen(!isComponentDropdownOpen)}
                className="w-full flex items-center justify-between rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
              >
                <span
                  className={
                    activeComponentId
                      ? "text-white"
                      : "text-white/60"
                  }
                >
                  {activeMaterialList.find(
                    (item) =>
                      item.id === activeComponentId
                  )?.label ?? "-- Select a component --"}
                </span>

                <svg
                  className={`h-4 w-4 text-white/60 transition-transform ${isComponentDropdownOpen
                    ? "rotate-180"
                    : ""
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {isComponentDropdownOpen && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl bg-neutral-900 border border-white/10 shadow-[0_55px_50px_rgba(0,0,0,1)]">                  {/* Default option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMeshes([]);
                      setIsComponentDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    -- Select a component --
                  </button>

                  {/* Components */}
                  {activeMaterialList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleSelectMaterial(
                          item.matNames
                        );

                        setIsComponentDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors cursor-pointer ${item.id === activeComponentId
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              MATERIAL CONTROLS
          ================================================= */}

          {selectedMeshes.length > 0 ? (

            <div className="flex flex-col gap-6">

              {/* =================================================
                  TEXTURES
              ================================================= */}

              <div className="flex flex-col gap-3">

                <label className="text-xs mb-2 font-semibold uppercase tracking-wider text-white/40">
                  Texture Presets
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {TEXTURE_PRESETS.map(
                    (preset) => {

                      const isPresetDisabled =
                        (isSiliconeOrMesh && preset.id !== "reset") ||
                        (isLogoSelected &&
                          (
                            preset.id === "leather" ||
                            preset.id === "carbon" ||
                            preset.id === "wood-finish"
                          )) ||
                        (isCaseInnerTray &&
                          preset.id !== "reset" &&
                          preset.id !== "plastic");

                      const isSelected =
                        activeMaterialState?.presetId ===
                        preset.id;

                      return (
                        <button
                          key={preset.id}
                          disabled={
                            isPresetDisabled
                          }
                          onClick={() =>
                            applyPreset(
                              preset
                            )
                          }
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all group ${isPresetDisabled
                            ? "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                            : isSelected
                              ? "bg-cyan-500/10 border-2 border-cyan-400 shadow-lg"
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                            }`}
                        >

                          <div
                            className={`h-14 w-14 rounded-full group-hover:scale-105 transition-transform bg-cover bg-center ${preset.id === "reset" ? "border-2 border-white" : ""
                              }`}
                            style={{
                              backgroundImage:
                                preset.id === "reset"
                                  ? "linear-gradient(45deg, transparent 49%, white 48%, white 51%, transparent 51%)"
                                  : preset.image
                                    ? `url(${preset.image})`
                                    : "none",
                            }}
                          />

                          <span className="text-xs text-white/80 font-medium">
                            {preset.label}
                          </span>

                        </button>
                      );
                    }
                  )}

                </div>
              </div>

              {/* =================================================
                  MATERIAL CONFIGURATOR
              ================================================= */}

              <div className="flex flex-col gap-4">

                <label className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Material Configurator
                </label>

                {/* =================================================
                    ROUGHNESS
                    ONLY METAL + PLASTIC
                ================================================= */}

                {(
                  activeMaterialState?.presetId ===
                  "metal" ||
                  activeMaterialState?.presetId ===
                  "plastic"
                ) && (

                    <div className="flex flex-col gap-1.5">

                      <div className="flex justify-between text-xs text-white/70">

                        <span>
                          Roughness
                        </span>

                        <span>
                          {Math.round(
                            roughness * 100
                          )}
                          %
                        </span>

                      </div>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={roughness}
                        onChange={(e) =>
                          updateRoughness(
                            parseFloat(
                              e.target.value
                            )
                          )
                        }
                        className="w-full accent-cyan-400 bg-white/20 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />

                    </div>
                  )}

                {/* =================================================
                    METALLIC
                    ONLY METAL
                ================================================= */}

                {activeMaterialState?.presetId ===
                  "metal" && (

                    <div className="flex flex-col gap-1.5">

                      <div className="flex justify-between text-xs text-white/70">

                        <span>
                          Metallic
                        </span>

                        <span>
                          {Math.round(
                            metalness * 100
                          )}
                          %
                        </span>

                      </div>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={metalness}
                        onChange={(e) =>
                          updateMetalness(
                            parseFloat(
                              e.target.value
                            )
                          )
                        }
                        className="w-full accent-cyan-400 bg-white/20 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />

                    </div>
                  )}

              </div>

              {/* =================================================
                  COLOR
              ================================================= */}

              <div className="flex flex-col gap-3">

                <label className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Color
                </label>

                <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10">

                  {/* Color picker */}
                  <input
                    type="color"
                    value={
                      /^#[0-9A-F]{6}$/i.test(hexColor)
                        ? hexColor
                        : "#ffffff"
                    }
                    onChange={(e) => updateColor(e.target.value)}
                    style={{
                      colorScheme: "dark",
                    }}
                    className="h-10 w-10 shrink-0 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />

                  <div className="flex flex-col flex-1 min-w-0">

                    <span className="text-[10px] text-white/40 uppercase font-semibold">
                      HEX Code
                    </span>

                    <input
                      type="text"
                      value={hexColor}
                      onChange={(e) => {
                        let value = e.target.value;

                        if (!value.startsWith("#")) {
                          value = "#" + value;
                        }

                        if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                          updateColor(value.toUpperCase());
                        }
                      }}
                      onBlur={() => {
                        if (!/^#[0-9A-F]{6}$/i.test(hexColor)) {
                          updateColor("#FFFFFF");
                        }
                      }}
                      className="bg-transparent text-sm font-mono text-white focus:outline-none uppercase w-full"
                    />

                  </div>

                  {/* Copy */}
                  <button
                    type="button"
                    onClick={() => {
                      setCopiedColor(hexColor);
                      setColorMessage("Color copied");

                      setTimeout(() => {
                        setColorMessage("");
                      }, 1500);
                    }}
                    className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                    title="Copy color"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white/60"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" />
                      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                    </svg>
                  </button>

                  {/* Paste */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!copiedColor) {
                        setColorMessage("No color copied");

                        setTimeout(() => {
                          setColorMessage("");
                        }, 1500);

                        return;
                      }

                      updateColor(copiedColor);
                      setColorMessage("Color pasted");

                      setTimeout(() => {
                        setColorMessage("");
                      }, 1500);
                    }}
                    className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                    title="Paste color"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white/60"
                    >
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    </svg>
                  </button>

                </div>
              </div>

              {colorMessage && (
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-black bg-white border border-white/15 px-4 py-2 rounded-lg backdrop-blur-md shadow-lg whitespace-nowrap">
                  {colorMessage}
                </span>
              )}

            </div>

          ) : (

            <div className="flex-1 flex items-center justify-center text-center text-xs text-white">
              Choose a component from the dropdown above or click directly on the 3D model.
            </div>

          )}

        </div>
      </aside>
    </div>
  );
}