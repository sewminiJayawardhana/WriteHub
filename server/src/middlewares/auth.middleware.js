const jwt = require('jsonwebtoken');
const User = require('../models/User');

const extractToken = (req) => {
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		return req.headers.authorization.split(' ')[1];
	}
	return null;
};

const protect = async (req, res, next) => {
	try {
		const token = extractToken(req);
		if (!token) {
			return res.status(401).json({ message: 'Authentication token missing' });
		}

		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.userId);
		if (!user) {
			return res.status(401).json({ message: 'Invalid authentication token' });
		}

		req.user = user;
		return next();
	} catch (error) {
		console.error('Authentication error', error);
		return res.status(401).json({ message: 'Not authorized' });
	}
};

module.exports = {
	protect,
};
