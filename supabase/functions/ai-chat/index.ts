import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT =
  "Kamu asisten AI LAZISMU Jakarta Pusat, jawab singkat & akurat soal zakat/infaq/wakaf/program LAZISMU dalam Bahasa Indonesia.";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function callGemini(question: string, apiKey: string): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: question }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini error ${res.status}: ${t}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const provider = Deno.env.get("AI_PROVIDER") || "gemini";
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    const body = await req.json();
    const question: string = body?.question?.toString().trim();
    if (!question) {
      return json({ error: "Pertanyaan kosong" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // "AI belum aktif" hanya jika API key untuk provider terkait kosong —
    // bukan karena AI_PROVIDER tidak diset (default sudah 'gemini').
    const keyForProvider = provider === "gemini" ? geminiKey : null;
    if (!keyForProvider) {
      const staticReply =
        "Fitur Tanya Jawab AI belum aktif, admin sedang menyiapkan.";
      await supabase.from("zakat_chat_logs").insert({
        pertanyaan: question,
        jawaban: staticReply,
        provider,
        status: "inactive",
      });
      return json({ answer: staticReply, active: false }, 200);
    }

    let answer: string;
    try {
      answer = await callGemini(question, geminiKey!);
    } catch (aiErr) {
      const msg = (aiErr as Error).message;
      await supabase.from("zakat_chat_logs").insert({
        pertanyaan: question,
        jawaban: null,
        provider,
        status: `error: ${msg}`,
      });
      return json({ error: "AI gagal menjawab, coba lagi nanti." }, 502);
    }

    await supabase.from("zakat_chat_logs").insert({
      pertanyaan: question,
      jawaban: answer,
      provider,
      status: "ok",
    });

    return json({ answer, active: true, provider }, 200);
  } catch (err) {
    return json({ error: (err as Error).message || "Server error" }, 500);
  }
});
