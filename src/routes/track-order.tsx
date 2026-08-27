import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — VedAarna Studio" },
      {
        name: "description",
        content:
          "Enter your AWB number to track your VedAarna Studio order in real time.",
      },
      { property: "og:title", content: "Track Your Order — VedAarna Studio" },
      {
        property: "og:description",
        content: "Follow your parcel from our studio to your door.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackOrder,
});

function TrackOrder() {
  const [awb, setAwb] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* breadcrumb */}
      <nav className="px-6 py-3 text-xs text-muted-foreground md:px-10">
        <a href="/" className="text-primary hover:underline">Home</a>
        <span className="mx-2">/</span>
        <span>Track Order</span>
      </nav>

      <main className="flex flex-1 items-start justify-center px-6 py-16 md:px-10">
        <div className="w-full max-w-xl rounded border border-border p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              type="text"
              value={awb}
              onChange={(e) => { setAwb(e.target.value); setSubmitted(false); }}
              placeholder="Enter Your AWB No."
              required
              className="w-full rounded border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-[#c9727a] placeholder:text-muted-foreground/60"
            />

            <button
              type="submit"
              className="mt-5 w-full rounded py-3.5 text-[11px] tracking-[0.22em] uppercase text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#c9727a" }}
            >
              Track Order
            </button>
          </form>

          {submitted && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              We could not find live tracking for that AWB number yet. If your
              order was placed in the last 48 hours it is still being packed —
              your tracking link is emailed the moment it ships.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
