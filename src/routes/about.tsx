import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import simranPortrait from "@/assets/simran-singh.jpg";
import simranComposite from "@/assets/simran-composite.jpg";
import manishPortrait from "@/assets/manish-singh.jpg";
import manishComposite from "@/assets/manish-composite.jpg";
import combineImage from "@/assets/Combine-Image.png";
import imgPeopleFirst from "@/assets/people-first.png";
import imgHeritage from "@/assets/Heritage-in-Every-Thread.png";
import imgSustainable from "@/assets/Sustainable-by-Choice.png";
import imgMeaningful from "@/assets/Meaningful-Designs.png";
import imgConscious from "@/assets/Conscious-Choices.png";
import imgArtisan from "@/assets/Artisan-First.png";
import imgTimeless from "@/assets/Timeless-Designs.png";
import imgMadeWithHeart from "@/assets/Made-with-Heart.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — VedAarna Studio" },
      {
        name: "description",
        content:
          "VedAarna Studio began with a simple belief: that traditional Indian craftsmanship deserves a home in the modern wardrobe.",
      },
      { property: "og:title", content: "About Us — VedAarna Studio" },
      {
        property: "og:description",
        content:
          "Traditional Indian craftsmanship for the modern wardrobe. A legacy in every stitch.",
      },
    ],
  }),
  component: About,
});

// ── Value pillars ────────────────────────────────────────────────────────────

const simranPillars = [
  {
    img: imgPeopleFirst,
    title: "People First",
    body: "We empower artisan communities and build long-term relationships.",
  },
  {
    img: imgHeritage,
    title: "Heritage in Every Thread",
    body: "Our designs celebrate timeless crafts passed down through generations.",
  },
  {
    img: imgSustainable,
    title: "Sustainable by Choice",
    body: "Mindful materials, ethical processes, and a commitment to a better tomorrow.",
  },
  {
    img: imgMeaningful,
    title: "Meaningful Designs",
    body: "Thoughtfully designed pieces that blend tradition with modern living.",
  },
];

