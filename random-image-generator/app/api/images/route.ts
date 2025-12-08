import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/images - Retrieve images for the authenticated user
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ message: "Must be logged in" }, { status: 401 });

  const url = new URL(request.url);
  const categoryId = url.searchParams.get("category_id");

  // Build query
  let query = supabase
    .from("images")
    .select(`
      *,
      categories:category_id ( name )
    `)
    .eq("user_id", user.id);

  // Filter by category at the DB level
  if (categoryId && categoryId !== "all") {
    query = query.eq("category_id", categoryId);
  }

  const { data: images, error } = await query.order("created_at", { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Attach public URL
  const result = images.map((img) => ({
    id: img.id,
    user_id: img.user_id,
    path: img.path,
    filename: img.filename,
    category_id: img.category_id,
    category_name: img.categories?.name ?? null,
    created_at: img.created_at,
    updated_at: img.updated_at,
    url: supabase.storage.from("images").getPublicUrl(img.path).data.publicUrl,
  }));

  return NextResponse.json({ images: result });
}

// POST /api/images - Upload images
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ message: "Must be logged in" }, { status: 401 });

  const formData = await request.formData();

  // category_id is nullable, so default = null
  const category_id = (formData.get("category_id") as string) || null;
  const files = formData.getAll("images") as File[];

  if (!files.length)
    return NextResponse.json({ message: "No files uploaded" }, { status: 400 });

  const uploaded: any[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = file.name;
    const path = `${user.id}/images/${Date.now()}-${i}-${filename}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(path, file);

    if (uploadError) continue;

    // Insert into table
    const { data: newImage, error: insertError } = await supabase
      .from("images")
      .insert({
        user_id: user.id,
        path,
        filename,
        category_id,
      })
      .select()
      .single();

    if (!insertError && newImage) {
      uploaded.push({
        ...newImage,
        url: supabase.storage.from("images").getPublicUrl(newImage.path).data
          .publicUrl,
      });
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
