import {
  fetchMedusaCollections,
  fetchMedusaProducts,
  type MedusaCollection,
  type MedusaProduct,
} from "@/lib/medusa";

import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export type Product = {
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  image: string;
  hover: string;
  images?: string[];
  /** All sizes offered for this product */
  sizes: string[];
  /**
   * Subset of `sizes` that are currently in stock.
   * When absent, ALL sizes are treated as available.
   * Sizes in `sizes` but NOT in `availableSizes` are shown crossed-out.
   */
  availableSizes?: string[];
  badge?: string;
  collections: string[];
  fabric: string;
  description?: string;
  care?: string;
  shipping?: string;
};

const CDN = "https://cdn.vedaarnastudio.com/products";

export const products: Product[] = [
  {
    slug: "chocolate-brown-satin-co-ord-set",
    name: "Chocolate Brown Satin Co-ord Set",
    price: 3000,
    compareAt: 3799,
    image: `${CDN}/VS-CRD-2PC-0001-BRN-26-01-FR.png`,
    hover: `${CDN}/VS-CRD-2PC-0001-BRN-26-02-SD.png`,
    images: [
      `${CDN}/VS-CRD-2PC-0001-BRN-26-01-FR.png`,
      `${CDN}/VS-CRD-2PC-0001-BRN-26-02-SD.png`,
      `${CDN}/VS-CRD-2PC-0001-BRN-26-03-BK.png`,
      `${CDN}/VS-CRD-2PC-0001-BRN-26-04-CD.png`,
      `${CDN}/VS-CRD-2PC-0001-BRN-26-05-WK.png`,
      `${CDN}/VS-CRD-2PC-0001-BRN-26-06-ST.png`,
    ],
    sizes: ["M", "L", "XL"],
    badge: "New",
    collections: ["new-arrivals", "co-ords"],
    fabric: "Satin",
    description:
      "Relaxed-fit satin co-ord set featuring an asymmetric kaftan-style button-down top, wide batwing sleeves with lace-trim detailing, and matching wide-leg pants.",
  },
  {
    slug: "multicolor-geometric-print-three-piece-co-ord-set",
    name: "Multicolor Geometric Print Three-Piece Co-ord Set",
    price: 4000,
    compareAt: 4999,
    image: `${CDN}/VS-THS-3PC-0002-MLT-26-01-FR.png`,
    hover: `${CDN}/VS-THS-3PC-0002-MLT-26-02-SD.png`,
    images: [
      `${CDN}/VS-THS-3PC-0002-MLT-26-01-FR.png`,
      `${CDN}/VS-THS-3PC-0002-MLT-26-02-SD.png`,
      `${CDN}/VS-THS-3PC-0002-MLT-26-03-BK.png`,
      `${CDN}/VS-THS-3PC-0002-MLT-26-04-CD.png`,
      `${CDN}/VS-THS-3PC-0002-MLT-26-05-WK.png`,
      `${CDN}/VS-THS-3PC-0002-MLT-26-06-ST.png`,
    ],
    sizes: ["M", "L", "XL"],
    badge: "New",
    collections: ["new-arrivals", "co-ords"],
    fabric: "Art Silk",
    description:
      "Contemporary three-piece co-ord set featuring a solid emerald green V-neck inner top, long open-front printed jacket, and matching wide-leg printed pants.",
  },
  {
    slug: "wine-bandhani-three-piece-kurta-set",
    name: "Wine Bandhani Three-Piece Kurta Set",
    price: 3000,
    compareAt: 3799,
    image: `${CDN}/VS-SUT-3PC-0003-DPW-26-01-FR.png`,
    hover: `${CDN}/VS-SUT-3PC-0003-DPW-26-02-SD.png`,
    images: [
      `${CDN}/VS-SUT-3PC-0003-DPW-26-01-FR.png`,
      `${CDN}/VS-SUT-3PC-0003-DPW-26-02-SD.png`,
      `${CDN}/VS-SUT-3PC-0003-DPW-26-03-BK.png`,
      `${CDN}/VS-SUT-3PC-0003-DPW-26-04-CD.png`,
      `${CDN}/VS-SUT-3PC-0003-DPW-26-05-WK.png`,
      `${CDN}/VS-SUT-3PC-0003-DPW-26-06-ST.png`,
    ],
    sizes: ["M", "L"],
    badge: "Bestseller",
    collections: ["new-arrivals", "kurta-suit-sets"],
    fabric: "Pure Cotton",
    description:
      "Elegant Bandhani-inspired three-piece set featuring a relaxed long V-neck kurta with contrast trim, matching wide-leg pants and coordinated dupatta.",
  },
  {
    slug: "pista-green-embroidered-three-piece-kurta-set",
    name: "Pista Green Embroidered Three-Piece Kurta Set",
    price: 2400,
    compareAt: 2999,
    image: `${CDN}/VS-SUT-3PC-0004-IVR-26-01-FR.png`,
    hover: `${CDN}/VS-SUT-3PC-0004-IVR-26-02-SD.png`,
    images: [
      `${CDN}/VS-SUT-3PC-0004-IVR-26-01-FR.png`,
      `${CDN}/VS-SUT-3PC-0004-IVR-26-02-SD.png`,
      `${CDN}/VS-SUT-3PC-0004-IVR-26-03-BK.png`,
      `${CDN}/VS-SUT-3PC-0004-IVR-26-04-CD.png`,
      `${CDN}/VS-SUT-3PC-0004-IVR-26-05-WK.png`,
      `${CDN}/VS-SUT-3PC-0004-IVR-26-06-ST.png`,
    ],
    sizes: ["M", "L", "XL"],
    badge: "New",
    collections: ["new-arrivals", "kurta-suit-sets"],
    fabric: "Mix Cotton",
    description:
      "Elegant pista green three-piece kurta set featuring delicate all-over embroidery, an embellished neckline and decorative lace border, paired with straight pants and a lightweight ivory embroidered dupatta.",
  },
  {
    slug: "charcoal-grey-bandhani-three-piece-kurta-set",
    name: "Charcoal Grey Bandhani Three-Piece Kurta Set",
    price: 3000,
    compareAt: 3799,
    image: `${CDN}/VS-SUT-3PC-0005-GRY-26-01-FR.png`,
    hover: `${CDN}/VS-SUT-3PC-0005-GRY-26-02-SD.png`,
    images: [
      `${CDN}/VS-SUT-3PC-0005-GRY-26-01-FR.png`,
      `${CDN}/VS-SUT-3PC-0005-GRY-26-02-SD.png`,
      `${CDN}/VS-SUT-3PC-0005-GRY-26-03-BK.png`,
      `${CDN}/VS-SUT-3PC-0005-GRY-26-04-CD.png`,
      `${CDN}/VS-SUT-3PC-0005-GRY-26-05-WK.png`,
      `${CDN}/VS-SUT-3PC-0005-GRY-26-06-ST.png`,
    ],
    sizes: ["M", "L", "XL"],
    badge: "New",
    collections: ["new-arrivals", "kurta-suit-sets"],
    fabric: "Pure Cotton",
    description:
      "Contemporary Bandhani three-piece set featuring a charcoal grey flared kurta with bold white geometric tie-dye motifs and lace-trim detailing, paired with deep purple Bandhani pants and a coordinated dual-tone dupatta.",
  },
  {
    slug: "ivory-red-paisley-print-three-piece-kurta-set",
    name: "Ivory Red Paisley Print Three-Piece Kurta Set",
    price: 2800,
    compareAt: 3499,
    image: `${CDN}/VS-SUT-3PC-0006-IVR-26-01-FR.png`,
    hover: `${CDN}/VS-SUT-3PC-0006-IVR-26-02-SD.png`,
    images: [
      `${CDN}/VS-SUT-3PC-0006-IVR-26-01-FR.png`,
      `${CDN}/VS-SUT-3PC-0006-IVR-26-02-SD.png`,
      `${CDN}/VS-SUT-3PC-0006-IVR-26-03-BK.png`,
      `${CDN}/VS-SUT-3PC-0006-IVR-26-04-CD.png`,
      `${CDN}/VS-SUT-3PC-0006-IVR-26-05-WK.png`,
      `${CDN}/VS-SUT-3PC-0006-IVR-26-06-ST.png`,
    ],
    sizes: ["M", "L", "XL"],
    badge: "Bestseller",
    collections: ["new-arrivals", "kurta-suit-sets"],
    fabric: "Rubia Cotton",
    description:
      "Traditional three-piece kurta set featuring an ivory base with all-over red paisley motifs, statement multicolor borders, straight pants and a coordinated red printed dupatta.",
  },
  {
    slug: "beige-peach-floral-button-down-midi-dress",
    name: "Beige Peach Floral Button-Down Midi Dress",
    price: 3000,
    compareAt: 3799,
    image: `${CDN}/VS-OPC-1PC-0007-BEG-26-01-FR.png`,
    hover: `${CDN}/VS-OPC-1PC-0007-BEG-26-02-SD.png`,
    images: [
      `${CDN}/VS-OPC-1PC-0007-BEG-26-01-FR.png`,
      `${CDN}/VS-OPC-1PC-0007-BEG-26-02-SD.png`,
      `${CDN}/VS-OPC-1PC-0007-BEG-26-03-BK.png`,
      `${CDN}/VS-OPC-1PC-0007-BEG-26-04-CD.png`,
      `${CDN}/VS-OPC-1PC-0007-BEG-26-05-WK.png`,
      `${CDN}/VS-OPC-1PC-0007-BEG-26-06-ST.png`,
    ],
    sizes: ["M", "L"],
    badge: "New",
    collections: ["new-arrivals", "dresses"],
    fabric: "Chanderi Silk",
    description:
      "Elegant beige button-down midi dress featuring peach floral motifs, subtle vertical stripe detailing, a classic shirt collar and 3/4 sleeves in a structured straight silhouette.",
  },
  {
    slug: "aqua-beige-leaf-print-kurta-palazzo-set-with-dupatta",
    name: "Aqua Beige Leaf Print Kurta Palazzo Set with Dupatta",
    price: 3000,
    compareAt: 3799,
    image: `${CDN}/VS-SUT-3PC-0008-AQG-26-01-FR.png`,
    hover: `${CDN}/VS-SUT-3PC-0008-AQG-26-02-SD.png`,
    images: [
      `${CDN}/VS-SUT-3PC-0008-AQG-26-01-FR.png`,
      `${CDN}/VS-SUT-3PC-0008-AQG-26-02-SD.png`,
      `${CDN}/VS-SUT-3PC-0008-AQG-26-03-BK.png`,
      `${CDN}/VS-SUT-3PC-0008-AQG-26-04-CD.png`,
      `${CDN}/VS-SUT-3PC-0008-AQG-26-05-WK.png`,
      `${CDN}/VS-SUT-3PC-0008-AQG-26-06-ST.png`,
    ],
    sizes: ["M", "L", "XL"],
    badge: "New",
    collections: ["new-arrivals", "kurta-suit-sets"],
    fabric: "Pure Cotton",
    description:
      "Aqua green and beige leaf-print straight kurta paired with striped palazzo pants and a coordinated aqua printed dupatta. Features a round neck, 3/4 sleeves and contrasting border details.",
  },
  {
    slug: "wine-floral-print-back-tie-short-dress",
    name: "Wine Floral Print Back-Tie Short Dress",
    price: 2200,
    compareAt: 2799,
    image: `${CDN}/VS-OPC-1PC-0009-BGY-26-01-FR.png`,
    hover: `${CDN}/VS-OPC-1PC-0009-BGY-26-02-SD.png`,
    images: [
      `${CDN}/VS-OPC-1PC-0009-BGY-26-01-FR.png`,
      `${CDN}/VS-OPC-1PC-0009-BGY-26-02-SD.png`,
      `${CDN}/VS-OPC-1PC-0009-BGY-26-03-BK.png`,
      `${CDN}/VS-OPC-1PC-0009-BGY-26-04-CD.png`,
      `${CDN}/VS-OPC-1PC-0009-BGY-26-05-WK.png`,
      `${CDN}/VS-OPC-1PC-0009-BGY-26-06-ST.png`,
    ],
    sizes: ["M", "L", "XL"],
    badge: "New",
    collections: ["new-arrivals", "dresses"],
    fabric: "Velvet",
    description:
      "Wine floral-print sleeveless short dress featuring a sweetheart neckline, broad shoulder straps, gathered waist and statement open-back tie-up bow.",
  },
  {
    slug: "mint-green-floral-print-kurta-set-with-dupatta",
    name: "Mint Green Floral Print Kurta Set with Dupatta",
    price: 2800,
    compareAt: 3499,
    image: `${CDN}/VS-SUT-3PC-0010-MNT-26-01-FR.png`,
    hover: `${CDN}/VS-SUT-3PC-0010-MNT-26-02-SD.png`,
    images: [
      `${CDN}/VS-SUT-3PC-0010-MNT-26-01-FR.png`,
      `${CDN}/VS-SUT-3PC-0010-MNT-26-02-SD.png`,
      `${CDN}/VS-SUT-3PC-0010-MNT-26-03-BK.png`,
      `${CDN}/VS-SUT-3PC-0010-MNT-26-04-CD.png`,
      `${CDN}/VS-SUT-3PC-0010-MNT-26-05-WK.png`,
      `${CDN}/VS-SUT-3PC-0010-MNT-26-06-ST.png`,
    ],
    sizes: ["M", "L", "XL"],
    badge: "Bestseller",
    collections: ["new-arrivals", "kurta-suit-sets"],
    fabric: "Mix Cotton",
    description:
      "Mint green 3-piece straight kurta set featuring an all-over delicate floral print, notched round neckline, scalloped sleeve detailing, straight pants and a coordinated embellished dupatta.",
  },
  {
    slug: "multicolor-velvet-floral-sheath-dress",
    name: "Multicolor Velvet Floral Sheath Dress",
    price: 2300,
    compareAt: 2899,
    image: `${CDN}/VS-OPC-1PC-0011-MLT-26-01-FR.png`,
    hover: `${CDN}/VS-OPC-1PC-0011-MLT-26-02-SD.png`,
    images: [
      `${CDN}/VS-OPC-1PC-0011-MLT-26-01-FR.png`,
      `${CDN}/VS-OPC-1PC-0011-MLT-26-02-SD.png`,
      `${CDN}/VS-OPC-1PC-0011-MLT-26-03-BK.png`,
      `${CDN}/VS-OPC-1PC-0011-MLT-26-04-CD.png`,
      `${CDN}/VS-OPC-1PC-0011-MLT-26-05-WK.png`,
      `${CDN}/VS-OPC-1PC-0011-MLT-26-06-ST.png`,
    ],
    sizes: ["M", "L"],
    badge: "New",
    collections: ["new-arrivals", "dresses"],
    fabric: "Velvet",
    description:
      "Sleeveless multicolor floral velvet sheath dress with a dark base, round neckline, defined waist seam and fitted knee-length silhouette.",
  },
];

