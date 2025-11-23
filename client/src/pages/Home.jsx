import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';

function Home({
	posts = [],
	currentUser = null,
	isLoading = false,
	onToggleLike = () => {},
	onAddComment = () => {},
	onDeleteComment = () => {},
}) {
	return (
		<section className="space-y-10">
			<header className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm shadow-slate-200/40">
				<h1 className="text-3xl font-semibold text-slate-900">Personal Blog Platform</h1>
				<p className="mt-3 text-base text-slate-600">
					Draft posts, share stories, and engage with readers. Use the navigation to create a post or manage your
					account.
				</p>
				<div className="mt-6 flex justify-center gap-4">
					<Link
						className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
						to="/create"
					>
						Create a post
					</Link>
					<Link
						className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
						to="/login"
					>
						Sign in
					</Link>
				</div>
			</header>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold text-slate-900">Latest posts</h2>
				{isLoading ? (
					<p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
						Loading latest posts...
					</p>
				) : posts.length === 0 ? (
					<p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
						No posts have been published yet. Be the first to share your story.
					</p>
				) : (
					<div className="grid gap-6 md:grid-cols-2">
						{posts.map((post) => (
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
		</section>
	);
}

export default Home;
