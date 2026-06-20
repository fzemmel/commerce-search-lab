import type { ChangeEventHandler } from "react";

import { Input } from "@/components/ui/input";

type SearchInputProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">Search</span>
      <Input value={value} onChange={onChange} placeholder="Search name, brand, or description" type="search" />
    </label>
  );
}
