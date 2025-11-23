import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Pencil, Save, X } from 'lucide-react';
import PostCard from '../components/PostCard.jsx';

function Profile({
	currentUser = null,
	posts = [],
	onUpdatePost = () => {},
	onDeletePost = () => {},
	onUpdateBio = () => {},
	onUpdateAvatar = () => {},
	onToggleLike = () => {},
	onAddComment = () => {},
	onDeleteComment = () => {},
}) {
	const [bioDraft, setBioDraft] = useState(currentUser?.bio ?? '');
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [editingPostId, setEditingPostId] = useState(null);
	const [editTitle, setEditTitle] = useState('');
	const [editContent, setEditContent] = useState('');
	const [editImages, setEditImages] = useState([]);
	const [editImagesChanged, setEditImagesChanged] = useState(false);
	const avatarInputRef = useRef(null);
	const editImagesInputRef = useRef(null);
	const currentUserId = currentUser?.id ?? currentUser?._id ?? null;

	const getAuthorId = (post) => post?.author?.id ?? post?.author?._id ?? post?.authorId ?? null;
	const isPostOwner = (post) => {
		const authorId = getAuthorId(post);
		return Boolean(authorId && currentUserId && String(authorId) === String(currentUserId));
	};

	useEffect(() => {
		if (!isEditingBio) {
			setBioDraft(currentUser?.bio ?? '');
		}
	}, [currentUser?.bio, isEditingBio]);

	if (!currentUser) {
		return (
			<section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm shadow-slate-200/40">
				<h1 className="text-2xl font-semibold text-slate-900">Sign in to view your profile</h1>
				<p className="mt-2 text-sm text-slate-500">Access your account details and manage your posts once you are logged in.</p>
				<Link
					className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
					to="/login"
				>
					Sign in
				</Link>
			</section>
		);
	}

	const myPosts = posts.filter(isPostOwner);
	const isEditingPost = editingPostId !== null;

	const startEditingPost = (post) => {
		if (!isPostOwner(post)) {
			return;
		}
		setEditingPostId(post.id);
		setEditTitle(post.title);
		setEditContent(post.content);
		setEditImages(post.images ? [...post.images] : []);
		setEditImagesChanged(false);
	};

	const cancelEditingPost = () => {
		setEditingPostId(null);
		setEditTitle('');
		setEditContent('');
		setEditImages([]);
		setEditImagesChanged(false);
	};

	const handlePostUpdate = (event) => {
		event.preventDefault();

		const trimmedTitle = editTitle.trim();
		const trimmedContent = editContent.trim();

		if (!trimmedTitle || !trimmedContent || editingPostId === null) {
			return;
		}

		const imagePayload = editImagesChanged ? [...editImages] : undefined;
		onUpdatePost({ id: editingPostId, title: trimmedTitle, content: trimmedContent, images: imagePayload });
		cancelEditingPost();
	};

	const handlePostDelete = (id) => {
		const target = posts.find((post) => post.id === id);
		if (!target || !isPostOwner(target)) {
			return;
		}
		onDeletePost(id);
		if (editingPostId === id) {
			cancelEditingPost();
		}
	};

	const handleBioSubmit = (event) => {
		event.preventDefault();
		const trimmed = bioDraft.trim();
		onUpdateBio(trimmed);
		setIsEditingBio(false);
	};

	const handleBioCancel = () => {
		setBioDraft(currentUser?.bio ?? '');
		setIsEditingBio(false);
	};

	const handleBioEditStart = () => {
		setBioDraft(currentUser?.bio ?? '');
		setIsEditingBio(true);
	};

	const handleAvatarButtonClick = () => {
		avatarInputRef.current?.click();
	};

	const handleAvatarChange = (event) => {
		const file = event.target.files && event.target.files[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				onUpdateAvatar(reader.result);
			}
		};
		reader.readAsDataURL(file);
		event.target.value = '';
	};

	const avatarInitials =
		currentUser?.name
			?.split(' ')
			.filter(Boolean)
			.map((part) => part[0].toUpperCase())
			.slice(0, 2)
			.join('') || 'YOU';

	return (
		<div className="space-y-10">
			<section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/40">
				<header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
					<div>
						<p className="text-sm uppercase tracking-wide text-slate-400">Account</p>
						<h1 className="text-3xl font-semibold text-slate-900">{currentUser.name}</h1>
						<p className="mt-1 text-sm text-slate-500">{currentUser.email}</p>
					</div>
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
						<div className="h-20 w-20 overflow-hidden rounded-full border border-indigo-200 bg-indigo-50">
							{currentUser.avatar ? (
								<img className="h-full w-full object-cover" src={currentUser.avatar} alt={`${currentUser.name}'s avatar`} />
							) : (
								<div className="flex h-full w-full items-center justify-center bg-indigo-600 text-lg font-semibold text-white">
									{avatarInitials}
								</div>
							)}
						</div>
						<div>
							<button
								className="inline-flex items-center gap-2 rounded-full border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
								onClick={handleAvatarButtonClick}
								type="button"
							>
								<ImageIcon aria-hidden className="h-4 w-4" />
								<span>Update photo</span>
							</button>
							<input
								accept="image/*"
								className="hidden"
								ref={avatarInputRef}
								type="file"
								onChange={handleAvatarChange}
							/>
						</div>
					</div>
				</header>

				<section className="mt-6 space-y-4">
					<header className="flex items-start justify-between gap-4">
						<div>
							<p className="text-sm font-medium text-slate-700">Bio</p>
							<p className="mt-1 text-sm text-slate-600">
								{currentUser.bio ? currentUser.bio : 'Add a short introduction so readers know who you are.'}
							</p>
						</div>
						<button
							className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
							onClick={handleBioEditStart}
							type="button"
						>
							<Pencil aria-hidden className="h-4 w-4" />
							<span>Edit bio</span>
						</button>
					</header>

					{isEditingBio ? (
						<form className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4" onSubmit={handleBioSubmit}>
							<label className="sr-only" htmlFor="bio">
								Bio
							</label>
							<textarea
								className="h-20 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
								id="bio"
								placeholder="Tell readers a little about yourself"
								value={bioDraft}
								onChange={(event) => setBioDraft(event.target.value)}
							/>
							<div className="flex items-center gap-3">
								<button
									className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
									type="submit"
								>
									<Save aria-hidden className="h-4 w-4" />
									<span>Save bio</span>
								</button>
								<button
									className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
									onClick={handleBioCancel}
									type="button"
								>
									<X aria-hidden className="h-4 w-4" />
									<span>Cancel</span>
								</button>
							</div>
						</form>
					) : null}
				</section>
			</section>

			<section className="space-y-6">
				<header>
					<h2 className="text-xl font-semibold text-slate-900">My posts</h2>
					<p className="mt-1 text-sm text-slate-500">Edit or remove the posts you have authored.</p>
				</header>

				{isEditingPost ? (
					<form
						className="space-y-5 rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm shadow-indigo-200/40"
						onSubmit={handlePostUpdate}
					>
						<h3 className="text-lg font-semibold text-indigo-700">Editing post</h3>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700" htmlFor="editTitle">
								Title
							</label>
							<input
								className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
								id="editTitle"
								required
								value={editTitle}
								onChange={(event) => setEditTitle(event.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700" htmlFor="editContent">
								Content
							</label>
							<textarea
								className="h-36 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
								id="editContent"
								required
								value={editContent}
								onChange={(event) => setEditContent(event.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-slate-700">Post images</p>
							<div className="flex flex-wrap items-center gap-3">
								<button
									className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
									onClick={() => editImagesInputRef.current?.click()}
									type="button"
								>
									<ImageIcon aria-hidden className="h-4 w-4" />
									<span>Upload images</span>
								</button>
								<input
									accept="image/*"
									className="hidden"
									ref={editImagesInputRef}
									type="file"
									multiple
									onChange={(event) => {
										const files = Array.from(event.target.files ?? []);
										if (files.length === 0) {
											return;
										}

										files.forEach((file) => {
											const reader = new FileReader();
											reader.onload = () => {
												if (typeof reader.result === 'string') {
													setEditImages((prev) => [...prev, reader.result]);
													setEditImagesChanged(true);
												}
											};
											reader.readAsDataURL(file);
										});
										event.target.value = '';
								}}
								/>
							</div>
							{editImages.length > 0 ? (
								<div className="grid gap-4 sm:grid-cols-2">
									{editImages.map((preview, index) => (
										<div key={`${preview}-${index}`} className="relative overflow-hidden rounded-2xl border border-indigo-200">
											<img className="h-48 w-full object-cover" src={preview} alt={`Post cover ${index + 1}`} />
											<button
												className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-white/90 p-2 text-xs font-semibold text-slate-600 shadow hover:bg-white"
												onClick={() => {
													setEditImages((prev) => prev.filter((_, idx) => idx !== index));
													setEditImagesChanged(true);
												}}
												type="button"
											>
												<X aria-hidden className="h-4 w-4" />
											</button>
										</div>
									))}
								</div>
							) : null}
						</div>
						<div className="flex flex-wrap items-center gap-3">
							<button className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200" type="submit">
								Save changes
							</button>
							<button className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100" onClick={cancelEditingPost} type="button">
								Cancel
							</button>
						</div>
					</form>
				) : null}


				{myPosts.length === 0 ? (
					<p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
						You have not published any posts yet.
					</p>
				) : (
					<div className="grid gap-6 md:grid-cols-2">
						{myPosts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								currentUser={currentUser}
								onEdit={startEditingPost}
								onDelete={handlePostDelete}
								onToggleLike={onToggleLike}
								onAddComment={onAddComment}
								onDeleteComment={onDeleteComment}
								canEdit={isPostOwner(post)}
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
}

export default Profile;
