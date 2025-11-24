const DATA_URL_REGEX = /^data:(?<mime>[-\w.+/]+);base64,(?<data>[A-Za-z0-9+/=\s]+)$/;

const cleanBase64 = (value) => (value ?? '').replace(/\s+/g, '');

const parseBase64Image = (rawValue) => {
	if (typeof rawValue !== 'string') {
		return null;
	}

	const value = rawValue.trim();
	if (!value) {
		return null;
	}

	const match = value.match(DATA_URL_REGEX);
	if (!match) {
		return null;
	}

	const { mime, data } = match.groups ?? {};
	const cleaned = cleanBase64(data);
	if (!mime || !cleaned) {
		return null;
	}

	try {
		const buffer = Buffer.from(cleaned, 'base64');
		if (!buffer.length) {
			return null;
		}
		return {
			data: buffer,
			contentType: mime,
		};
	} catch (error) {
		return null;
	}
};

const serializeImage = (image) => {
	if (!image) {
		return '';
	}

	const data = image.data ?? image;
	const contentType = image.contentType ?? 'application/octet-stream';

	if (!data) {
		return '';
	}

	if (typeof data === 'string') {
		return data.startsWith('data:') ? data : '';
	}

	const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
	if (!buffer.length) {
		return '';
	}

	return `data:${contentType};base64,${buffer.toString('base64')}`;
};

module.exports = {
	parseBase64Image,
	serializeImage,
};
