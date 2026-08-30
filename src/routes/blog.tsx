import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { blogTags, posts } from "@/lib/blog-data";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Styling Guides & Craft Stories | VedAarna Studio" },
      {
        name: "description",
        content:
          "Styling guides, fabric care notes and stories from the artisan clusters behind VedAarna Studio. Filter the journal by topic.",
      },
      { property: "og:title", content: "The VedAarna Journal" },
      {
        property: "og:description",
        content:
          "Styling guides, craft stories and fabric care notes from the VedAarna studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [active, setActive] = useState<string | null>(null);

  const visible = useMemo(
    () => (active ? posts.filter((p) => p.tags.includes(active)) : posts),
    [active],
  );

  const [featured, ...rest] = visible;

  return (
    <PageShell
      eyebrow="Discover"
      title="Journal"
      intro="Notes on styling, craft and care from the VedAarna studio."
      wide
    >
      {/* Filters */}
      <div className="border-b border-border pb-10">
        <div className="md:flex md:items-start md:gap-10">
          <p className="shrink-0 pt-1 text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
            Filters
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5 md:mt-0">
            <FilterPill
              label="All"
              selected={active === null}
              onClick={() => setActive(null)}
            />
            {blogTags.map((tag) => (
              <FilterPill
                key={tag}
                label={tag}
                selected={active === tag}
                onClick={() => setActive(active === tag ? null : tag)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Featured article */}
      {featured && (
        <article className="mt-14 grid gap-8 md:grid-cols-2 md:items-center">
          <img
            src={featured.image}
            alt={featured.title}
            width={1000}
            height={750}
            className="aspect-4/3 w-full object-cover"
          />
          <div>
            <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              {featured.date} · {featured.read}
            </p>
            <h2 className="mt-3 text-2xl leading-snug md:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {featured.excerpt}
            </p>
            <TagRow tags={featured.tags} onPick={setActive} />
            <Link
              to="/contact"
              className="mt-6 inline-block border-b border-foreground pb-1 text-[11px] tracking-[0.24em] uppercase"
            >
              Read the story
            </Link>
          </div>
        </article>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <div className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article key={post.slug} className="group">
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-4 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {post.date} · {post.read}
              </p>
              <h3 className="mt-2 text-lg leading-snug">{post.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <TagRow tags={post.tags} onPick={setActive} />
              <Link
                to="/contact"
                className="mt-4 inline-block text-[11px] tracking-[0.2em] uppercase link-underline"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      )}

      {visible.length === 0 && (
        <p className="mt-20 text-center text-sm text-muted-foreground">
          No journal entries under this topic yet.
        </p>
      )}
    </PageShell>
  );
}

function FilterPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
        selected
          ? "bg-foreground text-background"
          : "bg-sand/80 text-muted-foreground hover:bg-sand"
      }`}
    >
      {label}
    </button>
  );
}

function TagRow({
  tags,
  onPick,
}: {
  tags: string[];
  onPick: (tag: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.slice(0, 3).map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onPick(tag)}
          className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase link-underline"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
