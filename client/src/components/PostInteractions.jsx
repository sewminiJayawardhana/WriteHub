import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import LikeButton from './LikeButton.jsx';
import CommentSection from './CommentSection.jsx';

function PostInteractions({
	post,
	currentUser = null,
	onToggleLike = () => {},
	onAddComment = () => {},
	onDeleteComment = () => {},
}) {
	const [showComments, setShowComments] = useState(false);
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
				<button 
					onClick={() => setShowComments(!showComments)}
					className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition flex items-center gap-1.5 focus:outline-none"
					type="button"
				>
					<MessageSquare className="h-3.5 w-3.5" />
					<span>{comments.length} comment{comments.length === 1 ? '' : 's'}</span>
				</button>
			</div>

			{showComments && (
				<CommentSection
					postId={post.id}
					comments={comments}
					currentUser={currentUser}
					onAddComment={onAddComment}
					onDeleteComment={onDeleteComment}
				/>
			)}
		</div>
	);
}

export default PostInteractions;
