const express = require('express');
const router = express.Router();

const upload = require('../config/multer');
const { protect } = require('../middlewares/auth.middleware');
const {
	getPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
} = require('../controllers/post.controller');
const { toggleLike } = require('../controllers/like.controller');
const commentRoutes = require('./comment.routes');

router.get('/', getPosts);
router.get('/:postId', getPostById);
router.post('/', protect, upload.array('images', 6), createPost);
router.put('/:postId', protect, upload.array('images', 6), updatePost);
router.delete('/:postId', protect, deletePost);
router.post('/:postId/like', protect, toggleLike);

router.use('/:postId/comments', commentRoutes);

module.exports = router;
