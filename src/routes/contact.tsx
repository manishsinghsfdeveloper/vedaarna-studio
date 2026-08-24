import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — VedAarna Studio" },
      {
        name: "description",
        content:
          "Questions about sizing, orders or shipping? Reach the VedAarna Studio care team by email, phone or WhatsApp.",
      },
      { property: "og:title", content: "Contact VedAarna Studio" },
      {
        property: "og:description",
        content: "Customer care for orders, sizing, returns and exchanges.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
          Customer Care
        </p>
        <h1 className="mt-4 text-3xl md:text-4xl">Contact Us</h1>

        <div className="mt-12 grid gap-14 md:grid-cols-2">
          <div className="space-y-6 text-sm">
            <div>
              <h2 className="text-xs tracking-[0.18em] uppercase">Write to us</h2>
              <p className="mt-2 text-muted-foreground">
                <a href="mailto:care@vedaarnastudio.com" className="link-underline">
                  care@vedaarnastudio.com
                </a>
              </p>
              <p className="mt-1 text-muted-foreground">
                <a href="mailto:vedaarnastudio@gmail.com" className="link-underline">
                  vedaarnastudio@gmail.com
                </a>
              </p>
            </div>
            <div>
              <h2 className="text-xs tracking-[0.18em] uppercase">Call or WhatsApp</h2>
              <p className="mt-2 text-muted-foreground">
                <a href="tel:+919910201612" className="link-underline">+91 99102 01612</a>
                {", "}
                <a href="tel:+919818081910" className="link-underline">+91 98180 81910</a>
              </p>
              <p className="text-muted-foreground">Mon–Sat, 10am – 6pm IST</p>
            </div>
            <div>
              <h2 className="text-xs tracking-[0.18em] uppercase">Studio</h2>
              <p className="mt-2 text-muted-foreground">
                525, Lower Ground Floor, Sector 27,<br />
                Gurugram, Haryana 122009, India
              </p>
            </div>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div>
              <label htmlFor="name" className="text-[11px] tracking-[0.16em] uppercase">
                Name
              </label>
              <input
                id="name"
                required
                className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-[11px] tracking-[0.16em] uppercase">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-[11px] tracking-[0.16em] uppercase">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
            </div>
            <button className="w-full bg-foreground py-3.5 text-[11px] tracking-[0.24em] text-background uppercase">
              Send message
            </button>
            {sent && (
              <p className="text-sm text-muted-foreground">
                Thank you — our care team will reply within 24 hours.
              </p>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
