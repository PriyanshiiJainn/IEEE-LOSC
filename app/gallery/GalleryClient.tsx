"use client";

import { useState } from "react";
import Image from "next/image";

type ImageItem = {
  src: string;
  caption: string;
};

type Props = {
  images: ImageItem[];
};

export default function GalleryClient({ images }: Props) {
  const [fullImage, setFullImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center my-10">
        Image Gallery
      </h1>

      {/* Lightbox — intentionally uses plain <img> to load full-quality on demand */}
      {fullImage && (
        <div
          className="fixed inset-0 w-full h-screen bg-black bg-opacity-80 flex items-center justify-center z-50 px-4"
          onClick={() => setFullImage(null)}
        >
          <img
            src={fullImage}
            className="max-w-[90vw] max-h-[80vh] w-auto h-auto rounded-xl border-2 border-white object-contain"
            alt="Full View"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="absolute top-4 right-4 text-white text-3xl cursor-pointer select-none px-3 py-1 rounded-full bg-black/60">
            ✕
          </span>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 pb-10">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Sized container required by next/image fill */}
              <div
                className="relative w-full h-64 sm:h-72 md:h-80 lg:h-72 xl:h-80 overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setFullImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  priority={index < 2}
                />
              </div>
              <p className="mt-3 text-center text-ieee-red font-medium px-2 text-sm sm:text-base">
                {image.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
