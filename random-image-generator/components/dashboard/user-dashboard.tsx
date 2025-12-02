"use client";

import { useState } from "react";
import { DashboardControls } from "./controls-dashboard";
import { DashboardGallery } from "./gallery-dashboard";
import { useImages } from "@/contexts/imagesContext";

export default function UserDashboard({ user }: { user: any }) {
  const { images, refreshImages } = useImages();
  const [category, setCategory] = useState("all");

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
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
        categories={["all"]} // TODO: replace with user's categories
        imagesCount={images.length}
        onCategoryChange={handleCategoryChange}
        onGenerate={handleGenerate}
        onUpload={handleUpload}
      />
      <DashboardGallery featuredImage={null} gallery={images} />
    </div>
  );
}
