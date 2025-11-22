"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface FilterField {
  key: string;
  placeholder: string;
  type?: string;
  className?: string;
}

interface GlobalFiltersProps {
  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;
  fields: FilterField[];
  onReset: () => void;
}

export default function GlobalFilters({
  filters,
  setFilters,
  fields,
  onReset,
}: GlobalFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-end">
      {fields.map((field) => (
        <Input
          key={field.key}
          placeholder={field.placeholder}
          type={field.type || "text"}
          value={filters[field.key]}
          onChange={(e) =>
            setFilters({
              ...filters,
              [field.key]: e.target.value,
            })
          }
          className={field.className || "w-40"}
        />
      ))}

      <Button variant="outline" onClick={onReset}>
        <X className="h-4 w-4 mr-1" /> Clear
      </Button>
    </div>
  );
}
