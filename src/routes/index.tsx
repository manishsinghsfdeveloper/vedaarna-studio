import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { ProductCard } from "@/components/site/ProductCard";
import { NewArrivalsCarousel } from "@/components/site/NewArrivalsCarousel";
import { getCollections, getProducts, womenReviews } from "@/lib/shop-data";

// Local fallbacks for the first 6 Women of VedAarna cards on the home page.
// CDN URLs are in womenReviews[].image — these fire only if CDN load fails.
import pic1 from "@/assets/Women_Of_VedAarna/Client_Pic1.png";
import pic2 from "@/assets/Women_Of_VedAarna/Client_Pic2.jpeg";
import pic3 from "@/assets/Women_Of_VedAarna/Client_Pic3.jpg";
import pic4 from "@/assets/Women_Of_VedAarna/Client_Pic4.jpg";
import pic5 from "@/assets/Women_Of_VedAarna/Client_Pic5.jpg";
import pic6 from "@/assets/Women_Of_VedAarna/Client_Pic6.jpg";

const homeWomenFallbacks = [pic1, pic2, pic3, pic4, pic5, pic6];

export const Route = createFileRoute("/")({
  loader: async () => {
    const [allProducts, cols] = await Promise.all([getProducts(), getCollections()]);
    // New arrivals: take top 7 products with "new-arrivals" collection/tag
    const newArrivals = allProducts
      .filter((p) => p.collections.includes("new-arrivals"))
      .slice(0, 7);

    // Co-ords: products in co-ords collection, up to 4
    const coords = allProducts.filter((p) => p.collections.includes("co-ords")).slice(0, 4);

    // Dresses: products in dresses collection, up to 4
    const dresses = allProducts.filter((p) => p.collections.includes("dresses")).slice(0, 4);

    return { newArrivals, coords, dresses, collections: cols };
  },
  head: () => ({
    meta: [
      { title: "VedAarna Studio — Traditional & Contemporary Indian Fashion" },
      {
        name: "description",
        content:
          "Shop handcrafted kurta sets, dresses, sarees, co-ords and menswear at VedAarna Studio. Artisan-made Indian fashion for every occasion.",
      },
      { property: "og:title", content: "VedAarna Studio — Handcrafted Indian Fashion" },
      {
        property: "og:description",
        content:
          "Kurta & suit sets, dresses, organza sarees, co-ords and menswear — crafted in India, made to be lived in.",
      },
    ],
  }),
  component: Home,
});

const promises = [
  { title: "Artisan Made", copy: "Handblock prints & kantha by Indian craftspeople." },
  { title: "Pure Fabrics", copy: "Breathable mulmul, cotton, chanderi and organza." },
  { title: "Easy Returns", copy: "7-day hassle-free returns & size exchanges." },
  { title: "Express Shipping", copy: "Free shipping across India on orders above ₹2,999." },
];

// Show first 6 reviews on the home page; full 14 on /women-of-vedaarna
const homeWomenPreviews = womenReviews.slice(0, 6);

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`size-3.5 ${i < rating ? "fill-terracotta text-terracotta" : "fill-foreground/10 text-foreground/20"}`}
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Home() {
  const { newArrivals, coords, dresses, collections } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <h1 className="sr-only">
          VedAarna Studio — Traditional & Contemporary Fashion for Every Occasion
        </h1>

        <HeroCarousel />

        {/* Continuous auto-moving collection banner (Bunai-style) */}
        <section className="py-12 overflow-hidden border-b border-border/40">
          <div className="marquee-cards-track flex gap-4 pl-4">
            {[...collections, ...collections].map((c, idx) => (
              <Link
                key={`${c.slug}-${idx}`}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="group relative w-60 sm:w-68 md:w-76 shrink-0 aspect-[3/4] overflow-hidden rounded-2xl bg-[#f5f3f0] shadow-xs transition-transform duration-500 hover:scale-[1.02]"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  width={800}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 pt-14 text-center">
                  <p className="font-display text-sm text-white italic drop-shadow-xs">
                    {c.tagline}
                  </p>
                  <p className="mt-2 inline-block rounded-xs bg-white/95 px-3 py-1 text-[10px] font-medium tracking-[0.16em] uppercase text-foreground shadow-xs">
                    {c.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── NEW ARRIVALS carousel ── */}
        <section className="px-4 pb-8 md:px-10">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
              Just Landed
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl">New Arrivals</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Fresh off the loom — styles that just arrived at VedAarna Studio.
            </p>
          </div>
          <div className="relative mt-10 px-6">
            {newArrivals.length > 0 ? (
              <NewArrivalsCarousel products={newArrivals} />
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {newArrivals.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/collections/$slug"
              params={{ slug: "new-arrivals" }}
              className="inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              View All New Arrivals
            </Link>
          </div>
        </section>

        {/* ── EVERYDAY CO-ORDS ── */}
        <section className="mt-10 bg-blush/20 px-4 py-14 md:px-10">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
              Style that moves with you
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl">Everyday Co-Ords</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Two pieces. One perfect look. From morning errands to evening soirées — effortless
              co-ord sets designed to keep up with every version of you.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {coords.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/collections/$slug"
              params={{ slug: "co-ords" }}
              className="inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Shop All Co-Ords
            </Link>
          </div>
        </section>

        {/* ── FESTIVE DRESSES ── */}
        <section className="px-4 py-14 md:px-10">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
              Dressed for every occasion
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl">Festive Dresses</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Crafted to make every entrance unforgettable — dresses that blend Indian heritage with
              contemporary silhouettes, for women who never settle for ordinary.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {dresses.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/collections/$slug"
              params={{ slug: "dresses" }}
              className="inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Shop All Dresses
            </Link>
          </div>
        </section>

        {/* Story strip */}
        <section className="bg-sand/70 px-6 py-16 text-center md:px-10">
          <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
            The VedAarna Promise
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl leading-snug md:text-3xl">
            Slow fashion, woven by hand — for the woman who dresses for herself.
          </h2>
          <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-4">
            {promises.map((p) => (
              <div key={p.title}>
                <h3 className="text-sm tracking-[0.16em] uppercase">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WOMEN OF VEDAARNA ── */}
        <section className="px-4 py-14 md:px-10">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.24em] text-terracotta uppercase">
              Real Women, Real Stories
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-wide md:text-3xl">
              ♡ Women of VedAarna ♡
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              From wedding mandaps to everyday moments — our community wearing VedAarna, their way.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {homeWomenPreviews.map((r, idx) => (
              <article key={idx} className="group relative overflow-hidden rounded-xl bg-[#f5f3f0]">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={r.image}
                    alt={`${r.dress} — customer photo`}
                    loading="lazy"
                    width={400}
                    height={533}
                    onError={(e) => {
                      const fallback = homeWomenFallbacks[idx];
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <StarRating rating={r.rating} />
                  <p className="mt-1.5 text-[11px] leading-snug text-white/90 italic line-clamp-3">
                    "{r.review}"
                  </p>
                  <p className="mt-1.5 text-[10px] tracking-wide text-white font-medium line-clamp-2">
                    {r.dress}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/women-of-vedaarna"
              className="inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              See All Stories
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
