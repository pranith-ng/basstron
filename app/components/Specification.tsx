interface SpecItem {
  label: string;
  value: string | string[];
}

const LEFT_SPECS: SpecItem[] = [
  {
    label: "Product name:",
    value: "realme Buds T300",
  },
  {
    label: "Colors:",
    value: "Stylish Black   Youth White",
  },
  {
    label: "Noise cancellation features:",
    value: [
      "30dB Active Noise Cancellation",
      "Environment Noise Cancellation",
    ],
  },
  {
    label: "Audio Codec:",
    value: "AAC, SBC",
  },
  {
    label: "Battery:",
    value: [
      "Charging case+Buds :",
      "40hrs Music Playback (50% Volume, ANC OFF)",
      "30hrs Music Playback (50% Volume, ANC ON)",
      "",
      "Earbuds alone:",
      "8hrs Music Playback (50% Volume, ANC OFF)",
      "6hrs Music Playback (50% Volume, ANC ON)",
      "4hrs Calling Time (50% Volume, ANC OFF/ON)",
    ],
  },
];

const RIGHT_SPECS: SpecItem[] = [
  {
    label: "Bluetooth version:",
    value: "5.3",
  },
  {
    label: "Wireless Range:",
    value: "10m",
  },
  {
    label: "Waterproof Rating:",
    value: "IP55 (earbuds Only)",
  },
  {
    label: "Sound Size:",
    value: "12.4mm",
  },
  {
    label: "Charging time:",
    value: [
      "Charging case+Buds :",
      "10mins Charge for 7hrs Playback",
      "(50% Volume, ANC OFF)",
    ],
  },
  {
    label: "Battery Capacity:",
    value: ["Charging case: 460mAh", "Single earbud: 43mAh"],
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
    <section className="relative z-10 w-full bg-black pt-10 text-white sm:px-10 lg:px-20">
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
  );
}