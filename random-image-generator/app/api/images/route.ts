import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ message: "Must be logged in" }, { status: 401 });

  const url = new URL(request.url);
  const category = url.searchParams.get("category") || null;

  // Fetch image metadata from table
  const { data: images, error } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Filter by category if requested
  const filtered = category && category !== "all"
    ? images.filter(img => img.category === category)
    : images;

  // Attach public URL from storage
  const imagesWithUrls = filtered.map(img => ({
    ...img,
    url: supabase.storage.from("images").getPublicUrl(img.path).data.publicUrl,
  }));

  return NextResponse.json({ images: imagesWithUrls });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ message: "Must be logged in" }, { status: 401 });

  const formData = await request.formData();
  const category = (formData.get("category") as string) || "all";
  const files = formData.getAll("images") as File[];

  if (!files.length) return NextResponse.json({ message: "No files uploaded" }, { status: 400 });

  const uploaded: any[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = file.name;
    const path = `${user.id}/images/${Date.now()}-${i}-${filename}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage.from("images").upload(path, file);

    if (!uploadError) {
      // Insert metadata into images table
      const { data: newImage, error: tableError } = await supabase
        .from("images")
        .insert({
          user_id: user.id,
          path,
          filename,
          category,
        })
        .select()
        .single();

      if (!tableError && newImage) {
        uploaded.push({
          ...newImage,
          url: supabase.storage.from("images").getPublicUrl(newImage.path).data.publicUrl,
        });
      }
    }
  }

  return NextResponse.json({ uploaded });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ message: "Must be logged in" }, { status: 401 });

  const { path } = await request.json();

  if (!path || !path.startsWith(`${user.id}/images/`))
    return NextResponse.json({ message: "Invalid image path" }, { status: 400 });

  // Delete from storage
  const { error: storageError } = await supabase.storage.from("images").remove([path]);
  if (storageError) return NextResponse.json({ message: storageError.message }, { status: 500 });

  // Delete from table
  const { error: tableError } = await supabase.from("images").delete().eq("path", path);
  if (tableError) return NextResponse.json({ message: tableError.message }, { status: 500 });

  return NextResponse.json({ message: "Image deleted successfully" });
}
