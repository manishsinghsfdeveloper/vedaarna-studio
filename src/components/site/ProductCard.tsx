import { Link } from "@tanstack/react-router";
import { formatINR, type Product } from "@/lib/shop-data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1024}
          className="aspect-4/5 w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <img
          src={product.hover}
          alt=""
          aria-hidden
          loading="lazy"
          width={800}
          height={1024}
          className="absolute inset-0 aspect-4/5 w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-background/90 px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full flex-wrap justify-center gap-2 bg-background/90 py-2.5 transition-transform duration-300 group-hover:translate-y-0 md:flex">
          {product.sizes.map((s) => (
            <span key={s} className="text-[10px] tracking-[0.12em] text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </Link>

      <div className="mt-3.5 text-center">
        <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          VedAarna
        </p>
        <h3 className="mt-1.5 px-2 text-[13px] leading-snug">
          <Link to="/products/$slug" params={{ slug: product.slug }} className="link-underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 flex items-center justify-center gap-2 text-[13px]">
          <span>{formatINR(product.price)}</span>
          {product.compareAt && (
            <span className="text-muted-foreground line-through">
              {product.compareAt.toLocaleString("en-IN")}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
