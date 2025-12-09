"use client";

import { useEffect, useState } from "react";
import { DashboardControls } from "./controls-dashboard";
import { DashboardGallery } from "./gallery-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useImages } from "@/contexts/imagesContext";
import { useCategories } from "@/contexts/categoryContext";
import { Image } from "@/types/image";
import { Check } from "lucide-react";

export default function UserDashboard({ user }: { user: any }) {
  const { images, refreshImages, uploadImages } = useImages();
  const {
    categories,
    refreshCategories,
    createCategory,
  } = useCategories();

  const [category, setCategory] = useState("all");

  const [featuredImage, setFeaturedImage] = useState<Image | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // -----------------------------
  // Load categories on mount
  // -----------------------------
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // -----------------------------
  // Load all images on mount
  // -----------------------------
  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  // -----------------------------
  // Load images when category changes
  // -----------------------------
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);

    // "__new__" mode → do NOT load images
    if (cat === "__new__") return;

    refreshImages(cat);
  };

  // -----------------------------
  // Generate Random Featured Image
  // -----------------------------
  const handleGenerate = () => {
    if (images.length === 0) {
      setFeaturedImage(null);
      return;
    }
    
    // Pick a random image from current images
    const randomIndex = Math.floor(Math.random() * images.length);
    setFeaturedImage(images[randomIndex]);
  };

  // -----------------------------
  // Upload Images Handler
  // -----------------------------
  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";

    input.onchange = async (e: any) => {
      const files = Array.from(e.target.files) as File[];
      if (files.length === 0) return;

      const category_id =
        category === "all" || category === "__new__" ? null : category;

      // Upload
      await uploadImages(files, category_id);

      // Refresh based on UI state (NOT category_id)
      if (category === "all") {
        await refreshImages();        // show ALL images
      } else {
        await refreshImages(category); // show category images
      }
    };

    input.click();
  };

  // -----------------------------
  // Bulk Categorization
  // -----------------------------
  const handleBulkCategorize = async (category_id: string | null) => {
    if (selectedImages.length === 0) return;

    await fetch("/api/images/update-category", {
      method: "POST",
      body: JSON.stringify({
        category_id,
        image_ids: selectedImages,
      }),
    });

    await refreshImages(category === "all" ? undefined : category);
    setSelectedImages([]);
  };

  // -----------------------------
  // Bulk Delete
  // -----------------------------
  const handleBulkDelete = async () => {
    for (const id of selectedImages) {
      const img = images.find((i) => i.id === id);
      if (!img) continue;

      await fetch("/api/images", {
        method: "DELETE",
        body: JSON.stringify({ path: img.path }),
      });
    }

    await refreshImages(category === "all" ? undefined : category);

    setSelectedImages([]);
    setEditMode(false);
  };

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* ========================================= */}
      {/* MAIN DASHBOARD */}
      {/* ========================================= */}
      <DashboardControls
        category={category}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))} 
        imagesCount={images.length}
        onCategoryChange={handleCategoryChange}
        onGenerate={handleGenerate}
        onUpload={handleUpload}
        createCategory={async (name: string) => {
          await createCategory(name);
          await refreshCategories();

          // After creation, auto-select category
          setCategory(name);
          refreshImages(name);
        }}
      />

      <DashboardGallery featuredImage={featuredImage} gallery={images} onEdit={() => setEditMode(true)} />

      {/* ========================================= */}
      {/* EDIT OVERLAY WINDOW */}
      {/* ========================================= */}
      {editMode && (
        <div
          className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center"
          onClick={() => setEditMode(false)}
        >
          <Card
            className="max-w-5xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="space-y-6 pt-6">

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Gallery</h2>

                <Button variant="ghost" onClick={() => setEditMode(false)}>
                  Close
                </Button>
              </div>

              {/* CATEGORY FILTER */}
              <div className="space-y-2">
                <Label>Filter by Category</Label>
                <select
                  className="border rounded-md px-3 py-2 bg-background"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    refreshImages(e.target.value === "all" ? undefined : e.target.value);
                  }}
                >
                  <option value="all">All</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* IMAGE SELECTION GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img) => {
                  const active = selectedImages.includes(img.id);

                  return (
                    <div
                      key={img.id}
                      className={`
                        relative rounded-lg overflow-hidden border cursor-pointer
                        ${active ? "border-primary ring-2 ring-primary" : "border-muted"}
                      `}
                      onClick={() => {
                        setSelectedImages((prev) =>
                          prev.includes(img.id)
                            ? prev.filter((id) => id !== img.id)
                            : [...prev, img.id]
                        );
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.filename}
                        className="object-cover w-full h-36"
                      />

                      {active && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setSelectedImages([]);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  disabled={selectedImages.length === 0}
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </Button>

                {/* CATEGORIZE SELECTED (Dropdown) */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={selectedImages.length === 0}
                    >
                      Categorize Selected
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="z-[99999]">

                    <DropdownMenuLabel>Assign Category</DropdownMenuLabel>

                    <DropdownMenuItem onClick={() => handleBulkCategorize(null)}>
                      Uncategorized
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat.id}
                        onClick={() => handleBulkCategorize(cat.id)}
                      >
                        {cat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
