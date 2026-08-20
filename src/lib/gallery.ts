import type { ImageMetadata } from "astro";


const imageFiles = import.meta.glob<{
	default: ImageMetadata;
}>(
	"/src/assets/images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}",
	{
		eager: true
	}
);


const gifFiles = import.meta.glob<string>(
	"/src/assets/images/**/*.gif",
	{
		eager: true,
		query: "?url",
		import: "default"
	}
);


export interface GalleryImage {

	name: string;

	src: ImageMetadata;

	type: "image" | "360";

}


export interface GalleryGif {

	name: string;

	src: string;

	type: "gif";

}


export interface Gallery {

	name: string;

	images: GalleryImage[];

	gifs: GalleryGif[];

}


export function getGalleries(): Gallery[] {

	const galleries =
		new Map<string, Gallery>();


	/* ========================================
	   NORMALE BILDER + 360°
	   ======================================== */

	for (
		const [filePath, module]
		of Object.entries(imageFiles)
	) {

		const parts =
			filePath.split("/");


		const fileName =
			parts.pop();


		if (!fileName) {
			continue;
		}


		const galleryName =
			parts.pop();


		if (!galleryName) {
			continue;
		}


		if (!galleries.has(galleryName)) {

			galleries.set(
				galleryName,
				{
					name: galleryName,
					images: [],
					gifs: []
				}
			);

		}


		const type =
			fileName
				.toLowerCase()
				.startsWith("360_")
				? "360"
				: "image";


		galleries
			.get(galleryName)!
			.images
			.push({

				name: fileName,

				src: module.default,

				type

			});

	}


	/* ========================================
	   GIFS
	   ======================================== */

	for (
		const [filePath, url]
		of Object.entries(gifFiles)
	) {

		const parts =
			filePath.split("/");


		const fileName =
			parts.pop();


		if (!fileName) {
			continue;
		}


		const galleryName =
			parts.pop();


		if (!galleryName) {
			continue;
		}


		if (!galleries.has(galleryName)) {

			galleries.set(
				galleryName,
				{
					name: galleryName,
					images: [],
					gifs: []
				}
			);

		}


		galleries
			.get(galleryName)!
			.gifs
			.push({

				name: fileName,

				src: url,

				type: "gif"

			});

	}


	/* ========================================
	   SORTIERUNG
	   ======================================== */

	return Array
		.from(galleries.values())

		.map((gallery) => ({

			...gallery,

			images:
				gallery.images.sort(
					(a, b) =>
						a.name.localeCompare(
							b.name
						)
				),

			gifs:
				gallery.gifs.sort(
					(a, b) =>
						a.name.localeCompare(
							b.name
						)
				)

		}))

		.sort(
			(a, b) =>
				b.name.localeCompare(
					a.name
				)
		);

}