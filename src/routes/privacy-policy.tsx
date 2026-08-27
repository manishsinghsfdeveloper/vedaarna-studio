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
          "How VEDAARNA STUDIO collects, uses, maintains and discloses information. Read our full privacy policy for vedaarnastudio.com.",
      },
      { property: "og:title", content: "Privacy Policy — VedAarna Studio" },
      {
        property: "og:description",
        content:
          "We do not sell your personal data. Learn how VedAarna Studio collects, protects and uses your information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Information"
      title="Privacy Policy"
      intro="Your trust matters to us. This page explains what we collect, how we use it, and how we keep it safe."
    >
      <Prose sections={privacy} />
    </PageShell>
  ),
});
