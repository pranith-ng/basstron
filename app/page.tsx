import Image from "next/image";
import Viewer from "./components/Viewer";
import Hero from "./components/Hero";
import Video from "./components/Video";
import Features from "./components/Features";
import Svg from "./components/Svg";
import Specifications from "./components/Specification";
import Footer from "./components/Footer";
import Byo from "./components/Byo";

export default function Home() {
  return (
    <div >
      {/* <div className="relative h-svh w-screen">
        <Viewer />
        <Hero />
      </div> */}
      {/* <Video /> */}
      <Features />
      <Byo />
      <Specifications />
      <Footer />
      {/* <Svg /> */}
    </div>
  );
}
