import Image from "next/image";
import Viewer from "./components/Viewer";
import Hero from "./components/Hero";
import Video from "./components/Video";
import Features from "./components/Features";
import Svg from "./components/Svg";

export default function Home() {
  return (
    <div >
      <div className="relative h-screen w-screen">
        <Viewer />
        <Hero />
      </div>
      <Video />
      <Features />
      {/* <Svg /> */}
      {/* <Video /> */}
    </div>
  );
}
