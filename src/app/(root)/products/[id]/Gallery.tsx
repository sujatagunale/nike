"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ImageItem = { id: string; url: string; isPrimary: boolean; sortOrder: number };

export default function Gallery({ images }: { images: ImageItem[] }) {
  const ordered = useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
        return a.sortOrder - b.sortOrder;
      }),
    [images]
  );

  const [index, setIndex] = useState(0);
  const current = ordered[index] ?? ordered[0];

  const onPrev = () => setIndex((i) => (i - 1 + ordered.length) % ordered.length);
  const onNext = () => setIndex((i) => (i + 1) % ordered.length);

  return (
    <div className="grid grid-cols-[72px_1fr] gap-4">
      <div className="flex flex-col gap-3 overflow-auto max-h-[560px] pr-1">
        {ordered.map((img, i) => (
          <button
            key={img.id}
            aria-label={`Preview ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`relative size-16 rounded border ${i === index ? "border-dark-900" : "border-light-300"} overflow-hidden`}
          >
            <Image src={img.url} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>

      <div className="relative rounded-lg bg-light-200">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          {current && <Image src={current.url} alt="" fill className="object-contain" />}
        </div>

        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3">
          <button
            onClick={onPrev}
            className="size-8 rounded-full bg-light-100/90 border border-light-300 text-dark-900"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={onNext}
            className="size-8 rounded-full bg-light-100/90 border border-light-300 text-dark-900"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
