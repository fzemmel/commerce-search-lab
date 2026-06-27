import { describe, expect, it } from "vitest";

import {
  formatCategoryLabel,
  getCategoryOptions,
  getProductBySlug,
  parseProductQuery,
  queryProducts,
  type ProductQuery,
} from "@/lib/product-query";
import type { Product } from "@/types/product";

const catalog: Product[] = [
  {
    id: "test-1",
    slug: "alpha-shirt",
    name: "Alpha Shirt",
    brand: "Northline",
    category: "apparel",
    description: "Breathable cotton shirt for warm days.",
    price: 50,
    image: "alpha shirt",
    rating: 4.4,
    attributes: { color: "White", size: "M", material: "Cotton" },
  },
  {
    id: "test-2",
    slug: "bravo-runner",
    name: "Bravo Runner",
    brand: "Motion Lab",
    category: "footwear",
    description: "Lightweight running shoe with responsive foam.",
    price: 120,
    image: "bravo runner",
    rating: 4.9,
    attributes: { color: "Black", size: "EU 42", material: "Knit" },
  },
  {
    id: "test-3",
    slug: "carry-tote",
    name: "Carry Tote",
    brand: "Carry Studio",
    category: "accessories",
    description: "Oversized tote for daily commerce essentials.",
    price: 40,
    image: "carry tote",
    rating: 4.1,
    attributes: { color: "Natural", size: "18L", material: "Linen" },
  },
];

const defaultQuery: ProductQuery = {
  q: "",
  category: "all",
  sort: "name-asc",
};

describe("parseProductQuery", () => {
  it("uses safe defaults for empty search params", () => {
    expect(parseProductQuery({})).toEqual(defaultQuery);
  });

  it("normalizes valid query, category, and sort values", () => {
    expect(parseProductQuery({ q: "  shirt  ", category: "apparel", sort: "price-asc" }, ["apparel"])).toEqual({
      q: "shirt",
      category: "apparel",
      sort: "price-asc",
    });
  });

  it("falls back for invalid category and sort values when valid categories are provided", () => {
    expect(parseProductQuery({ category: "invalid", sort: "unknown" }, ["apparel"])).toEqual(defaultQuery);
  });

  it("keeps dynamic API categories when no category allow-list is provided", () => {
    expect(parseProductQuery({ category: "home-decoration" })).toEqual({ ...defaultQuery, category: "home-decoration" });
  });

  it("uses the first value for repeated search params", () => {
    expect(parseProductQuery({ q: ["shoe", "shirt"], category: ["footwear", "apparel"], sort: ["rating-desc"] }, ["footwear"])).toEqual({
      q: "shoe",
      category: "footwear",
      sort: "rating-desc",
    });
  });
});

describe("queryProducts", () => {
  it("searches by name, brand, and description case-insensitively", () => {
    expect(queryProducts({ ...defaultQuery, q: "alpha" }, catalog).map((product) => product.slug)).toEqual(["alpha-shirt"]);
    expect(queryProducts({ ...defaultQuery, q: "motion lab" }, catalog).map((product) => product.slug)).toEqual(["bravo-runner"]);
    expect(queryProducts({ ...defaultQuery, q: "ESSENTIALS" }, catalog).map((product) => product.slug)).toEqual(["carry-tote"]);
  });

  it("filters by category", () => {
    expect(queryProducts({ ...defaultQuery, category: "footwear" }, catalog).map((product) => product.slug)).toEqual(["bravo-runner"]);
  });

  it("sorts by name ascending by default", () => {
    expect(queryProducts(defaultQuery, catalog).map((product) => product.slug)).toEqual(["alpha-shirt", "bravo-runner", "carry-tote"]);
  });

  it("sorts by price ascending and descending", () => {
    expect(queryProducts({ ...defaultQuery, sort: "price-asc" }, catalog).map((product) => product.slug)).toEqual([
      "carry-tote",
      "alpha-shirt",
      "bravo-runner",
    ]);
    expect(queryProducts({ ...defaultQuery, sort: "price-desc" }, catalog).map((product) => product.slug)).toEqual([
      "bravo-runner",
      "alpha-shirt",
      "carry-tote",
    ]);
  });

  it("sorts by rating descending", () => {
    expect(queryProducts({ ...defaultQuery, sort: "rating-desc" }, catalog).map((product) => product.slug)).toEqual([
      "bravo-runner",
      "alpha-shirt",
      "carry-tote",
    ]);
  });

  it("does not mutate the source catalog", () => {
    const originalOrder = catalog.map((product) => product.slug);

    queryProducts({ ...defaultQuery, sort: "price-asc" }, catalog);

    expect(catalog.map((product) => product.slug)).toEqual(originalOrder);
  });
});

describe("getProductBySlug", () => {
  it("returns a product for a known slug", () => {
    expect(getProductBySlug("alpha-shirt", catalog)?.name).toBe("Alpha Shirt");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProductBySlug("does-not-exist", catalog)).toBeUndefined();
  });
});

describe("getCategoryOptions", () => {
  it("returns the available category options from the catalog", () => {
    expect(getCategoryOptions(catalog)).toEqual([
      { value: "accessories", label: "Accessories" },
      { value: "apparel", label: "Apparel" },
      { value: "footwear", label: "Footwear" },
    ]);
  });
});

describe("formatCategoryLabel", () => {
  it("formats API category slugs as readable labels", () => {
    expect(formatCategoryLabel("home-decoration")).toBe("Home Decoration");
    expect(formatCategoryLabel("mens_shoes")).toBe("Mens Shoes");
  });
});
