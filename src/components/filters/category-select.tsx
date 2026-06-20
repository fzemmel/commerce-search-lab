import type { ChangeEventHandler } from "react";

import { Select } from "@/components/ui/select";
import type { ProductCategory } from "@/types/product";

type CategoryOption = {
  value: ProductCategory;
  label: string;
};

type CategorySelectProps = {
  value: ProductCategory | "all";
  options: CategoryOption[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
};

export function CategorySelect({ value, options, onChange }: CategorySelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
      <Select value={value} onChange={onChange}>
        <option value="all">All categories</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
