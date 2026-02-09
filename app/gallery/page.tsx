"use client";

import { useState } from "react";

export default function GalleryPage() {
  const [fullImage, setFullImage] = useState<string | null>(null);

  const images = [
   
   "/faculty_advisor.jpeg",
   "/faculty_advisor.jpeg",
   "/faculty_advisor.jpeg",
   "/faculty_advisor.jpeg",
   "/faculty_advisor.jpeg",
   "/faculty_advisor.jpeg", 
   "/faculty_advisor.jpeg",
   "/faculty_advisor.jpeg",
   "/faculty_advisor.jpeg"

  ];

  return (
    <div className=" min-h-screen">
      <h1 className="text-4xl text-center font-semibold my-10">
        Image Gallery
      </h1>

      {fullImage && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-80 flex items-center justify-center z-50">
          <img
            src={fullImage}
            className="max-w-[700px] rounded-xl border-2 border-white"
            alt="Full View"
          />
          <span
            className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
            onClick={() => setFullImage(null)}
          >
            X
          </span>
        </div>
      )}

      <div className="w-4/5 mx-auto grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-8 pb-10">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            className="w-full h-[400px] cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 rounded-2xl hover:rotate-[0deg] hover:rounded-2xl hover:shadow-2xl"
            onClick={() => setFullImage(src)}
          />
        ))}
      </div>
    </div>
  );
}
