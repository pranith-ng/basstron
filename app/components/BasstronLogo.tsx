"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAppContext } from "../context/Context";



function buildWavePath(progress: number, phase: number) {
    const width = 1008;
    const height = 1054;

    const baseline = height - (height * progress) / 100;

    const amplitude = 14;
    const points = 32;

    let path = `M 0 ${height} L 0 ${baseline}`;

    for (let i = 0; i <= points; i++) {
        const x = (width / points) * i;

        const y =
            baseline +
            Math.sin((i / points) * Math.PI * 6 + phase) * amplitude;

        path += ` L ${x} ${y}`;
    }

    path += ` L ${width} ${height} Z`;

    return path;
}

export default function BasstronLogo() {
    const { setLoaderLoaded } = useAppContext();
    const { viewerLoaded } = useAppContext();

    const [finished, setFinished] = useState(false);

    const logoColor = viewerLoaded ? "#000000" : "#ffffff";

    const clipId = useId();

    const waveRef = useRef<SVGPathElement>(null);
    const logoRef = useRef<SVGSVGElement>(null);

    const progressRef = useRef(0);
    const displayedProgressRef = useRef(0);
    const phaseRef = useRef(0);

    // =========================================
    // FILES TO LOAD
    // =========================================

    useEffect(() => {
        const startTime = performance.now();

        const files = [
            "/model/tws_threejs.glb",
            "/background/b6.jpg",

            ...Array.from(
                { length: 356 },
                (_, i) =>
                    `/frames/${String(i + 1).padStart(4, "0")}.webp`
            ),
        ];

        let loaded = 0;
        const actualProgress = { value: 0 };

        const updateProgress = () => {
            loaded++;

            actualProgress.value = (loaded / files.length) * 100;
        };

        const update = () => {
            const elapsed = performance.now() - startTime;

            // Progress based on actual loading
            const loadingProgress = actualProgress.value;
            // Progress based on minimum 3 second duration
            const timeProgress = Math.min(
                100,
                (elapsed / 5000) * 100
            );

            // Don't let progress outrun either one
            const progress = Math.min(
                loadingProgress,
                timeProgress
            );

            progressRef.current = progress;

            if (
                actualProgress.value >= 100 &&
                timeProgress >= 100
            ) {
                progressRef.current = 100;
                setFinished(true);
                return;
            }

            requestAnimationFrame(update);
        };

        requestAnimationFrame(update);

        files.forEach((file) => {
            if (file.endsWith(".glb")) {
                fetch(file)
                    .then(() => updateProgress())
                    .catch(() => updateProgress());

                return;
            }

            const img = new Image();

            img.onload = updateProgress;
            img.onerror = updateProgress;

            img.src = file;
        });
    }, []);

    // =========================================
    // SMOOTH PROGRESS
    // =========================================



    // =========================================
    // WAVE
    // =========================================

    useGSAP(() => {
        let animationFrame: number;
        let lastTime = performance.now();

        const update = (time: number) => {
            const delta = Math.min((time - lastTime) / 1000, 0.05);
            lastTime = time;

            // Smooth progress
            displayedProgressRef.current +=
                (progressRef.current - displayedProgressRef.current) *
                Math.min(delta * 8, 1);

            // Wave movement
            phaseRef.current += delta * ((Math.PI * 2) / 0.7);

            if (waveRef.current) {
                waveRef.current.setAttribute(
                    "d",
                    buildWavePath(
                        displayedProgressRef.current,
                        phaseRef.current
                    )
                );
            }

            animationFrame = requestAnimationFrame(update);
        };

        animationFrame = requestAnimationFrame(update);

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    // =========================================
    // FINISHED
    // =========================================

    useGSAP(() => {
        if (!finished) return;
        if (!logoRef.current) return;

        gsap.to(logoRef.current, {
            top: "50px",
            width: 60,
            duration: 1,
            ease: "power1.inOut",
            onComplete: () => {
                setLoaderLoaded(true);
            },
        });
    }, [finished]);

    return (
        <svg
            ref={logoRef}
            viewBox="0 0 1008 1054"
            className="absolute left-1/2 w-[300px] h-auto z-50"
            style={{
                top: "50%",
                transform: "translate(-55%, -50%)",
            }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <clipPath id={clipId}>
                    <path
                        ref={waveRef}
                        d={buildWavePath(0, 0)}
                    />
                </clipPath>
            </defs>

            {/* =========================================
          FULL LOGO OUTLINE
          ========================================= */}
            <g
                transform="translate(0,1054) scale(0.1,-0.1)"
                fill="none"
                stroke={logoColor}
                strokeWidth="35"
                opacity="0.4"
            >
                <path d="M4730 9819 c-37 -15 -67 -46 -123 -128 -169 -249 -632 -631 -1177 -971 -375 -234 -515 -336 -696 -513 -380 -369 -590 -806 -610 -1272 -19 -429 154 -890 495 -1320 117 -148 339 -371 485 -487 103 -82 145 -106 99 -55 -33 35 -164 241 -230 362 -291 528 -360 1010 -207 1435 111 308 356 571 703 753 58 30 215 100 348 156 133 55 283 121 335 147 89 45 253 147 264 165 3 5 10 9 16 9 11 0 10 -22 -8 -640 -3 -102 -12 -502 -20 -890 -31 -1533 -54 -2533 -65 -2910 -8 -294 -8 -420 0 -495 54 -472 262 -893 617 -1249 412 -413 921 -666 1509 -752 165 -24 513 -24 680 0 536 77 982 307 1308 671 251 282 404 615 448 979 25 210 2 480 -63 716 -133 485 -493 956 -973 1275 -431 286 -908 429 -1430 428 -292 0 -534 -38 -779 -123 -274 -95 -555 -260 -733 -433 l-53 -51 0 54 c0 30 9 388 20 795 39 1431 71 4131 51 4211 -28 111 -120 169 -211 133z
m1985 -5090 c314 -39 645 -163 905 -340 445 -302 731 -754 776 -1228 l7 -74 -114 5 c-91 4 -123 9 -162 28 -71 34 -130 105 -162 197 -82 238 -103 280 -158 313 -18 11 -50 20 -71 20 -34 0 -46 -7 -82 -45 -57 -59 -83 -142 -129 -421 -47 -282 -88 -464 -104 -464 -12 0 -26 55 -65 256 -41 211 -67 286 -112 332 -27 27 -39 32 -78 32 -77 0 -124 -65 -173 -241 -9 -33 -20 -56 -24 -52 -14 15 -49 258 -79 553 -49 476 -73 575 -146 608 -41 19 -64 14 -99 -21 -70 -70 -88 -187 -155 -1037 -28 -353 -50 -568 -67 -645 l-6 -30 -8 35 c-5 19 -18 105 -29 190 -67 493 -142 856 -204 978 -36 71 -77 102 -133 102 -39 0 -51 -5 -83 -38 -59 -58 -86 -156 -146 -526 -14 -88 -36 -191 -48 -230 l-23 -71 -17 39 c-10 21 -36 109 -58 195 -58 226 -106 309 -190 332 -64 17 -120 -4 -223 -85 -101 -79 -147 -88 -310 -61 -49 8 -94 15 -99 15 -23 0 26 299 70 422 215 599 875 999 1599 971 66 -2 156 -9 200 -14z
m9 -939 c4 -36 18 -175 31 -309 28 -274 48 -410 75 -523 33 -136 67 -175 141 -165 71 9 106 62 154 227 15 52 30 102 35 110 10 18 21 -21 51 -180 66 -354 123 -452 244 -419 90 25 134 145 200 547 39 235 72 389 85 397 8 5 52 -100 80 -190 38 -123 134 -246 231 -296 60 -30 156 -49 257 -49 l92 0 -6 -42 c-40 -298 -172 -565 -384 -776 -233 -232 -505 -376 -843 -448 -166 -35 -483 -44 -660 -20 -843 118 -1532 731 -1652 1469 l-12 78 36 -5 c20 -3 73 -10 119 -16 130 -17 226 8 326 84 54 42 107 76 118 76 16 0 38 -63 82 -233 46 -183 81 -275 119 -315 77 -83 178 -60 231 52 33 70 57 174 101 438 32 197 59 318 70 318 10 0 35 -74 59 -172 36 -144 68 -328 116 -658 61 -423 87 -527 141 -577 35 -32 69 -37 105 -14 85 52 112 224 189 1175 20 241 39 459 42 484 8 56 18 37 27 -48z" />
            </g>

            {/* =========================================
          REVEALED WHITE LOGO
          ========================================= */}
            <g clipPath={`url(#${clipId})`}>
                <g
                    transform="translate(0,1054) scale(0.1,-0.1)"
                    fill={logoColor}
                    stroke="none"
                >
                    <path d="M4730 9819 c-37 -15 -67 -46 -123 -128 -169 -249 -632 -631 -1177 -971 -375 -234 -515 -336 -696 -513 -380 -369 -590 -806 -610 -1272 -19 -429 154 -890 495 -1320 117 -148 339 -371 485 -487 103 -82 145 -106 99 -55 -33 35 -164 241 -230 362 -291 528 -360 1010 -207 1435 111 308 356 571 703 753 58 30 215 100 348 156 133 55 283 121 335 147 89 45 253 147 264 165 3 5 10 9 16 9 11 0 10 -22 -8 -640 -3 -102 -12 -502 -20 -890 -31 -1533 -54 -2533 -65 -2910 -8 -294 -8 -420 0 -495 54 -472 262 -893 617 -1249 412 -413 921 -666 1509 -752 165 -24 513 -24 680 0 536 77 982 307 1308 671 251 282 404 615 448 979 25 210 2 480 -63 716 -133 485 -493 956 -973 1275 -431 286 -908 429 -1430 428 -292 0 -534 -38 -779 -123 -274 -95 -555 -260 -733 -433 l-53 -51 0 54 c0 30 9 388 20 795 39 1431 71 4131 51 4211 -28 111 -120 169 -211 133z
m1985 -5090 c314 -39 645 -163 905 -340 445 -302 731 -754 776 -1228 l7 -74 -114 5 c-91 4 -123 9 -162 28 -71 34 -130 105 -162 197 -82 238 -103 280 -158 313 -18 11 -50 20 -71 20 -34 0 -46 -7 -82 -45 -57 -59 -83 -142 -129 -421 -47 -282 -88 -464 -104 -464 -12 0 -26 55 -65 256 -41 211 -67 286 -112 332 -27 27 -39 32 -78 32 -77 0 -124 -65 -173 -241 -9 -33 -20 -56 -24 -52 -14 15 -49 258 -79 553 -49 476 -73 575 -146 608 -41 19 -64 14 -99 -21 -70 -70 -88 -187 -155 -1037 -28 -353 -50 -568 -67 -645 l-6 -30 -8 35 c-5 19 -18 105 -29 190 -67 493 -142 856 -204 978 -36 71 -77 102 -133 102 -39 0 -51 -5 -83 -38 -59 -58 -86 -156 -146 -526 -14 -88 -36 -191 -48 -230 l-23 -71 -17 39 c-10 21 -36 109 -58 195 -58 226 -106 309 -190 332 -64 17 -120 -4 -223 -85 -101 -79 -147 -88 -310 -61 -49 8 -94 15 -99 15 -23 0 26 299 70 422 215 599 875 999 1599 971 66 -2 156 -9 200 -14z
m9 -939 c4 -36 18 -175 31 -309 28 -274 48 -410 75 -523 33 -136 67 -175 141 -165 71 9 106 62 154 227 15 52 30 102 35 110 10 18 21 -21 51 -180 66 -354 123 -452 244 -419 90 25 134 145 200 547 39 235 72 389 85 397 8 5 52 -100 80 -190 38 -123 134 -246 231 -296 60 -30 156 -49 257 -49 l92 0 -6 -42 c-40 -298 -172 -565 -384 -776 -233 -232 -505 -376 -843 -448 -166 -35 -483 -44 -660 -20 -843 118 -1532 731 -1652 1469 l-12 78 36 -5 c20 -3 73 -10 119 -16 130 -17 226 8 326 84 54 42 107 76 118 76 16 0 38 -63 82 -233 46 -183 81 -275 119 -315 77 -83 178 -60 231 52 33 70 57 174 101 438 32 197 59 318 70 318 10 0 35 -74 59 -172 36 -144 68 -328 116 -658 61 -423 87 -527 141 -577 35 -32 69 -37 105 -14 85 52 112 224 189 1175 20 241 39 459 42 484 8 56 18 37 27 -48z" />
                </g>
            </g>
        </svg>
    );
}


