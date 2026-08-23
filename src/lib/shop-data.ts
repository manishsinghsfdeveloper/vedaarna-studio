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
  sizes: string[];
  badge?: string;
  collections: string[];
  fabric: string;
};

export const products: Product[] = [
  {
    slug: "vernazza-floral-flared-dress",
    name: "Vernazza Floral Flared Dress",
    price: 6497.5,
    compareAt: 7997,
    image: p1,
    hover: p2,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    badge: "New",
    collections: ["new-arrivals", "dresses", "sale"],
    fabric: "Handwoven cotton",
  },
  {
    slug: "radiant-meadows-off-white-kantha-tiered-dress",
    name: "Radiant Meadows Off-White Cotton Kantha Tiered Dress",
    price: 6497.5,
    image: p2,
    hover: p1,
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"],
    badge: "New",
    collections: ["new-arrivals", "dresses"],
    fabric: "Kantha cotton",
  },
  {
    slug: "radiant-meadows-purple-kantha-tiered-dress",
    name: "Radiant Meadows Purple Cotton Kantha Tiered Dress",
    price: 6497.5,
    image: p3,
    hover: p2,
    sizes: ["XS", "S", "M", "XXL", "3XL"],
    collections: ["new-arrivals", "dresses"],
    fabric: "Kantha cotton",
  },
  {
    slug: "neelambari-navy-printed-kurta-suit-set",
    name: "Neelambari Navy Printed Kurta Suit Set",
    price: 7997,
    compareAt: 9997,
    image: p4,
    hover: p8,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    badge: "Bestseller",
    collections: ["new-arrivals", "kurta-suit-sets", "sale"],
    fabric: "Mulmul cotton",
  },
  {
    slug: "haldi-mustard-cotton-co-ord-set",
    name: "Haldi Mustard Cotton Co-Ord Set",
    price: 5497,
    image: p5,
    hover: p1,
    sizes: ["S", "M", "L", "XL"],
    collections: ["new-arrivals", "co-ords"],
    fabric: "Yarn dyed cotton",
  },
  {
    slug: "sheer-grace-mint-organza-saree",
    name: "Sheer Grace Mint Organza Saree",
    price: 9497,
    image: p6,
    hover: p3,
    sizes: ["Free Size"],
    badge: "New",
    collections: ["new-arrivals", "sarees"],
    fabric: "Organza silk",
  },
  {
    slug: "aarav-ivory-chikankari-kurta-set",
    name: "Aarav Ivory Chikankari Kurta Set",
    price: 6997,
    image: p7,
    hover: p5,
    sizes: ["38", "40", "42", "44"],
    collections: ["new-arrivals", "menswear"],
    fabric: "Lucknowi cotton",
  },
  {
    slug: "gulaab-pink-anarkali-suit-set",
    name: "Gulaab Pink Anarkali Suit Set",
    price: 8497,
    compareAt: 10997,
    image: p8,
    hover: p4,
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    badge: "Bestseller",
    collections: ["new-arrivals", "kurta-suit-sets", "sale"],
    fabric: "Chanderi",
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
    image: p4,
  },
  { slug: "co-ords", title: "Co-Ord Sets", tagline: "Made to feel like you!", image: p5 },
  { slug: "dresses", title: "Dresses", tagline: "Designed to belong to you!", image: p1 },
  { slug: "sarees", title: "Sarees", tagline: "Draped in quiet luxury!", image: p6 },
  { slug: "menswear", title: "Menswear", tagline: "Crafted for his ease!", image: p7 },
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    tagline: "Crafted for your kind of beautiful!",
    image: p2,
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

export const productsIn = (slug: string) =>
  products.filter((p) => p.collections.includes(slug));

export const formatINR = (n: number) =>
  "MRP " +
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
