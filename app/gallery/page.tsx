import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/data";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";



export default async function GalleryPage() {
  let images: { src: string; caption: string }[] = [];
  try {
    const rows = await getGalleryImages();
    images = rows.map((r) => ({ src: r.imageUrl, caption: r.caption }));
  } catch {
    images = [];
  }

  return <GalleryClient images={images} />;
}
