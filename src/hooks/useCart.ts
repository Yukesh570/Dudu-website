/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCart.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { getCart } from "../lib/apiUtils";

import { useToast } from "@/hooks/useToast"

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
  };
};

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const { showError } = useToast();

  const fetchCart = useCallback(async () => {
    setLoading(true);
    
    try {
      const json = await getCart();
     
      if (json.status === "success") {
        const normalized: CartItem[] = json.data.flatMap((shop: any) =>
          shop.items.map((item: any) => ({
            id: item.id,
            quantity: item.qty,
            product: {
              id: item.productId,
              name: item.name,
              image: item.img,
              price: item.price,
            },
          }))
        );

        setCart(normalized);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      showError("Failed to fetch cart");
      
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return { cart, loading, loggedIn, refetch: fetchCart };
}
