"use client";
import { Carousel } from "antd";
import { useRef, useState } from "react";
import {
  LeftOutlined,
  RightOutlined,
  PauseOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";

export default function Home() {
  const carouselRef = useRef(null);
  const [autoPlay, setAutoPlay] = useState(true);

  const onChange = (current) => {
    console.log("slide:", current);
  };

  const toggleAutoPlay = () => {
    setAutoPlay((p) => !p);
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      <h1 className="text-[46px] my-8">Test Banner eBay Style</h1>

      <div className="w-full flex justify-center px-4">
        <div className="relative max-w-[1488px] w-full rounded-[20px] overflow-hidden">
          <Carousel
            ref={carouselRef}
            className="w-full h-[360px]"
            autoplay={autoPlay}
            autoplaySpeed={3000}
            dots
            afterChange={onChange}
          >
            {/* Banner 1 */}
            <div>
              <div className="flex w-full h-[360px] bg-black text-white ">
                <div className="w-1/2 h-full flex flex-col justify-center px-12 bg-[#191919] text-white">
                  <h2 className="text-[32px] font-bold mb-3 leading-tight">
                    Celebrate eBay's anniversary
                  </h2>
                  <p className="text-[16px] text-[#e5e5e5] mb-6">
                    30 years of collecting. Millions of items. Endless
                    adventures.
                  </p>
                  <button
                    className="bg-white text-[#191919] font-medium rounded-full hover:bg-[#f5f5f5] transition cursor-pointer"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "16px",
                      padding: "10px 20px",
                    }}
                  >
                    Keep collecting
                  </button>
                </div>
                <div className="w-1/2 h-full bg-[#191919]">
                  <a href="#" className="block w-full h-full">
                    <img
                      src="https://i.ebayimg.com/images/g/1OwAAeSwgpposG~R/s-l960.webp"
                      alt="eBay banner"
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Banner 2 - Clickable */}
            <div>
              <div className="flex w-full h-[360px] bg-[#E99A02] px-[88px]">
                <div className="w-2/5 h-full flex flex-col justify-center">
                  <h2
                    className="font-bold leading-snug mb-2"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "36px",
                      color: "#562F01",
                    }}
                  >
                    Whatever you're into, it's here
                  </h2>
                  <p
                    className="mb-6"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "16px",
                      color: "#562F01",
                    }}
                  >
                    Turn a wrench, get a tech upgrade, and find everything you
                    love.
                  </p>
                  <a
                    href="#"
                    className="rounded-full hover:opacity-90 transition w-fit cursor-pointer"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "16px",
                      backgroundColor: "#562F01",
                      color: "#E99A02",
                      padding: "10px 20px",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    Do your thing
                  </a>
                </div>
                <div className="w-3/5 h-full flex">
                  <div className="grid grid-cols-3 w-full h-full place-items-center">
                    <a
                      href="#"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src="https://i.ebayimg.com/images/g/tgUAAOSwkKJnycJx/s-l300.webp"
                        alt="Motors image"
                        className="w-[240px] h-[240px] object-contain"
                      />
                      <span
                        className="mt-3 block"
                        style={{
                          fontFamily: '"Market Sans", Arial, sans-serif',
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#562F01",
                        }}
                      >
                        Motors &gt;
                      </span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src="https://i.ebayimg.com/images/g/ZC8AAOSwU8dnycJ2/s-l300.webp"
                        alt="Electronics image"
                        className="w-[240px] h-[240px] object-contain"
                      />
                      <span
                        className="mt-3 block"
                        style={{
                          fontFamily: '"Market Sans", Arial, sans-serif',
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#562F01",
                        }}
                      >
                        Electronics &gt;
                      </span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src="https://i.ebayimg.com/images/g/YkcAAOSwd0FnycJ4/s-l300.webp"
                        alt="Collectibles and Art image"
                        className="w-[240px] h-[240px] object-contain"
                      />
                      <span
                        className="mt-3 block"
                        style={{
                          fontFamily: '"Market Sans", Arial, sans-serif',
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#562F01",
                        }}
                      >
                        Collectibles and Art &gt;
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner 3 - Clickable */}
            <div>
              <div className="flex w-full h-[360px] bg-[#00A2E8] px-[88px]">
                <div className="w-2/5 h-full flex flex-col justify-center">
                  <h2
                    className="font-bold leading-snug mb-2"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "36px",
                      color: "#111",
                    }}
                  >
                    All your faves are here
                  </h2>
                  <p
                    className="mb-6"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "16px",
                      color: "#111",
                    }}
                  >
                    Refresh your space, elevate your style and power your work.
                  </p>
                  <a
                    href="#"
                    className="rounded-full hover:opacity-90 transition w-fit cursor-pointer"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "16px",
                      backgroundColor: "#111",
                      color: "#00A2E8",
                      padding: "10px 20px",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    Do your thing
                  </a>
                </div>
                <div className="w-3/5 h-full flex">
                  <div className="grid grid-cols-3 w-full h-full place-items-center">
                    <a
                      href="#"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src="https://i.ebayimg.com/images/g/apEAAOSwVN1n4r~-/s-l300.webp"
                        alt="Home and Garden image"
                        className="w-[240px] h-[240px] object-contain"
                      />
                      <span
                        className="mt-3 block"
                        style={{
                          fontFamily: '"Market Sans", Arial, sans-serif',
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#111",
                        }}
                      >
                        Home and Garden &gt;
                      </span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src="https://i.ebayimg.com/images/g/Pr8AAOSw4E5n4sAC/s-l300.webp"
                        alt="Fashion image"
                        className="w-[240px] h-[240px] object-contain"
                      />
                      <span
                        className="mt-3 block"
                        style={{
                          fontFamily: '"Market Sans", Arial, sans-serif',
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#111",
                        }}
                      >
                        Fashion &gt;
                      </span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src="https://i.ebayimg.com/images/g/kUgAAOSwPedn4sAG/s-l300.webp"
                        alt="Business & Industrial image"
                        className="w-[240px] h-[240px] object-contain"
                      />
                      <span
                        className="mt-3 block"
                        style={{
                          fontFamily: '"Market Sans", Arial, sans-serif',
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#111",
                        }}
                      >
                        Business & Industrial &gt;
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner 4 - Clickable */}
            <div>
              <div className="flex w-full h-[360px] bg-[#E99A02] px-[88px]">
                <div className="w-2/5 h-full flex flex-col justify-center">
                  <h2
                    className="font-bold leading-snug mb-2"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "36px",
                      color: "#562F01",
                    }}
                  >
                    Build an elite collection
                  </h2>
                  <p
                    className="mb-6"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "16px",
                      color: "#562F01",
                    }}
                  >
                    Choose your next adventure from thousands of finds.
                  </p>
                  <a
                    href="#"
                    className="rounded-full hover:opacity-90 transition w-fit cursor-pointer"
                    style={{
                      fontFamily: '"Market Sans", Arial, sans-serif',
                      fontSize: "16px",
                      backgroundColor: "#562F01",
                      color: "#E99A02",
                      padding: "10px 20px",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    Start your journey
                  </a>
                </div>
                <div className="w-3/5 h-full flex">
                  <div className="grid grid-cols-3 w-full h-full place-items-center">
                    <a
                      href="#"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src="https://i.ebayimg.com/images/g/5-8AAeSwpvJotaqH/s-l300.webp"
                        alt="Trading cards"
                        className="w-[240px] h-[240px] object-contain"
                      />
                      <span
                        className="mt-3 block"
                        style={{
                          fontFamily: '"Market Sans", Arial, sans-serif',
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#562F01",
                        }}
                      >
                        Trading cards &gt;
                      </span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src="https://i.ebayimg.com/images/g/PkIAAeSwZ05otaqK/s-l300.webp"
                        alt="Toys"
                        className="w-[240px] h-[240px] object-contain"
                      />
                      <span
                        className="mt-3 block"
                        style={{
                          fontFamily: '"Market Sans", Arial, sans-serif',
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#562F01",
                        }}
                      >
                        Toys &gt;
                      </span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <img
                        src="https://i.ebayimg.com/images/g/7ykAAeSwYXRotaqP/s-l300.webp"
                        alt="Sports cards"
                        className="w-[240px] h-[240px] object-contain"
                      />
                      <span
                        className="mt-3 block"
                        style={{
                          fontFamily: '"Market Sans", Arial, sans-serif',
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#562F01",
                        }}
                      >
                        Sports cards &gt;
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Carousel>

          {/* Nút điều hướng + autoplay */}
          <div className="absolute bottom-4 right-4 flex gap-3 z-30">
            <button
              onClick={() => carouselRef.current.prev()}
              className="cursor-pointer bg-[#e5e5e5] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#d4d4d4] shadow"
              aria-label="Previous slide"
            >
              <LeftOutlined className="text-black text-[20px] font-extrabold" />
            </button>
            <button
              onClick={() => carouselRef.current.next()}
              className="cursor-pointer bg-[#e5e5e5] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#d4d4d4] shadow"
              aria-label="Next slide"
            >
              <RightOutlined className="text-black text-[20px] font-extrabold" />
            </button>
            <button
              onClick={toggleAutoPlay}
              className="cursor-pointer bg-[#e5e5e5] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#d4d4d4] shadow"
              aria-label={autoPlay ? "Pause autoplay" : "Play autoplay"}
            >
              {autoPlay ? (
                <PauseOutlined className="text-black text-[20px] font-extrabold" />
              ) : (
                <CaretRightOutlined className="text-black text-[20px] font-extrabold" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="color-red">aloalo lao</div>

      <style jsx global>{`
        .slick-slider .slick-dots {
          bottom: 14px;
        }
        .slick-dots li {
          margin: 0;
        }
        .slick-dots li button {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: rgba(255, 255, 255, 0.6) !important;
          border: none !important;
          padding: 0 !important;
          cursor: pointer;
        }
        .slick-dots li.slick-active button {
          background: white !important;
        }
        .slick-dots li button:before {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
