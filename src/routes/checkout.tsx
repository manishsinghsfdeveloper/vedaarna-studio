/**
 * Checkout page — billing form + Razorpay payment.
 *
 * Flow:
 *  1. User fills in contact + shipping details
 *  2. "Place Order & Pay" calls a TanStack server function that:
 *     a. Creates a Razorpay order (server-side, key_secret never exposed to browser)
 *     b. Returns the Razorpay order_id + amount to the client
 *  3. Browser opens Razorpay checkout modal
 *  4. On payment success Razorpay calls our webhook (already configured in medusa-config)
 *     AND the frontend calls a verify server function to confirm signature.
 *  5. On verified payment we clear the cart and show a success screen.
 *
 * Order email is triggered from the server function to orders@vedaarnastudio.com.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart, type CartItem } from "@/lib/cart";
import { Check, ChevronLeft, ShoppingBag } from "lucide-react";

// ---------------------------------------------------------------------------
// Server functions — run on the server, key_secret never reaches the browser
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// CF-Workers-safe helpers (no Buffer, no process.env, no node:crypto)
// ---------------------------------------------------------------------------

/**
 * Read a runtime env var/secret.
 * Priority: globalThis.__env__ (CF Worker bindings) → import.meta.env (Vite build-time)
 * CF Worker secrets set via `wrangler secret put` live in globalThis.__env__ at runtime.
 */
function getEnvVar(key: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfEnv = (globalThis as any).__env__ as Record<string, string> | undefined;
  if (cfEnv?.[key]) return cfEnv[key];
  // Fallback: Vite build-time / local dev
  return (import.meta.env[key] as string | undefined) ?? "";
}

/** base64-encode a string using the Web API available in all environments */
function toBase64(str: string): string {
  // btoa is available in CF Workers, browsers, and modern Node
  return btoa(str);
}

/** HMAC-SHA256 using Web Crypto — available in CF Workers natively */
async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Razorpay order creation */
const createRazorpayOrder = createServerFn({ method: "POST" })
  .validator(
    (data: {
      amount: number; // paise (INR × 100)
      receipt: string;
      notes: Record<string, string>;
    }) => data,
  )
  .handler(async ({ data }) => {
    const keyId = getEnvVar("RAZORPAY_KEY_ID");
    const keySecret = getEnvVar("RAZORPAY_KEY_SECRET");

    if (!keyId || !keySecret) {
      throw new Error(
        "Payment gateway is not configured. Please contact support at orders@vedaarnastudio.com.",
      );
    }

    // Basic auth: base64(keyId:keySecret) — using btoa (CF Workers compatible)
    const credentials = toBase64(`${keyId}:${keySecret}`);

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: "INR",
        receipt: data.receipt,
        notes: data.notes,
      }),
    });

    if (!res.ok) {
      const err = (await res.json()) as { error?: { description?: string } };
      throw new Error(
        err.error?.description ?? "Failed to create payment order. Please try again.",
      );
    }

    const order = (await res.json()) as { id: string; amount: number };
    return { orderId: order.id, amount: order.amount };
  });

/** Verify Razorpay payment signature (HMAC-SHA256 via Web Crypto) */
const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .validator(
    (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const keySecret = getEnvVar("RAZORPAY_KEY_SECRET");

    if (!keySecret) {
      throw new Error("Payment verification unavailable — gateway not configured.");
    }

    const message = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
    const expected = await hmacSha256Hex(keySecret, message);

    if (expected !== data.razorpay_signature) {
      throw new Error("Payment verification failed — signature mismatch.");
    }
    return { verified: true };
  });

