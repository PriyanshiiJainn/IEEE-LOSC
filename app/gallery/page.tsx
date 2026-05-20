import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/data";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";



export default async function GalleryPage() {
  const rows = await getGalleryImages();
  const images = rows.map((r) => ({ src: r.imageUrl, caption: r.caption }));

  return <GalleryClient images={images} />;
}
