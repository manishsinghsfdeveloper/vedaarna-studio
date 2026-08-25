import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p5 from "@/assets/p5.jpg";
import p8 from "@/assets/p8.jpg";
import p6 from "@/assets/p6.jpg";
import p4 from "@/assets/p4.jpg";

const features = [
  { name: "Ananya R.", note: "Gulaab Pink Anarkali Suit Set", image: p8 },
  { name: "Meher K.", note: "Sheer Grace Mint Organza Saree", image: p6 },
  { name: "Ira D.", note: "Radiant Meadows Kantha Tiered Dress", image: p2 },
  { name: "Saloni V.", note: "Haldi Mustard Cotton Co-Ord Set", image: p5 },
  { name: "Tanvi M.", note: "Neelambari Navy Kurta Suit Set", image: p4 },
  { name: "Reha S.", note: "Radiant Meadows Purple Tiered Dress", image: p3 },
];

export const Route = createFileRoute("/celebrities")({
  head: () => ({
    meta: [
      { title: "Celebrities in VedAarna — Studio Spotlights" },
      {
        name: "description",
        content:
          "Artists, performers and creators wearing VedAarna Studio kurta sets, sarees and handcrafted dresses.",
      },
      { property: "og:title", content: "Celebrities in VedAarna" },
      {
        property: "og:description",
        content: "Spotting our handcrafted pieces on stage, on set and on screen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Discover"
      title="Celebrities in VedAarna"
      intro="Performers, presenters and creators who chose our handcrafted pieces for the moments that mattered."
      wide
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {features.map((f) => (
          <figure key={f.name} className="group overflow-hidden">
            <img
              src={f.image}
              alt={`${f.name} wearing the ${f.note}`}
              loading="lazy"
              width={800}
              height={1024}
              className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="mt-3">
              <p className="text-sm">{f.name}</p>
              <p className="text-xs text-muted-foreground">in the {f.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        Styling a shoot or a stage look? Write to press@vedaarnastudio.com for loan requests.
      </p>
    </PageShell>
  ),
});
