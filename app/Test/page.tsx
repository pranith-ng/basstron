"use client";

import { useEffect, useState } from "react";
import BasstronLogo from "../components/BasstronLogo";
import Hero from "../components/Hero";

export default function TestPage() {
  const [progress, setProgress] = useState(0);

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
    <Hero />
  );
}