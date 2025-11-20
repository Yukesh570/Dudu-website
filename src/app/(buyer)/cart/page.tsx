"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/hooks/useCart";
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

export default function CartPage() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const { cart, loading, loggedIn } = useCart();

  if (loading) return <p className="p-4">Loading...</p>;

  if (!loggedIn) {
    return (
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-4">
            Please log in to view your cart.
          </p>
          <Button asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (cart.length === 0) {
    return <p className="p-6 text-center">🛒 Your cart is empty.</p>;
  }

  return (
    <section className="p-6">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="mr-2"
                />
                {item.product ? (
                  <>
                    <div className="w-12 h-12 relative inline-block">
                      <Image
                        src={`${MEDIA_URL}/${item.product.image}`}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="ml-2">{item.product.name}</span>
                  </>
                ) : (
                  <span className="text-gray-500">Unknown product</span>
                )}
              </TableCell>
              <TableCell>
                {item.product ? `Rs. ${item.product.price}` : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button size="sm" variant="outline">
                    +
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {item.product
                  ? `Rs. ${item.product.price * item.quantity}`
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-end">
        <Button size="lg">Proceed to Checkout</Button>
      </div>
    </section>
  );
}
