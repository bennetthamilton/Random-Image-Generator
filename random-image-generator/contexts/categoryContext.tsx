"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { Category } from "@/types/category";

type CategoriesContextType = {
  categories: Category[];
  refreshCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  renameCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories
  const refreshCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }, []);

  // Create a new category
  const createCategory = useCallback(
    async (name: string) => {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      await refreshCategories();
    },
    [refreshCategories]
  );

  // Rename category
  const renameCategory = useCallback(
    async (id: string, name: string) => {
      await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      await refreshCategories();
    },
    [refreshCategories]
  );

  // Delete category
  const deleteCategory = useCallback(
    async (id: string) => {
      await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    },
    []
  );

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        refreshCategories,
        createCategory,
        renameCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) throw new Error("useCategories must be used within CategoriesProvider");
  return context;
}
