import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — VedAarna Studio" },
      {
        name: "description",
        content:
          "Sign in to your VedAarna Studio account to view orders, saved addresses and your wishlist.",
      },
      { property: "og:title", content: "My Account — VedAarna Studio" },
      {
        property: "og:description",
        content: "Access your orders, addresses and wishlist in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Account,
});

function Account() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [done, setDone] = useState(false);

  return (
    <PageShell
      eyebrow="Information"
      title="My Account"
      intro="Track orders, store your measurements and keep a wishlist of pieces you love."
    >
      <div className="max-w-md">
        <div className="flex gap-8 border-b border-border">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`-mb-px border-b-2 pb-3 text-[11px] tracking-[0.2em] uppercase ${
                mode === m ? "border-foreground" : "border-transparent text-muted-foreground"
              }`}
            >
              {m === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          {mode === "register" && (
            <div>
              <label htmlFor="fullname" className="text-[11px] tracking-[0.16em] uppercase">
                Full name
              </label>
              <input
                id="fullname"
                required
                className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
            </div>
          )}
          <div>
            <label htmlFor="acc-email" className="text-[11px] tracking-[0.16em] uppercase">
              Email
            </label>
            <input
              id="acc-email"
              type="email"
              required
              className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label htmlFor="acc-pass" className="text-[11px] tracking-[0.16em] uppercase">
              Password
            </label>
            <input
              id="acc-pass"
              type="password"
              required
              className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
            />
          </div>
          <button className="w-full bg-foreground py-3.5 text-[11px] tracking-[0.24em] text-background uppercase">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
          {done && (
            <p className="text-sm text-muted-foreground">
              Accounts are opening shortly — meanwhile our care team can help with any order at
              care@vedaarnastudio.com.
            </p>
          )}
        </form>
      </div>
    </PageShell>
  );
}
