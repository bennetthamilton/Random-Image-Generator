"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Image } from "@/types/image";

type ImagesContextType = {
  images: Image[];
  refreshImages: (category_id?: string | null) => Promise<void>;
  uploadImages: (files: File[], category_id?: string | null) => Promise<void>;
  deleteImage: (path: string) => Promise<void>;
};

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export function ImagesProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<Image[]>([]);

  // Fetch images
  const refreshImages = useCallback(async (category_id?: string | null) => {
    const params =
      category_id && category_id !== "all"
        ? `?category_id=${category_id}`
        : "";

    const res = await fetch(`/api/images${params}`);
    const data = await res.json();

    setImages(data.images || []);
  }, []);

  // Upload images
  const uploadImages = useCallback(
    async (files: File[], category_id?: string | null) => {
      if (!files.length) return;

      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }

      // category_id can be null (uncategorized)
      if (category_id) {
        formData.append("category_id", category_id);
      }

      console.log("UPLOADING FILES:", files);
      console.log("CATEGORY_ID:", category_id);

      await fetch("/api/images", {
        method: "POST",
        body: formData,
      });
    }, []);

  // Delete image
  const deleteImage = useCallback(async (path: string) => {
    const res = await fetch("/api/images", {
      method: "DELETE",
      body: JSON.stringify({ path }),
    });

    await res.json();
    setImages((prev) => prev.filter((img) => img.path !== path));
  }, []);

  return (
    <ImagesContext.Provider value={{ images, refreshImages, uploadImages, deleteImage }}>
      {children}
    </ImagesContext.Provider>
  );
}

// Hook
export function useImages() {
  const context = useContext(ImagesContext);
  if (!context) throw new Error("useImages must be used within ImagesProvider");
  return context;
}
