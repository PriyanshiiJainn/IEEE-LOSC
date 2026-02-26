"use client";

import { useState } from "react";

export default function GalleryPage() {
  const [fullImage, setFullImage] = useState<string | null>(null);

  const images = [
  { src: "/image1.png", caption: "The LNM Institute of Information Technology (LNMIIT), Jaipur" },
  { src: "/image2.png", caption: "Aerial View of LNMIIT Jaipur Campus" },
  { src: "/image4.png", caption: "Blooming Greens at LNMIIT Jaipur" },
  { src: "/image5.png", caption: "LNMIIT AI Centre – Advancing Artificial Intelligence Research" },
  { src: "/image.png", caption: "Academic Block at LNMIIT – A hub for innovation, research, and academic excellence" },
  { src: "/image6.png", caption: "Central Plaza at LNMIIT – A vibrant space for student interaction and campus life." },
  { src: "/image7.png", caption: "Green Lawns of LNMIIT Campus" },
  { src: "/image8.png", caption: "Central Activity Area – LNMIIT" },
  { src: "/image3.png", caption: "Lighting Up the Campus – Celebrating Success Together." },
];
  return (
    <div className=" min-h-screen">
      <h1 className="text-4xl font-bold text-ieee-navy text-center my-10">
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
        {images.map((image, index) => (
  <div key={index} className="flex flex-col items-center">
    <img
      src={image.src}
      alt={`Image ${index + 1}`}
      className="w-full h-[400px] cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 rounded-2xl hover:shadow-2xl"
      onClick={() => setFullImage(image.src)}
    />
    <p className="mt-2 text-center text-ieee-red font-medium">
      {image.caption}
    </p>
  </div>
))}
        
      </div>
    </div>
  );
}
