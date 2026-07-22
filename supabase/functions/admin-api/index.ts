import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const TABLES = {
  programs: "programs",
  pengurus: "pengurus",
  galeri: "galeri",
  berita: "berita",
  slides: "dashboard_slides",
  donasi: "donasi_metode",
} as const;

type TableName = keyof typeof TABLES;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const url = new URL(req.url);
    const parts = (url.pathname.split("/admin-api/")[1] ?? "").split("/").filter(Boolean);
    const resource = parts[0] as TableName | "kontak" | "zakat";
    const id = parts[1];

    // ---------- settings (single-row) ----------
    if (resource === "kontak") {
      if (req.method === "GET") {
        const { data } = await supabase.from("kontak_settings").select("*").eq("id", 1).maybeSingle();
        return json({ data });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const { telepon, email, alamat, qris_image } = body;
        const { data, error } = await supabase
          .from("kontak_settings")
          .upsert({ id: 1, telepon, email, alamat, qris_image, updated_at: new Date().toISOString() })
          .select()
          .single();
        if (error) return json({ error: error.message }, 400);
        return json({ data });
      }
    }

    if (resource === "zakat") {
      if (req.method === "GET") {
        const { data } = await supabase.from("zakat_settings").select("*").eq("id", 1).maybeSingle();
        return json({ data });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const { harga_emas_per_gram, harga_beras_per_kg } = body;
        const { data, error } = await supabase
          .from("zakat_settings")
          .upsert({
            id: 1,
            harga_emas_per_gram: Number(harga_emas_per_gram),
            harga_beras_per_kg: Number(harga_beras_per_kg),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) return json({ error: error.message }, 400);
        return json({ data });
      }
    }

    // ---------- collection CRUD ----------
    const table = TABLES[resource as TableName];
    if (!table) return json({ error: "Unknown resource: " + resource }, 404);

    if (req.method === "GET") {
      let query = supabase.from(table).select("*");
      if (table === "berita") query = query.order("tanggal", { ascending: false });
      else query = query.order("urutan", { ascending: true });
      const { data, error } = await query;
      if (error) return json({ error: error.message }, 400);
      return json({ data });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabase.from(table).insert(body).select().single();
      if (error) return json({ error: error.message }, 400);
      return json({ data }, 201);
    }

    if (req.method === "PUT") {
      if (!id) return json({ error: "ID required" }, 400);
      const body = await req.json();
      const { data, error } = await supabase.from(table).update(body).eq("id", id).select().single();
      if (error) return json({ error: error.message }, 400);
      return json({ data });
    }

    if (req.method === "DELETE") {
      if (!id) return json({ error: "ID required" }, 400);
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (err) {
    return json({ error: (err as Error).message || "Server error" }, 500);
  }
});
