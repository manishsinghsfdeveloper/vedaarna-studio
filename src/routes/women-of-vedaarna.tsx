import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import p1 from "@/assets/p1.jpg";
import p3 from "@/assets/p3.jpg";
import p7 from "@/assets/p7.jpg";

const stories = [
  {
    name: "Kamla Devi, block printer",
    place: "Bagru, Rajasthan",
    image: p1,
    body: "Kamla carves and prints the florals that run through our summer dresses. Thirty-one years at the printing table, and she still checks every repeat by eye.",
  },
  {
    name: "Rehana Bibi, kantha artisan",
    place: "Bolpur, West Bengal",
    image: p3,
    body: "Rehana leads a group of fourteen women who hand stitch our kantha tiers. A single dress carries close to nine days of running stitch.",
  },
  {
    name: "Sunita Rathore, studio tailor",
    place: "Jaipur, Rajasthan",
    image: p7,
    body: "Sunita finishes every custom order that leaves the studio and trains our new tailors on fit across sizes XXS to 5XL.",
  },
];

export const Route = createFileRoute("/women-of-vedaarna")({
  head: () => ({
    meta: [
      { title: "Women of VedAarna — The Hands Behind the Craft" },
      {
        name: "description",
        content:
          "Meet the block printers, kantha artisans and tailors whose work makes every VedAarna Studio piece.",
      },
      { property: "og:title", content: "Women of VedAarna" },
      {
        property: "og:description",
        content: "Portraits of the artisans and makers behind our collections.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Discover"
      title="Women of VedAarna"
      intro="Over eighty percent of the hands that make our clothing belong to women working from home studios and small workshops. These are a few of them."
      wide
    >
      <div className="space-y-16">
        {stories.map((s, i) => (
          <article
            key={s.name}
            className={`grid items-center gap-8 md:grid-cols-2 ${
              i % 2 ? "md:[&>figure]:order-2" : ""
            }`}
          >
            <figure>
              <img
                src={s.image}
                alt={s.name}
                loading="lazy"
                width={900}
                height={1125}
                className="aspect-4/5 w-full object-cover"
              />
            </figure>
            <div>
              <h2 className="text-xl">{s.name}</h2>
              <p className="mt-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {s.place}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  ),
});
