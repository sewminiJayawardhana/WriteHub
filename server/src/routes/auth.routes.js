const express = require('express');
const router = express.Router();

const upload = require('../config/multer');
const {
	registerUser,
	loginUser,
	getCurrentUser,
	updateBio,
	updateAvatar,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.patch('/bio', protect, updateBio);
router.patch('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
