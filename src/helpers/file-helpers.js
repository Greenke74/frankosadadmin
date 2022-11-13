export function getWidthAndHeight(file) {
	return new Promise((resolve) => {
		const inputImage = new Image();
		inputImage.crossOrigin = 'Anonymous';

		inputImage.onload = () => {
			const inputWidth = inputImage.naturalWidth;
			const inputHeight = inputImage.naturalHeight;
			resolve({ width: inputWidth, height: inputHeight, file: file });
		};
		inputImage.src = window.URL.createObjectURL(file);
	});
}

export const dataURLtoFile = (dataUrl, filename) => {
	var arr = dataUrl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
};

export function getWidthAndHeightFormUrl(url) {
	return new Promise((resolve) => {
		const inputImage = new Image();
		inputImage.crossOrigin = 'Anonymous';

		inputImage.onload = () => {
			const inputWidth = inputImage.naturalWidth;
			const inputHeight = inputImage.naturalHeight;
			resolve({ width: inputWidth, height: inputHeight });
		};
		inputImage.src = url;
	});
}


export const getSrcFromFile = (file) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
	});
};

const createFileObjectURL = (file) =>
	new Promise((resolve, reject) => {
		try {
			let rawImage = new Image();

			rawImage.addEventListener('load', function () {
				resolve(rawImage);
			});

			rawImage.src = URL.createObjectURL(new Blob([file], { type: 'image' }));
		} catch (e) {
			reject(e);
		}
	});

const convertToWebpObjectURL = (rawImage, crop = undefined) =>
	new Promise((resolve, reject) => {
		try {
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			const pixelRatio = window.devicePixelRatio || 1;

			if (crop?.container?.width && crop?.wh?.width) {
				const { wh, container } = crop;

				const maxHeight = container.height;
				const maxWidth = container.width;

				const width = (crop.width / maxWidth) * wh.width;
				const height = (crop.height / maxHeight) * wh.height;
				const left = (crop.left / maxWidth) * wh.width;
				const top = (crop.top / maxHeight) * wh.height;

				canvas.width = width * pixelRatio;
				canvas.height = height * pixelRatio;

				ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
				ctx.imageSmoothingQuality = 'high';
				ctx.drawImage(rawImage, left, top, width, height, 0, 0, width, height);
				canvas.toBlob(
					(blob) => {
						resolve(blob);
					},
					'image/webp',
					0.99
				);
			} else {
				canvas.width = rawImage.width * pixelRatio;
				canvas.height = rawImage.height * pixelRatio;

				ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
				ctx.imageSmoothingQuality = 'high';
				ctx.drawImage(rawImage, 0, 0);
				canvas.toBlob(
					(blob) => {
						resolve(blob);
					},
					'image/webp'
				);
			}
		} catch (e) {
			reject(e);
		}
	});

export const compressImage = async (file, fileName = file.name, crop) => {
	const [fname, extension] = fileName.split('.');

	const rawImage = await createFileObjectURL(file);

	const { wh } = await getWidthAndHeight(file);
	const blob = crop
		? await convertToWebpObjectURL(rawImage, { ...crop, wh })
		: await convertToWebpObjectURL(rawImage);

	return new File([blob], `${fname}.webp`);
};