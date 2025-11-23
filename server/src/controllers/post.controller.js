const path = require('path');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { removeFileIfExists } = require('../utils/file');
const { formatPost } = require('../utils/response');

const populatePost = async (postId) =>
	Post.findById(postId)
		.populate('author', 'name email bio avatar')
		.populate({ path: 'comments', populate: { path: 'author', select: 'name avatar' }, options: { sort: { createdAt: 1 } } });

const getPosts = async (req, res, next) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate('author', 'name email bio avatar')
			.populate({ path: 'comments', populate: { path: 'author', select: 'name avatar' }, options: { sort: { createdAt: 1 } } });

		return res.json({ posts: posts.map((post) => formatPost(post, req)) });
	} catch (error) {
		return next(error);
	}
};

const getPostById = async (req, res, next) => {
	try {
		const post = await populatePost(req.params.postId || req.params.id);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}
		return res.json({ post: formatPost(post, req) });
	} catch (error) {
		return next(error);
	}
};

const createPost = async (req, res, next) => {
	try {
		const { title, content } = req.body;
		if (!title || !content) {
			return res.status(400).json({ message: 'Title and content are required' });
		}

		const images = (req.files ?? []).map((file) => path.posix.join('uploads', 'posts', file.filename));

		const post = await Post.create({
			title,
			content,
			images,
			author: req.user.id,
		});

		const populated = await populatePost(post.id);
		return res.status(201).json({ post: formatPost(populated, req) });
	} catch (error) {
		return next(error);
	}
};

const relativeImagePath = (image, req) => {
	if (!image) {
		return null;
	}
	const baseUrl = `${req.protocol}://${req.get('host')}/`;
	return image.startsWith(baseUrl) ? image.slice(baseUrl.length) : image;
};

const normalizeExistingImages = (value, req) => {
	if (!value) {
		return [];
	}

	if (Array.isArray(value)) {
		return value.map((item) => relativeImagePath(item, req)).filter(Boolean);
	}

	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed)
			? parsed.map((item) => relativeImagePath(item, req)).filter(Boolean)
			: [];
	} catch (error) {
		return value
			.split(',')
			.map((item) => relativeImagePath(item.trim(), req))
			.filter(Boolean);
	}
};

const updatePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.postId || req.params.id);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		if (post.author.toString() !== req.user.id.toString()) {
			return res.status(403).json({ message: 'You do not have permission to edit this post' });
		}

		const { title, content, existingImages } = req.body;
		const trimmedTitle = title?.trim();
		const trimmedContent = content?.trim();

		if (!trimmedTitle || !trimmedContent) {
			return res.status(400).json({ message: 'Title and content are required' });
		}

		const imagesToKeep = normalizeExistingImages(existingImages, req);
		const newImages = (req.files ?? []).map((file) => path.posix.join('uploads', 'posts', file.filename));
		const imagesToRemove = (post.images ?? []).filter((imagePath) => !imagesToKeep.includes(imagePath));

		imagesToRemove.forEach((imagePath) => removeFileIfExists(imagePath));

		post.title = trimmedTitle;
		post.content = trimmedContent;
		post.images = [...imagesToKeep, ...newImages];
		await post.save();

		const populated = await populatePost(post.id);
		return res.json({ post: formatPost(populated, req) });
	} catch (error) {
		return next(error);
	}
};

const deletePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.postId || req.params.id);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		if (post.author.toString() !== req.user.id.toString()) {
			return res.status(403).json({ message: 'You do not have permission to delete this post' });
		}

		(post.images ?? []).forEach((imagePath) => removeFileIfExists(imagePath));

		await Comment.deleteMany({ _id: { $in: post.comments } });
		await post.deleteOne();

		return res.json({ message: 'Post deleted successfully' });
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	getPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
};
