import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let images: any[] = [];
  let dbReachable = true;
  try {
    images = await (prisma as any).galleryImage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    dbReachable = false;
  }

  return (
    <div>
      {!dbReachable && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database unreachable. Images will appear here when the database is reachable.
        </div>
      )}
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Manage Gallery</h1>
      <GalleryManager initialImages={images} />
    </div>
  );
}