const manishPillars = [
  {
    img: imgConscious,
    title: "Conscious Choices",
    body: "Thoughtful materials and responsible practices for a better tomorrow.",
  },
  {
    img: imgArtisan,
    title: "Artisan First",
    body: "Empowering artisan communities and preserving traditional crafts.",
  },
  {
    img: imgTimeless,
    title: "Timeless Designs",
    body: "Effortless styles that transcend trends and celebrate heritage.",
  },
  {
    img: imgMadeWithHeart,
    title: "Made with Heart",
    body: "Every piece is crafted with passion, care, and intention.",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero banner — combined founders image */}
        <img
          src={combineImage}
          alt="Simran Singh & Manish Singh — VedAarna Studio"
          loading="eager"
          className="w-full object-cover"
        />

        {/* ── Intro ──────────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">About Us</p>
          <h1 className="mt-4 text-3xl md:text-4xl">A Legacy in Every Stitch</h1>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            VedAarna Studio began with a simple belief: that traditional Indian craftsmanship
            deserves a home in the modern wardrobe — not as a costume for special occasions, but as
            an everyday expression of who you are.
          </p>
          <blockquote className="mt-8 font-display text-xl italic text-muted-foreground">
            A Legacy in Every Stitch.
          </blockquote>
        </div>

        {/* ── Leadership grid ────────────────────────────────────────────── */}
        <div className="border-t border-border bg-sand/40 py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm text-muted-foreground">Today, VedAarna is shaped by</p>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 max-w-xl mx-auto">
              {/* Simran */}
              <div className="flex flex-col items-center">
                <div className="h-56 w-56 overflow-hidden rounded-none border border-border">
                  <img
                    src={simranPortrait}
                    alt="Simran Singh — CMD & CEO"
                    width={400}
                    height={500}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <p className="mt-4 font-display text-lg">Simran Singh</p>
                <p className="mt-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  CMD &amp; CEO
                </p>
              </div>

              {/* Manish */}
              <div className="flex flex-col items-center">
                <div className="h-56 w-56 overflow-hidden rounded-none border border-border">
                  <img
                    src={manishPortrait}
                    alt="Manish Singh — CTO"
                    width={400}
                    height={500}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <p className="mt-4 font-display text-lg">Manish Singh</p>
                <p className="mt-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  CTO
                </p>
              </div>
            </div>

            <p className="mt-10 max-w-2xl mx-auto text-sm leading-relaxed text-muted-foreground">
              Together, they bring two very different worlds into one brand — one rooted in design,
              craft and the boutique floor; the other in technology, systems and scale. That balance
              is what lets VedAarna hold onto the intimacy of a made-to-measure studio while
              building something built to grow.
            </p>
          </div>
        </div>

        {/* ── Simran section ─────────────────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
            <div className="grid items-start gap-12 md:grid-cols-2">
              {/* Left — text */}
              <div className="md:pr-8">
                <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
                  Our Story
                </p>
                <h2 className="mt-4 text-3xl leading-tight md:text-4xl">
                  Crafted with Heart.
                  <br />
                  Rooted in Heritage.
                </h2>
                <div className="mt-1 h-px w-10 bg-primary" />

                <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    At the heart of VedAarna is Simran Singh, whose eye for silhouette, embroidery
                    and fit shapes every piece that carries the VedAarna name.
                  </p>
                  <p>
                    Her approach is rooted in the belief that fine tailoring is a form of care —
                    that a garment should feel like it was made for you, not just made available to
                    you. From sourcing fabric to signing off on the final stitch, Simran stays close
                    to the craft, ensuring VedAarna's bridal and fusion pieces carry the same warmth
                    and precision the studio was built on.
                  </p>
                </div>

                {/* Pull-quote */}
                <div className="mt-10 border-l-2 border-primary pl-5">
                  <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-2">
                    "
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    Every piece we create carries the soul of the artisan and the story of our
                    culture.
                  </p>
                  <p className="mt-3 font-display text-base italic">— Simran Singh</p>
                  <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                    CMD &amp; CEO, VedAarna Studio
                  </p>
                </div>

                {/* Pillars */}
                <div className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-10">
                  {simranPillars.map((p) => (
                    <div key={p.title}>
                      <img src={p.img} alt={p.title} className="h-10 w-10 object-contain" />
                      <h3 className="mt-2 text-[11px] tracking-[0.16em] uppercase">{p.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — photo in arch */}
              <div className="relative flex justify-center md:justify-end">
                <div
                  className="relative overflow-hidden bg-sand/60"
                  style={{
                    width: "min(560px, 100%)",
                    aspectRatio: "3/4",
                    borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
                  }}
                >
                  <img
                    src={simranComposite}
                    alt="Simran Singh — CMD & CEO, VedAarna Studio"
                    width={840}
                    height={1120}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Manish section ─────────────────────────────────────────────── */}
        <section className="border-t border-border bg-sand/30">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
            <div className="grid items-start gap-12 md:grid-cols-2">
              {/* Left — photo in arch (mirrored) */}
              <div className="relative flex justify-center md:justify-start order-2 md:order-1">
                <div
                  className="relative overflow-hidden bg-sand/60"
                  style={{
                    width: "min(560px, 100%)",
                    aspectRatio: "3/4",
                    borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
                  }}
                >
                  <img
                    src={manishComposite}
                    alt="Manish Singh — CTO, VedAarna Studio"
                    width={840}
                    height={1120}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Right — text */}
              <div className="md:pl-8 order-1 md:order-2">
                <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
                  Our Story
                </p>
                <h2 className="mt-4 text-3xl leading-tight md:text-4xl">
                  Where Tradition
                  <br />
                  Meets Purpose
                </h2>
                <div className="mt-1 h-px w-10 bg-primary" />

                <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Manish Singh brings the systems and technology that let VedAarna's craftsmanship
                    reach further — from the storefront experience to the tools that run behind the
                    scenes.
                  </p>
                  <p>
                    His work ensures that the studio's growth never comes at the cost of the
                    personal touch clients expect, building the digital backbone that connects
                    design, discovery and delivery into one seamless experience. At VedAarna, he
                    leads product, technology and the platforms that carry the brand into its next
                    chapter.
                  </p>
                </div>

                {/* Pull-quote */}
                <div className="mt-10 border-l-2 border-primary pl-5">
                  <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-2">
                    "
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    Every thread tells a story. We simply ensure it reaches you.
                  </p>
                  <p className="mt-3 font-display text-base italic">— Manish Singh</p>
                  <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                    CTO, VedAarna Studio
                  </p>
                </div>

                {/* Pillars */}
                <div className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-10">
                  {manishPillars.map((p) => (
                    <div key={p.title}>
                      <img src={p.img} alt={p.title} className="h-10 w-10 object-contain" />
                      <h3 className="mt-2 text-[11px] tracking-[0.16em] uppercase">{p.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Closing ────────────────────────────────────────────────────── */}
        <div className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Over the years, VedAarna has grown — but the thought behind it hasn't changed.
                Fashion should let a woman carry her heritage forward on her own terms, dressed for
                the moment, without ever telling her who she needs to be.
              </p>
              <p className="font-display text-base italic text-foreground">
                Because every stitch carries a story. Ours is just getting started.
              </p>
            </div>
            <p className="mt-10 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              VedAarna Studio is a registered trademark of VedAarna Studio.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
