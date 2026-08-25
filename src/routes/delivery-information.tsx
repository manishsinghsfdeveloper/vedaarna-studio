import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/site/PageShell";
import { delivery } from "@/lib/policy-content";

export const Route = createFileRoute("/delivery-information")({
  head: () => ({
    meta: [
      { title: "Delivery Information — VedAarna Studio" },
      {
        name: "description",
        content:
          "Dispatch timelines, shipping charges, international delivery and order tracking at VedAarna Studio.",
      },
      { property: "og:title", content: "Delivery Information — VedAarna Studio" },
      {
        property: "og:description",
        content: "Free shipping above ₹2,999 in India, worldwide delivery in 7–14 days.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Information"
      title="Delivery Information"
      intro="When your parcel leaves the studio, and when it should reach you."
    >
      <Prose sections={delivery} />
    </PageShell>
  ),
});
