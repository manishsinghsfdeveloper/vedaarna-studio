import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import hero from "@/assets/hero-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — VedAarna Studio" },
      {
        name: "description",
        content:
          "VedAarna Studio works with Indian artisans to create handblock printed, kantha and chanderi clothing made to be lived in.",
      },
      { property: "og:title", content: "Our Story — VedAarna Studio" },
      {
        property: "og:description",
        content: "Slow, handcrafted Indian fashion made with artisan clusters across India.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <img
          src={hero}
          alt="VedAarna Studio craft"
          loading="lazy"
          width={1920}
          height={1088}
          className="h-[45vh] w-full object-cover"
        />
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
            Our Story
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl">Woven with intention</h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              VedAarna Studio began with a simple belief — that everyday clothing can carry
              the soul of a craft. Each piece we make starts at the loom or the printing
              table, in small artisan clusters across Rajasthan, Bengal and Madhya Pradesh.
            </p>
            <p>
              We work in pure, breathable fabrics: mulmul and handwoven cotton for daily
              ease, chanderi and organza for the occasions that ask for a little shimmer.
              Our kantha is stitched by hand, our blocks are carved in teak, and our dyes
              are chosen for gentleness on skin and soil alike.
            </p>
            <p>
              Sizes run from XXS to 5XL because celebration should never be conditional.
              Nothing is made in excess — we produce in small runs, restock what is loved,
              and retire what is not.
            </p>
          </div>
          <blockquote className="mt-12 border-l-2 border-primary pl-6 font-display text-xl italic">
            Crafted for your kind of beautiful.
          </blockquote>
        </div>
      </main>
      <Footer />
    </div>
  );
}
