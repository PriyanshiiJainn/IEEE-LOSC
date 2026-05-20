export declare const GALLERY_DSC_FILES: readonly string[];
export declare const DEFAULT_GALLERY_CAPTION: string;

export type DefaultGalleryDisplayImage = {
  src: string;
  caption: string;
};

export declare function getDefaultGalleryDisplayImages(): DefaultGalleryDisplayImage[];

export type DefaultGalleryDbRow = {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
};

export declare function getDefaultGalleryDbRows(): DefaultGalleryDbRow[];

export declare function getDefaultGallerySeedRows(): Array<{
  imageUrl: string;
  caption: string;
  order: number;
}>;
