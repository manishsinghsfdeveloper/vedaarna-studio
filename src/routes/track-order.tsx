import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — VedAarna Studio" },
      {
        name: "description",
        content:
          "Enter your VedAarna Studio order number and email to see where your parcel has reached.",
      },
      { property: "og:title", content: "Track Your Order — VedAarna Studio" },
      {
        property: "og:description",
        content: "Follow your parcel from our Jaipur studio to your door.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackOrder,
});

function TrackOrder() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageShell
      eyebrow="Information"
      title="Track Order"
      intro="Your order number looks like VA-10234 and is in your confirmation email."
    >
      <form
        className="max-w-md space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div>
          <label htmlFor="order" className="text-[11px] tracking-[0.16em] uppercase">
            Order number
          </label>
          <input
            id="order"
            required
            placeholder="VA-10234"
            className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-[11px] tracking-[0.16em] uppercase">
            Email or phone
          </label>
          <input
            id="email"
            required
            className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
          />
        </div>
        <button className="w-full bg-foreground py-3.5 text-[11px] tracking-[0.24em] text-background uppercase">
          Track
        </button>
      </form>

      {submitted && (
        <div className="mt-10 max-w-md border border-border p-6 text-sm text-muted-foreground">
          We could not find live tracking for that reference yet. If your order was placed in the
          last 48 hours it is still being packed at the studio — your tracking link is emailed the
          moment it ships.
        </div>
      )}
    </PageShell>
  );
}
