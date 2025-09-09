"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import ResidencyCard from "@/components/Home/ResidencyCard";
import {
  residencyPrograms,
  type residencyProgram,
} from "@/app/api/data";
import Image from "next/image";

// Arrow Button Component
const ArrowButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    aria-label={direction === "left" ? "Previous" : "Next"}
    className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-10
      h-10 w-10 items-center justify-center rounded-full
      bg-light_bg dark:bg-darklight
      ring-1 ring-border/60 dark:ring-dark_border/40
      shadow-cause-shadow
      hover:scale-[1.06] active:scale-[0.96] transition-transform
      ${direction === "left" ? "-left-3" : "-right-3"}`}
  >
    {direction === "left" ? (
      <ArrowLeft className="h-5 w-5 text-primary" />
    ) : (
      <ArrowRight className="h-5 w-5 text-primary" />
    )}
  </button>
);

const NextArrow = (props: any) => <ArrowButton direction="right" onClick={props.onClick} />;
const PrevArrow = (props: any) => <ArrowButton direction="left" onClick={props.onClick} />;

export default function ResidencySlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 450,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
    appendDots: (dots: ReactNode) => (
      <div className="mt-6">
        <ul className="flex justify-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="h-2.5 w-2.5 rounded-full bg-muted transition-all" />
    ),
  };

  return (
    <section
      className="bg-white dark:bg-gray-900 py-20 md:py-18"
      aria-labelledby="residency-heading"
    >
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
          {/* Left Block: Icon + Text */}
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div
              className="hidden lg:flex items-center justify-center
                w-16 h-16
                rounded-full border-2
                bg-gradient-to-br from-secondary/50 via-neutral-100/40 to-secondary/40
                dark:from-secondary/20 dark:via-neutral-800/40 dark:to-secondary/30
                border-blue-100 dark:border-blue-400
                shadow-lg dark:shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/50 to-transparent dark:from-white/10 opacity-60 animate-shine"></div>
              <Image
                src="/images/hero/residency.png"
                alt="Residency Icon"
                width={32}
                height={32}
                className="object-contain relative z-10"
              />
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
              <h2
                id="residency-heading"
                className="text-2xl md:text-4xl font-bold 
                text-light_text dark:text-dark_text leading-snug"
              >
                Residency by Investment
              </h2>
              <p className="text-16 md:text-18 text-light_grey dark:text-dark_text/70 max-w-xl mt-2">
                Explore trusted programs that empower global mobility through
                secure, investment-led residency opportunities.
              </p>
            </div>
          </div>

          {/* Right Block: Button */}
          <div className="flex justify-center md:justify-end mt-4 md:mt-0">
            <button
              className="inline-flex items-center justify-center rounded-lg px-6 py-2.5
                bg-secondary text-white font-medium
                hover:bg-transparent hover:text-secondary dark:hover:text-white border border-secondary
                shadow-md transition-all"
            >
              View All
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <Slider {...settings}>
            {residencyPrograms.map((program: residencyProgram, index) => (
              <div key={`${program.country}-${index}`} className="px-2.5 md:px-3">
                <ResidencyCard {...program} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Custom dots */}
        <style jsx global>{`
          @keyframes shine {
            0% {
              transform: translateX(-100%) rotate(25deg);
            }
            100% {
              transform: translateX(200%) rotate(25deg);
            }
          }
          .animate-shine {
            animation: shine 3s linear infinite;
          }
          .slick-dots li button:before {
            display: none;
          }
          .slick-dots li {
            margin: 0;
            width: auto;
            height: auto;
          }
          .slick-dots li.slick-active div {
            background: #e1b923; /* brand secondary color */
            transform: scale(1.2);
            box-shadow: 0 0 0 3px rgba(225, 185, 35, 0.25);
          }
        `}</style>
      </div>
    </section>
  );
}
