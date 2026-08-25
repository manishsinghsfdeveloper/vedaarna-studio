import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { EnquiryForm } from "@/components/site/EnquiryForm";

const points = [
  "Exclusive territory rights for your city",
  "Store design, visual merchandising and staff training support",
  "Seasonal collections shipped on a consignment-friendly model",
  "Marketing collateral and local campaign support",
];

export const Route = createFileRoute("/franchise-enquiry")({
  head: () => ({
    meta: [
      { title: "Franchise Enquiry — VedAarna Studio" },
      {
        name: "description",
        content:
          "Open a VedAarna Studio franchise store. Territory rights, store design support, training and seasonal collections.",
      },
      { property: "og:title", content: "Franchise Enquiry — VedAarna Studio" },
      {
        property: "og:description",
        content: "Partner with us to bring handcrafted Indian fashion to your city.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Information"
      title="Franchise Enquiry"
      intro="We are opening a small number of partner stores across India. If you know retail and love craft, we would like to hear from you."
    >
      <ul className="space-y-3 text-sm text-muted-foreground">
        {points.map((p) => (
          <li key={p} className="border-l-2 border-primary pl-4">
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted-foreground">
        Indicative requirement: 600–900 sq ft in a prime high street or mall location, and an
        initial investment from ₹25 lakh including inventory.
      </p>
      <div className="mt-12">
        <EnquiryForm
          fields={[
            { id: "f-name", label: "Name" },
            { id: "f-email", label: "Email", type: "email" },
            { id: "f-phone", label: "Phone", type: "tel" },
            { id: "f-city", label: "Proposed city" },
            { id: "f-space", label: "Available retail space (sq ft)" },
            { id: "f-exp", label: "Your retail experience", textarea: true },
          ]}
        />
      </div>
    </PageShell>
  ),
});
