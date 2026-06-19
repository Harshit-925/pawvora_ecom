/**
 * PawVora AnimatedMarqueeHero — hero-3.tsx
 *
 * Adapted from the 21st.dev AnimatedMarqueeHero component for use in a
 * Vite + React project (no "use client" needed).
 * - PawVora brand colors, fonts, and copy
 * - Infinite scrolling pet image marquee at the bottom
 * - Spring physics entrance animations (Framer Motion)
 * - Path alias @/ → src/ via vite.config.ts
 */

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
  title?: React.ReactNode;
  description?: string;
  ctaText?: string;
  ctaSecondaryText?: string;
  images?: string[];
  className?: string;
  onCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
}

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const PrimaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.06, boxShadow: "0 16px 40px rgba(225,29,72,0.45)" }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    className="px-8 py-4 rounded-full text-white font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-rose-300 cursor-pointer border-0"
    style={{
      background: "linear-gradient(135deg, #E11D48, #B80035)",
      fontFamily: "'Karla', sans-serif",
    }}
  >
    {children}
  </motion.button>
);

const SecondaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04, backgroundColor: "rgba(30,58,95,0.06)" }}
    whileTap={{ scale: 0.96 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    className="px-8 py-4 rounded-full font-semibold text-lg cursor-pointer border-2 bg-transparent focus:outline-none focus:ring-4 focus:ring-navy-200"
    style={{
      color: "#1E3A5F",
      borderColor: "#1E3A5F",
      fontFamily: "'Karla', sans-serif",
    }}
  >
    {children}
  </motion.button>
);

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  title,
  description = "Premium food, treats & toys crafted for dogs, cats, and every beloved companion in between. Because they deserve nothing but the best.",
  ctaText = "Shop Now",
  ctaSecondaryText = "Nutrition AI",
  images = [],
  className,
  onCtaClick,
  onSecondaryCtaClick,
}) => {
  // Seamless loop: triplicate so there's always content visible
  const loopImages = [...images, ...images, ...images];

  const defaultTitle = (
    <>
      Fuel Their{" "}
      <span
        style={{
          background: "linear-gradient(135deg, #E11D48, #FB7185)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Adventure.
      </span>
    </>
  );

  const resolvedTitle = title ?? defaultTitle;

  return (
    <section
      id="hero"
      className={cn(
        "relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-28",
        className
      )}
      style={{
        background:
          "linear-gradient(160deg, #FFF8F1 0%, #FFF0F3 45%, #FFF8F1 100%)",
      }}
    >
      {/* ── Background decorative blobs ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          animate={{ scale: [1, 1.18, 1], rotate: [0, 12, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, #FB7185 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, -10, 0] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute -bottom-56 -left-48 w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #E11D48 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Hero text content ───────────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
        }}
        className="relative z-10 flex flex-col items-center gap-6 pb-[38vh] md:pb-[42vh]"
      >
        {/* Main heading */}
        <motion.h1
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09 } },
          }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight max-w-4xl"
          style={{ fontFamily: "'Playfair Display SC', serif", color: "#1E3A5F" }}
        >
          {typeof resolvedTitle === "string"
            ? resolvedTitle.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={FADE_UP}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))
            : resolvedTitle}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={FADE_UP}
          className="text-lg md:text-xl leading-relaxed max-w-xl"
          style={{ color: "#5C3F40", fontFamily: "'Karla', sans-serif" }}
        >
          {description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={FADE_UP}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <PrimaryButton onClick={onCtaClick}>{ctaText} 🐶</PrimaryButton>
          <SecondaryButton onClick={onSecondaryCtaClick}>{ctaSecondaryText}</SecondaryButton>
        </motion.div>

        {/* Trust row — avatars + stats */}
        <motion.div
          variants={FADE_UP}
          className="flex flex-wrap items-center justify-center gap-8 pt-2"
        >
          {/* Avatar stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1552053831-71594a27632d?w=40&h=40&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=40&h=40&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=40&h=40&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=40&h=40&fit=crop&crop=face",
              ].map((src, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm"
                  style={{ zIndex: 4 - i }}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div
                className="text-sm font-bold"
                style={{ color: "#1E3A5F", fontFamily: "'Karla', sans-serif" }}
              >
                50,000+ families
              </div>
              <div
                className="text-xs"
                style={{ color: "#906F70", fontFamily: "'Karla', sans-serif" }}
              >
                trust PawVora
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-10" style={{ background: "rgba(144,111,112,0.25)" }} />

          {/* Stats */}
          {[
            { value: "4.9 ★", label: "Avg Rating" },
            { value: "100%", label: "Natural" },
            { value: "Vet", label: "Approved" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span
                className="text-2xl font-bold"
                style={{ color: "#E11D48", fontFamily: "'Playfair Display SC', serif" }}
              >
                {s.value}
              </span>
              <span
                className="text-xs"
                style={{ color: "#906F70", fontFamily: "'Karla', sans-serif" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Image Marquee ───────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 w-full h-[38vh] md:h-[44vh] z-20 pointer-events-auto"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 22%, black 80%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 22%, black 80%, transparent 100%)",
        }}
        aria-hidden="true"
      >
        {/* Also fade left/right edges */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        />
        <div
          className="flex gap-4 h-full items-end pb-4 relative z-20 animate-marquee"
          style={{ width: "max-content" }}
        >
          {loopImages.map((src, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 overflow-hidden rounded-2xl shadow-xl"
              style={{
                width: "clamp(130px, 14vw, 200px)",
                height: "clamp(170px, 18vw, 260px)",
                border: "2px solid rgba(255,255,255,0.7)",
                transform: index % 3 === 0 ? "rotate(-3deg)" : index % 3 === 1 ? "rotate(2deg)" : "rotate(-1deg)",
              }}
            >
              <img
                src={src}
                alt={`Pet product image ${(index % (images.length || 1)) + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* subtle inner glow */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: "inset 0 0 20px rgba(225,29,72,0.08)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
