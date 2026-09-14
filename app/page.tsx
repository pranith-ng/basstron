"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "./context/Context";

import Viewer from "./components/Viewer";
import Hero from "./components/Hero";
import Video from "./components/Video";
import Features from "./components/Features";
import Specifications from "./components/Specification";
import Footer from "./components/Footer";
import Byo from "./components/Byo";
import BasstronLogo from "./components/BasstronLogo";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const { loaderLoaded } = useAppContext();
  const { viewerLoaded } = useAppContext();
  const { heroLoaded } = useAppContext();

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const steps = duration / interval;

    let step = 0;

    const timer = setInterval(() => {
      step++;

      const value = Math.min(
        100,
        Math.round((step / steps) * 100)
      );

      setProgress(value);

      if (value >= 100) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black">

      <div className="relative h-svh w-full">
        <BasstronLogo/>
        {loaderLoaded && <Viewer />}
        {viewerLoaded && <Hero />}
      </div>

      {heroLoaded && (
        <>
          {/* <Video /> */}
          <Features />
          <Byo />
          <Specifications />
          <Footer />
        </>
      )}


    </div>
  );
}