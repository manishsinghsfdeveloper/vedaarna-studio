import {
  createFileRoute,
  Link,
  notFound,
  useNavigate as useNavigateBase,
} from "@tanstack/react-router";
// Route /checkout is generated on next build — cast navigate to accept any string until then
const useNavigate = () => useNavigateBase() as (opts: { to: string }) => void;
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { formatINR, getProduct, getProducts } from "@/lib/shop-data";
import { useCart } from "@/lib/cart";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Check,
  Ruler,
  ZoomIn,
  ZoomOut,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const [product, related] = await Promise.all([getProduct(params.slug), getProducts()]);
    if (!product) throw notFound();
    return { product, related: related.filter((p) => p.slug !== params.slug).slice(0, 4) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — VedAarna Studio" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — VedAarna Studio` },
        {
          name: "description",
          content: `${product.name} in ${product.fabric}. Handcrafted by VedAarna Studio artisans. Sizes ${product.sizes.join(", ")}.`,
        },
        { property: "og:title", content: `${product.name} — VedAarna Studio` },
        { property: "og:description", content: `Handcrafted ${product.fabric} — made in India.` },
      ],
    };
  },
  component: ProductPage,
});

// Size measurement chart data in Inches and Centimeters
const SIZE_CHART_INCHES = [
  { size: "XS", bust: "34", waist: "28", hip: "38", length: "46" },
  { size: "S", bust: "36", waist: "30", hip: "40", length: "46" },
  { size: "M", bust: "38", waist: "32", hip: "42", length: "46" },
  { size: "L", bust: "40", waist: "34", hip: "44", length: "47" },
  { size: "XL", bust: "42", waist: "36", hip: "46", length: "47" },
  { size: "XXL", bust: "44", waist: "38", hip: "48", length: "47" },
  { size: "3XL", bust: "46", waist: "40", hip: "50", length: "48" },
];

