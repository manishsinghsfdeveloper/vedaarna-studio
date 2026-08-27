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
          "Terms of Use for vedaarnastudio.com — user agreement, disclaimers, payment facility, limitation of liability, governing law, arbitration, e-coupons and grievance officer details.",
      },
      { property: "og:title", content: "Terms of Use — VedAarna Studio" },
      {
        property: "og:description",
        content:
          "User agreement, disclaimers, limitation of liability, governing law and grievance officer details for VedAarna Studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Information"
      title="Terms of Use"
      intro="Please read these terms carefully. By using vedaarnastudio.com, you agree to be bound by this User Agreement."
    >
      <Prose sections={terms} />
    </PageShell>
  ),
});
