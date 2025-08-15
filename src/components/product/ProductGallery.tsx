"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

function sanitize(arr: string[]) {
  const set = new Set<string>();
  const out: string[] = [];
  for (const src of arr || []) {
    if (!src) continue;
    const s = src.trim();
    if (!s) continue;
    const lowered = s.toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].some((e) => lowered.endsWith(e))) continue;
    if (!set.has(s)) {
      set.add(s);
      out.push(s);
    }
  }
  return out;
}

export default function ProductGallery({ images }: { images: string[] }) {
  const initial = useMemo(() => sanitize(images), [images]);
  const [items, setItems] = useState<string[]>(initial);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const s = sanitize(images);
    setItems(s);
    setActiveIdx(0);
  }, [images]);

  const onThumbError = useCallback(
    (idx: number) => {
      setItems((prev) => prev.filter((_, i) => i !== idx));
      setActiveIdx((prev) => (idx < prev ? prev - 1 : prev >= items.length - 1 ? Math.max(0, prev - 1) : prev));
    },
    [items.length]
  );

  const onMainError = useCallback(() => {
    setItems((prev) => {
      const remaining = prev.filter((_, i) => i !== activeIdx);
      return remaining;
    });
    setActiveIdx((prev) => Math.min(prev, Math.max(0, items.length - 2)));
  }, [activeIdx, items.length]);

  const prev = useCallback(() => {
    setActiveIdx((i) => (i <= 0 ? Math.max(0, items.length - 1) : i - 1));
  }, [items.length]);

  const next = useCallback(() => {
    setActiveIdx((i) => (i >= items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (!items.length) {
    return (
      <div className="w-full grid md:grid-cols-[96px_1fr] gap-4">
        <div className="hidden md:block" />
        <div className="aspect-[4/5] w-full rounded-lg bg-light-200 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-dark-700">
            <ImageOff className="h-8 w-8" />
            <span className="font-jost text-caption">No product images available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid md:grid-cols-[96px_1fr] gap-4">
      <div className="hidden md:flex flex-col gap-2">
        {items.map((src, i) => (
          <button
            key={src}
            onClick={() => setActiveIdx(i)}
            className={`relative h-20 w-20 rounded-lg overflow-hidden ring-2 transition ${i === activeIdx ? "ring-dark-900" : "ring-transparent hover:ring-dark-700"}`}
          >
            <Image
              src={src}
              alt={`Thumbnail ${i + 1}`}
              fill
              sizes="80px"
              className="object-cover"
              onError={() => onThumbError(i)}
            />
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-light-200">
          <Image
            src={items[activeIdx]}
            alt={`Product image ${activeIdx + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
            onError={onMainError}
            priority
          />
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            aria-label="Previous image"
            onClick={prev}
            className="h-8 w-8 rounded-full bg-light-100 shadow flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next image"
            onClick={next}
            className="h-8 w-8 rounded-full bg-light-100 shadow flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
