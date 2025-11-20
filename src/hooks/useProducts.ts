import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Product = {
  id: number;
  name: string;
  image: string;
  video?: string | null;
  category?: string;
  description?: string;
  order?: number;
  price?: number;
  rate?: number;
  count?: number;
  type?: string | null;
  serviceId?: number;
  createdAt?: string;
  __service__?: {
    id: number;
    image: string;
    name: string;
    order: number;
    createdAt: string;
  };
};

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/product/getByCategory/${category}`);
        const json = await res.json();
        if (json.status === "success") setProducts(json.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  return { products, loading };
}
