"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image } from "@/types/image";

type DashboardGalleryProps = {
  featuredImage?: Image | null;
  gallery: Image[];
  onEdit: () => void;
};

export function DashboardGallery({ featuredImage, gallery, onEdit }: DashboardGalleryProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="min-h-[250px] flex items-center justify-center">
        <CardContent className="p-6 flex items-center justify-center w-full h-full">
          {featuredImage ? (
            <img src={featuredImage.url} alt={featuredImage.filename} className="max-h-60 object-contain" />
          ) : (
            <span className="text-sm text-muted-foreground">
              No image generated yet.
            </span>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Your Gallery</h2>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEdit}
          >
            Edit
          </Button>
        </div>

        {gallery.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              No images uploaded yet. Upload an image to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {gallery.map((img) => (
              <Card key={img.id}>
                <CardContent className="p-2">
                  <img src={img.url} alt={img.filename} className="object-cover w-full h-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
