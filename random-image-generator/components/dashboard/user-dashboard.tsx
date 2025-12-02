"use client";

import { useEffect, useState } from "react";
import { DashboardControls } from "./controls-dashboard";
import { DashboardGallery } from "./gallery-dashboard";
import { useImages } from "@/contexts/imagesContext";
import { useCategories } from "@/contexts/categoryContext";

export default function UserDashboard({ user }: { user: any }) {
  const { images, refreshImages } = useImages();
  const {
    categories,
    refreshCategories,
    createCategory,
  } = useCategories();

  const [category, setCategory] = useState("all");

  // Load categories on mount
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // Load images when category changes
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);

    // "__new__" mode → do NOT load images
    if (cat === "__new__") return;

    refreshImages(cat);
  };

  const handleGenerate = () => {
    // TODO: implement generate logic
  };

  const handleUpload = () => {
    // TODO: trigger upload modal
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

      <DashboardGallery featuredImage={null} gallery={images} />
    </div>
  );
}
