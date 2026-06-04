import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
	Sparkles, 
	Search, 
	ArrowRight, 
	BookOpen, 
	PenTool, 
	Clock, 
	Activity
} from 'lucide-react';
import PostCard from '../components/PostCard.jsx';

// Utility to calculate estimated reading time
const getReadingTime = (text) => {
	const words = text ? text.trim().split(/\s+/).length : 0;
	return Math.max(1, Math.ceil(words / 200));
};

function Home({
	posts = [],
	currentUser = null,
	isLoading = false,
	onToggleLike = () => {},
	onAddComment = () => {},
	onDeleteComment = () => {},
	onOpenAuth = () => {},
}) {
	// Search and filter state
	const [searchQuery, setSearchQuery] = useState('');
	const [readingTimeFilter, setReadingTimeFilter] = useState('all'); // all, short (< 2 min), medium (2-5 min), long (> 5 min)

	// Statistics based on actual loaded posts
	const stats = useMemo(() => {
		const totalPosts = posts.length;
		const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
		const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
		
		// Find unique authors
		const authors = new Set();
		posts.forEach(p => {
			if (p.author?.id || p.author?._id) {
				authors.add(p.author.id || p.author._id);
			}
		});

		return {
			postsCount: totalPosts,
			likesCount: totalLikes,
			commentsCount: totalComments,
			authorsCount: authors.size
		};
	}, [posts]);

	// Filtered posts based on search and reading time
	const filteredPosts = useMemo(() => {
		return posts.filter(post => {
			const matchesSearch = 
				post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.content?.toLowerCase().includes(searchQuery.toLowerCase());
			
			if (!matchesSearch) return false;
			
			const readingTime = getReadingTime(post.content);
			if (readingTimeFilter === 'short') return readingTime <= 2;
			if (readingTimeFilter === 'medium') return readingTime > 2 && readingTime <= 5;
			if (readingTimeFilter === 'long') return readingTime > 5;
			
			return true;
		});
	}, [posts, searchQuery, readingTimeFilter]);

	return (
		<div className="relative space-y-16 overflow-hidden pb-12">
			{/* Decorative animated blobs for creative premium aesthetic */}
			<div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-indigo-300 opacity-20 blur-3xl animate-blob"></div>
			<div className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-pink-300 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
			<div className="pointer-events-none absolute left-1/3 bottom-40 h-96 w-96 rounded-full bg-emerald-200 opacity-15 blur-3xl animate-blob animation-delay-4000"></div>

			{/* 1. Hero Section */}
			<header className="relative z-10 mx-auto max-w-4xl text-center">
				<div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-200/60 bg-indigo-50/70 px-4 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur-md transition-all duration-300 hover:scale-105">
					<Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
					<span>Welcome to WriteHub 2026</span>
				</div>
				<h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
					Where stories find their{' '}
					<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent animate-gradient-x">
						creative spark.
					</span>
				</h1>
				<p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
					WriteHub is a modern, responsive blogging playground. Publish rich stories, share dynamic media, 
					and connect with readers through live engagements and interactive content.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-4">
					{currentUser ? (
						<Link
							className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 hover:bg-indigo-700"
							to="/create"
						>
							<PenTool className="h-4 w-4" />
							<span>Start writing now</span>
							<ArrowRight className="h-4 w-4" />
						</Link>
					) : (
						<>
							<button
								onClick={() => onOpenAuth('register')}
								className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 hover:bg-indigo-700 focus:outline-none"
								type="button"
							>
								<span>Create your account</span>
								<ArrowRight className="h-4 w-4" />
							</button>
							<button
								onClick={() => onOpenAuth('login')}
								className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur-md shadow-sm transition-all hover:scale-105 hover:bg-slate-100/50 focus:outline-none"
								type="button"
							>
								<span>Sign In</span>
							</button>
						</>
					)}
				</div>
			</header>

			{/* 2. Platform Stats Bar */}
			<section className="relative z-10 grid grid-cols-2 gap-4 rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xl shadow-slate-200/30 backdrop-blur-md md:grid-cols-4">
				<div className="text-center">
					<p className="text-3xl font-extrabold text-indigo-600">{stats.postsCount}</p>
					<p className="mt-1 text-sm font-medium text-slate-500">Stories Published</p>
				</div>
				<div className="text-center border-l border-slate-200/60">
					<p className="text-3xl font-extrabold text-indigo-600">{stats.likesCount}</p>
					<p className="mt-1 text-sm font-medium text-slate-500">Post Hearts</p>
				</div>
				<div className="text-center border-l border-slate-200/60">
					<p className="text-3xl font-extrabold text-indigo-600">{stats.commentsCount}</p>
					<p className="mt-1 text-sm font-medium text-slate-500">Active Comments</p>
				</div>
				<div className="text-center border-l border-slate-200/60">
					<p className="text-3xl font-extrabold text-indigo-600">{stats.authorsCount}</p>
					<p className="mt-1 text-sm font-medium text-slate-500">Active Writers</p>
				</div>
			</section>

			{/* 3. Main Content Feed with Search and Filtering */}
			<section className="relative z-10 space-y-6 pt-4 border-t border-slate-200/70">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-2xl font-bold tracking-tight text-slate-900">Explore Published Stories</h2>
						<p className="mt-1 text-sm text-slate-500">Read what others have written on the platform.</p>
					</div>

					{/* Search input */}
					<div className="relative max-w-xs w-full">
						<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
							<Search className="h-4 w-4" />
						</span>
						<input
							type="text"
							className="w-full rounded-full border border-slate-200/80 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
							placeholder="Search titles or content..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				{/* Filtering submenus */}
				<div className="flex flex-wrap items-center gap-2 pb-2">
					<span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
						<Clock className="h-3 w-3" />
						<span>Reading Length:</span>
					</span>
					<button
						onClick={() => setReadingTimeFilter('all')}
						className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
							readingTimeFilter === 'all'
								? 'bg-indigo-600 text-white'
								: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
						}`}
					>
						All Stories ({posts.length})
					</button>
					<button
						onClick={() => setReadingTimeFilter('short')}
						className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
							readingTimeFilter === 'short'
								? 'bg-indigo-600 text-white'
								: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
						}`}
					>
						Quick Reads (&le; 2 min)
					</button>
					<button
						onClick={() => setReadingTimeFilter('medium')}
						className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
							readingTimeFilter === 'medium'
								? 'bg-indigo-600 text-white'
								: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
						}`}
					>
						Medium (3-5 min)
					</button>
					<button
						onClick={() => setReadingTimeFilter('long')}
						className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
							readingTimeFilter === 'long'
								? 'bg-indigo-600 text-white'
								: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
						}`}
					>
						Deep Dives (&gt; 5 min)
					</button>
				</div>

				{/* Render list */}
				{isLoading ? (
					<div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-slate-400">
						<Activity className="h-8 w-8 animate-pulse text-indigo-500" />
						<p className="mt-4 text-sm font-medium">Fetching active database stories...</p>
					</div>
				) : filteredPosts.length === 0 ? (
					<div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
						<BookOpen className="mx-auto h-8 w-8 text-slate-400" />
						<p className="mt-4 text-sm font-medium text-slate-700">No matching posts found</p>
						<p className="mt-1 text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2">
						{filteredPosts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								currentUser={currentUser}
								onToggleLike={onToggleLike}
								onAddComment={onAddComment}
								onDeleteComment={onDeleteComment}
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
}

export default Home;
