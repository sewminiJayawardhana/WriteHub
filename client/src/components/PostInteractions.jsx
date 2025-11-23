import LikeButton from './LikeButton.jsx';
import CommentSection from './CommentSection.jsx';

function PostInteractions({
	post,
	currentUser = null,
	onToggleLike = () => {},
	onAddComment = () => {},
	onDeleteComment = () => {},
}) {
	const likes = post.likes ?? [];
	const comments = post.comments ?? [];
	const isLiked = currentUser ? likes.includes(currentUser.id) : false;

	return (
		<div className="mt-6 space-y-5">
			<div className="flex items-center justify-between">
				<LikeButton
					count={likes.length}
					isLiked={isLiked}
					disabled={!currentUser}
					onToggle={() => onToggleLike(post.id)}
				/>
				<p className="text-xs text-slate-400">{comments.length} comment{comments.length === 1 ? '' : 's'}</p>
			</div>

			<CommentSection
				postId={post.id}
				comments={comments}
				currentUser={currentUser}
				onAddComment={onAddComment}
				onDeleteComment={onDeleteComment}
			/>
		</div>
	);
}

export default PostInteractions;
