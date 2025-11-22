/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ReactSimpleWysiwyg from "react-simple-wysiwyg";
import { Product } from "./ProductTable";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode: boolean;
  product: Product | null;
  onSubmit: (formData: any) => void;
}

export default function ProductFormDialog({
  open,
  onOpenChange,
  editMode,
  product,
  onSubmit,
}: ProductFormDialogProps) {
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

  useEffect(() => {
    if (editMode && product) {
      setFormData({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        rate: (product as any).rate || 1,
        count: (product as any).count || 0,
        image: null,
        video: null,
      });
    } else {
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
    }
  }, [editMode, product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Product" : "Add Product"}</DialogTitle>
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
            {editMode && product?.image && (
              <div className="mb-2 flex items-center gap-3 p-2 border rounded bg-muted/30">
                <img
                  src={`${MEDIA_URL}/${product.image}`}
                  alt="Current"
                  className="h-16 w-16 object-cover rounded"
                />
                <span className="text-sm text-muted-foreground">
                  Current image
                </span>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files?.[0] })
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              {editMode ? "Upload new image to replace current one" : ""}
            </p>
          </div>
          <div>
            <Label>Video</Label>
            {editMode && product?.video && (
              <div className="mb-2 p-2 border rounded bg-muted/30">
                <video
                  src={`${MEDIA_URL}/${product.video}`}
                  className="h-32 w-full object-contain rounded"
                  controls
                />
                <span className="text-sm text-muted-foreground mt-1 block">
                  Current video
                </span>
              </div>
            )}
            <Input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setFormData({ ...formData, video: e.target.files?.[0] })
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              {editMode ? "Upload new video to replace current one" : ""}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{editMode ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
