import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/lib/shop-data";

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

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
      <Marquee />

      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2 md:px-10">
        <button
          className="justify-self-start md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <span className="hidden md:block" />

        <Link to="/" className="flex items-center justify-self-center" aria-label="VedAarna Studio">
          <img
            src="/logo.svg"
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

      {open && (
        <nav className="border-t border-border md:hidden">
          <ul className="flex flex-col px-6 py-2">
            {navLinks.map((l) => (
              <li key={l.slug} className="border-b border-border/60 last:border-0">
                <Link
                  to="/collections/$slug"
                  params={{ slug: l.slug }}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-xs tracking-[0.13em] uppercase"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 pb-2">
              <Link to="/about" onClick={() => setOpen(false)} className="text-xs tracking-[0.13em] uppercase">
                Our Story
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
