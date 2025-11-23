const buildFileUrl = (req, filePath) => {
	if (!filePath) {
		return '';
	}
	const normalized = filePath.replace(/\\/g, '/');
	if (normalized.startsWith('http')) {
		return normalized;
	}
	return `${req.protocol}://${req.get('host')}/${normalized}`;
};

const formatUser = (userDoc, req) => {
	if (!userDoc) {
		return null;
	}
	const user = userDoc.toObject ? userDoc.toObject({ virtuals: true }) : userDoc;
	const id = user.id ?? user._id?.toString?.() ?? String(user._id ?? '');
	return {
		id,
		name: user.name,
		email: user.email,
		bio: user.bio,
		avatar: user.avatar ? buildFileUrl(req, user.avatar) : '',
	};
};

const formatComment = (commentDoc, req) => {
	if (!commentDoc) {
		return null;
	}
	const comment = commentDoc.toObject ? commentDoc.toObject({ virtuals: true }) : commentDoc;
	const id = comment.id ?? comment._id?.toString?.() ?? String(comment._id ?? '');
	return {
		id,
		text: comment.text,
		author: formatUser(comment.author, req),
		createdAt: comment.createdAt,
		updatedAt: comment.updatedAt,
	};
};

const formatPost = (postDoc, req) => {
	if (!postDoc) {
		return null;
	}
	const post = postDoc.toObject ? postDoc.toObject({ virtuals: true }) : postDoc;
	const id = post.id ?? post._id?.toString?.() ?? String(post._id ?? '');
	return {
		id,
		title: post.title,
		content: post.content,
		images: (post.images ?? []).map((imagePath) => buildFileUrl(req, imagePath)),
		author: formatUser(post.author, req),
		likes: (post.likes ?? []).map((like) => like.toString()),
		comments: (post.comments ?? []).map((comment) => formatComment(comment, req)),
		createdAt: post.createdAt,
		updatedAt: post.updatedAt,
	};
};

module.exports = {
	buildFileUrl,
	formatUser,
	formatComment,
	formatPost,
};
