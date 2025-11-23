const Post = require('../models/Post');
const { formatPost } = require('../utils/response');

const toggleLike = async (req, res, next) => {
	try {
		const { postId } = req.params;
		const post = await Post.findById(postId)
			.populate('author', 'name email bio avatar')
			.populate({ path: 'comments', populate: { path: 'author', select: 'name avatar' }, options: { sort: { createdAt: 1 } } });

		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		const userId = req.user._id.toString();
		const hasLiked = (post.likes ?? []).some((likeId) => likeId.toString() === userId);

		if (hasLiked) {
			post.likes = post.likes.filter((likeId) => likeId.toString() !== userId);
		} else {
			post.likes.push(req.user._id);
		}

		await post.save();

		await post.populate('author', 'name email bio avatar');
		await post.populate({ path: 'comments', populate: { path: 'author', select: 'name avatar' }, options: { sort: { createdAt: 1 } } });

		return res.json({ post: formatPost(post, req) });
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	toggleLike,
};
