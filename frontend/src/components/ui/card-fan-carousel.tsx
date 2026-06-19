"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useInView } from "framer-motion";
import { ShoppingBag, Check, PawPrint } from "lucide-react";
import { useStore } from "../../store/useAppStore";
import type { Product } from "../../types";

interface CardFanCarouselProps {
  products: Product[];
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7,  scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, zIndex: 10 },
  { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, zIndex: 3 },
  { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, zIndex: 2 },
  { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;       // 352px
  else if (width < 640) idealPx = 26 * 16;  // 416px
  else if (width < 768) idealPx = 28 * 16;  // 448px
  else if (width < 1024) idealPx = 34 * 16; // 544px
  else idealPx = 38 * 16;                    // 608px

  const available = window.innerHeight * 0.7; // 70vh budget
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const offset = slot - center;
  const absOffset = Math.abs(offset);
  return {
    rot: offset * 7,
    scale: 1.0 - 0.04 * absOffset,
    x: offset * 9.5,
    y: absOffset * absOffset * 1.2,
    zIndex: 10 - absOffset,
  };
}



export default function CardFanCarousel({ products }: CardFanCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const addToCart = useStore((s) => s.addToCart);
  const [addedStates, setAddedStates] = useState<Record<string, boolean>>({});

  const totalCards = products.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      products.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination, products]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedStates(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedStates(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  useEffect(() => {
    if (!isInView) return;

    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.2 + slot * 0.06, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Hover interactions
    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`, y: `${targetY}rem`, rotation: targetRot, scale: targetScale,
          duration: 0.45, delay, ease: "back.out(1.1)", overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => { if (!isAnimating.current) updateHoverLayout(activeSlot); };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, isInView]);

  if (!totalCards) return null;

  return (
    <div className="flex flex-col items-center w-full pt-0 pb-4 relative z-20">
      <div className="flex items-center justify-center w-full max-w-[90rem]">
        <div ref={containerRef} className="fan-layout flex relative justify-center items-center w-full max-w-[80rem]">
          {products.map((product) => {
            const isAdded = addedStates[product.id] || false;

            return (
              <div
                key={product.id}
                className="fan-card select-none"
                style={{ opacity: 0 }}
              >
                <div className="w-full h-full flex flex-col justify-between p-4 bg-white/90 backdrop-blur-md border border-white/60 rounded-[1.5rem] overflow-hidden shadow-[0_12px_36px_rgba(225,29,72,0.05)] relative group">
                  {/* Image Area */}
                  <div className="relative w-full h-[54%] overflow-hidden rounded-2xl bg-rose-50/40 shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isNew && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-navy-800" style={{ background: "#1E3A5F" }}>
                        NEW
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-rose-500">
                        HOT
                      </span>
                    )}
                  </div>

                  {/* Info Area */}
                  <div className="flex flex-col flex-grow justify-between pt-3 pb-1">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1" style={{ fontFamily: "'Playfair Display SC', serif", color: "#1E3A5F" }}>
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                        by {product.brand}
                      </span>
                      
                      {/* Short Description */}
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-2 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-extrabold text-rose-500" style={{ fontFamily: "'Playfair Display SC', serif" }}>
                        ${product.price.toFixed(2)}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="flex items-center justify-center p-2 rounded-xl text-white shadow-[0_4px_12px_rgba(225,29,72,0.15)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-0"
                        style={{
                          background: isAdded
                            ? 'linear-gradient(135deg, #10B981, #059669)'
                            : 'linear-gradient(135deg, #E11D48, #B80035)'
                        }}
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="flex items-center justify-center gap-6 mt-6 z-30">
          {/* Left Arrow: Dog Paw (Navy) */}
          <button 
            className="relative flex items-center justify-center rounded-full border-2 border-[#1E3A5F] bg-white text-[#1E3A5F] w-12 h-12 cursor-pointer shadow-[0_4px_14px_rgba(30,58,95,0.12)] hover:bg-[#1E3A5F] hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 z-30 border-0 outline-none"
            onClick={() => cycle("left")} 
            aria-label="Previous (Dog Paw)"
          >
            <PawPrint className="w-5 h-5 -rotate-[30deg]" />
          </button>
          
          <span className="text-xs font-bold text-[#5C3F40] min-w-[5rem] text-center" style={{ fontFamily: "'Karla', sans-serif" }}>
            Card {centerIndex + 1} of {totalCards}
          </span>
          
          {/* Right Arrow: Cat Paw (Rose) */}
          <button 
            className="relative flex items-center justify-center rounded-full border-2 border-[#E11D48] bg-white text-[#E11D48] w-12 h-12 cursor-pointer shadow-[0_4px_14px_rgba(225,29,72,0.12)] hover:bg-[#E11D48] hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 z-30 border-0 outline-none"
            onClick={() => cycle("right")} 
            aria-label="Next (Cat Paw)"
          >
            <PawPrint className="w-5 h-5 rotate-[30deg]" />
          </button>
        </div>
      )}
    </div>
  );
}
