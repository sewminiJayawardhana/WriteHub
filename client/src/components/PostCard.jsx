import { useState } from 'react';
import { X } from 'lucide-react';
import PostInteractions from './PostInteractions.jsx';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
});

function formatTimestamp(value) {
	if (!value) {
		return 'Recently updated';
	}
	try {
		return dateFormatter.format(new Date(value));
	} catch (error) {
		return 'Recently updated';
	}
}

function PostCard({
	post,
	currentUser = null,
	onEdit = () => {},
	onDelete = () => {},
	onToggleLike = () => {},
	onAddComment = () => {},
	onDeleteComment = () => {},
	canEdit = false,
}) {
	const [activeImage, setActiveImage] = useState(null);
	const authorLabel = post.author?.name ?? post.authorName ?? post.author ?? 'Unknown author';
	const createdAt = formatTimestamp(post.createdAt);
	const images = post.images ?? [];

	return (
		<article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
			<header className="space-y-1">
				<h2 className="text-xl font-semibold text-slate-900">{post.title}</h2>
				<p className="text-xs uppercase tracking-wide text-slate-400">
					{authorLabel} • {createdAt}
				</p>
			</header>

			<p className="mt-4 text-sm leading-6 text-slate-600">{post.content}</p>

			{images.length > 0 ? (
				<div className={`mt-4 grid gap-3 ${images.length > 1 ? 'sm:grid-cols-2' : ''}`}>
					{images.map((src, index) => (
						<div key={`${src}-${index}`} className="overflow-hidden rounded-xl border border-slate-100">
							<img 
								className="h-56 w-full object-cover cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:opacity-95" 
								src={src} 
								alt={`${post.title} image ${index + 1}`} 
								onClick={() => setActiveImage(src)}
							/>
						</div>
					))}
				</div>
			) : null}

			{canEdit ? (
				<div className="mt-6 flex items-center gap-2">
					<button
						className="rounded-full border border-indigo-200 px-4 py-2 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
						onClick={() => onEdit(post)}
						type="button"
					>
						Edit
					</button>
					<button
						className="rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
						onClick={() => onDelete(post.id)}
						type="button"
					>
						Delete
					</button>
				</div>
			) : null}

			<PostInteractions
				post={post}
				currentUser={currentUser}
				onToggleLike={onToggleLike}
				onAddComment={onAddComment}
				onDeleteComment={onDeleteComment}
			/>

			{/* Image Lightbox Modal */}
			{activeImage && (
				<div 
					className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-zoom-out"
					onClick={() => setActiveImage(null)}
				>
					{/* Close button */}
					<button
						className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all focus:outline-none"
						onClick={() => setActiveImage(null)}
						type="button"
						aria-label="Close image preview"
					>
						<X className="h-5 w-5" />
					</button>

					{/* Image wrapper */}
					<div className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
						<img 
							className="max-w-full max-h-[85vh] object-contain rounded-2xl cursor-default" 
							src={activeImage} 
							alt="Focussed preview" 
						/>
					</div>
				</div>
			)}
		</article>
	);
}

export default PostCard;

