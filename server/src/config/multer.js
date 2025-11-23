const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDir = (dirPath) => {
	fs.mkdirSync(dirPath, { recursive: true });
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadsRoot = path.join(__dirname, '..', '..', 'uploads');
		const folderName = file.fieldname === 'avatar' ? 'avatars' : 'posts';
		const targetDir = path.join(uploadsRoot, folderName);
		ensureDir(targetDir);
		cb(null, targetDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const ext = path.extname(file.originalname) || '.png';
		cb(null, `${uniqueSuffix}${ext}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
	if (allowed.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Unsupported file type'));
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
		files: 6,
	},
});

module.exports = upload;
