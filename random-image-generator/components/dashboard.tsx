"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function UserDashboard({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* ---------- LEFT COLUMN ---------- */}
      <div className="flex flex-col gap-6">

        {/* Category Selector */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="w-full border rounded-md bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Images</option>
            {/* Later: map user-created categories */}
          </select>
        </div>

        {/* Generate Random Image */}
        <Button size="lg" className="w-full">
          Generate Random Image
        </Button>

        {/* Upload Image */}
        <Button variant="outline" size="lg" className="w-full">
          Upload Image
        </Button>
      </div>

      {/* ---------- RIGHT COLUMN ---------- */}
      <div className="flex flex-col gap-6">

        {/* Featured Generated Image */}
        <Card className="min-h-[250px] flex items-center justify-center">
          <CardContent className="p-6 flex items-center justify-center w-full h-full">
            <span className="text-sm text-muted-foreground">
              No image generated yet.
            </span>
          </CardContent>
        </Card>

        {/* Gallery Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Your Gallery</h2>

          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              No images uploaded yet. Upload an image to get started!
            </CardContent>
          </Card>

          {/* Later: replace with image grid */}
        </div>
      </div>
    </div>
  );
}
