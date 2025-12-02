"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type DashboardControlsProps = {
  category: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onGenerate: () => void;
  onUpload: () => void;
};

export function DashboardControls({
  category,
  categories,
  onCategoryChange,
  onGenerate,
  onUpload,
}: DashboardControlsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="w-full border rounded-md bg-background px-3 py-2 text-sm"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <Button size="lg" className="w-full" onClick={onGenerate}>
        Generate Random Image
      </Button>

      <Button variant="outline" size="lg" className="w-full" onClick={onUpload}>
        Upload Image
      </Button>
    </div>
  );
}