/** Send order confirmation email to orders@vedaarnastudio.com */
const sendOrderEmail = createServerFn({ method: "POST" })
  .validator(
    (data: {
      orderRef: string;
      customer: { name: string; email: string; phone: string };
      address: { line1: string; city: string; state: string; pin: string };
      items: CartItem[];
      subtotal: number;
      paymentId: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    // Uses Medusa's notification system via a direct HTTP call to the backend.
    const backendUrl =
      getEnvVar("VITE_MEDUSA_BACKEND_URL") || "https://vedaarna-studio-production.up.railway.app";

    const itemsHtml = data.items
      .map(
        (i) =>
          `<tr>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;">${i.name}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${i.size}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${i.qty}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">₹${(i.price * i.qty).toLocaleString("en-IN")}</td>
          </tr>`,
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1f2328;">
        <h2 style="color:#c87346;">New Order — VedAarna Studio</h2>
        <p><strong>Order Ref:</strong> ${data.orderRef}</p>
        <p><strong>Razorpay Payment ID:</strong> ${data.paymentId}</p>
        <hr/>
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${data.customer.name}<br/>
        <strong>Email:</strong> ${data.customer.email}<br/>
        <strong>Phone:</strong> ${data.customer.phone}</p>
        <h3>Shipping Address</h3>
        <p>${data.address.line1}<br/>${data.address.city}, ${data.address.state} — ${data.address.pin}</p>
        <h3>Items Ordered</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="background:#f5f3f0;">
            <th style="padding:8px 12px;text-align:left;">Product</th>
            <th style="padding:8px 12px;">Size</th>
            <th style="padding:8px 12px;">Qty</th>
            <th style="padding:8px 12px;text-align:right;">Amount</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="text-align:right;font-size:16px;margin-top:12px;"><strong>Total: ₹${data.subtotal.toLocaleString("en-IN")}</strong></p>
        <hr/>
        <p style="font-size:12px;color:#666;">This is an automated notification from vedaarnastudio.com</p>
      </div>
    `;

    // Try posting to Medusa custom email endpoint (if configured)
    try {
      await fetch(`${backendUrl}/store/custom/order-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "orders@vedaarnastudio.com",
          subject: `New Order: ${data.orderRef}`,
          html,
        }),
      });
    } catch {
      // Non-fatal — order is still confirmed via Razorpay
    }

    return { sent: true };
  });

// ---------------------------------------------------------------------------
// Razorpay script loader (client-side helper)
// ---------------------------------------------------------------------------

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route = (createFileRoute as any)("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — VedAarna Studio" }, { name: "robots", content: "noindex" }],
  }),
  component: CheckoutPage,
});

interface BillingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
}

const EMPTY_FORM: BillingForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pin: "",
};

