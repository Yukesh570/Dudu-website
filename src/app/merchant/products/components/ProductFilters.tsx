import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface ProductFiltersType {
  name: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface ProductFiltersProps {
  filters: ProductFiltersType;
  setFilters: (filters: ProductFiltersType) => void;
  onReset: () => void;
}

export default function ProductFilters({
  filters,
  setFilters,
  onReset,
}: ProductFiltersProps) {
  return (
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
      <Button variant="outline" onClick={onReset}>
        <X className="h-4 w-4 mr-1" /> Clear
      </Button>
    </div>
  );
}
