import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";

const steps = [
  {
    title: "Share your code",
    copy: "Send your personal code to a friend by WhatsApp, email or however you like.",
  },
  {
    title: "They save ₹500",
    copy: "Your friend gets ₹500 off their first order above ₹3,999.",
  },
  {
    title: "You earn ₹500",
    copy: "Once their order ships, ₹500 in store credit lands in your account.",
  },
];

export const Route = createFileRoute("/refer-earn")({
  head: () => ({
    meta: [
      { title: "Refer & Earn — VedAarna Studio" },
      {
        name: "description",
        content:
          "Share VedAarna Studio with a friend: they get ₹500 off their first order and you earn ₹500 in store credit.",
      },
      { property: "og:title", content: "Refer & Earn — VedAarna Studio" },
      {
        property: "og:description",
        content: "₹500 for your friend, ₹500 for you. No limit on referrals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReferEarn,
});

function ReferEarn() {
  const [code, setCode] = useState<string | null>(null);

  return (
    <PageShell
      eyebrow="Discover"
      title="Refer & Earn"
      intro="Handcrafted clothing travels best by word of mouth. Pass it on and you both gain."
    >
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title}>
            <p className="font-display text-2xl text-primary">0{i + 1}</p>
            <h2 className="mt-2 text-sm tracking-[0.16em] uppercase">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.copy}</p>
          </div>
        ))}
      </div>

      <form
        className="mt-14 max-w-md space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setCode("VEDA-" + Math.random().toString(36).slice(2, 7).toUpperCase());
        }}
      >
        <div>
          <label htmlFor="ref-email" className="text-[11px] tracking-[0.16em] uppercase">
            Your email
          </label>
          <input
            id="ref-email"
            type="email"
            required
            className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
          />
        </div>
        <button className="w-full bg-foreground py-3.5 text-[11px] tracking-[0.24em] text-background uppercase">
          Get my code
        </button>
      </form>

      {code && (
        <p className="mt-6 text-sm">
          Your referral code:{" "}
          <span className="border border-dashed border-foreground px-3 py-1 tracking-[0.2em]">
            {code}
          </span>
        </p>
      )}

      <div className="mt-14 space-y-2 text-xs leading-relaxed text-muted-foreground">
        <p>
          Terms: store credit is valid for 12 months, cannot be clubbed with other discount codes,
          and is released only after the referred order has passed its return window.
        </p>
      </div>
    </PageShell>
  );
}
