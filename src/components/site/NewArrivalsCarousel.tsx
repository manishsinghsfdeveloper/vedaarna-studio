import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { formatINR, type Product } from "@/lib/shop-data";

interface Props {
  products: Product[];
}

export function NewArrivalsCarousel({ products }: Props) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(4);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = products.length;
  const maxIndex = Math.max(0, total - itemsPerView);

  // Responsive itemsPerView calculation
  useEffect(() => {
    const updateItemsPerView = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setItemsPerView(1.25); // show 1 full card + partial peek of next on mobile
      } else if (w < 768) {
        setItemsPerView(2.2);
      } else if (w < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => {
      if (prev >= maxIndex) return 0;
      return Math.min(prev + 1, maxIndex);
    });
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((prev) => {
      if (prev <= 0) return maxIndex;
      return Math.max(prev - 1, 0);
    });
  }, [maxIndex]);

  // Auto-slide every 3.5 seconds when not hovered/paused
  useEffect(() => {
    if (isPaused || total <= 1) return;
    timerRef.current = setInterval(() => {
      next();
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, next, total]);

  const goTo = (idx: number) => {
    setCurrent(Math.min(Math.max(0, idx), maxIndex));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const currentX = e.touches[0]?.clientX ?? 0;
    touchDeltaX.current = currentX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 40) {
      if (touchDeltaX.current < 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  };

  // Calculate slide percentage
  // In percent: each item width = 100 / itemsPerView
  const itemWidthPercent = 100 / itemsPerView;
  const translateX = current * itemWidthPercent;

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding Viewport */}
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform"
          style={{
            transform: `translateX(-${translateX}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="shrink-0 px-2 sm:px-2.5 md:px-3"
              style={{
                width: `${itemWidthPercent}%`,
              }}
            >
              <CarouselCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Prev Navigation Arrow */}
      <button
        type="button"
        aria-label="Previous Products"
        onClick={prev}
        className="absolute top-1/3 -left-3 md:-left-5 z-20 flex size-9 md:size-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md transition-all duration-300 hover:scale-105 hover:bg-background focus:outline-none"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Next Navigation Arrow */}
      <button
        type="button"
        aria-label="Next Products"
        onClick={next}
        className="absolute top-1/3 -right-3 md:-right-5 z-20 flex size-9 md:size-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md transition-all duration-300 hover:scale-105 hover:bg-background focus:outline-none"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="mt-8 flex justify-center items-center gap-2">
        {Array.from({ length: maxIndex + 1 }, (_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => goTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === current
                ? "w-6 bg-terracotta"
                : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function CarouselCard({ product }: { product: Product }) {
  return (
    <article className="group/card flex flex-col h-full">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#f5f3f0]"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={600}
          height={800}
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500 group-hover/card:opacity-0"
        />
        <img
          src={product.hover}
          alt=""
          aria-hidden
          loading="lazy"
          width={600}
          height={800}
          className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        />
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-background/90 px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase rounded-sm font-medium shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Quick size preview hover bar */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full flex-wrap justify-center gap-1.5 bg-background/90 py-2 transition-transform duration-300 group-hover/card:translate-y-0 md:flex">
            {product.sizes.map((s) => (
              <span key={s} className="text-[10px] tracking-[0.12em] text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        )}
      </Link>
      <div className="mt-3 text-center flex flex-col items-center">
        <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">VedAarna</p>
        <h3 className="mt-1 px-1 text-[13px] leading-snug line-clamp-2">
          <Link to="/products/$slug" params={{ slug: product.slug }} className="link-underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center justify-center gap-2 text-[13px]">
          <span>{formatINR(product.price)}</span>
          {product.compareAt && (
            <span className="text-muted-foreground line-through text-[12px]">
              ₹{product.compareAt.toLocaleString("en-IN")}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
