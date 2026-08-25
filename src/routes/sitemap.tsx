import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { collections } from "@/lib/shop-data";

const information = [
  { label: "About Us", to: "/about" },
  { label: "My Account", to: "/account" },
  { label: "Track Order", to: "/track-order" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Delivery Information", to: "/delivery-information" },
  { label: "Refund, Exchanges and Returns", to: "/returns-exchanges" },
  { label: "Terms of Use", to: "/terms-of-use" },
  { label: "FAQ", to: "/faq" },
  { label: "Franchise Enquiry", to: "/franchise-enquiry" },
  { label: "Wholesale Enquiry", to: "/wholesale-enquiry" },
] as const;

const discover = [
  { label: "Blog", to: "/blog" },
  { label: "Celebrities in VedAarna", to: "/celebrities" },
  { label: "Women of VedAarna", to: "/women-of-vedaarna" },
  { label: "Sitemap", to: "/sitemap" },
  { label: "Refer & Earn", to: "/refer-earn" },
  { label: "Become a Stockist", to: "/become-a-stockist" },
] as const;

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — VedAarna Studio" },
      {
        name: "description",
        content:
          "Every page on VedAarna Studio in one place: collections, information pages and brand stories.",
      },
      { property: "og:title", content: "Sitemap — VedAarna Studio" },
      {
        property: "og:description",
        content: "Browse all collections and pages on VedAarna Studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Discover" title="Sitemap" wide>
      <div className="grid gap-12 md:grid-cols-3">
        <div>
          <h2 className="text-xs tracking-[0.18em] uppercase">Shop</h2>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="link-underline">
                Home
              </Link>
            </li>
            {collections.map((c) => (
              <li key={c.slug}>
                <Link to="/collections/$slug" params={{ slug: c.slug }} className="link-underline">
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/collections/$slug" params={{ slug: "sale" }} className="link-underline">
                Sale
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs tracking-[0.18em] uppercase">Information</h2>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {information.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs tracking-[0.18em] uppercase">Discover</h2>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {discover.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-underline">
                  {l.label}
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
      </div>
    </PageShell>
  ),
});
