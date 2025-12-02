import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Params = {
  params: {
    id: string;
  };
};

// GET /api/categories/[id] - Retrieve a specific category by ID
export async function GET(_req: Request, { params }: Params) {
  const { id } = params;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json(data);
}

// PATCH /api/categories/[id] - Update a specific category by ID
export async function PATCH(req: Request, { params }: Params) {
  const { id } = params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("categories")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE /api/categories/[id] - Delete a specific category by ID
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = params;

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ success: true });
}
