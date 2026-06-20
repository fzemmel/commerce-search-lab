import { products } from "@/data/products";
import type { Product, ProductCategory } from "@/types/product";

export type ProductSort = "name-asc" | "price-asc" | "price-desc" | "rating-desc";

export type ProductQuery = {
  q: string;
  category: ProductCategory | "all";
  sort: ProductSort;
};

export type SearchParamValue = string | string[] | undefined;
export type ProductSearchParams = Record<string, SearchParamValue>;

export const categoryLabels: Record<ProductCategory, string> = {
  apparel: "Apparel",
  footwear: "Footwear",
  accessories: "Accessories",
  equipment: "Equipment",
};

export const sortLabels: Record<ProductSort, string> = {
  "name-asc": "Name A-Z",
  "price-asc": "Price ascending",
  "price-desc": "Price descending",
  "rating-desc": "Rating descending",
};

const categories = Object.keys(categoryLabels) as ProductCategory[];
const sortValues = Object.keys(sortLabels) as ProductSort[];

function firstParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseProductQuery(searchParams: ProductSearchParams): ProductQuery {
  const q = firstParam(searchParams.q)?.trim() ?? "";
  const category = firstParam(searchParams.category);
  const sort = firstParam(searchParams.sort);

  return {
    q,
    category: category && categories.includes(category as ProductCategory) ? (category as ProductCategory) : "all",
    sort: sort && sortValues.includes(sort as ProductSort) ? (sort as ProductSort) : "name-asc",
  };
}

export function getCategoryOptions() {
  return categories.map((value) => ({ value, label: categoryLabels[value] }));
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function queryProducts(query: ProductQuery, catalog: Product[] = products) {
  const search = query.q.toLowerCase();

  return catalog
    .filter((product) => {
      const matchesCategory = query.category === "all" || product.category === query.category;
      const searchable = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
      const matchesSearch = search.length === 0 || searchable.includes(search);

      return matchesCategory && matchesSearch;
    })
    .toSorted((a, b) => {
      switch (query.sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating-desc":
          return b.rating - a.rating;
        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
}
