import { Heart } from 'lucide-react';

function LikeButton({ count = 0, isLiked = false, onToggle = () => {}, disabled = false }) {
	const label = isLiked ? 'Unlike' : 'Like';
	return (
		<button
			className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${
				disabled
					? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
					: isLiked
					? 'border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
					: 'border-slate-200 text-slate-600 hover:bg-slate-100'
			}`}
			disabled={disabled}
			onClick={onToggle}
			type="button"
		>
			<span className="inline-flex items-center justify-center" aria-hidden>
				<Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current text-indigo-600' : ''}`} />
			</span>
			
			<span className="text-slate-400">•</span>
			<span>{count}</span>
		</button>
	);
}

export default LikeButton;
