"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/contexts/categoryContext";

export function CategoryManager() {
  const { categories, renameCategory, deleteCategory } = useCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const handleRename = async (id: string) => {
    if (!newName.trim()) return;
    await renameCategory(id, newName.trim());
    setEditingId(null);
    setNewName("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await deleteCategory(id);
  };

  return (
    <div className="flex flex-col gap-4">
      {categories.map((cat) => (
        <div key={cat.id} className="flex items-center gap-2">
          {editingId === cat.id ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <Button size="sm" onClick={() => handleRename(cat.id)}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <span>{cat.name}</span>
              <Button size="sm" onClick={() => { setEditingId(cat.id); setNewName(cat.name); }}>
                Rename
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
