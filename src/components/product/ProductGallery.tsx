"use client";

import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ProductGallery({ images, title }: Props) {
  const [valid, setValid] = useState<string[]>(
    Array.from(new Set(images.filter(Boolean)))
  );
  const [index, setIndex] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const hasImages = valid.length > 0;
  const current = useMemo(() => valid[index] ?? "", [valid, index]);

  useEffect(() => {
    if (index >= valid.length) setIndex(0);
  }, [valid, index]);

  const onThumbError = useCallback(
    (src: string) => {
      setValid((v) => v.filter((i) => i !== src));
    },
    [setValid]
  );

  const onMainError = useCallback(() => {
    setValid((v) => v.filter((_, i) => i !== index));
  }, [index]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + valid.length) % valid.length);
  }, [valid.length]);
  const next = useCallback(() => {
    setIndex((i) => (i + 1) % valid.length);
  }, [valid.length]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!hasImages) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [hasImages, prev, next]);

  if (!hasImages) {
    return (
      <div className="w-full">
        <div className="rounded-lg bg-light-200 aspect-[4/5] flex items-center justify-center text-dark-700">
          <div className="flex flex-col items-center gap-2">
            <ImageOff aria-hidden className="h-8 w-8" />
            <p className="font-jost text-caption">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4">
      {valid.length > 1 && (
        <div className="flex flex-col gap-3">
          {valid.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              className={`relative rounded-lg overflow-hidden border ${
                i === index ? "border-dark-900" : "border-transparent"
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900`}
              aria-label={`View image ${i + 1}`}
            >
              <div className="relative size-16">
                <Image
                  src={src}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      <div
        ref={mainRef}
        tabIndex={0}
        className="flex-1 relative rounded-lg bg-light-200 overflow-hidden aspect-[4/5] focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
        aria-label="Product gallery"
      >
        {current ? (
          <Image
            key={current}
            src={current}
            alt={title}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover"
            onError={onMainError}
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-dark-700">
            <div className="flex flex-col items-center gap-2">
              <ImageOff aria-hidden className="h-8 w-8" />
              <p className="font-jost text-caption">No images available</p>
            </div>
          </div>
        )}

        {valid.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-light-100 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-full bg-light-100 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
