import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/shop-data";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQty, totalQty, subtotal } = useCart();
  const navigate = useNavigate();

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal
        aria-label="Shopping bag"
        className={`fixed right-0 top-0 z-[301] flex h-full w-full max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-[0.12em] uppercase">My Bag</span>
            {totalQty > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-terracotta text-[10px] font-bold text-white">
                {totalQty}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <ShoppingBag className="h-12 w-12 text-border" />
              <p className="text-sm font-medium">Your bag is empty</p>
              <p className="text-xs text-muted-foreground">
                Browse our collections and add something beautiful.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 border border-foreground px-6 py-2.5 text-[11px] tracking-[0.18em] uppercase transition-colors hover:bg-foreground hover:text-background"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border/60 px-5">
              {items.map((item) => (
                <li key={`${item.slug}::${item.size}`} className="flex gap-4 py-5">
                  {/* Product image */}
                  <Link
                    to="/products/$slug"
                    params={{ slug: item.slug }}
                    onClick={onClose}
                    className="shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={100}
                      className="h-24 w-20 rounded-sm object-contain bg-[#f5f3f0]"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          to="/products/$slug"
                          params={{ slug: item.slug }}
                          onClick={onClose}
                          className="text-xs font-medium leading-snug line-clamp-2 hover:text-terracotta transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Size: {item.size}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug, item.size)}
                        aria-label="Remove item"
                        className="shrink-0 text-muted-foreground hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty stepper */}
                      <div className="flex items-center gap-2 border border-border rounded-sm">
                        <button
                          type="button"
                          onClick={() => updateQty(item.slug, item.size, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-xs font-medium">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.slug, item.size, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — subtotal + checkout */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal ({totalQty} item{totalQty !== 1 ? "s" : ""})
              </span>
              <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Shipping &amp; taxes calculated at checkout. Free delivery on orders above ₹2,999.
            </p>

            <button
              type="button"
              onClick={() => {
                onClose();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                navigate({ to: "/checkout" as any });
              }}
              className="w-full bg-foreground py-4 text-[11px] font-semibold tracking-[0.24em] text-background uppercase transition-all hover:bg-terracotta hover:text-white"
            >
              Proceed to Checkout — {formatINR(subtotal)}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full border border-border py-3 text-[11px] tracking-[0.18em] uppercase text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}
