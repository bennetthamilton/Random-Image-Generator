"use client";

import { useEffect, useState } from "react";
import { DashboardControls } from "./controls-dashboard";
import { DashboardGallery } from "./gallery-dashboard";
import { useImages } from "@/contexts/imagesContext";
import { useCategories } from "@/contexts/categoryContext";
import { Image } from "@/types/image";

export default function UserDashboard({ user }: { user: any }) {
  const { images, refreshImages, uploadImages } = useImages();
  const {
    categories,
    refreshCategories,
    createCategory,
  } = useCategories();

  const [category, setCategory] = useState("all");
  const [featuredImage, setFeaturedImage] = useState<Image | null>(null);

  // Load categories on mount
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // Load all images on mount
  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  // Load images when category changes
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);

    // "__new__" mode → do NOT load images
    if (cat === "__new__") return;

    refreshImages(cat);
  };

  const handleGenerate = () => {
    if (images.length === 0) {
      setFeaturedImage(null);
      return;
    }
    
    // Pick a random image from current images
    const randomIndex = Math.floor(Math.random() * images.length);
    setFeaturedImage(images[randomIndex]);
  };

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <DashboardControls
        category={category}
        categories={["all", ...categories.map((c) => c.name)]}
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

      <DashboardGallery featuredImage={featuredImage} gallery={images} />
    </div>
  );
}
