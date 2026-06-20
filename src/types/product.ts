export type ProductCategory = "apparel" | "footwear" | "accessories" | "equipment";

export type ProductAttributes = {
  color: string;
  size: string;
  material: string;
  [key: string]: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  attributes: ProductAttributes;
};
