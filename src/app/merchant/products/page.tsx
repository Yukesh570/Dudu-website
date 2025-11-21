/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, PlusCircle, X } from "lucide-react";
import {
  getAuthToken,
  getAllProductsPublic,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/apiUtils";
import ReactSimpleWysiwyg from "react-simple-wysiwyg";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  video?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [formData, setFormData] = useState<any>({
    id: null,
    name: "",
    category: "",
    price: "",
    description: "",
    rate: 1,
    count: 0,
    image: null,
    video: null,
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
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      rate: 1,
      count: 0,
      image: null,
      video: null,
    });
    setDialogOpen(true);
  }

  function handleCreate() {
    setEditMode(false);
    setFormData({
      id: null,
      name: "",
      category: "",
      price: "",
      description: "",
      rate: 1,
      count: 0,
      image: null,
      video: null,
    });
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-end">
        <Input
          placeholder="Search name..."
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="w-48"
        />
        <Input
          placeholder="Category..."
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="w-48"
        />
        <Input
          placeholder="Min Price"
          type="number"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          className="w-32"
        />
        <Input
          placeholder="Max Price"
          type="number"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="w-32"
        />
        <Button variant="outline" onClick={resetFilters}>
          <X className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Description</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts().map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">
                  {p.image && (
                    <img
                      src={`${MEDIA_URL}/${p.image}`}
                      alt={p.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2 max-w-xs truncate">{p.description}</td>
                <td className="p-2 text-right space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && filteredProducts().length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-muted-foreground"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Category (case-sensitive)</Label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Price (in USD)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <ReactSimpleWysiwyg
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Rate</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Count</Label>
              <Input
                type="number"
                value={formData.count}
                onChange={(e) =>
                  setFormData({ ...formData, count: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files?.[0] })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                {editMode ? "Leave empty to keep current image" : ""}
              </p>
            </div>
            <div>
              <Label>Video</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setFormData({ ...formData, video: e.target.files?.[0] })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                {editMode ? "Leave empty to keep current video" : ""}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{editMode ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
