/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addToCart } from "@/lib/apiUtils";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDialog({
  open,
  onOpenChange,
  productId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productId: number | null;
}) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    async function fetchOne() {
      try {
        const res = await fetch(`${API_URL}/product/getOne/${productId}/`);
        const json = await res.json();
        if (json.status === "success") {
          setSelectedProduct(json.data);
          setQuantity(1);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }
    fetchOne();
  }, [productId]);

  async function handleAddToCart() {
    if (!selectedProduct) return;
    setAdding(true);
    setMessage(null);
    try {
      await addToCart(selectedProduct.id, quantity);
      setMessage("✅ Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage("❌ Failed to add to cart");
    } finally {
      setAdding(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{selectedProduct?.name}</DialogTitle>
        </DialogHeader>

        {selectedProduct ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 relative">
              <Image
                src={`${MEDIA_URL}/${selectedProduct.image}`}
                alt={selectedProduct.name}
                fill
                className="object-contain"
              />
            </div>

            {selectedProduct.video && (
              <video
                src={`${MEDIA_URL}/${selectedProduct.video}`}
                controls
                className="w-full rounded-lg shadow"
              />
            )}

            {selectedProduct.price && (
              <p className="text-lg font-semibold text-gray-800">
                ${selectedProduct.price}
              </p>
            )}

            {selectedProduct.description && (
              <p className="text-sm text-center text-gray-600">
                {selectedProduct.description}
              </p>
            )}

            {selectedProduct.rate !== undefined && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < (selectedProduct.rate ?? 0) ? "⭐" : "☆"}
                  </span>
                ))}
                <span className="text-xs text-gray-500">
                  ({selectedProduct.count ?? 0} reviews)
                </span>
              </div>
            )}

            {selectedProduct.__service__ && (
              <div className="flex items-center gap-2 mt-2">
                <Image
                  src={`${MEDIA_URL}/${selectedProduct.__service__.image}`}
                  alt={selectedProduct.__service__.name}
                  width={24}
                  height={24}
                />
                <span className="text-sm text-gray-700">
                  {selectedProduct.__service__.name}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </Button>

            {message && (
              <p className="text-sm text-center text-gray-600">{message}</p>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
