"use client"
import { useEffect, useState } from "react";
import BasstronLogo from "../components/BasstronLogo";
import Viewer from "../components/Viewer";
import Hero from "../components/Hero";
import Video from "../components/Video";
import Features from "../components/Features";
import Specifications from "../components/Specification";
import Footer from "../components/Footer";
import Byo from "../components/Byo";

export default function TestPage() {

  return (
     <div className={`bg-black h-svh`}>

      <div className="relative h-svh w-full">
        
        {/* <Viewer /> */}
        <Hero />
      </div>

      <Video />
      <Features />
      <Byo />
      <Specifications />
      <Footer />
      
    </div>
  )
}