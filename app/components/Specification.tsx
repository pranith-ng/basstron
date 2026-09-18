import Footer from "./Footer";

interface SpecItem {
  label: string;
  value: string | string[];
}

const LEFT_SPECS: SpecItem[] = [
  {
    label: "Product name:",
    value: "BASSTRON T1",
  },
  {
    label: "Colors:",
    value: "Fully Customizable",
  },
  {
    label: "Noise cancellation features:",
    value: [
      "50 dB Active Noise Cancellation",
      "Environmental Noise Cancellation",
    ],
  },
  {
    label: "Audio Codecs:",
    value: "SBC · AAC · LDAC",
  },
  {
    label: "Battery:",
    value: [
      "Charging Case + Buds:",
      "48 hrs Music Playback (50% Volume, ANC OFF)",
      "34 hrs Music Playback (50% Volume, ANC ON)",
      "",
      "Earbuds Alone:",
      "8 hrs Music Playback (50% Volume, ANC OFF)",
      "6 hrs Music Playback (50% Volume, ANC ON)",
      "5 hrs Calling Time (50% Volume, ANC OFF/ON)",
    ],
  },
];

const RIGHT_SPECS: SpecItem[] = [
  {
    label: "Bluetooth Version:",
    value: "6.3",
  },
  {
    label: "Wireless Range:",
    value: "15 m",
  },
  {
    label: "Waterproof Rating:",
    value: "IPX7 (earbuds only)",
  },
  {
    label: "Driver Size:",
    value: "12 mm",
  },
  {
    label: "Fast Charging:",
    value: [
      "Charging Case + Buds:",
      "10 min charge → 7 hrs Playback",
    ],
  },
  {
    label: "Battery Capacity:",
    value: ["Charging case: 480 mAh", "Single earbud: 50 mAh"],
  },
];

function SpecColumn({ items }: { items: SpecItem[] }) {
  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="mt-12">
          <h3 className="text-sm font-medium">{item.label}</h3>

          <div className="mt-6 text-sm leading-6 text-gray-400">
            {Array.isArray(item.value) ? (
              item.value.map((line, lineIdx) =>
                line === "" ? (
                  <br key={lineIdx} />
                ) : (
                  <p key={lineIdx}>{line}</p>
                )
              )
            ) : (
              <p>{item.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Specifications() {
  return (
    <div className="relative w-full bg-black">
      {/* 
        1. z-10 & bg-black: Covers the footer as you scroll down.
        2. relative: Slides up over the sticky footer.
      */}
      <section className="relative z-10 min-h-screen w-full bg-black pt-10 text-white sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-[1100px] rounded-4xl bg-slate-900 px-6 py-10">
          <h2 className="font-josefin text-center text-3xl font-medium text-white">
            Specifications
          </h2>

          <div className="mt-8 h-px w-full bg-gray-700" />

          <div className="grid grid-cols-1 gap-x-20 md:grid-cols-2 md:justify-items-center">
            <SpecColumn items={LEFT_SPECS} />
            <SpecColumn items={RIGHT_SPECS} />
          </div>
        </div>
      </section>

      {/* 2. Separate Footer component */}
      <Footer />
    </div>
  );
}