import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { faqs } from "@/lib/policy-content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — VedAarna Studio" },
      {
        name: "description",
        content:
          "Answers on sizing, custom stitching, fabric care, delivery timelines and international shipping at VedAarna Studio.",
      },
      { property: "og:title", content: "Frequently Asked Questions — VedAarna Studio" },
      {
        property: "og:description",
        content: "Sizing, custom stitching, fabric care and shipping — answered.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Faq,
});

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PageShell
      eyebrow="Information"
      title="Frequently Asked Questions"
      intro="Everything customers ask us most often. Still unsure? Write to care@vedaarnastudio.com."
    >
      <div className="divide-y divide-border border-t border-b border-border">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left text-sm"
              aria-expanded={open === i}
            >
              <span>{f.q}</span>
              {open === i ? (
                <Minus className="size-4 shrink-0" />
              ) : (
                <Plus className="size-4 shrink-0" />
              )}
            </button>
            {open === i && (
              <p className="pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