export type Collection = {
  slug: string;
  title: string;
  tagline: string;
  image: string;
};

export const collections: Collection[] = [
  {
    slug: "kurta-suit-sets",
    title: "Kurta & Suit Sets",
    tagline: "Crafted for celebrations!",
    image: `${CDN}/VS-SUT-3PC-0004-IVR-26-01-FR.png`,
  },
  {
    slug: "co-ords",
    title: "Co-Ord Sets",
    tagline: "Made to feel like you!",
    image: `${CDN}/VS-CRD-2PC-0001-BRN-26-01-FR.png`,
  },
  {
    slug: "dresses",
    title: "Dresses",
    tagline: "Designed to belong to you!",
    image: `${CDN}/VS-OPC-1PC-0007-BEG-26-01-FR.png`,
  },
  {
    slug: "sarees",
    title: "Sarees",
    tagline: "Draped in quiet luxury!",
    image: `${CDN}/VS-SUT-3PC-0020-RNP-26-01-FR.png`,
  },
  {
    slug: "menswear",
    title: "Menswear",
    tagline: "Crafted for his ease!",
    image: `${CDN}/VS-KRS-2PC-0026-MST-26-01-FR.png`,
  },
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    tagline: "Crafted for your kind of beautiful!",
    image: `${CDN}/VS-THS-3PC-0002-MLT-26-01-FR.png`,
  },
];

