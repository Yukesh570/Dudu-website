/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

export default function ProductCard({
  product,
  onClick,
}: {
  product: any;
  onClick: () => void;
}) {
  return (
    <Card
      key={product.id}
      className="hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center p-4">
        <div className="w-20 h-20 relative mb-2">
          <Image
            src={`${MEDIA_URL}/${product.image}`}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        <span className="text-sm font-medium">{product.name}</span>
      </CardContent>
    </Card>
  );
}
