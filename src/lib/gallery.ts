import type { ImageMetadata } from "astro";

const imageFiles = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}",
	{
		eager: true
	}
);

export interface GalleryImage {
	name: string;
	src: ImageMetadata;
}

export interface Gallery {
	name: string;
	images: GalleryImage[];
}

export function getGalleries(): Gallery[] {
	const galleries = new Map<string, Gallery>();

	for (const [filePath, module] of Object.entries(imageFiles)) {
		const parts = filePath.split("/");
		const fileName = parts.pop();

		if (!fileName) {
			continue;
		}

		const galleryName = parts.pop();

		if (!galleryName) {
			continue;
		}

		if (!galleries.has(galleryName)) {
			galleries.set(galleryName, {
				name: galleryName,
				images: []
			});
		}

		galleries.get(galleryName)!.images.push({
			name: fileName,
			src: module.default
		});
	}

	return Array.from(galleries.values())
		.map((gallery) => ({
			...gallery,
			images: gallery.images.sort((a, b) =>
				a.name.localeCompare(b.name)
			)
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}