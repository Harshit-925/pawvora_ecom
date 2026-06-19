/**
 * HeroSection — wraps AnimatedMarqueeHero with PawVora-specific
 * pet image data from Unsplash and Stitch-generated assets.
 */
import React from "react";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";

// High-quality Unsplash pet & pet-food images for the marquee
const PET_MARQUEE_IMAGES = [
  // Dogs
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&auto=format&fit=crop&q=80",
  // Cats
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&auto=format&fit=crop&q=80",
  // Pet food / treats
  "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&auto=format&fit=crop&q=80",
  // More dogs
  "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop&q=80",
  // More pets
  "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1527362950785-f487a7c1fe48?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=600&auto=format&fit=crop&q=80",
];

export const HeroSection: React.FC = () => {
  const scrollToShop = () => {
    document.getElementById("dogs")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAI = () => {
    document
      .getElementById("nutrition-ai")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatedMarqueeHero
      title={
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
      }
      description="Premium food, treats & toys crafted for dogs, cats, and every beloved companion in between. Because they deserve nothing but the best."
      ctaText="Shop Now"
      ctaSecondaryText="Nutrition AI ✨"
      images={PET_MARQUEE_IMAGES}
      onCtaClick={scrollToShop}
      onSecondaryCtaClick={scrollToAI}
    />
  );
};
