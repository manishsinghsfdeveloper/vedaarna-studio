import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/site/PageShell";
import { returns } from "@/lib/policy-content";

export const Route = createFileRoute("/returns-exchanges")({
  head: () => ({
    meta: [
      { title: "Refunds, Exchanges & Returns — VedAarna Studio" },
      {
        name: "description",
        content:
          "7-day returns, free first size exchange within India and how refunds are processed at VedAarna Studio.",
      },
      { property: "og:title", content: "Refunds, Exchanges & Returns" },
      {
        property: "og:description",
        content: "Easy 7-day returns and one free size exchange on every order in India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Information"
      title="Refunds, Exchanges & Returns"
      intro="If a piece is not right for you, here is exactly how to send it back."
    >
      <Prose sections={returns} />
    </PageShell>
  ),
});
