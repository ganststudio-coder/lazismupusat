import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = (url.pathname.split("/admin-login/")[1] ?? "").replace(/^\/+/, "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    if (path === "" || path === "login") {
      const { username, password } = await req.json();
      if (!username || !password) {
        return json({ error: "Username dan password wajib diisi" }, 400);
      }

      const { data: admin, error } = await supabase
        .from("admin_users")
        .select("id, username, email, role, password_hash, created_at")
        .eq("username", username)
        .maybeSingle();

      if (error || !admin) {
        return json({ error: "Username atau password salah" }, 401);
      }

      const hash = await sha256(password);
      if (hash !== admin.password_hash) {
        return json({ error: "Username atau password salah" }, 401);
      }

      // enforce max 4 admins when creating new (not here — login only)
      const { password_hash: _ph, ...safe } = admin;
      return json({ admin: safe }, 200);
    }

    if (path === "create-admin") {
      // Only master can create new admin
      const { master_username, new_username, new_email, new_password, new_role } = await req.json();
      if (!master_username || !new_username || !new_email || !new_password) {
        return json({ error: "Data tidak lengkap" }, 400);
      }

      const { data: master } = await supabase
        .from("admin_users")
        .select("role")
        .eq("username", master_username)
        .maybeSingle();
      if (!master || master.role !== "master") {
        return json({ error: "Hanya master yang dapat menambah admin" }, 403);
      }

      const { count } = await supabase
        .from("admin_users")
        .select("*", { count: "exact", head: true });
      if ((count ?? 0) >= 4) {
        return json({ error: "Maksimal 4 akun admin" }, 400);
      }

      const hash = await sha256(new_password);
      const { data: created, error: createErr } = await supabase
        .from("admin_users")
        .insert({
          username: new_username,
          email: new_email,
          password_hash: hash,
          role: new_role || "regular",
        })
        .select("id, username, email, role, created_at")
        .single();

      if (createErr) {
        return json({ error: createErr.message }, 400);
      }
      return json({ admin: created }, 201);
    }

    if (path === "delete-admin") {
      const { master_username, target_id } = await req.json();
      if (!master_username || !target_id) {
        return json({ error: "Data tidak lengkap" }, 400);
      }
      const { data: master } = await supabase
        .from("admin_users")
        .select("role")
        .eq("username", master_username)
        .maybeSingle();
      if (!master || master.role !== "master") {
        return json({ error: "Hanya master yang dapat menghapus admin" }, 403);
      }
      const { data: target } = await supabase
        .from("admin_users")
        .select("role, username")
        .eq("id", target_id)
        .maybeSingle();
      if (!target) return json({ error: "Admin tidak ditemukan" }, 404);
      if (target.role === "master") {
        return json({ error: "Master tidak dapat dihapus" }, 400);
      }
      const { error: delErr } = await supabase
        .from("admin_users")
        .delete()
        .eq("id", target_id);
      if (delErr) return json({ error: delErr.message }, 400);
      return json({ ok: true }, 200);
    }

    if (path === "change-password") {
      const { username, old_password, new_password } = await req.json();
      if (!username || !old_password || !new_password) {
        return json({ error: "Data tidak lengkap" }, 400);
      }
      const { data: admin } = await supabase
        .from("admin_users")
        .select("password_hash")
        .eq("username", username)
        .maybeSingle();
      if (!admin) return json({ error: "Admin tidak ditemukan" }, 404);
      const oldHash = await sha256(old_password);
      if (oldHash !== admin.password_hash) {
        return json({ error: "Password lama salah" }, 401);
      }
      const newHash = await sha256(new_password);
      await supabase.from("admin_users").update({ password_hash: newHash }).eq("username", username);
      return json({ ok: true }, 200);
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    return json({ error: (err as Error).message || "Server error" }, 500);
  }

  function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
