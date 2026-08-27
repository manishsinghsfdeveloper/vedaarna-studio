import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/site/PageShell";
import { returns } from "@/lib/policy-content";

export const Route = createFileRoute("/returns-exchanges")({
  head: () => ({
    meta: [
      { title: "Refund, Exchanges & Returns — VedAarna Studio" },
      {
        name: "description",
        content:
          "Exchange policy, cancellation policy and refund policy at VedAarna Studio. Domestic exchanges within 3 days of delivery, cancellations within 24 hours.",
      },
      { property: "og:title", content: "Refund, Exchanges & Returns — VedAarna Studio" },
      {
        property: "og:description",
        content:
          "Exchange within 3 days of delivery. Orders cancelled within 24 hours. No returns or refunds on delivered orders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Information"
      title="Refund, Exchanges & Returns"
      intro="Our exchange, cancellation and refund policies — everything you need to know before and after your order."
    >
      <Prose sections={returns} />
    </PageShell>
  ),
});
