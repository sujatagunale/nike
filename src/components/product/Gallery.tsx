"use client";
import React from "react";
import Image from "next/image";
import { useMemo, useState } from "react";

type Img = { id: string; url: string; isPrimary: boolean; sortOrder: number };

export default function Gallery({ images }: { images: Img[] }) {
  const ordered = useMemo(
    () => [...images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder),
    [images]
  );
  const [index, setIndex] = useState(0);
  const current = ordered[index];

  const next = () => setIndex((i) => (i + 1) % ordered.length);
  const prev = () => setIndex((i) => (i - 1 + ordered.length) % ordered.length);

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <div className="hidden sm:flex flex-col gap-3">
          {ordered.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIndex(i)}
              aria-label={`Thumbnail ${i + 1}`}
              className={`relative h-16 w-16 rounded-lg overflow-hidden border ${i === index ? "border-dark-900" : "border-light-300"}`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
        <div className="relative group flex-1 rounded-lg bg-light-200 overflow-hidden">
          <div className="relative w-full aspect-[4/3] md:aspect-[4/3]">
            {current && (
              <Image
                key={current.id}
                src={current.url}
                alt=""
                fill
                className="object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                priority
              />
            )}
          </div>
          {ordered.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute bottom-3 right-14 h-8 w-8 rounded-full bg-light-100 shadow flex items-center justify-center"
              >
                ‹
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-light-100 shadow flex items-center justify-center"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
      <div className="sm:hidden mt-3 flex gap-2 overflow-x-auto">
        {ordered.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setIndex(i)}
            aria-label={`Thumbnail ${i + 1}`}
            className={`relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border ${i === index ? "border-dark-900" : "border-light-300"}`}
          >
            <Image src={img.url} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
