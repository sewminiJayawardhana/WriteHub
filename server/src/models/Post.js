const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
		},
		content: {
			type: String,
			required: [true, 'Content is required'],
		},
		images: {
			type: [String],
			default: [],
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		likes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'User',
			default: [],
		},
		comments: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Comment',
			default: [],
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: (doc, ret) => {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
				return ret;
			},
		},
		toObject: {
			virtuals: true,
			transform: (doc, ret) => {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
				return ret;
			},
		},
	},
);

PostSchema.virtual('likesCount').get(function likesCount() {
	return this.likes?.length ?? 0;
});

module.exports = mongoose.model('Post', PostSchema);
