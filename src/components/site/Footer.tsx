import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", to: "new-arrivals" },
      { label: "Kurta & Suit Sets", to: "kurta-suit-sets" },
      { label: "Dresses", to: "dresses" },
      { label: "Sarees", to: "sarees" },
      { label: "Menswear", to: "menswear" },
    ],
  },
];

const help = [
  "Shipping Policy",
  "Return & Exchange",
  "Track Your Order",
  "Size Guide",
  "FAQs",
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-sand/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 md:px-10">
        <div>
          <h3 className="text-xl tracking-[0.25em] uppercase">VedAarna</h3>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Handcrafted, artisan-made clothing for the everyday and the extraordinary.
            Made in India, made to be lived in.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="#" aria-label="Instagram"><Instagram className="size-4.5" /></a>
            <a href="#" aria-label="Facebook"><Facebook className="size-4.5" /></a>
            <a href="#" aria-label="YouTube"><Youtube className="size-4.5" /></a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs tracking-[0.18em] uppercase">{col.title}</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to="/collections/$slug" params={{ slug: l.to }} className="link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-xs tracking-[0.18em] uppercase">Help</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {help.map((h) => (
              <li key={h}>
                <Link to="/contact" className="link-underline">{h}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.18em] uppercase">Join the studio list</h4>
          <p className="mt-5 text-sm text-muted-foreground">
            Be first to know about new collections and private sales.
          </p>
          <form
            className="mt-5 flex border-b border-foreground/30"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="text-xs tracking-[0.18em] uppercase">Join</button>
          </form>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="link-underline">Our Story</Link></li>
            <li><Link to="/contact" className="link-underline">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 px-6 py-6 text-center text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
        © {new Date().getFullYear()} VedAarna Studio — All rights reserved
      </div>
    </footer>
  );
}
