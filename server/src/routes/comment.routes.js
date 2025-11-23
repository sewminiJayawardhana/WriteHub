const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middlewares/auth.middleware');
const { addComment, deleteComment } = require('../controllers/comment.controller');

router.post('/', protect, addComment);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
