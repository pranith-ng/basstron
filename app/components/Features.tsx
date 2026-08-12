import React from 'react';

const Features = () => {
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

  //1


      <section className="max-w-6xl mx-auto p-6 md:p-8 bg-white text-slate-900 font-sans overflow-hidden">
        <div className="grid md:grid-row-2 gap-10 md:gap-12 items-center border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">

          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-600">
                Advanced Noise-Cancellation
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-800">
                Crystal Clear Calls
              </h3>
            </div>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              The 2 built-in microphones can accurately block out
              background noise effectively, ensuring your voice
              remains the priority.
            </p>
          </div>

          <div className="w-full ">
            <div className="">
              <img
                src="/bentogrid/noise_cancellation_3.png"
                alt=""
                className="w-full scale-150 h-auto object-contain sm:scale-110"
              />
            </div>
          </div>

        </div>
      </section>

      // 2

      <section className="max-w-6xl mx-auto p-6 md:p-8 bg-white text-slate-900 font-sans overflow-hidden">
        <div className="grid md:grid-row-2 gap-10 md:gap-12 items-center border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">

          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-600">
                Advanced Noise-Cancellation
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-800">
                Crystal Clear Calls
              </h3>
            </div>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              The 2 built-in microphones can accurately block out
              background noise effectively, ensuring your voice
              remains the priority.
            </p>
          </div>

          <div className="w-full ">
            <div className="">
              <img
                src="/bentogrid/mic.png"
                alt=""
                className="w-full scale-200 h-auto object-contain sm:scale-140"
              />
            </div>
          </div>

        </div>
      </section>

    //3

      <section className="max-w-6xl mx-auto p-6 md:p-8 bg-white text-slate-900 font-sans overflow-hidden">
        <div className="grid md:grid-row-2 gap-10 md:gap-12 items-center border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">

          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-600">
                Advanced Noise-Cancellation
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-800">
                Crystal Clear Calls
              </h3>
            </div>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              The 2 built-in microphones can accurately block out
              background noise effectively, ensuring your voice
              remains the priority.
            </p>
          </div>

          <div className="w-full ">
            <div className="">
              <img
                src="/bentogrid/gaming.png"
                alt=""
                className="w-full scale-150 h-auto object-contain sm:scale-140"
              />
            </div>
          </div>

        </div>
      </section>

// 4


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

//5

      <section className="max-w-6xl mx-auto p-6 md:p-8 bg-white text-slate-900 font-sans overflow-hidden">
        <div className="grid md:grid-row-2 gap-10 md:gap-12 items-center border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">

          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-600">
                Advanced Noise-Cancellation
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-800">
                Crystal Clear Calls
              </h3>
            </div>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              The 2 built-in microphones can accurately block out
              background noise effectively, ensuring your voice
              remains the priority.
            </p>
          </div>

          <div className="w-full ">
            <div className="">
              <img
                src="/bentogrid/charging_case_2.png"
                alt=""
                className="w-full scale-120 h-auto object-contain sm:scale-120"
              />
            </div>
          </div>

        </div>
      </section>

      <div className="h-screen w-screen overflow-hidden">
        <svg
          className="w-screen h-screen block"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          {/* Green background */}
          <rect width="1440" height="900" fill="#16a34a" />

          {/* Center star */}
          <polygon
            points="720,260 760,380 890,380 785,455 825,585 720,505 615,585 655,455 550,380 680,380"
            fill="white"
          />
        </svg>
      </div>

    </>


  );
};

export default Features;