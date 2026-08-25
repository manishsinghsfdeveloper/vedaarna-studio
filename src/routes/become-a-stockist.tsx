import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { EnquiryForm } from "@/components/site/EnquiryForm";

const benefits = [
  "Curated seasonal drops with size sets built for your customers",
  "Look-book, product imagery and print stories you can use in-store",
  "Small opening order of 20 pieces for first-time stockists",
  "Restock support within 3 weeks on core styles",
];

export const Route = createFileRoute("/become-a-stockist")({
  head: () => ({
    meta: [
      { title: "Become a Stockist — VedAarna Studio" },
      {
        name: "description",
        content:
          "Stock VedAarna Studio in your boutique or concept store. Curated seasonal drops, low opening orders and restock support.",
      },
      { property: "og:title", content: "Become a Stockist — VedAarna Studio" },
      {
        property: "og:description",
        content: "Carry handcrafted Indian fashion in your store, from 20 pieces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Discover"
      title="Become a Stockist"
      intro="We partner with a small circle of boutiques and concept stores in India and abroad who tell the story of the craft as carefully as we do."
    >
      <ul className="space-y-3 text-sm text-muted-foreground">
        {benefits.map((b) => (
          <li key={b} className="border-l-2 border-primary pl-4">
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <EnquiryForm
          fields={[
            { id: "s-store", label: "Store name" },
            { id: "s-name", label: "Contact person" },
            { id: "s-email", label: "Email", type: "email" },
            { id: "s-phone", label: "Phone", type: "tel" },
            { id: "s-city", label: "City & country" },
            { id: "s-web", label: "Website or Instagram" },
            { id: "s-about", label: "Tell us about your store", textarea: true },
          ]}
          cta="Apply to stock"
        />
      </div>
    </PageShell>
  ),
});
