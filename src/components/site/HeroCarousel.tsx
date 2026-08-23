import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {slides.map((s, idx) => (
        <div
          key={s.title}
          className={`transition-opacity duration-700 ${idx === i ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"}`}
        >
          <div className="relative">
            <img
              src={s.image}
              alt={s.title}
              width={1920}
              height={1088}
              className="h-[60vh] w-full object-cover md:h-[78vh]"
            />
            <div
              className={`absolute inset-0 flex items-center px-8 md:px-20 ${
                s.align === "right" ? "justify-end text-right" : "justify-start text-left"
              }`}
            >
              <div className="max-w-md">
                <p className="text-xs tracking-[0.22em] text-foreground/80 uppercase md:text-sm">
                  {s.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-3xl leading-tight tracking-[0.06em] uppercase md:text-5xl">
                  {s.title}
                </h2>
                <Link
                  to="/collections/$slug"
                  params={{ slug: s.slug }}
                  className="mt-6 inline-block border-b border-foreground pb-1 text-xs tracking-[0.22em] uppercase"
                >
                  {s.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2.5">
        {slides.map((s, idx) => (
          <button
            key={s.title}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`size-2 rounded-full transition-colors ${idx === i ? "bg-foreground" : "bg-foreground/35"}`}
          />
        ))}
      </div>
    </section>
  );
}
