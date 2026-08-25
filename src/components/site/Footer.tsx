import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";

const shopLinks = [
  { label: "New Arrivals", to: "new-arrivals" },
  { label: "Kurta & Suit Sets", to: "kurta-suit-sets" },
  { label: "Dresses", to: "dresses" },
  { label: "Sarees", to: "sarees" },
  { label: "Menswear", to: "menswear" },
];

const informationLinks = [
  { label: "About Us", to: "/about" },
  { label: "My Account", to: "/account" },
  { label: "Track Order", to: "/track-order" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Delivery Information", to: "/delivery-information" },
  { label: "Refund, Exchanges and Returns", to: "/returns-exchanges" },
  { label: "Terms of use", to: "/terms-of-use" },
  { label: "Faq", to: "/faq" },
  { label: "Franchise Enquiry", to: "/franchise-enquiry" },
  { label: "Wholesale Enquiry", to: "/wholesale-enquiry" },
] as const;

const discoverLinks = [
  { label: "Blog", to: "/blog" },
  { label: "Celebrities in VedAarna", to: "/celebrities" },
  { label: "Women Of VedAarna", to: "/women-of-vedaarna" },
  { label: "Sitemap", to: "/sitemap" },
  { label: "Refer & Earn", to: "/refer-earn" },
  { label: "Become a Stockist", to: "/become-a-stockist" },
] as const;

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
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 md:grid-cols-3 md:gap-10 lg:grid-cols-6 md:px-10">
        {/* Column 1 — Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
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

        {/* Column 3 — Information */}
        <div>
          <h4 className="text-xs tracking-[0.18em] uppercase">Information</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {informationLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Discover */}
        <div>
          <h4 className="text-xs tracking-[0.18em] uppercase">Discover</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {discoverLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5 — Customer Service */}
        <div>
          <h4 className="text-xs tracking-[0.18em] uppercase">Customer Service</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {customerService.map((h) => (
              <li key={h}>
                <Link to="/contact" className="link-underline">
                  {h}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/contact" className="link-underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 6 — Stay Connected */}
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
