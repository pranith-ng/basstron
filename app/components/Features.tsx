"use client";

import React from "react";

const Features = () => {
  const feature1 = [
    {
      video: "/bentogrid/noise_cancellation/video.mp4",
      heading: "noise cancellation",
      text: "Block out unwanted background noise and stay fully immersed in your music with powerful active noise cancellation, wherever you go.",
    },
    {
      video: "/bentogrid/lightning/video.mp4",
      heading: "fast charging",
      text: "Power up quickly and get back to your music with fast charging that delivers hours of playback in just minutes.",
    },
  ];

  const features = [
    {
      id: 1,
      value: "5",
      unit: "hours",
      title: "Phone call",
      subtitle: "buds only",
      imgAlt: "Earbuds calling feature",
      reverse: false,
      img: "/bentogrid/tws_1.png",
      tws: "1",
    },
    {
      id: 2,
      value: "8",
      unit: "hours",
      title: "music",
      subtitle: "buds only",
      imgAlt: "Earbuds music playback",
      reverse: true,
      img: "/bentogrid/tws_2.png",
      tws: "2",
    },
    {
      id: 3,
      value: "48",
      unit: "hours",
      title: "music",
      subtitle: "Buds + Case",
      imgAlt: "Earbuds with charging case",
      reverse: false,
      img: "/bentogrid/tws_case_2.png",
      tws: "3",
    },
  ];

  return (
    <section className="relative z-10 bg-black pt-28">
      {/* Videos */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {feature1.map((item, index) => (
          <div
            key={index}
            className="w-full bg-slate-900 rounded-4xl shadow-lg overflow-hidden flex flex-col"
          >
            {/* Upper Content Area (Mocking the Book Cover) */}
            <div className="p-2 sm:p-4 rounded-4xl flex flex-col">
              {/* Placeholder for Video */}
              <div className=" rounded-4xl flex items-center justify-center relative mb-6">
                <div className="py-5 sm:py-0 w-full h-full rounded-4xl bg-black">
                  <video
                    src={item.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    ref={(video) => {
                      if (video && index === 1) {
                        video.playbackRate = 0.8;
                      }
                    }}
                    className="w-full h-full object-cover rounded-4xl"
                  />
                </div>
              </div>

              {/* Dynamic Content (Title and Text) */}
              <div className="p-4 flex flex-col text-center">
                <h2 className="text-xl md:text-3xl uppercase font-poetsen mb-6 text-white">
                  {item.heading}
                </h2>
                <p className="text-xs sm:text-sm md:text-lg font-josefin text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="max-w-6xl h-fit pb-30 sm:pb-50 mx-auto px-6 py-16 space-y-22 flex flex-col overflow-hidden rounded-4xl">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`flex flex-col md:flex-row items-center md:gap-12 ${feature.reverse ? "md:flex-row-reverse" : ""
              }`}
          >
            {/* Text Content */}
            <div className="w-[100%] sm:w-[50%] flex gap-8 justify-center text-center">
              <span className="text-[clamp(8rem,20vw,16rem)] font-black tracking-tighter text-slate-900">
                {feature.value}
              </span>

              <div className="flex flex-col justify-center md:-mt-4 lg:-mt-10">

                <span className="text-[clamp(1.6rem,4vw,3.5rem)] font-bold text-slate-800 uppercase text-center">
                  {feature.unit}
                </span>

                <h3 className="font-josefin text-[clamp(1.2rem,2vw,2rem)] font-medium text-slate-500 text-center md:-mt-1">
                  {feature.title}
                </h3>

                <p className="font-josefin text-sm sm:text-base text-slate-300 font-light text-center pt-1.5">
                  ({feature.subtitle})
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-[100%] h-[100%] flex-1 flex justify-center items-center">
              <img
                src={feature.img}
                alt={feature.imgAlt}
                className={`md:absolute ${feature.tws === "1"
                  ? "scale-150 md:scale-180"
                  : feature.tws === "2"
                    ? "scale-150 mt-6 md:scale-180"
                    : "scale-200 md:scale-210 mt-30 sm:mt-40 md:mt-80"
                  }`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;