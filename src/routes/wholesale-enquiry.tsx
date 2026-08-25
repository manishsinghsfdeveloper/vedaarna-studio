import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export const Route = createFileRoute("/wholesale-enquiry")({
  head: () => ({
    meta: [
      { title: "Wholesale Enquiry — VedAarna Studio" },
      {
        name: "description",
        content:
          "Buy VedAarna Studio handcrafted kurta sets, dresses and sarees at wholesale for your boutique or multi-brand store.",
      },
      { property: "og:title", content: "Wholesale Enquiry — VedAarna Studio" },
      {
        property: "og:description",
        content: "Wholesale pricing for boutiques, multi-brand stores and exporters.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Information"
      title="Wholesale Enquiry"
      intro="Boutiques, multi-brand stores and exporters can order our collections at wholesale rates. Minimum order is 30 pieces per style range, with size sets of your choosing."
    >
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Lead time is 3–4 weeks for stocked styles and 6 weeks for made-to-order lots. We share a
          digital linesheet with wholesale pricing once your business details are verified.
        </p>
        <p>Private label and custom colourways are possible from 100 pieces per style.</p>
      </div>
      <div className="mt-12">
        <EnquiryForm
          fields={[
            { id: "w-business", label: "Business name" },
            { id: "w-name", label: "Contact person" },
            { id: "w-email", label: "Email", type: "email" },
            { id: "w-phone", label: "Phone", type: "tel" },
            { id: "w-city", label: "City & country" },
            { id: "w-req", label: "Categories and quantities you need", textarea: true },
          ]}
          cta="Request linesheet"
        />
      </div>
    </PageShell>
  ),
});
