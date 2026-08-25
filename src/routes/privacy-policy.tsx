import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/site/PageShell";
import { privacy } from "@/lib/policy-content";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — VedAarna Studio" },
      {
        name: "description",
        content:
          "How VedAarna Studio collects, uses and protects your personal information when you shop with us.",
      },
      { property: "og:title", content: "Privacy Policy — VedAarna Studio" },
      {
        property: "og:description",
        content: "Our approach to your data, cookies, sharing and your privacy rights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Information"
      title="Privacy Policy"
      intro="Your trust matters to us. This page explains what we collect and how we use it."
    >
      <Prose sections={privacy} />
    </PageShell>
  ),
});
