import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    eyebrow: "Your VedAarna favourites now come with",
    title: "Express Shipping",
    cta: "Shop Now",
    slug: "new-arrivals",
    align: "right" as const,
  },
  {
    image: hero2,
    eyebrow: "Festive Edit",
    title: "Anarkali Suit Sets",
    cta: "Explore",
    slug: "kurta-suit-sets",
    align: "left" as const,
  },
  {
    image: hero3,
    eyebrow: "Light as air, radiant like you",
    title: "Organza Sarees",
    cta: "Discover",
    slug: "sarees",
    align: "left" as const,
  },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Auto-advance timer
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);
  const next = () => setI((v) => (v + 1) % slides.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartX.current;
    const dy = touch.clientY - touchStartY.current;
    // Only treat as horizontal swipe if movement is more horizontal than vertical
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next(); // swipe left → next
      else prev();        // swipe right → prev
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((s, idx) => (
        <div
          key={s.title}
          className={`transition-opacity duration-700 ${idx === i ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"}`}
        >
          <div className="relative w-full">
            <img
              src={s.image}
              alt={s.title}
              width={1920}
              height={1088}
              className="h-[70vw] min-h-[320px] w-full object-cover object-top md:h-[78vh] md:min-h-0"
            />
            {/* Gradient overlay so text is always readable on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-none" />
            <div
              className={`absolute inset-0 flex items-end justify-center px-5 pb-10 text-center md:items-center md:pb-0 md:px-20 ${
                s.align === "right"
                  ? "md:justify-end md:text-right"
                  : "md:justify-start md:text-left"
              }`}
            >
              <div className="max-w-xs md:max-w-md">
                <p className="text-[10px] tracking-[0.2em] text-white/90 uppercase md:text-xs md:tracking-[0.22em] md:text-foreground/80">
                  {s.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-2xl leading-tight tracking-[0.06em] text-white uppercase md:mt-3 md:text-5xl md:text-foreground">
                  {s.title}
                </h2>
                <Link
                  to="/collections/$slug"
                  params={{ slug: s.slug }}
                  className="mt-4 inline-block border-b border-white pb-0.5 text-[11px] tracking-[0.2em] text-white uppercase md:mt-6 md:border-foreground md:text-foreground md:text-xs md:tracking-[0.22em]"
                >
                  {s.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2.5 md:bottom-5">
        {slides.map((s, idx) => (
          <button
            key={s.title}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`size-2 rounded-full transition-colors ${idx === i ? "bg-white md:bg-foreground" : "bg-white/50 md:bg-foreground/35"}`}
          />
        ))}
      </div>
    </section>
  );
}
