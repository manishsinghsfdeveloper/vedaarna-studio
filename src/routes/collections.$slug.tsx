import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { collectionTitle, productsIn } from "@/lib/shop-data";

export const Route = createFileRoute("/collections/$slug")({
  head: ({ params }) => {
    const title = collectionTitle(params.slug);
    return {
      meta: [
        { title: `${title} — VedAarna Studio` },
        {
          name: "description",
          content: `Shop ${title.toLowerCase()} at VedAarna Studio — handcrafted, artisan-made Indian fashion in pure fabrics.`,
        },
        { property: "og:title", content: `${title} — VedAarna Studio` },
        {
          property: "og:description",
          content: `Explore our ${title.toLowerCase()} collection, handcrafted in India.`,
        },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const title = collectionTitle(slug);
  const items = productsIn(slug);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-4 md:px-10">
        <div className="py-12 text-center">
          <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            VedAarna Studio
          </p>
          <h1 className="mt-3 text-3xl capitalize md:text-4xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Handcrafted pieces in pure fabrics, finished by artisans across India.
          </p>
        </div>

        <div className="flex items-center justify-between border-y border-border py-3 text-[11px] tracking-[0.16em] uppercase">
          <span>{items.length} products</span>
          <span className="text-muted-foreground">Sort: Featured</span>
        </div>

        {items.length ? (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-sm text-muted-foreground">
            This collection is being restocked. Please check back soon.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
