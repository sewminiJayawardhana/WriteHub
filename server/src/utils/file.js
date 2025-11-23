const fs = require('fs');
const path = require('path');

const resolveUploadPath = (relativePath) => {
	if (!relativePath) {
		return null;
	}
	const normalized = relativePath.startsWith('uploads') ? relativePath : path.join('uploads', relativePath);
	return path.join(__dirname, '..', '..', normalized);
};

const removeFileIfExists = (relativePath) => {
	const fullPath = resolveUploadPath(relativePath);
	if (!fullPath) {
		return;
	}

	fs.stat(fullPath, (statErr) => {
		if (statErr) {
			return;
		}

		fs.unlink(fullPath, (unlinkErr) => {
			if (unlinkErr) {
				console.error(`Failed to remove file at ${fullPath}`, unlinkErr);
			}
		});
	});
};

module.exports = {
	resolveUploadPath,
	removeFileIfExists,
};
