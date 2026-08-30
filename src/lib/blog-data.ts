import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  image: string;
  tags: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "guide-to-indian-ethnic-wear-for-every-occasion",
    title: "A guide to Indian ethnic wear for every occasion",
    excerpt:
      "From a Monday mulmul kurta to a festive anarkali — how to build a small ethnic wardrobe that carries you through the whole year.",
    date: "12 August 2026",
    read: "6 min read",
    image: p4,
    tags: ["ethnic wear", "Dressing guide", "Fashion Tips", "kurta set"],
  },
  {
    slug: "choosing-a-dress-for-a-summer-celebration",
    title: "Choosing the right dress for a summer celebration",
    excerpt:
      "Silhouettes, fabrics and prints that stay comfortable through a long day in the heat — without looking like you dressed for comfort.",
    date: "28 July 2026",
    read: "5 min read",
    image: p1,
    tags: ["summer collection", "Maxi dress", "festive outfit ideas", "cotton"],
  },
  {
    slug: "how-to-drape-an-organza-saree",
    title: "How to drape an organza saree so it actually stays put",
    excerpt:
      "Six pleats, one belt and a few well-placed pins — the studio method we use for slippery, feather-light weaves.",
    date: "9 July 2026",
    read: "4 min read",
    image: p6,
    tags: ["silk organza", "Chiffon saree", "Dressing guide", "festive wear"],
  },
  {
    slug: "caring-for-handblock-prints-and-kantha",
    title: "Caring for handblock prints and kantha",
    excerpt:
      "Why the first wash matters most, and the simple three-step routine that keeps natural dyes deep for years.",
    date: "21 June 2026",
    read: "3 min read",
    image: p7,
    tags: ["Handblock print", "Handcrafted", "Sustainable fashion", "cotton"],
  },
  {
    slug: "cotton-vs-linen-which-ethnic-fabric-to-pick",
    title: "Cotton vs linen: which ethnic fabric should you pick?",
    excerpt:
      "Both breathe beautifully, but they behave very differently across an Indian summer. Here is how we choose between them.",
    date: "4 June 2026",
    read: "5 min read",
    image: p2,
    tags: [
      "cotton vs linen ethnic wear",
      "breathable ethnic fabrics",
      "summer ethnic wear fabrics",
      "cotton",
    ],
  },
  {
    slug: "office-ethnic-wear-that-works-all-week",
    title: "Office ethnic wear that works all week",
    excerpt:
      "Five kurta sets, two pairs of trousers and one dupatta — a capsule that never repeats itself in the same meeting room.",
    date: "19 May 2026",
    read: "6 min read",
    image: p3,
    tags: [
      "ethnic wear for office",
      "office wear kurta sets",
      "comfortable office wear for women",
      "kurta set",
    ],
  },
  {
    slug: "monsoon-dressing-guide",
    title: "The monsoon dressing guide",
    excerpt:
      "Shorter hems, quick-drying weaves and colours that forgive a splash. Dressing well when the sky cannot make up its mind.",
    date: "2 May 2026",
    read: "4 min read",
    image: p5,
    tags: [
      "monsoon dressing guide",
      "ethnic outfit ideas for rainy days",
      "monsoon styling tips",
      "lightweight ethnic wear",
    ],
  },
  {
    slug: "festive-colour-trends-for-the-season",
    title: "Festive colour trends for the season",
    excerpt:
      "Terracotta, unbleached ivory and deep indigo — the three tones our karigars keep reaching for this year.",
    date: "16 April 2026",
    read: "5 min read",
    image: hero1,
    tags: [
      "festive color trends",
      "festive ethnic wear for women",
      "Festive Kurta Sets",
      "festive wear",
    ],
  },
  {
    slug: "styling-a-kurta-set-five-ways",
    title: "Styling one kurta set five different ways",
    excerpt:
      "One handblock kurta set, five looks — from an early morning puja to a late dinner, with nothing more than a belt and a jacket.",
    date: "29 March 2026",
    read: "4 min read",
    image: p8,
    tags: [
      "styling kurta sets for women",
      "kurta set styling ideas",
      "casual kurta look",
      "ethnic styling tips",
    ],
  },
  {
    slug: "what-handcrafted-really-means",
    title: "What \u201chandcrafted\u201d really means in our studio",
    excerpt:
      "A walk through the block-carving, printing and finishing tables — and why two pieces are never quite identical.",
    date: "11 March 2026",
    read: "7 min read",
    image: hero2,
    tags: ["Handcrafted", "Sustainable fashion", "Handblock print"],
  },
  {
    slug: "dressing-for-a-family-function",
    title: "Dressing for a family function without overthinking it",
    excerpt:
      "The one silhouette that photographs well, seats comfortably and survives a full day of relatives.",
    date: "24 February 2026",
    read: "3 min read",
    image: hero3,
    tags: ["family function outfit", "festive outfit", "best women outfit"],
  },
  {
    slug: "building-a-slow-wardrobe",
    title: "Building a slow wardrobe, one piece at a time",
    excerpt:
      "Why we would rather you bought four pieces a year than forty — and how to choose those four.",
    date: "7 February 2026",
    read: "5 min read",
    image: p1,
    tags: ["Sustainable fashion", "daily wear", "Fashion Tips"],
  },
];

export const blogTags: string[] = Array.from(
  new Set(posts.flatMap((p) => p.tags)),
).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