export const navLinks = [
  { label: "NEW ARRIVALS", slug: "new-arrivals" },
  { label: "KURTA & SUIT SETS", slug: "kurta-suit-sets" },
  { label: "DRESSES", slug: "dresses" },
  { label: "SAREES", slug: "sarees" },
  { label: "CO-ORDS", slug: "co-ords" },
  { label: "MENSWEAR", slug: "menswear" },
  { label: "SALE", slug: "sale" },
];

export const collectionTitle = (slug: string) =>
  collections.find((c) => c.slug === slug)?.title ??
  (slug === "sale" ? "Sale" : slug.replace(/-/g, " "));

export const productsIn = (slug: string) => products.filter((p) => p.collections.includes(slug));

export const formatINR = (n: number) =>
  "MRP " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---------------------------------------------------------------------------
// Medusa → local type mappers
// ---------------------------------------------------------------------------

function mapProduct(p: MedusaProduct): Product {
  const images = p.images ?? [];
  // Medusa products can have multiple images; use thumbnail as primary, second image as hover
  const image = p.thumbnail ?? images[0]?.url ?? p1;
  const hover = images[1]?.url ?? images[0]?.url ?? p.thumbnail ?? p2;
  const sizes = p.variants.length ? p.variants.map((v) => v.title) : ["Free Size"];
  // Medusa stores price on variants — Store API v2 price_set; fall back to 0 until price modules wired
  const price = (p.metadata?.["price_inr"] as number | undefined) ?? 0;
  const compareAt = p.metadata?.["compare_at_inr"] as number | undefined;
  const badge = p.metadata?.["badge"] as string | undefined;
  const fabric = (p.metadata?.["fabric"] as string | undefined) ?? "";
  const collectionHandles = p.collection?.handle ? [p.collection.handle] : [];
  const tagHandles = (p.tags ?? []).map((t) => t.value);

  const allImages = images.length > 0 ? images.map((img) => img.url) : [image, hover];

  return {
    slug: p.handle,
    name: p.title,
    price,
    ...(compareAt !== undefined && { compareAt }),
    image,
    hover,
    images: allImages,
    sizes,
    ...(badge !== undefined && { badge }),
    collections: [...collectionHandles, ...tagHandles],
    fabric,
    description: (p.metadata?.["description"] as string | undefined) ?? "",
  };
}

