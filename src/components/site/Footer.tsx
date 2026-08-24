import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";

const shopLinks = [
  { label: "New Arrivals", to: "new-arrivals" },
  { label: "Kurta & Suit Sets", to: "kurta-suit-sets" },
  { label: "Dresses", to: "dresses" },
  { label: "Sarees", to: "sarees" },
  { label: "Menswear", to: "menswear" },
];

const customerService = [
  "Shipping Policy",
  "Return & Exchange",
  "Track Your Order",
  "Size Guide",
  "FAQs",
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/vedaarnastudio",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/p/VedAarna-Studio-61580045627541/",
    icon: Facebook,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCzfLfOudodCBC6v55aTKqQA",
    icon: Youtube,
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-sand/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 md:gap-10 md:px-10">

        {/* Column 1 — Brand */}
        <div>
          <h3 className="text-xl tracking-[0.25em] uppercase">VedAarna Studio</h3>
          <p className="mt-2 text-xs tracking-[0.14em] text-muted-foreground italic">
            A Legacy in every stitch...!!!
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Where timeless craftsmanship meets contemporary elegance. Each creation is thoughtfully
            designed, meticulously tailored, and beautifully brought to life—honouring the artistry
            of Indian couture and the individuality of the woman who wears it.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Made with artistry. Crafted with passion. Created to become a part of your story.
          </p>
        </div>

        {/* Column 2 — Shop */}
        <div>
          <h4 className="text-xs tracking-[0.18em] uppercase">Shop</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {shopLinks.map((l) => (
              <li key={l.to}>
                <Link to="/collections/$slug" params={{ slug: l.to }} className="link-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Customer Service */}
        <div>
          <h4 className="text-xs tracking-[0.18em] uppercase">Customer Service</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {customerService.map((h) => (
              <li key={h}>
                <Link to="/contact" className="link-underline">{h}</Link>
              </li>
            ))}
            <li><Link to="/about" className="link-underline">Our Story</Link></li>
            <li><Link to="/contact" className="link-underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 4 — Stay Connected */}
        <div>
          <h4 className="text-xs tracking-[0.18em] uppercase">Stay Connected</h4>
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

          <div className="mt-6">
            <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase mb-3">
              Follow us
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-border/70 px-6 py-6 text-center text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
        © {new Date().getFullYear()} VedAarna Studio — All rights reserved
      </div>
    </footer>
  );
}
