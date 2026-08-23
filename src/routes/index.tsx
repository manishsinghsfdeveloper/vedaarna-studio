import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { ProductCard } from "@/components/site/ProductCard";
import { collections, productsIn } from "@/lib/shop-data";

export const Route = createFileRoute("/")({
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

function Home() {
  const featured = productsIn("new-arrivals");

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <h1 className="sr-only">
          VedAarna Studio — Traditional & Contemporary Fashion for Every Occasion
        </h1>

        <HeroCarousel />

        {/* Category tiles */}
        <section className="px-4 py-14 md:px-10">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {collections.map((c) => (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="group relative overflow-hidden bg-muted"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  width={800}
                  height={1024}
                  className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-3 pt-10 text-center">
                  <p className="font-display text-sm text-background italic">{c.tagline}</p>
                  <p className="mt-1.5 inline-block bg-background/95 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase">
                    {c.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New arrivals */}
        <section className="px-4 pb-8 md:px-10">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
              New Arrivals
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl">Bring your best look forward.</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/collections/$slug"
              params={{ slug: "new-arrivals" }}
              className="inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              View All
            </Link>
          </div>
        </section>

        {/* Story strip */}
        <section className="mt-20 bg-sand/70 px-6 py-16 text-center md:px-10">
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
      </main>
      <Footer />
    </div>
  );
}
