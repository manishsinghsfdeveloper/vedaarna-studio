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
          "Frequently asked questions about VedAarna Studio — shipping, delivery timelines, returns, size guide, order tracking and fabric care.",
      },
      { property: "og:title", content: "Frequently Asked Questions — VedAarna Studio" },
      {
        property: "og:description",
        content: "Shipping, delivery, returns, size guide and order tracking — all your questions answered.",
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
      intro="Everything you need to know about shopping with VedAarna Studio. Still unsure? Write to care@vedaarnastudio.com."
      heroStrip
    >
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded border border-border">
            {/* Header */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left"
              aria-expanded={open === i}
              style={{ backgroundColor: "#c9727a" }}
            >
              <span className="text-[11px] tracking-[0.18em] uppercase font-medium text-white">
                {f.q}
              </span>
              {open === i ? (
                <Minus className="size-4 shrink-0 text-white" />
              ) : (
                <Plus className="size-4 shrink-0 text-white" />
              )}
            </button>
            {/* Answer */}
            {open === i && (
              <div className="border-t border-border bg-background px-5 py-5">
                <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
