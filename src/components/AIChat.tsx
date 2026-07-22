import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import type { ChatMessage } from '../lib/types';

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const QUICK_QS = [
  'Apa itu zakat maal?',
  'Bagaimana cara menghitung zakat profesi?',
  'Program apa saja di LAZISMU Jakarta Pusat?',
  'Kapan wajib membayar zakat fitrah?',
];

const INACTIVE_REPLY =
  'Fitur Tanya Jawab AI belum aktif, admin sedang menyiapkan.';

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'assistant',
      content: 'Assalamu\'alaikum! Saya asisten AI LAZISMU Jakarta Pusat. Tanyakan seputar zakat, infaq, wakaf, atau program kami.',
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [active, setActive] = useState<boolean | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || sending) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: q, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Gagal menghubungi AI');
      if (data.active === false) setActive(false);
      else if (data.active === true) setActive(true);
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.answer || INACTIVE_REPLY,
        ts: Date.now(),
      };
      setMessages((m) => [...m, reply]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { id: `e-${Date.now()}`, role: 'assistant', content: 'Maaf, terjadi kendala teknis. Silakan coba lagi nanti.', ts: Date.now() },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card flex h-[520px] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-neutral-100 bg-lazismu-green px-5 py-4 text-white">
        <div className="rounded-xl bg-white/15 p-2">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-lg font-semibold">Tanya Jawab AI</h3>
          <p className="text-xs text-white/70">Asisten cerdas seputar zakat & program LAZISMU</p>
        </div>
        {active === false && (
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
            Belum aktif
          </span>
        )}
        {active === true && (
          <span className="inline-flex items-center gap-1 rounded-full bg-lazismu-orange px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-white" /> Aktif
          </span>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-lazismu-cream/40 p-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-lazismu-green text-white' : 'bg-lazismu-orange text-white'}`}>
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-lazismu-green text-white' : 'bg-white text-neutral-700 shadow-soft'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lazismu-orange text-white">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-neutral-400 shadow-soft">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && !sending && (
        <div className="border-t border-neutral-100 px-4 py-2">
          <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            <Sparkles className="h-3 w-3" /> Coba pertanyaan ini
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_QS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border border-lazismu-green/20 bg-white px-3 py-1.5 text-xs text-lazismu-green transition hover:bg-lazismu-green hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 border-t border-neutral-100 bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pertanyaan Anda..."
          className="input flex-1"
          disabled={sending}
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-green px-4 py-2.5" aria-label="Kirim">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
