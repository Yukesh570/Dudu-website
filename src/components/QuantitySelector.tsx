"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  initial?: number;
  onChange?: (value: number) => void;
};

export function QuantitySelector({ initial = 1, onChange }: Props) {
  const [quantity, setQuantity] = useState(initial);

  const updateQuantity = (newVal: number) => {
    if (newVal < 1) return; // prevent zero/negative
    setQuantity(newVal);
    onChange?.(newVal);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => updateQuantity(quantity - 1)}
      >
        -
      </Button>
      <span className="w-6 text-center">{quantity}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => updateQuantity(quantity + 1)}
      >
        +
      </Button>
    </div>
  );
}
