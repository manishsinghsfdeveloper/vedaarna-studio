import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/site/PageShell";
import { delivery } from "@/lib/policy-content";

export const Route = createFileRoute("/delivery-information")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery Policy — VedAarna Studio" },
      {
        name: "description",
        content:
          "Free shipping on all prepaid orders in India. International shipping, dispatch timelines, order tracking, cancellation and payment options at VedAarna Studio.",
      },
      { property: "og:title", content: "Shipping & Delivery Policy — VedAarna Studio" },
      {
        property: "og:description",
        content:
          "Free shipping on all prepaid orders in India. International orders ship worldwide — free above USD 150.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Information"
      title="Shipping & Delivery Policy"
      intro="Everything you need to know about shipping, dispatch timelines, and getting your order safely."
    >
      <Prose sections={delivery} />
    </PageShell>
  ),
});
