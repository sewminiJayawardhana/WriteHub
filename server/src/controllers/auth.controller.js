const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/User');
const { removeFileIfExists } = require('../utils/file');
const { formatUser } = require('../utils/response');

const generateToken = (userId) =>
	jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	});

const registerUser = async (req, res, next) => {
	try {
		const { name, email, password, bio } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: 'are requiredName, email, and password ' });
		}

		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return res.status(409).json({ message: 'An account with that email already exists' });
		}

		const user = await User.create({ name, email, password, bio: bio ?? '' });
		const token = generateToken(user.id);
		return res.status(201).json({
			token,
			user: formatUser(user, req),
		});
	} catch (error) {
		return next(error);
	}
};

const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}

		const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		const token = generateToken(user.id);
		return res.json({
			token,
			user: formatUser(user, req),
		});
	} catch (error) {
		return next(error);
	}
};

const getCurrentUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);
		return res.json({ user: formatUser(user, req) });
	} catch (error) {
		return next(error);
	}
};

const updateBio = async (req, res, next) => {
	try {
		const { bio } = req.body;
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ bio: bio?.trim() ?? '' },
			{ new: true },
		);
		return res.json({ user: formatUser(user, req) });
	} catch (error) {
		return next(error);
	}
};

const updateAvatar = async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'Avatar file is required' });
		}

		const avatarPath = path.posix.join('uploads', 'avatars', req.file.filename);
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (user.avatar) {
			removeFileIfExists(user.avatar);
		}

		user.avatar = avatarPath;
		await user.save();

		return res.json({ user: formatUser(user, req) });
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	registerUser,
	loginUser,
	getCurrentUser,
	updateBio,
	updateAvatar,
};
