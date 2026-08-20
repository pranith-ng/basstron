"use client"

import React from 'react';

const Features = () => {

  const feature1 = [

     {
      video: "/bentogrid/noise_cancellation/video.mp4",
      text: "This is the first video",
    },
    {
      video: "/bentogrid/lightning/video.mp4",
      text: "This is the second video",
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
      tws: "1"
    },
    {
      id: 2,
      value: "10",
      unit: "hours",
      title: "music playback",
      subtitle: "buds only",
      imgAlt: "Earbuds music playback",
      reverse: true,
      img: "/bentogrid/tws_2.png",
      tws: "2"
    },
    {
      id: 3,
      value: "50",
      unit: "hours",
      title: "music playback",
      subtitle: "Buds + Case",
      imgAlt: "Earbuds with charging case",
      reverse: false,
      img: "/bentogrid/tws_case_2.png",
      tws: "3"
    },
  ];

  return (
    <>

      <div>
        {feature1.map((item, index) => (
          <div key={index} className="w-full">
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
              className="w-full"
            />

            <p className="text-center">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <section className="max-w-6xl h-fit pb-[200px] mx-auto px-6 py-16 space-y-24 flex flex-col overflow-hidden">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`flex flex-col md:flex-row items-center md:gap-12 ${feature.reverse ? 'md:flex-row-reverse' : ''
              }`}
          >
            {/* Text Content */}
            <div className="w-[50%] flex gap-8 items-center justify-center text-center md:text-left">

              <span className="text-[clamp(7rem,20vw,16rem)] font-black tracking-tighter text-slate-900">
                {feature.value}
              </span>

              <div className="flex flex-col">
                <div className="flex items-baseline justify-center md:justify-start">
                  <span className="text-[clamp(1.2rem,4vw,3rem)] font-bold text-slate-700 uppercase">
                    {feature.unit}
                  </span>
                </div>

                <h3 className="text-[clamp(1rem,4vw,2.2rem)] font-medium text-slate-600">
                  {feature.title}
                </h3>

                <p className="text-lg md:text-xl text-slate-400 font-light italic">
                  {feature.subtitle}
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-[100%] h-[100%] flex-1 flex justify-center items-center">
              <img
                src={feature.img}
                alt={feature.imgAlt}
                className={`md:absolute ${feature.tws === "1" ? "scale-150 sm:scale-180 md:scale-180" : feature.tws === "2" ? "scale-150 sm:scale-180 md:scale-180" : "scale-220 mt-45 md:mt-80"}`}
              />
            </div>

          </div>
        ))}
      </section>


    </>
  );
};

export default Features;