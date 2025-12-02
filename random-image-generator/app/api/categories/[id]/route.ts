import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/categories/[id] - Retrieve a specific category by ID
// export async function GET(_req: Request, { params }: Params) {
//   const { id } = params;

//   const { data, error } = await supabase
//     .from("categories")
//     .select("*")
//     .eq("id", id)
//     .single();

//   if (error) return NextResponse.json({ error }, { status: 500 });

//   return NextResponse.json(data);
// }

// PATCH /api/categories/[id] - Update a specific category by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await req.json();
  const { name } = body;

  const { data, error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ category: data });
}

// DELETE /api/categories/[id] - Delete a specific category by ID
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
