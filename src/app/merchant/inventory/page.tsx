"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalFilters from "@/components/Filters";
import { getAllProductsPublic, updateProduct } from "@/lib/apiUtils";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

type Product = {
  id: number;
  name: string;
  count: number;
  category?: string;
  image?: string;
  draftCount?: number;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({
    name: "",
    category: "",
    minCount: "",
    maxCount: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await getAllProductsPublic();
      const data = res.data || [];
      setProducts(data.map((p: Product) => ({ ...p, draftCount: p.count })));
    } finally {
      setLoading(false);
    }
  }

  function filteredProducts() {
    return products.filter((p) => {
      if (
        filters.name &&
        !p.name.toLowerCase().includes(filters.name.toLowerCase())
      )
        return false;
      if (filters.category && p.category !== filters.category) return false;
      if (filters.minCount && p.count < parseFloat(filters.minCount))
        return false;
      if (filters.maxCount && p.count > parseFloat(filters.maxCount))
        return false;
      return true;
    });
  }

  function resetFilters() {
    setFilters({ name: "", category: "", minCount: "", maxCount: "" });
  }

  function setDraft(id: number, value: number) {
    if (value < 0) return;
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

      {/* 🔥 REPLACED FILTERS */}
      <GlobalFilters
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        fields={[
          { key: "name", placeholder: "Search name...", className: "w-48" },
          { key: "category", placeholder: "Category...", className: "w-48" },
          {
            key: "minCount",
            placeholder: "Min Count",
            type: "number",
            className: "w-32",
          },
          {
            key: "maxCount",
            placeholder: "Max Count",
            type: "number",
            className: "w-32",
          },
        ]}
      />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts().map((p) => {
          const hasChanges = p.draftCount !== p.count;
          return (
            <div
              key={p.id}
              className="border rounded-lg p-3 flex items-center gap-3"
            >
              <img
                src={`${MEDIA_URL}/${p.image}`}
                alt={p.name}
                className="h-12 w-12 object-cover rounded flex-shrink-0"
              />

              <h2 className="font-semibold flex-1 min-w-0 truncate">
                {p.name}
              </h2>

              <Input
                type="number"
                className="w-16 text-center flex-shrink-0"
                value={p.draftCount}
                min={0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0) setDraft(p.id, val);
                }}
              />

              {hasChanges && (
                <Button
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => saveCount(p)}
                  disabled={saving === p.id}
                >
                  {saving === p.id ? "..." : "Save"}
                </Button>
              )}
            </div>
          );
        })}

        {!loading && filteredProducts().length === 0 && (
          <p className="text-muted-foreground">No products found.</p>
        )}
      </div>
    </div>
  );
}
