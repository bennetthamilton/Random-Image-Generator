import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/categories - Retrieve categories for the authenticated user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ categories: data });
}

// POST /api/categories - Create a new category for the authenticated user
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Supabase auth error:", userError);
      return NextResponse.json({ error: "Auth error" }, { status: 500 });
    }

    if (!user) {
      console.error("No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      console.error("Invalid category name:", name);
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    // Check for duplicate category
    const { data: existing, error: existingError } = await supabase
      .from("categories")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", name)
      .maybeSingle();

    if (existingError) {
      console.error("Error checking existing category:", existingError);
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existing) {
      console.error("Category already exists:", name);
      return NextResponse.json({ error: "You already have a category with that name" }, { status: 409 });
    }

    // Insert new category
    const { data, error } = await supabase
      .from("categories")
      .insert({ name, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Error inserting category:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Category created successfully:", data);

    return NextResponse.json({ category: data });
  } catch (err) {
    console.error("Unexpected error in POST /api/categories:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
