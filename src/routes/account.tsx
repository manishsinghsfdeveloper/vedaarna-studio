import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

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
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="grid md:grid-cols-2 md:divide-x md:divide-border gap-16 md:gap-0">

          {/* ── Left: Login ───────────────────────────────────────────────── */}
          <div className="md:pr-16">
            <h2 className="text-xl tracking-[0.12em] uppercase">Login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              If you've created an account with us, please enter.
            </p>

            <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="acc-email"
                  className="text-[11px] tracking-[0.18em] uppercase"
                >
                  Email
                </label>
                <input
                  id="acc-email"
                  type="email"
                  placeholder="Email"
                  required
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              <div>
                <label
                  htmlFor="acc-pass"
                  className="text-[11px] tracking-[0.18em] uppercase"
                >
                  Password
                </label>
                <input
                  id="acc-pass"
                  type="password"
                  placeholder="Password"
                  required
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              <a
                href="#"
                className="block text-sm text-primary hover:underline"
              >
                Forgot your password?
              </a>

              <button
                type="submit"
                className="w-full bg-foreground py-3.5 text-[11px] tracking-[0.24em] text-background uppercase hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* ── Right: Create Account ─────────────────────────────────────── */}
          <div className="md:pl-16 flex flex-col justify-center">
            <h2 className="text-xl tracking-[0.12em] uppercase">Create an Account</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Registering with VedAarna Studio lets you access your order status and history
              anytime. We'll have your account set up in no time — we only ask for the
              information needed to make your purchase process faster and easier.
            </p>

            <button
              type="button"
              className="mt-8 w-full bg-foreground py-3.5 text-[11px] tracking-[0.24em] text-background uppercase hover:opacity-90 transition-opacity"
            >
              Create Account
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
