/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  getAuthToken,
  getAllProductsPublic,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/apiUtils";
import GlobalFilters, { FilterField } from "@/components/Filters"; // import your global filters
import ProductTable, { Product } from "./components/ProductTable";
import ProductFormDialog from "./components/ProductFormDialog";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [filters, setFilters] = useState<Record<string, string>>({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const token = getAuthToken();

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const json = await getAllProductsPublic();
      if (json.status === "success") setProducts(json.data);
    } catch (err) {
      console.error("Error fetching products:", err);
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
      if (filters.minPrice && p.price < parseFloat(filters.minPrice))
        return false;
      if (filters.maxPrice && p.price > parseFloat(filters.maxPrice))
        return false;
      return true;
    });
  }

  function resetFilters() {
    setFilters({ name: "", category: "", minPrice: "", maxPrice: "" });
  }

  function handleEdit(product: Product) {
    setEditMode(true);
    setCurrentProduct(product);
    setDialogOpen(true);
  }

  function handleCreate() {
    setEditMode(false);
    setCurrentProduct(null);
    setDialogOpen(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete product");
    }
  }

  async function handleSubmit(formData: any) {
    const body = new FormData();
    body.append("name", formData.name);
    body.append("category", formData.category);
    body.append("price", formData.price.toString());
    body.append("description", formData.description);
    body.append("rate", formData.rate.toString());
    body.append("count", formData.count.toString());
    if (formData.image) body.append("image", formData.image);
    if (formData.video) body.append("video", formData.video);

    try {
      if (editMode) {
        await updateProduct(formData.id, body);
      } else {
        await createProduct(body);
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving:", err);
      alert(err instanceof Error ? err.message : "Failed to save product");
    }
  }

  const filterFields: FilterField[] = [
    { key: "name", placeholder: "Search name...", className: "w-48" },
    { key: "category", placeholder: "Category...", className: "w-48" },
    {
      key: "minPrice",
      placeholder: "Min Price",
      type: "number",
      className: "w-32",
    },
    {
      key: "maxPrice",
      placeholder: "Max Price",
      type: "number",
      className: "w-32",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* 🔥 Replaced ProductFilters with GlobalFilters */}
      <GlobalFilters
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        fields={filterFields}
      />

      <ProductTable
        products={filteredProducts()}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editMode={editMode}
        product={currentProduct}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