function mapCollection(c: MedusaCollection): Collection {
  const defaultCol = collections.find((col) => col.slug === c.handle);
  return {
    slug: c.handle,
    title: c.title,
    tagline: (c.metadata?.["tagline"] as string | undefined) ?? defaultCol?.tagline ?? c.title,
    image:
      (c.metadata?.["image_url"] as string | undefined) ??
      defaultCol?.image ??
      `${CDN}/VS-THS-3PC-0002-MLT-26-01-FR.png`,
  };
}

// ---------------------------------------------------------------------------
// Async data fetchers (fall back to static data if Medusa is unreachable)
// ---------------------------------------------------------------------------

/** Fetch all products from Medusa. Falls back to static product list. */
export async function getProducts(collectionHandle?: string): Promise<Product[]> {
  const raw = await fetchMedusaProducts(collectionHandle);
  if (raw.length === 0) {
    return collectionHandle ? productsIn(collectionHandle) : products;
  }
  return raw.map(mapProduct);
}

/** Fetch all collections from Medusa. Falls back to static collection list. */
export async function getCollections(): Promise<Collection[]> {
  const raw = await fetchMedusaCollections();
  if (raw.length === 0) return collections;
  return raw.map(mapCollection);
}

/** Fetch a single product by handle/slug. Falls back to static lookup. */
export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Women of VedAarna — client photos served from Cloudflare R2
//
// Upload script: scripts/upload-women-images-to-r2.ts
// After running the script, images live at:
//   https://cdn.vedaarnastudio.com/Women_Of_VedAarna/<filename>
//
// During local dev (before upload) the bundled local imports in
// src/assets/Women_Of_VedAarna/ are used as the fallback src.
// ---------------------------------------------------------------------------

