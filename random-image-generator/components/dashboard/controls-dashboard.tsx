"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type DashboardControlsProps = {
  category: string;
  categories: string[];
  imagesCount: number;
  onCategoryChange: (category: string) => void;
  onGenerate: () => void;
  onUpload: () => void;
  createCategory: (name: string) => Promise<void>;
};

export function DashboardControls({
  category,
  categories,
  imagesCount,
  onCategoryChange,
  onGenerate,
  onUpload,
  createCategory,
}: DashboardControlsProps) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const isCreating = category === "__new__";

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;

    const finalName = newCategoryName.trim();
    await createCategory(finalName);

    // Reset state + switch dropdown to created category
    setNewCategoryName("");
    onCategoryChange(finalName);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* CATEGORY DROPDOWN */}
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

          <option value="__new__">Create New...</option>
        </select>
      </div>

      {/* NEW CATEGORY MODE */}
      {isCreating ? (
        <div className="flex flex-col gap-4 border rounded-md p-4 bg-muted/30">
          <Label htmlFor="newCategory">New Category Name</Label>
          <input
            id="newCategory"
            type="text"
            placeholder="Enter category name..."
            className="w-full border rounded-md bg-background px-3 py-2 text-sm"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />

          {/* TODO button - select from uploaded images to categorize */}
          {/* <Button
            variant="outline"
            size="lg"
            className="w-full"
            disabled={imagesCount === 0}
          >
            Select From Uploaded Images
          </Button> */}

          {/* CREATE CATEGORY */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleCreate}
            disabled={!newCategoryName.trim()}
          >
            Create Category
          </Button>
        </div>
      ) : (
        <>
          <Button
            size="lg"
            className="w-full"
            onClick={onGenerate}
            disabled={imagesCount === 0}
          >
            Generate Random Image
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onUpload}
          >
            Upload Image
          </Button>
        </>
      )}
    </div>
  );
}
