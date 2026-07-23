import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DashboardSlide } from '../lib/types';

const INTERVAL = 5000;

export function SlideCarousel({ slides }: { slides: DashboardSlide[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const count = slides.length;
  const go = useCallback((n: number) => setIdx(() => (n + count) % count), [count]);
  const next = useCallback(() => go(idx + 1), [go, idx]);
  const prev = useCallback(() => go(idx - 1), [go, idx]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    timer.current = window.setInterval(() => setIdx((c) => (c + 1) % count), INTERVAL);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [count, paused]);

  useEffect(() => { if (idx >= count && count > 0) setIdx(0); }, [idx, count]);

  if (count === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-lazismu-green-dark shadow-lift"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === idx ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={i !== idx}
          >
            <img src={s.image_url} alt={s.caption || ''} className="h-full w-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="absolute inset-0 bg-gradient-to-t from-lazismu-green-dark/80 via-lazismu-green-dark/20 to-transparent" />
            {s.caption && (
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <p className="max-w-2xl font-serif text-lg font-medium text-white drop-shadow sm:text-2xl">
                  {s.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/40 sm:left-5"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/40 sm:right-5"
            aria-label="Berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? 'w-7 bg-lazismu-orange' : 'w-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