const WOMEN_CDN = "https://cdn.vedaarnastudio.com/Women_Of_VedAarna";

export type WomenReview = {
  /** R2 CDN URL */
  image: string;
  /** Local asset fallback (bundled by Vite at build time) */
  localImage: string;
  rating: number;
  review: string;
  dress: string;
};

/**
 * All 14 Women of VedAarna entries.
 * `image` = CDN URL (used in production after R2 upload).
 * `localImage` = local asset path resolved at build time (used as <img> fallback).
 *
 * IMPORTANT: After running `npx tsx scripts/upload-women-images-to-r2.ts` and
 * verifying all images load via the CDN, you can remove the localImage imports
 * from the route files and use only `image` here.
 */
export const womenReviews: WomenReview[] = [
  {
    image: `${WOMEN_CDN}/Client_Pic1.png`,
    localImage: "",
    rating: 5,
    review:
      "The colors are so vibrant and true to what was shown. It made me feel so special at my cousin's wedding!",
    dress: "Ivory Red Paisley Print Three-Piece Kurta Set",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic2.jpeg`,
    localImage: "",
    rating: 5,
    review:
      "Absolutely love how comfortable yet elegant this feels. Wore it all day and never wanted to take it off.",
    dress: "Mint Green Floral Print Kurta Set with Dupatta",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic3.jpg`,
    localImage: "",
    rating: 5,
    review:
      "The fabric quality is outstanding. Got so many compliments at the function. Worth every rupee!",
    dress: "Wine Bandhani Three-Piece Kurta Set",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic4.jpg`,
    localImage: "",
    rating: 4,
    review:
      "Gorgeous outfit. The embroidery work is so detailed — looks far more expensive than it is.",
    dress: "Pista Green Embroidered Three-Piece Kurta Set",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic5.jpg`,
    localImage: "",
    rating: 5,
    review:
      "My go-to now for any festive occasion. The fit is perfect and the dupatta is gorgeous.",
    dress: "Aqua Beige Leaf Print Kurta Palazzo Set with Dupatta",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic6.jpg`,
    localImage: "",
    rating: 5,
    review:
      "Received it just in time for Diwali and it was the highlight of my look. So many compliments!",
    dress: "Charcoal Grey Bandhani Three-Piece Kurta Set",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic7.jpg`,
    localImage: "",
    rating: 5,
    review:
      "The colors are even more beautiful in person. I wore this to my best friend's mehndi and felt like a queen.",
    dress: "Multicolor Geometric Print Three-Piece Co-ord Set",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic8.jpeg`,
    localImage: "",
    rating: 5,
    review:
      "I was hesitant to order online but VedAarna exceeded every expectation. The drape, the color — perfect!",
    dress: "Chocolate Brown Satin Co-ord Set",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic9.jpg`,
    localImage: "",
    rating: 4,
    review: "Loved the fit and finish. Great for both casual outings and festive gatherings.",
    dress: "Beige Peach Floral Button-Down Midi Dress",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic10.jpg`,
    localImage: "",
    rating: 5,
    review:
      "The stitching is immaculate and the color stayed vibrant even after washing. Truly impressed.",
    dress: "Multicolor Velvet Floral Sheath Dress",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic11.jpg`,
    localImage: "",
    rating: 5,
    review:
      "Wore this to a family function and people kept asking where I got it. Absolutely stunning!",
    dress: "Mint Green Floral Print Kurta Set with Dupatta",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic12.jpg`,
    localImage: "",
    rating: 5,
    review:
      "The fabric is so soft and the print is gorgeous. I'll definitely be ordering more from VedAarna.",
    dress: "Ivory Red Paisley Print Three-Piece Kurta Set",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic13.jpeg`,
    localImage: "",
    rating: 5,
    review:
      "Perfect for a sangeet night. So light and breezy — danced all night without any discomfort!",
    dress: "Wine Floral Print Back-Tie Short Dress",
  },
  {
    image: `${WOMEN_CDN}/Client_Pic14.jpg`,
    localImage: "",
    rating: 4,
    review:
      "Really happy with the quality and the sizing was spot on. Comfortable and chic — love VedAarna!",
    dress: "Pista Green Embroidered Three-Piece Kurta Set",
  },
];
