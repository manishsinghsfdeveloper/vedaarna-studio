import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { womenReviews } from "@/lib/shop-data";

// Local asset fallbacks — used when R2 CDN images haven't loaded yet (or during local dev)
import pic1 from "@/assets/Women_Of_VedAarna/Client_Pic1.png";
import pic2 from "@/assets/Women_Of_VedAarna/Client_Pic2.jpeg";
import pic3 from "@/assets/Women_Of_VedAarna/Client_Pic3.jpg";
import pic4 from "@/assets/Women_Of_VedAarna/Client_Pic4.jpg";
import pic5 from "@/assets/Women_Of_VedAarna/Client_Pic5.jpg";
import pic6 from "@/assets/Women_Of_VedAarna/Client_Pic6.jpg";
import pic7 from "@/assets/Women_Of_VedAarna/Client_Pic7.jpg";
import pic8 from "@/assets/Women_Of_VedAarna/Client_Pic8.jpeg";
import pic9 from "@/assets/Women_Of_VedAarna/Client_Pic9.jpg";
import pic10 from "@/assets/Women_Of_VedAarna/Client_Pic10.jpg";
import pic11 from "@/assets/Women_Of_VedAarna/Client_Pic11.jpg";
import pic12 from "@/assets/Women_Of_VedAarna/Client_Pic12.jpg";
import pic13 from "@/assets/Women_Of_VedAarna/Client_Pic13.jpeg";
import pic14 from "@/assets/Women_Of_VedAarna/Client_Pic14.jpg";

// Map local fallbacks in the same order as womenReviews
const localFallbacks = [
  pic1,
  pic2,
  pic3,
  pic4,
  pic5,
  pic6,
  pic7,
  pic8,
  pic9,
  pic10,
  pic11,
  pic12,
  pic13,
  pic14,
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`size-4 ${i < rating ? "fill-terracotta text-terracotta" : "fill-foreground/10 text-foreground/20"}`}
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function WomenOfVedAarnaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Page hero */}
        <section className="border-b border-foreground/10 py-16 text-center">
          <p className="text-[11px] tracking-[0.28em] text-terracotta uppercase">
            Real Women, Real Stories
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-wide md:text-5xl">
            ♡ Women of VedAarna ♡
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            From wedding mandaps to morning chai runs — our community of women who wear VedAarna
            their way. Every picture is a story of confidence, colour and craft.
          </p>
          <Link
            to="/collections/$slug"
            params={{ slug: "new-arrivals" }}
            className="mt-8 inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            Shop the Look
          </Link>
        </section>

        {/* Reviews grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {womenReviews.map((r, idx) => (
              <article
                key={idx}
                className="group flex flex-col overflow-hidden rounded-xl border border-foreground/8 bg-background shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#f5f3f0]">
                  <img
                    src={r.image}
                    alt={`${r.dress} — customer photo`}
                    loading="lazy"
                    width={600}
                    height={800}
                    onError={(e) => {
                      // Fall back to local bundled asset if CDN image fails
                      const fallback = localFallbacks[idx];
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <StarRating rating={r.rating} />
                  <p className="text-[13px] leading-relaxed text-foreground/80 italic">
                    &ldquo;{r.review}&rdquo;
                  </p>
                  <p className="mt-auto border-t border-foreground/8 pt-2 text-[12px] font-medium tracking-wide">
                    {r.dress}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="bg-sand/60 py-16 text-center">
          <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
            Wear it. Love it. Share it.
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl">
            Tag us <span className="text-terracotta">@vedaarnastudio</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Share your VedAarna look on Instagram and you might be featured right here on this page.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute("/women-of-vedaarna")({
  head: () => ({
    meta: [
      { title: "Women of VedAarna — Wear It Your Way" },
      {
        name: "description",
        content:
          "Real women, real stories — our community shares their VedAarna looks from weddings to everyday moments.",
      },
      { property: "og:title", content: "Women of VedAarna" },
      {
        property: "og:description",
        content: "Real women wearing VedAarna Studio — share your look and get featured.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WomenOfVedAarnaPage,
});
