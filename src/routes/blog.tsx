import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import p1 from "@/assets/p1.jpg";
import p4 from "@/assets/p4.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

const posts = [
  {
    title: "A guide to Indian ethnic wear for every occasion",
    excerpt:
      "From a Monday mulmul kurta to a festive anarkali — how to build a small ethnic wardrobe that works all year.",
    date: "12 August 2026",
    read: "6 min read",
    image: p4,
  },
  {
    title: "Choosing the right dress for a summer celebration",
    excerpt:
      "Silhouettes, fabrics and prints that stay comfortable through a long day in the heat.",
    date: "28 July 2026",
    read: "5 min read",
    image: p1,
  },
  {
    title: "How to drape an organza saree so it stays put",
    excerpt: "Six pleats, one belt and a few pins — our studio method for slippery weaves.",
    date: "9 July 2026",
    read: "4 min read",
    image: p6,
  },
  {
    title: "Caring for handblock prints and kantha",
    excerpt:
      "Why the first wash matters most, and the simple routine that keeps colours deep for years.",
    date: "21 June 2026",
    read: "3 min read",
    image: p7,
  },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — VedAarna Studio Blog" },
      {
        name: "description",
        content:
          "Styling guides, fabric care notes and stories from the artisan clusters behind VedAarna Studio.",
      },
      { property: "og:title", content: "The VedAarna Journal" },
      {
        property: "og:description",
        content: "Styling guides, craft stories and fabric care from our studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Discover"
      title="The Journal"
      intro="Notes on styling, craft and care from the VedAarna studio."
      wide
    >
      <div className="grid gap-10 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.title} className="group">
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              width={800}
              height={600}
              className="aspect-4/3 w-full object-cover"
            />
            <p className="mt-4 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              {post.date} · {post.read}
            </p>
            <h2 className="mt-2 text-lg leading-snug">{post.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
            <Link
              to="/contact"
              className="mt-3 inline-block text-[11px] tracking-[0.2em] uppercase link-underline"
            >
              Read more
            </Link>
          </article>
        ))}
      </div>
    </PageShell>
  ),
});
