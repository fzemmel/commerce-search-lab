import Link from "next/link";

import { ProductBadges } from "@/components/product/product-badges";
import { ProductPrice } from "@/components/product/product-price";
import { categoryLabels } from "@/lib/product-query";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="flex h-full flex-col">
        <div className="relative min-h-48 bg-linear-to-br from-stone-100 via-amber-50 to-teal-50 p-5">
          <div className="absolute left-5 top-5">
            <ProductBadges isNew={product.isNew} isSale={product.isSale} />
          </div>
          <div className="flex h-40 items-end justify-center rounded-2xl border border-white/70 bg-white/50 p-6 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {product.image}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm text-slate-500">
            <span>{product.brand}</span>
            <span>{categoryLabels[product.category]}</span>
          </div>
          <h2 className="text-lg font-semibold leading-6 text-slate-950 group-hover:text-amber-800">{product.name}</h2>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <ProductPrice price={product.price} originalPrice={product.originalPrice} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {product.rating.toFixed(1)} / 5
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
