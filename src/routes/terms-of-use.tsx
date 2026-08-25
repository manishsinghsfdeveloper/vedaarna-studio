import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/site/PageShell";
import { terms } from "@/lib/policy-content";

export const Route = createFileRoute("/terms-of-use")({
  head: () => ({
    meta: [
      { title: "Terms of Use — VedAarna Studio" },
      {
        name: "description",
        content:
          "The terms that apply when you browse or order from VedAarna Studio, including pricing, handcraft variation and liability.",
      },
      { property: "og:title", content: "Terms of Use — VedAarna Studio" },
      {
        property: "og:description",
        content: "Conditions of using the VedAarna Studio website and placing orders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Information" title="Terms of Use">
      <Prose sections={terms} />
    </PageShell>
  ),
});