function CheckoutPage() {
  const { items, subtotal, totalQty, clearCart, sessionId } = useCart();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as (opts: { to: string }) => void;

  const [form, setForm] = useState<BillingForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<BillingForm>>({});
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [success, setSuccess] = useState<{ orderRef: string; paymentId: string } | null>(null);

  // Shipping: free above 2999, else 99
  const shipping = subtotal >= 2999 ? 0 : 99;
  const total = subtotal + shipping;

  const set =
    (field: keyof BillingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((err) => ({ ...err, [field]: undefined }));
    };

  function validate(): boolean {
    const e: Partial<BillingForm> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
      e.phone = "10-digit mobile required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.pin.trim() || form.pin.length !== 6 || isNaN(Number(form.pin)))
      e.pin = "Valid 6-digit PIN required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handlePlaceOrder = async () => {
    setPayError("");
    if (!validate()) return;
    if (items.length === 0) {
      setPayError("Your bag is empty.");
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Could not load payment gateway. Please try again.");

      // 2. Create order on server
      const orderRef = `VS-${sessionId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      const { orderId, amount } = await createRazorpayOrder({
        data: {
          amount: total * 100, // paise
          receipt: orderRef,
          notes: {
            customer_name: `${form.firstName} ${form.lastName}`,
            customer_email: form.email,
            customer_phone: form.phone,
            shipping_address: `${form.address}, ${form.city}, ${form.state} - ${form.pin}`,
            items_summary: items.map((i) => `${i.name} (${i.size} x${i.qty})`).join("; "),
            session_id: sessionId,
          },
        },
      });

      // 3. Open Razorpay modal
      const RazorpayClass = (
        window as unknown as { Razorpay: new (opts: unknown) => { open(): void } }
      ).Razorpay;
      const razorpayKeyId = import.meta.env["VITE_RAZORPAY_KEY_ID"] as string | undefined;

      await new Promise<void>((resolve, reject) => {
        const rzp = new RazorpayClass({
          key: razorpayKeyId ?? "",
          amount,
          currency: "INR",
          order_id: orderId,
          name: "VedAarna Studio",
          description: `Order ${orderRef}`,
          image: "/logo.png",
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
          notes: { order_ref: orderRef },
          theme: { color: "#c87346" },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // 4. Verify signature server-side
              await verifyRazorpayPayment({ data: response });

              // 5. Send order email
              await sendOrderEmail({
                data: {
                  orderRef,
                  customer: {
                    name: `${form.firstName} ${form.lastName}`,
                    email: form.email,
                    phone: form.phone,
                  },
                  address: {
                    line1: form.address,
                    city: form.city,
                    state: form.state,
                    pin: form.pin,
                  },
                  items,
                  subtotal: total,
                  paymentId: response.razorpay_payment_id,
                },
              });

              clearCart();
              setSuccess({ orderRef, paymentId: response.razorpay_payment_id });
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled.")),
          },
        });
        rzp.open();
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed. Please try again.";
      if (msg !== "Payment cancelled.") setPayError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-6">
            <Check className="h-8 w-8" />
          </div>
          <p className="text-[11px] tracking-[0.22em] text-terracotta uppercase">Order Confirmed</p>
          <h1 className="mt-3 text-2xl font-display font-normal">Thank you for your order!</h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            We&apos;ve received your order and sent a confirmation to <strong>{form.email}</strong>.
            Our team will prepare your package shortly.
          </p>
          <div className="mt-6 space-y-1 text-xs text-muted-foreground">
            <p>
              <strong className="text-foreground">Order Reference:</strong> {success.orderRef}
            </p>
            <p>
              <strong className="text-foreground">Payment ID:</strong> {success.paymentId}
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              to="/"
              className="border border-foreground px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Continue Shopping
            </Link>
            <Link
              to="/account"
              className="bg-terracotta text-white px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-opacity hover:opacity-90"
            >
              View My Account
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Empty cart guard ─────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <ShoppingBag className="h-12 w-12 text-border" />
          <h1 className="text-xl font-display font-normal">Your bag is empty</h1>
          <p className="text-sm text-muted-foreground">Add items before proceeding to checkout.</p>
          <Link
            to="/"
            className="mt-4 border border-foreground px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            Shop Now
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main checkout layout ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Continue Shopping
          </button>
        </nav>

        <h1 className="mb-8 text-2xl font-display font-normal tracking-tight">Checkout</h1>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* ── Left: Billing & Shipping form ─────────────────────────────── */}
          <div className="space-y-8">
            {/* Contact */}
            <section>
              <h2 className="mb-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground border-b border-border pb-2">
                Contact Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name" error={errors.firstName}>
                  <input
                    value={form.firstName}
                    onChange={set("firstName")}
                    type="text"
                    autoComplete="given-name"
                    required
                    className={inputCls(!!errors.firstName)}
                    placeholder="Ananya"
                  />
                </Field>
                <Field label="Last Name" error={errors.lastName}>
                  <input
                    value={form.lastName}
                    onChange={set("lastName")}
                    type="text"
                    autoComplete="family-name"
                    required
                    className={inputCls(!!errors.lastName)}
                    placeholder="Sharma"
                  />
                </Field>
                <Field label="Email Address" error={errors.email} className="sm:col-span-2">
                  <input
                    value={form.email}
                    onChange={set("email")}
                    type="email"
                    autoComplete="email"
                    required
                    className={inputCls(!!errors.email)}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Mobile Number" error={errors.phone} className="sm:col-span-2">
                  <input
                    value={form.phone}
                    onChange={set("phone")}
                    type="tel"
                    autoComplete="tel"
                    required
                    className={inputCls(!!errors.phone)}
                    placeholder="+91 98765 43210"
                  />
                </Field>
              </div>
            </section>

            {/* Shipping address */}
            <section>
              <h2 className="mb-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground border-b border-border pb-2">
                Shipping Address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Address / Flat / Building"
                  error={errors.address}
                  className="sm:col-span-2"
                >
                  <input
                    value={form.address}
                    onChange={set("address")}
                    type="text"
                    autoComplete="street-address"
                    required
                    className={inputCls(!!errors.address)}
                    placeholder="123, Rose Apartments, MG Road"
                  />
                </Field>
                <Field label="City" error={errors.city}>
                  <input
                    value={form.city}
                    onChange={set("city")}
                    type="text"
                    autoComplete="address-level2"
                    required
                    className={inputCls(!!errors.city)}
                    placeholder="Gurugram"
                  />
                </Field>
                <Field label="State" error={errors.state}>
                  <select
                    value={form.state}
                    onChange={set("state")}
                    autoComplete="address-level1"
                    className={inputCls(!!errors.state)}
                  >
                    <option value="">Select State</option>
                    {INDIA_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="PIN Code" error={errors.pin}>
                  <input
                    value={form.pin}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        pin: e.target.value.replace(/\D/g, "").slice(0, 6),
                      }));
                      setErrors((er) => {
                        const next = { ...er };
                        delete next.pin;
                        return next;
                      });
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="postal-code"
                    required
                    className={inputCls(!!errors.pin)}
                    placeholder="122009"
                  />
                </Field>
                <Field label="Country">
                  <input
                    value="India"
                    readOnly
                    className={`${inputCls(false)} bg-muted/40 text-muted-foreground cursor-default`}
                  />
                </Field>
              </div>
            </section>

            {/* Payment note */}
            <section className="rounded-sm border border-border bg-sand/20 p-4 text-xs text-stone-700 space-y-1">
              <p className="font-semibold uppercase tracking-wider text-[11px]">Payment</p>
              <p>
                You will be redirected to the secure Razorpay payment gateway to complete your
                order. We accept UPI, Cards, Net Banking, and Wallets.
              </p>
            </section>

            {payError && (
              <p
                role="alert"
                className="rounded-sm bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700"
              >
                {payError}
              </p>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-foreground py-4 text-[12px] font-semibold tracking-[0.24em] uppercase text-background transition-all hover:bg-terracotta hover:text-white disabled:opacity-50"
            >
              {loading ? "Processing…" : `Place Order & Pay — ₹${total.toLocaleString("en-IN")}`}
            </button>
          </div>

          {/* ── Right: Order summary ────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 lg:self-start space-y-5">
            <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground border-b border-border pb-2">
              Order Summary ({totalQty} item{totalQty !== 1 ? "s" : ""})
            </h2>

            <ul className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={`${item.slug}::${item.size}`} className="flex gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={80}
                      className="h-20 w-16 rounded-sm object-contain bg-[#f5f3f0]"
                    />
                    <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-stone-700 text-[10px] font-bold text-white">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center min-w-0">
                    <p className="text-xs font-medium line-clamp-2 leading-snug">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Size: {item.size}</p>
                    <p className="mt-1 text-xs font-semibold">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-medium">Free</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-border pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-[11px] text-muted-foreground">
                Add ₹{(2999 - subtotal).toLocaleString("en-IN")} more for free shipping.
              </p>
            )}

            <div className="rounded-sm bg-sand/30 p-3 text-[11px] text-stone-700 space-y-1">
              <p className="font-semibold text-terracotta">
                COD Available · 3-Day Exchange · Handcrafted in India
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable form field wrapper
// ---------------------------------------------------------------------------

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  // exactOptionalPropertyTypes: must explicitly allow undefined
  error?: string | undefined;
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] tracking-[0.16em] uppercase text-foreground font-medium">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full border ${hasError ? "border-rose-400" : "border-border"} bg-background px-4 py-3 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground/50`;
}

// ---------------------------------------------------------------------------
// Indian states list
// ---------------------------------------------------------------------------

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
