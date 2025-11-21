"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllProductsPublic, updateProduct } from "@/lib/apiUtils";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

type Product = {
  id: number;
  name: string;
  count: number;
  image?: string;
  draftCount?: number; // local editable count
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await getAllProductsPublic();
      const data = res.data || [];

      // add draftCount to each product
      setProducts(data.map((p: Product) => ({ ...p, draftCount: p.count })));
    } finally {
      setLoading(false);
    }
  }

  function setDraft(id: number, value: number) {
    if (value < 0) return; // no negative values

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, draftCount: value } : p))
    );
  }

  async function saveCount(p: Product) {
    const newCount = p.draftCount ?? p.count;

    const body = new FormData();
    body.append("count", newCount.toString());

    try {
      setSaving(p.id);
      await updateProduct(p.id, body);

      // sync real count
      setProducts((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, count: newCount } : item
        )
      );
    } catch (err) {
      console.error("Failed to update stock:", err);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => {
          const hasChanges = p.draftCount !== p.count;

          return (
            <div
              key={p.id}
              className="border rounded-lg p-4 flex flex-col gap-4"
            >
              {/* Product Image + Name */}
              <div className="flex items-center gap-4">
                <img
                  src={`${MEDIA_URL}/${p.image}`}
                  alt={p.name}
                  className="h-16 w-16 object-cover rounded"
                />

                <h2 className="font-semibold">{p.name}</h2>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  className="w-24 text-center"
                  value={p.draftCount}
                  min={0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) setDraft(p.id, val);
                  }}
                />
              </div>

              {/* Save Changes */}
              {hasChanges && (
                <Button
                  className="w-full"
                  onClick={() => saveCount(p)}
                  disabled={saving === p.id}
                >
                  {saving === p.id ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          );
        })}

        {!loading && products.length === 0 && (
          <p className="text-muted-foreground">No products found.</p>
        )}
      </div>
    </div>
  );
}
