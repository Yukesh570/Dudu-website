import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

export type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  video?: string;
};

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
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
          {products.map((p) => (
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
                <Button size="icon" variant="ghost" onClick={() => onEdit(p)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(p.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
          {!loading && products.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-muted-foreground">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
