export default function Specifications() {
    return (
        <section className="w-full bg-black px-6 py-10 text-white sm:px-10 lg:px-20">
            <div className="mx-auto w-full max-w-[1100px]">

                <h2 className="text-3xl font-medium text-white text-center">
                    Specifications
                </h2>

                <div className="mt-8 h-px w-full bg-gray-700" />

                <div className="grid grid-cols-1 gap-x-20 md:grid-cols-2 md:justify-items-center">

                    {/* LEFT */}
                    <div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Product name:
                            </h3>

                            <p className="mt-6 text-sm leading-6 text-gray-400">
                                realme Buds T300
                            </p>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Colors:
                            </h3>

                            <p className="mt-6 text-sm leading-6 text-gray-400">
                                Stylish Black&nbsp;&nbsp;&nbsp;Youth White
                            </p>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Noise cancellation features:
                            </h3>

                            <div className="mt-6 text-sm leading-6 text-gray-400">
                                <p>30dB Active Noise Cancellation</p>
                                <p>Environment Noise Cancellation</p>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Audio Codec:
                            </h3>

                            <p className="mt-6 text-sm leading-6 text-gray-400">
                                AAC, SBC
                            </p>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Battery:
                            </h3>

                            <div className="mt-6 text-sm leading-6 text-gray-400">
                                <p>Charging case+Buds :</p>
                                <p>40hrs Music Playback (50% Volume, ANC OFF)</p>
                                <p>30hrs Music Playback (50% Volume, ANC ON)</p>

                                <br />

                                <p>Earbuds alone:</p>
                                <p>8hrs Music Playback (50% Volume, ANC OFF)</p>
                                <p>6hrs Music Playback (50% Volume, ANC ON)</p>
                                <p>4hrs Calling Time (50% Volume, ANC OFF/ON)</p>
                            </div>
                        </div>

                    </div>


                    {/* RIGHT */}
                    <div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Bluetooth version:
                            </h3>

                            <p className="mt-6 text-sm leading-6 text-gray-400">
                                5.3
                            </p>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Wireless Range:
                            </h3>

                            <p className="mt-6 text-sm leading-6 text-gray-400">
                                10m
                            </p>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Waterproof Rating:
                            </h3>

                            <p className="mt-6 text-sm leading-6 text-gray-400">
                                IP55 (earbuds Only)
                            </p>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Sound Size:
                            </h3>

                            <p className="mt-6 text-sm leading-6 text-gray-400">
                                12.4mm
                            </p>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Charging time:
                            </h3>

                            <div className="mt-6 text-sm leading-6 text-gray-400">
                                <p>Charging case+Buds :</p>
                                <p>10mins Charge for 7hrs Playback</p>
                                <p>(50% Volume, ANC OFF)</p>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-sm font-medium">
                                Battery Capacity:
                            </h3>

                            <div className="mt-6 text-sm leading-6 text-gray-400">
                                <p>Charging case: 460mAh</p>
                                <p>Single earbud: 43mAh</p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}