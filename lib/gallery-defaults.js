/**
 * Bundled default gallery photos in public/gallery (DSC03378–DSC03688).
 * Shown on the public gallery when the database is unreachable or empty.
 */

/** @type {readonly string[]} */
const GALLERY_DSC_FILES = [
  "DSC03378.jpg",
  "DSC03389.jpg",
  "DSC03394.jpg",
  "DSC03400.jpg",
  "DSC03403.jpg",
  "DSC03444.jpg",
  "DSC03447.jpg",
  "DSC03490.jpg",
  "DSC03491.jpg",
  "DSC03533.jpg",
  "DSC03548.jpg",
  "DSC03558.jpg",
  "DSC03610.jpg",
  "DSC03632.jpg",
  "DSC03677.jpg",
  "DSC03688.jpg",
];

const DEFAULT_GALLERY_CAPTION = "IEEE Optica Student Chapter, LNMIIT";

function getDefaultGalleryDisplayImages() {
  return GALLERY_DSC_FILES.map((file) => ({
    src: `/gallery/${file}`,
    caption: DEFAULT_GALLERY_CAPTION,
  }));
}

/** Synthetic rows for getGalleryImages() when DB is unavailable. */
function getDefaultGalleryDbRows() {
  return GALLERY_DSC_FILES.map((file, order) => ({
    id: `default-${file.replace(/\.[^.]+$/, "").toLowerCase()}`,
    imageUrl: `/gallery/${file}`,
    caption: DEFAULT_GALLERY_CAPTION,
    order,
  }));
}

function getDefaultGallerySeedRows() {
  return GALLERY_DSC_FILES.map((file, order) => ({
    imageUrl: `/gallery/${file}`,
    caption: DEFAULT_GALLERY_CAPTION,
    order,
  }));
}

module.exports = {
  GALLERY_DSC_FILES,
  DEFAULT_GALLERY_CAPTION,
  getDefaultGalleryDisplayImages,
  getDefaultGalleryDbRows,
  getDefaultGallerySeedRows,
};
