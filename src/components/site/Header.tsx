import { Link } from "@tanstack/react-router";
import { Menu, Minus, Plus, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { navLinks } from "@/lib/shop-data";

// Mobile nav: top-level sections with optional sub-items (expand/collapse)
const mobileNav = [
  { label: "NEW ARRIVALS", slug: "new-arrivals", children: [] },
  {
    label: "INDIAN WEAR",
    slug: null,
    children: [
      { label: "Kurta & Suit Sets", slug: "kurta-suit-sets" },
      { label: "Sarees", slug: "sarees" },
    ],
  },
  {
    label: "WESTERN WEAR",
    slug: null,
    children: [
      { label: "Dresses", slug: "dresses" },
      { label: "Co-Ord Sets", slug: "co-ords" },
    ],
  },
  {
    label: "MENSWEAR",
    slug: "menswear",
    children: [],
  },
  { label: "SALE", slug: "sale", children: [] },
  { label: "OUR STORY", slug: null, to: "/about" as const, children: [] },
] as const;

function Marquee() {
  const items = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="overflow-hidden bg-blush py-2 text-secondary-foreground">
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {items.map((i) => (
              <span
                key={`${dup}-${i}`}
                className="whitespace-nowrap px-10 text-[11px] tracking-[0.14em] uppercase"
              >
                Use code VED20 to get 20% off!
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Rendered via portal so it sits outside <header>'s stacking context
// and can truly cover the full viewport including the hero carousel
function MobileDrawer({
  expanded,
  onToggle,
  onClose,
}: {
  expanded: string | null;
  onToggle: (label: string) => void;
  onClose: () => void;
}) {
  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-background"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Drawer header — mirrors the main header bar */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-border px-4 py-2">
        <button
          className="justify-self-start"
          aria-label="Close menu"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
        <Link
          to="/"
          className="flex items-center justify-self-center"
          onClick={onClose}
          aria-label="VedAarna Studio"
        >
          <img src="/logo.png" alt="VedAarna Studio" className="h-16 w-auto" draggable={false} />
        </Link>
        <button aria-label="Cart" className="relative justify-self-end">
          <ShoppingBag className="size-5" />
          <span className="absolute -top-2 -right-2 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">
            0
          </span>
        </button>
      </div>

      {/* Scrollable nav items */}
      <ul className="flex-1 overflow-y-auto">
        {mobileNav.map((item) => {
          const hasChildren = item.children.length > 0;
          const isExpanded = expanded === item.label;

          return (
            <li key={item.label} className="border-b border-border/60">
              <div className="flex items-center justify-between px-6 py-4">
                {hasChildren ? (
                  <button
                    className="flex-1 text-left text-xs font-medium tracking-[0.13em] uppercase"
                    onClick={() => onToggle(item.label)}
                  >
                    {item.label}
                  </button>
                ) : "to" in item && item.to ? (
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="flex-1 text-xs font-medium tracking-[0.13em] uppercase"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    to="/collections/$slug"
                    params={{ slug: item.slug! }}
                    onClick={onClose}
                    className="flex-1 text-xs font-medium tracking-[0.13em] uppercase"
                  >
                    {item.label}
                  </Link>
                )}

                {hasChildren && (
                  <button
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    onClick={() => onToggle(item.label)}
                    className="ml-4 text-foreground/60"
                  >
                    {isExpanded ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </button>
                )}
              </div>

              {hasChildren && isExpanded && (
                <ul className="border-t border-border/40 bg-secondary/30 pb-2">
                  {item.children.map((child) => (
                    <li key={child.slug} className="border-b border-border/30 last:border-0">
                      <Link
                        to="/collections/$slug"
                        params={{ slug: child.slug }}
                        onClick={onClose}
                        className="block px-10 py-3 text-xs tracking-[0.1em] text-muted-foreground uppercase"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>,
    document.body
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSection = (label: string) =>
    setExpanded((v) => (v === label ? null : label));

  const closeAll = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
        <Marquee />

        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2 md:px-10">
          <button
            className="justify-self-start md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-5" />
          </button>
          <span className="hidden md:block" />

          <Link to="/" className="flex items-center justify-self-center" aria-label="VedAarna Studio">
            <img
              src="/logo.png"
              alt="VedAarna Studio"
              className="h-16 w-auto md:h-20"
              draggable={false}
            />
          </Link>

          <div className="flex items-center gap-5 justify-self-end">
            <button aria-label="Search" className="hidden md:block">
              <Search className="size-5" />
            </button>
            <Link to="/contact" aria-label="Account" className="hidden md:block">
              <User className="size-5" />
            </Link>
            <button aria-label="Cart" className="relative">
              <ShoppingBag className="size-5" />
              <span className="absolute -top-2 -right-2 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden border-t border-border md:block">
          <ul className="flex items-center justify-center gap-9 py-3.5">
            {navLinks.map((l) => (
              <li key={l.slug}>
                <Link
                  to="/collections/$slug"
                  params={{ slug: l.slug }}
                  className="link-underline text-[11.5px] font-medium tracking-[0.13em] uppercase"
                  activeProps={{ className: "text-primary" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile nav rendered via portal — sits above everything including the sticky header */}
      {open && (
        <MobileDrawer
          expanded={expanded}
          onToggle={toggleSection}
          onClose={closeAll}
        />
      )}
    </>
  );
}
