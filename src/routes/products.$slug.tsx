import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { formatINR, products } from "@/lib/shop-data";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
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

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState(product.sizes[0]);
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-4 md:px-10">
        <nav className="py-5 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          <Link to="/" className="link-underline">Home</Link>
          <span className="px-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {[product.image, product.hover].map((src) => (
              <img
                key={src}
                src={src}
                alt={product.name}
                width={800}
                height={1024}
                className="aspect-4/5 w-full bg-muted object-cover"
              />
            ))}
          </div>

          <div className="lg:sticky lg:top-40 lg:self-start">
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              VedAarna
            </p>
            <h1 className="mt-3 text-2xl md:text-3xl">{product.name}</h1>
            <p className="mt-4 flex items-center gap-3 text-lg">
              <span>{formatINR(product.price)}</span>
              {product.compareAt && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.compareAt.toLocaleString("en-IN")}
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

            <div className="mt-8">
              <p className="text-[11px] tracking-[0.18em] uppercase">Select size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-11 border px-3 py-2 text-xs tracking-[0.1em] transition-colors ${
                      s === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button className="mt-8 w-full bg-foreground py-4 text-[11px] tracking-[0.24em] text-background uppercase transition-opacity hover:opacity-90">
              Add to bag
            </button>
            <button className="mt-3 w-full border border-foreground py-4 text-[11px] tracking-[0.24em] uppercase transition-colors hover:bg-secondary">
              Buy it now
            </button>

            <dl className="mt-10 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex gap-3">
                <dt className="w-28 text-muted-foreground">Fabric</dt>
                <dd>{product.fabric}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 text-muted-foreground">Care</dt>
                <dd>Gentle hand wash separately in cold water</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 text-muted-foreground">Shipping</dt>
                <dd>Dispatched in 2-3 working days</dd>
              </div>
            </dl>
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-center text-2xl">You may also like</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
