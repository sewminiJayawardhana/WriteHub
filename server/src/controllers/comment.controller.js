const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { formatComment } = require('../utils/response');

const addComment = async (req, res, next) => {
	try {
		const { text } = req.body;
		const { postId } = req.params;

		if (!text || !text.trim()) {
			return res.status(400).json({ message: 'Comment text is required' });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		const comment = await Comment.create({
			post: postId,
			author: req.user.id,
			text: text.trim(),
		});

		post.comments.push(comment.id);
		await post.save();

		const populatedComment = await Comment.findById(comment.id).populate('author', 'name avatar');
		return res.status(201).json({ comment: formatComment(populatedComment, req) });
	} catch (error) {
		return next(error);
	}
};

const deleteComment = async (req, res, next) => {
	try {
		const { postId, commentId } = req.params;
		const comment = await Comment.findById(commentId).populate('author');
		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		if (comment.author.id.toString() !== req.user.id.toString()) {
			const post = await Post.findById(postId || comment.post);
			if (!post || post.author.toString() !== req.user.id.toString()) {
				return res.status(403).json({ message: 'You do not have permission to delete this comment' });
			}
		}

		await Comment.deleteOne({ _id: commentId });
		await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });

		return res.json({ message: 'Comment removed', commentId });
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	addComment,
	deleteComment,
};
