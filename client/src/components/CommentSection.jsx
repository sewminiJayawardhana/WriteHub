import { useState } from 'react';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
});

function formatTimestamp(value) {
	if (!value) {
		return '';
	}
	try {
		return dateFormatter.format(new Date(value));
	} catch (error) {
		return '';
	}
}

function CommentSection({
	postId,
	comments = [],
	currentUser = null,
	onAddComment = () => {},
	onDeleteComment = () => {},
}) {
	const [text, setText] = useState('');
	const isAuthenticated = Boolean(currentUser);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!isAuthenticated) {
			return;
		}
		const trimmed = text.trim();
		if (!trimmed) {
			return;
		}
		onAddComment(postId, trimmed);
		setText('');
	};

	return (
		<div className="space-y-4">
			<form className="space-y-2" onSubmit={handleSubmit}>
				<label className="sr-only" htmlFor={`comment-${postId}`}>
					Add a comment
				</label>
				<textarea
					className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
					disabled={!isAuthenticated}
					id={`comment-${postId}`}
					placeholder={isAuthenticated ? 'Share your thoughts...' : 'Sign in to join the conversation'}
					rows={3}
					value={text}
					onChange={(event) => setText(event.target.value)}
				/>
				<div className="flex justify-end">
					<button
						className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
						disabled={!isAuthenticated}
						type="submit"
					>
						Post comment
					</button>
				</div>
			</form>

			<div className="space-y-3">
				{comments.length === 0 ? (
					<p className="text-xs text-slate-400">No comments yet. Start the discussion.</p>
				) : (
					comments.map((comment) => {
						const authorName = comment.author?.name ?? comment.authorName ?? 'Anonymous';
						const authorId = comment.author?.id ?? comment.author?._id ?? comment.authorId ?? null;
						const currentUserId = currentUser?.id ?? currentUser?._id ?? null;
						const commentId = comment.id ?? comment._id;
						const canDelete = Boolean(currentUserId && authorId && String(currentUserId) === String(authorId));

						return (
							<div
								key={commentId}
								className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-semibold text-slate-700">{authorName}</p>
										<p className="text-xs text-slate-400">{formatTimestamp(comment.createdAt)}</p>
									</div>
									{canDelete ? (
										<button
											className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
											onClick={() => onDeleteComment(postId, commentId)}
											type="button"
										>
											Delete
										</button>
									) : null}
								</div>
								<p className="mt-2 text-sm text-slate-600">{comment.text}</p>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

export default CommentSection;