const SIZE_CHART_CMS = [
  { size: "XS", bust: "86.4", waist: "71.1", hip: "96.5", length: "116.8" },
  { size: "S", bust: "91.4", waist: "76.2", hip: "101.6", length: "116.8" },
  { size: "M", bust: "96.5", waist: "81.3", hip: "106.7", length: "116.8" },
  { size: "L", bust: "101.6", waist: "86.4", hip: "111.8", length: "119.4" },
  { size: "XL", bust: "106.7", waist: "91.4", hip: "116.8", length: "119.4" },
  { size: "XXL", bust: "111.8", waist: "96.5", hip: "121.9", length: "119.4" },
  { size: "3XL", bust: "116.8", waist: "101.6", hip: "127.0", length: "121.9" },
];

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Available sizes — if not specified, all sizes are available
  const availableSizes = product.availableSizes ?? product.sizes;

  // Default selection: first available size, or first size if none available
  const firstAvailable =
    product.sizes.find((s) => availableSizes.includes(s)) ?? product.sizes[0] ?? "";
  const [size, setSize] = useState(firstAvailable);

  // Add to bag state
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Gallery images list
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image, product.hover].filter(Boolean);

  // Lightbox Zoom State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Modals & Drawers
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<"in" | "cm">("in");
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Pincode Checker State
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "valid" | "invalid">("idle");

  // Active Info Tab State
  const [activeTab, setActiveTab] = useState<"description" | "care" | "details">("description");

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Add to bag handler
  const handleAddToBag = () => {
    if (!size || !availableSizes.includes(size)) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000);
      return;
    }
    setSizeError(false);
    addItem({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  // Buy It Now: add to bag then go straight to checkout
  const handleBuyNow = () => {
    if (!size || !availableSizes.includes(size)) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000);
      return;
    }
    setSizeError(false);
    addItem({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size,
    });
    navigate({ to: "/checkout" });
  };

  // Pincode validation handler
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6 || isNaN(Number(pincode))) {
      setPincodeStatus("invalid");
      return;
    }
    setPincodeStatus("valid");
  };

  // Review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerEmail || !reviewBody) return;
    setReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setReviewSubmitted(false);
      setReviewTitle("");
      setReviewBody("");
      setReviewerName("");
      setReviewerEmail("");
    }, 2200);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-terracotta/20">
      <Header />

      {/* ─────────────────────────────────────────────────────────────────────────
          MOBILE LAYOUT  : single column — hero image → product info → more images
          DESKTOP LAYOUT : two-column side-by-side (lg:grid-cols-12)
          ───────────────────────────────────────────────────────────────────────── */}
      <main className="pb-24 lg:pb-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="px-4 pb-3 pt-3 text-[11px] tracking-[0.1em] text-muted-foreground uppercase md:px-8 lg:px-14"
        >
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="px-1.5 opacity-40">/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        {/* ── Desktop two-column wrapper (hidden on mobile) ── */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:px-14 lg:pb-14">
          {/* ── LEFT: full gallery (desktop only — 7 cols) ── */}
          <div className="hidden lg:block lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  onClick={() => {
                    setLightboxIndex(idx);
                    setZoomLevel(1);
                  }}
                  className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-lg bg-[#f5f3f0] border border-sand/40 hover:border-terracotta/30 transition-all"
                >
                  <img
                    src={src}
                    alt={`${product.name} - View ${idx + 1}`}
                    width={900}
                    height={1125}
                    className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center bg-black/10 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100 lg:flex">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase shadow-sm">
                      <ZoomIn className="h-3.5 w-3.5 text-terracotta" /> Zoom
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: product info (desktop 5 cols, always visible) ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start space-y-5 px-4 md:px-8 lg:px-0">
            {/* MOBILE ONLY: hero image with swipe carousel */}
            <div className="lg:hidden -mx-4">
              <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none">
                {galleryImages.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    onClick={() => {
                      setLightboxIndex(idx);
                      setZoomLevel(1);
                    }}
                    className="relative shrink-0 w-full snap-center aspect-[3/4] bg-[#f5f3f0] cursor-zoom-in"
                  >
                    <img
                      src={src}
                      alt={`${product.name} - View ${idx + 1}`}
                      width={900}
                      height={1125}
                      className="absolute inset-0 h-full w-full object-contain"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white">
                      {idx + 1} / {galleryImages.length}
                    </span>
                  </div>
                ))}
              </div>
              <p className="px-4 pt-2 text-[10px] tracking-wider text-muted-foreground uppercase">
                ← Swipe for more photos · Tap to zoom
              </p>
            </div>

            {/* Brand Tag & Title */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-terracotta uppercase">
                  VedAarna Studio Couture
                </span>
                {/* Review Star Rating Snippet */}
                <button
                  onClick={() => {
                    const el = document.getElementById("reviews-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] underline underline-offset-2">12 reviews</span>
                </button>
              </div>

              <h1 className="mt-2 text-xl font-normal md:text-3xl font-display tracking-tight text-foreground leading-snug">
                {product.name}
              </h1>

              {/* Price & Taxes */}
              <div className="mt-3.5 flex items-baseline gap-3">
                <span className="text-2xl font-light tracking-tight text-foreground">
                  {formatINR(product.price)}
                </span>
                {product.compareAt && (
                  <span className="text-base text-muted-foreground/80 line-through">
                    {formatINR(product.compareAt)}
                  </span>
                )}
                {product.compareAt && (
                  <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-terracotta">
                    Save{" "}
                    {Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] tracking-wide text-muted-foreground">
                Inclusive of all taxes. Free shipping across India.
              </p>
            </div>

            {/* Offers For You — Bunai-style terracotta banner */}
            <div className="overflow-hidden rounded-sm border border-terracotta/30">
              <button
                type="button"
                onClick={() => setIsOffersOpen(!isOffersOpen)}
                className="flex w-full items-center justify-between bg-terracotta px-4 py-3 text-white"
              >
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">
                  Offers For You
                </span>
                <span className="text-lg font-light leading-none">{isOffersOpen ? "−" : "+"}</span>
              </button>

              {isOffersOpen && (
                <div className="space-y-2.5 border border-t-0 border-terracotta/20 bg-background p-3.5 text-xs">
                  <div className="flex items-start justify-between rounded border border-dashed border-terracotta/40 p-2.5">
                    <div>
                      <p className="font-semibold text-stone-900">
                        Get FLAT 10% OFF on First Order
                      </p>
                      <p className="text-[11px] text-stone-600">
                        On cart value above ₹2,499 · Use code at checkout
                      </p>
                    </div>
                    <span className="rounded bg-terracotta px-2 py-1 text-[10px] font-mono font-bold text-white tracking-widest uppercase shrink-0 ml-2">
                      VEDAARNA10
                    </span>
                  </div>
                  <div className="flex items-start justify-between rounded border border-dashed border-terracotta/40 p-2.5">
                    <div>
                      <p className="font-semibold text-stone-900">
                        FLAT ₹500 OFF on Prepaid Orders
                      </p>
                      <p className="text-[11px] text-stone-600">
                        Use on UPI, Net Banking or Card checkout
                      </p>
                    </div>
                    <span className="rounded bg-stone-800 px-2 py-1 text-[10px] font-mono font-bold text-white tracking-widest uppercase shrink-0 ml-2">
                      PREPAID500
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Size Selector with Size Chart Trigger */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground">
                  Select Size: <span className="font-normal text-terracotta ml-1">{size}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  <Ruler className="h-3.5 w-3.5 text-terracotta" />
                  Size Guide & Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => {
                  const isSelected = s === size;
                  const isAvailable = availableSizes.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        if (isAvailable) {
                          setSize(s);
                          setSizeError(false);
                        }
                      }}
                      disabled={!isAvailable}
                      aria-label={isAvailable ? `Size ${s}` : `Size ${s} — out of stock`}
                      className={`relative min-w-[50px] h-11 px-3.5 text-xs font-medium tracking-[0.1em] transition-all duration-200 rounded-sm ${
                        !isAvailable
                          ? "border border-border/40 bg-background text-muted-foreground/40 cursor-not-allowed line-through"
                          : isSelected
                            ? "border-2 border-foreground bg-foreground text-background shadow-xs font-semibold"
                            : "border border-border bg-background hover:border-foreground/70 text-foreground"
                      }`}
                    >
                      {s}
                      {isSelected && isAvailable && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-terracotta text-[8px] text-white">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Size error message */}
              {sizeError && (
                <p className="text-xs text-rose-600 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Please select an available size before adding to bag.
                </p>
              )}
            </div>

            {/* Call To Actions */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleAddToBag}
                className={`w-full rounded-sm py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase shadow-sm transition-all ${
                  addedFeedback
                    ? "bg-emerald-700 text-white"
                    : "bg-foreground text-background hover:bg-terracotta hover:text-white"
                }`}
              >
                {addedFeedback ? "✓ Added to Bag!" : "Add to Bag"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full rounded-sm border border-foreground py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors hover:bg-foreground hover:text-background"
              >
                Buy It Now — Checkout
              </button>
            </div>

            {/* WhatsApp Sizing Concierge */}
            <a
              href={`https://wa.me/919910201612?text=${encodeURIComponent(`Hi VedAarna Studio! I'd like to know more about the fit & styling for: ${product.name}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-sm border border-emerald-200 bg-emerald-50/50 p-3.5 transition-colors hover:bg-emerald-50 group"
            >
              {/* WhatsApp SVG logo */}
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 shrink-0 fill-[#25D366]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-stone-800 group-hover:text-emerald-800 transition-colors">
                  Need help with sizing or styling?
                </p>
                <p className="text-[11px] text-emerald-700 underline underline-offset-2">
                  Message us on WhatsApp →
                </p>
              </div>
              {/* Vedaarna logo text */}
              <span className="hidden sm:block text-[10px] font-display font-medium tracking-widest text-terracotta/70 uppercase shrink-0">
                VedAarna Studio
              </span>
            </a>

            {/* Value Proposition Badges — COD / 3-day exchange / Handcrafted in India */}
            <div className="grid grid-cols-3 gap-2.5 border-y border-border py-4 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="h-4 w-4 text-terracotta" />
                <span className="text-[11px] font-medium tracking-wide text-foreground leading-tight">
                  COD Available
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 border-x border-border">
                <RotateCcw className="h-4 w-4 text-terracotta" />
                <span className="text-[11px] font-medium tracking-wide text-foreground leading-tight">
                  3-Day Exchange
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-terracotta" />
                <span className="text-[11px] font-medium tracking-wide text-foreground leading-tight">
                  Handcrafted in India
                </span>
              </div>
            </div>

            {/* Pincode Delivery Checker */}
            <div className="space-y-2 pt-1">
              <label
                htmlFor="pincode-input"
                className="text-[11px] font-semibold tracking-[0.14em] uppercase text-foreground flex items-center gap-1.5"
              >
                <MapPin className="h-3.5 w-3.5 text-terracotta" /> Check Delivery Availability
              </label>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  id="pincode-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ""));
                    setPincodeStatus("idle");
                  }}
                  placeholder="Enter PIN code"
                  className="min-w-0 flex-1 rounded-sm border border-border px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-sm bg-stone-900 px-4 py-2.5 text-xs font-medium tracking-wide text-white uppercase hover:bg-terracotta transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeStatus === "valid" && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 pt-1">
                  <Check className="h-3.5 w-3.5" /> Delivery available to {pincode} in 3-5 business
                  days. Express Dispatch enabled.
                </p>
              )}
              {pincodeStatus === "invalid" && (
                <p className="text-xs text-rose-600 pt-1">
                  Please enter a valid 6-digit Indian Postal Pincode.
                </p>
              )}
            </div>

            {/* Tabbed Product Details / Care / Manufacturer Info */}
            <div className="border-t border-border pt-5">
              {/* Tab Navigation — flex with equal thirds so all 3 fit on mobile */}
              <div className="flex border-b border-border">
                {(
                  [
                    { key: "description", label: "Details" },
                    { key: "care", label: "Care" },
                    { key: "details", label: "Info" },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 pb-3 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all text-center ${
                      activeTab === key
                        ? "text-terracotta border-b-2 border-terracotta"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="py-4 text-xs leading-relaxed text-muted-foreground">
                {activeTab === "description" && (
                  <div className="space-y-4 text-stone-700">
                    <p className="leading-relaxed">
                      {product.description ||
                        `A refined creation from the VedAarna Studio atelier — a dusky grey rayon shirt with a distinctive diagonal gathered silhouette, paired with sleek black rayon straight pants with pockets.`}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-stone-900 mb-1.5">Top</p>
                        <ul className="space-y-1 list-disc pl-4">
                          <li>Material: Rayon</li>
                          <li>Shirt collar</li>
                          <li>Diagonal gathered detailing</li>
                          <li>Front button closure</li>
                          <li>One side long sleeve</li>
                          <li>Cuff &amp; button detailing on sleeves</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900 mb-1.5">Bottom</p>
                        <ul className="space-y-1 list-disc pl-4">
                          <li>Material: Rayon</li>
                          <li>Elasticated waistband</li>
                          <li>Slip-on closure</li>
                          <li>Both side seam pockets</li>
                          <li>Comfort fit</li>
                        </ul>
                      </div>
                    </div>

                    {/* Measurements table */}
                    <table className="w-full border border-border/60 text-[11px]">
                      <tbody className="divide-y divide-border/60">
                        <tr className="bg-sand/20">
                          <td className="px-3 py-2 font-medium text-stone-600 w-1/2">Top Length</td>
                          <td className="px-3 py-2 font-semibold text-stone-900">34&quot;</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 font-medium text-stone-600">Sleeve Length</td>
                          <td className="px-3 py-2 font-semibold text-stone-900">20&quot;</td>
                        </tr>
                        <tr className="bg-sand/20">
                          <td className="px-3 py-2 font-medium text-stone-600">Bottom Length</td>
                          <td className="px-3 py-2 font-semibold text-stone-900">36&quot;</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="space-y-1.5">
                      <p>
                        <strong className="text-stone-900">Fabric:</strong>{" "}
                        {product.fabric || "Rayon"}
                      </p>
                      <p>
                        <strong className="text-stone-900">Work:</strong> Solid
                      </p>
                      <p>
                        <strong className="text-stone-900">Includes:</strong> Top &amp; Bottom (2
                        Pcs.)
                      </p>
                      <p>
                        <strong className="text-stone-900">Wash Care:</strong> Gentle hand wash
                        separately in cold water with mild detergent. Avoid prolonged soaking.
                      </p>
                      <p>
                        <strong className="text-stone-900">Model Size:</strong> Model is wearing
                        size S
                      </p>
                      <p>
                        <strong className="text-stone-900">Model Height:</strong> 5&apos;7&quot;
                      </p>
                      <p className="text-[11px] text-stone-500 italic">
                        Disclaimer: Product colour may slightly vary due to photographic lighting or
                        your display settings. All measurements noted are garment measurements.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-4 text-stone-700">
                    <div>
                      <p className="font-semibold italic text-stone-800">
                        Wash Care: Gentle hand wash separately in cold water with mild/liquid
                        detergent. Dry clean is also suitable. Do not spray deodorant or perfume
                        directly on the fabric.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-stone-900 text-[11px]">
                        A Note on Handcrafted Products
                      </p>
                      <p>
                        Naturally dyed and artisanal fabrics may experience slight colour transfer
                        during the first few washes or when in contact with skin and light-coloured
                        garments. In the careful process of hand block-printing, embroidery, and
                        stitching, minor variations are an inherent part of the craft. These unique
                        characteristics are the signature of all handmade creations and give each
                        piece its own identity.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-stone-900 text-[11px]">
                        Colour Representation
                      </p>
                      <p>
                        Like most fashion brands, our garments are photographed professionally under
                        controlled studio lighting. Colour perception can vary based on shot angle,
                        lighting conditions, background tones, and display colour temperature. As a
                        result, prints and colours may vary by approximately 10–12%. We strive to
                        represent product colours as accurately as possible.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
                  <dl className="space-y-3 text-stone-700">
                    <div className="border-b border-border/50 pb-2.5">
                      <dt className="font-semibold text-stone-900">Net Quantity</dt>
                      <dd className="mt-0.5">1 N</dd>
                    </div>
                    <div className="border-b border-border/50 pb-2.5">
                      <dt className="font-semibold text-stone-900">Manufactured by</dt>
                      <dd className="mt-0.5">
                        VEDAARNA STUDIO
                        <br />
                        525, Lower Ground Floor, Sector-27,
                        <br />
                        Gurugram, Haryana – 122009
                      </dd>
                    </div>
                    <div className="border-b border-border/50 pb-2.5">
                      <dt className="font-semibold text-stone-900">Country of Origin</dt>
                      <dd className="mt-0.5">India</dd>
                    </div>
                    <div className="border-b border-border/50 pb-2.5">
                      <dt className="font-semibold text-stone-900">Customer Care Address</dt>
                      <dd className="mt-0.5">
                        VEDAARNA STUDIO
                        <br />
                        525, Lower Ground Floor, Sector-27,
                        <br />
                        Gurugram, Haryana – 122009
                      </dd>
                    </div>
                    <div className="border-b border-border/50 pb-2.5">
                      <dt className="font-semibold text-stone-900">Email</dt>
                      <dd className="mt-0.5">
                        <a
                          href="mailto:orders@vedaarnastudio.com"
                          className="text-terracotta underline underline-offset-2"
                        >
                          orders@vedaarnastudio.com
                        </a>
                      </dd>
                    </div>
                    <div className="border-b border-border/50 pb-2.5">
                      <dt className="font-semibold text-stone-900">Phone</dt>
                      <dd className="mt-0.5">+91 9910201612</dd>
                    </div>
                    <div className="pb-1">
                      <dt className="font-semibold text-stone-900">Commodity</dt>
                      <dd className="mt-0.5">Western Wear</dd>
                    </div>
                  </dl>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section
          id="reviews-section"
          className="mt-16 border-t border-border pt-10 px-4 md:px-8 lg:px-14"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-terracotta uppercase">
                Customer Feedback
              </p>
              <h2 className="mt-1 text-2xl font-display font-normal text-foreground">
                Verified Reviews & Experiences
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold">4.9 out of 5</span>
                <span className="text-xs text-muted-foreground">(Based on 12 verified buyers)</span>
              </div>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-foreground bg-background px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Sample Review Cards Grid */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-sm border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">3 days ago</span>
              </div>
              <p className="font-semibold text-xs text-foreground">
                "Breathtaking quality & perfect fitting"
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                The fabric is pure luxury. The drape and finish are better than top high-street
                designer stores. Delivered swiftly to Bangalore!
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                <span className="h-6 w-6 rounded-full bg-terracotta/20 flex items-center justify-center text-[10px] font-bold text-terracotta">
                  A
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">Ananya Sharma</p>
                  <p className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                    <ShieldCheck className="h-3 w-3" /> Verified Buyer
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">1 week ago</span>
              </div>
              <p className="font-semibold text-xs text-foreground">
                "True to size, stunning colors"
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Wore this for an intimate family celebration and received countless compliments. The
                WhatsApp concierge helped me select size L.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                <span className="h-6 w-6 rounded-full bg-terracotta/20 flex items-center justify-center text-[10px] font-bold text-terracotta">
                  P
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">Pooja Nair</p>
                  <p className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                    <ShieldCheck className="h-3 w-3" /> Verified Buyer
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">2 weeks ago</span>
              </div>
              <p className="font-semibold text-xs text-foreground">
                "Superb organic breathable cotton"
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                So gentle on the skin in hot weather. Loved the neat packaging and handwritten note
                from VedAarna Studio team.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                <span className="h-6 w-6 rounded-full bg-terracotta/20 flex items-center justify-center text-[10px] font-bold text-terracotta">
                  S
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">Sunita Mehra</p>
                  <p className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                    <ShieldCheck className="h-3 w-3" /> Verified Buyer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Recommendation */}
        <section className="mt-16 border-t border-border pt-10 px-4 md:px-8 lg:px-14">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-terracotta uppercase">
              Complete The Wardrobe
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-normal">You May Also Like</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </main>

      {/* ── Sticky mobile Add-to-Bag bar (hidden on lg+) ───────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 flex gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <button
          type="button"
          onClick={handleAddToBag}
          className={`flex-1 rounded-sm py-3 text-[11px] font-semibold tracking-[0.16em] uppercase transition-all ${
            addedFeedback ? "bg-emerald-700 text-white" : "bg-foreground text-background"
          }`}
        >
          {addedFeedback ? "✓ Added!" : "Add to Bag"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 rounded-sm border border-foreground py-3 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors bg-terracotta text-white"
        >
          Buy Now
        </button>
      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN LIGHTBOX & ZOOM MODAL */}
      {/* ========================================================================= */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
          {/* Top Bar with actions */}
          <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 text-white">
            <span className="text-xs tracking-widest uppercase font-mono">
              {product.name} — Photo {lightboxIndex + 1} of {galleryImages.length}
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => (z === 1 ? 1.8 : 1))}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
                title="Toggle Zoom"
              >
                {zoomLevel === 1 ? <ZoomIn className="h-5 w-5" /> : <ZoomOut className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex(null);
                  setZoomLevel(1);
                }}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
                title="Close Lightbox"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Previous Image Arrow */}
          <button
            type="button"
            onClick={() => {
              setLightboxIndex((idx) =>
                idx === null ? 0 : (idx - 1 + galleryImages.length) % galleryImages.length,
              );
              setZoomLevel(1);
            }}
            className="absolute left-4 z-50 rounded-full bg-white/15 p-3 text-white backdrop-blur-md hover:bg-white/30 transition-all"
            aria-label="Previous Image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Main Zoomable Image Canvas */}
          <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden flex items-center justify-center">
            <img
              src={galleryImages[lightboxIndex]}
              alt={product.name}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-300 ease-out cursor-zoom-in"
              onClick={() => setZoomLevel((z) => (z === 1 ? 1.8 : 1))}
            />
          </div>

          {/* Next Image Arrow */}
          <button
            type="button"
            onClick={() => {
              setLightboxIndex((idx) => (idx === null ? 0 : (idx + 1) % galleryImages.length));
              setZoomLevel(1);
            }}
            className="absolute right-4 z-50 rounded-full bg-white/15 p-3 text-white backdrop-blur-md hover:bg-white/30 transition-all"
            aria-label="Next Image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIZE CHART & FIT GUIDE MODAL */}
      {/* ========================================================================= */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-2xl rounded-sm bg-background p-6 md:p-8 shadow-2xl border border-border">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-display font-medium text-foreground">
                  Standard Garment Sizing Chart
                </h3>
                <p className="text-xs text-muted-foreground">
                  Accurate measurements for Indian ethnic wear tailored for comfort fit.
                </p>
              </div>

              {/* Unit Switcher */}
              <div className="flex items-center rounded-sm border border-border p-0.5 bg-muted">
                <button
                  type="button"
                  onClick={() => setSizeUnit("in")}
                  className={`px-3 py-1 text-xs font-semibold transition-all ${
                    sizeUnit === "in"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground"
                  }`}
                >
                  Inches
                </button>
                <button
                  type="button"
                  onClick={() => setSizeUnit("cm")}
                  className={`px-3 py-1 text-xs font-semibold transition-all ${
                    sizeUnit === "cm"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground"
                  }`}
                >
                  CM
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-sand/20 font-semibold tracking-wider uppercase text-foreground">
                    <th className="py-3 px-3">Size</th>
                    <th className="py-3 px-3">Bust ({sizeUnit})</th>
                    <th className="py-3 px-3">Waist ({sizeUnit})</th>
                    <th className="py-3 px-3">Hip ({sizeUnit})</th>
                    <th className="py-3 px-3">Length ({sizeUnit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {(sizeUnit === "in" ? SIZE_CHART_INCHES : SIZE_CHART_CMS).map((row) => (
                    <tr
                      key={row.size}
                      className={
                        row.size === size
                          ? "bg-terracotta/10 font-semibold text-terracotta"
                          : "hover:bg-muted/40"
                      }
                    >
                      <td className="py-3 px-3 font-mono">{row.size}</td>
                      <td className="py-3 px-3">{row.bust}</td>
                      <td className="py-3 px-3">{row.waist}</td>
                      <td className="py-3 px-3">{row.hip}</td>
                      <td className="py-3 px-3">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded bg-sand/30 p-3.5 text-[11px] text-stone-700 space-y-1">
              <p className="font-semibold text-terracotta uppercase tracking-wider">
                How To Measure:
              </p>
              <p>
                • <strong>Bust:</strong> Measure around the fullest part of your chest with tape
                comfortable.
              </p>
              <p>
                • <strong>Waist:</strong> Measure at your natural waistline, above the navel.
              </p>
              <p>
                • <strong>Hip:</strong> Measure around the fullest part of your hips.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WRITE A REVIEW MODAL */}
      {/* ========================================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-sm bg-background p-6 md:p-8 shadow-2xl border border-border">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {reviewSubmitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-display font-medium text-foreground">
                  Thank you for your review!
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Your feedback for {product.name} has been received and forwarded to our customer
                  care team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <h3 className="text-xl font-display font-medium text-foreground">
                    Write a Review
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Share your fit and fabric experience with {product.name}
                  </p>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Rating
                  </label>
                  <div className="flex gap-1.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${star <= reviewRating ? "fill-amber-500 text-amber-500" : "text-border"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label
                    htmlFor="review-title"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                  >
                    Review Headline
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Absolutely in love with the fit and craft!"
                    className="w-full rounded-sm border border-border px-3.5 py-2 text-xs focus:border-foreground focus:outline-hidden"
                  />
                </div>

                {/* Review Comments */}
                <div>
                  <label
                    htmlFor="review-body"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review-body"
                    required
                    rows={4}
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Describe the fabric feel, sizing precision, craftsmanship, and how it fit you..."
                    className="w-full rounded-sm border border-border px-3.5 py-2 text-xs focus:border-foreground focus:outline-hidden"
                  />
                </div>

                {/* Reviewer Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reviewer-name"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      id="reviewer-name"
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Radhika S."
                      className="w-full rounded-sm border border-border px-3.5 py-2 text-xs focus:border-foreground focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reviewer-email"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="reviewer-email"
                      type="email"
                      required
                      value={reviewerEmail}
                      onChange={(e) => setReviewerEmail(e.target.value)}
                      placeholder="radhika@example.com"
                      className="w-full rounded-sm border border-border px-3.5 py-2 text-xs focus:border-foreground focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-sm bg-foreground py-3 text-xs font-semibold tracking-[0.2em] uppercase text-background hover:bg-terracotta hover:text-white transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
