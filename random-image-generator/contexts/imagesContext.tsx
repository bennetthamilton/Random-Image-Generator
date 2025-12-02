"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Image } from "@/types/image";

type ImagesContextType = {
  images: Image[];
  refreshImages: (category?: string) => Promise<void>;
  uploadImages: (files: File[], category?: string) => Promise<void>;
  deleteImage: (path: string) => Promise<void>;
};

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export function ImagesProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<Image[]>([]);

  // Fetch images
  const refreshImages = useCallback(async (category?: string) => {
    const params = category ? `?category=${category}` : "";
    const res = await fetch(`/api/images${params}`);
    const data = await res.json();
    setImages(data.images || []);
  }, []);

  // Upload images
  const uploadImages = useCallback(async (files: File[], category?: string) => {
    if (!files.length) return;
    const formData = new FormData();
    for (const file of files) formData.append("images", file);
    if (category) formData.append("category", category);

    const res = await fetch("/api/images", { method: "POST", body: formData });
    await res.json();
    await refreshImages(category);
  }, [refreshImages]);

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
