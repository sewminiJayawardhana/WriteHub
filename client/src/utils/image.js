export const fileToDataUrl = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result);
			} else {
				reject(new Error('Unable to read file as data URL'));
			}
		};
		reader.onerror = (event) => {
			reject(event?.target?.error ?? new Error('Failed to read file'));
		};
		reader.readAsDataURL(file);
	});

export const filesToDataUrls = async (files = []) => {
	if (!files || files.length === 0) {
		return [];
	}
	const items = Array.from(files);
	const results = await Promise.all(items.map((file) => fileToDataUrl(file)));
	return results.filter(Boolean);
};
