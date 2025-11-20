"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import ProductDialog from "./ProductDialog";

export default function ServiceCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { products, loading } = useProducts(category);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold mb-4">{category} Products</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => {
                setSelectedId(product.id);
                setOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ProductDialog
        open={open}
        onOpenChange={setOpen}
        productId={selectedId}
      />
    </section>
  );
}
