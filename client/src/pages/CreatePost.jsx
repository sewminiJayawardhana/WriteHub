import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, X } from 'lucide-react';

// Displays the post creation form with image previews
function CreatePost({
	currentUser = null,
	onCreatePost = () => {},
}) {
	// Track form inputs, uploads, and submit state
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [selectedImages, setSelectedImages] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const imageInputRef = useRef(null);
	const selectedImagesRef = useRef([]);

	// Ask unauthenticated visitors to sign in first
	if (!currentUser) {
		return (
			<section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm shadow-slate-200/40">
				<h1 className="text-2xl font-semibold text-slate-900">Sign in to create posts</h1>
				<p className="mt-2 text-sm text-slate-500">
					You need an account to write, edit, and manage your stories.
				</p>
				<Link
					className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
					to="/login"
				>
					Sign in
				</Link>
			</section>
		);
	}

	// Release any generated preview URLs
	const revokePreview = (image) => {
		if (image?.file && image.preview) {
			URL.revokeObjectURL(image.preview);
		}
	};

	useEffect(() => {
		selectedImagesRef.current = selectedImages;
	}, [selectedImages]);

	useEffect(
		() => () => {
			// Clean up previews when the component unmounts
			selectedImagesRef.current.forEach(revokePreview);
		},
		[],
	);

	// Clear the form after a successful submit
	const resetForm = () => {
		setTitle('');
		setContent('');
		setSelectedImages((prev) => {
			prev.forEach(revokePreview);
			return [];
		});
	};

	// Send the new post up to the parent handler
	const handleSubmit = async (event) => {
		event.preventDefault();

		const trimmedTitle = title.trim();
		const trimmedContent = content.trim();

		if (!trimmedTitle || !trimmedContent) {
			return;
		}

		const newFiles = selectedImages.map((image) => image.file).filter(Boolean);

		try {
			setIsSubmitting(true);
			await onCreatePost({
				title: trimmedTitle,
				content: trimmedContent,
				files: newFiles,
			});
			resetForm();
		} catch (error) {
			// Errors surface via toast notifications triggered in parent handlers.
		} finally {
			setIsSubmitting(false);
		}
	};

	// Open the hidden file picker
	const handleImageButtonClick = () => {
		imageInputRef.current?.click();
	};

	// Add selected images and create previews
	const handleImageSelect = (event) => {
		const files = Array.from(event.target.files ?? []);
		if (files.length === 0) {
			return;
		}

		const newEntries = files.map((file) => ({
			id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
			preview: URL.createObjectURL(file),
			file,
			isExisting: false,
		}));

		setSelectedImages((prev) => [...prev, ...newEntries]);
		event.target.value = '';
	};

	// Remove an image preview from the list
	const handleImageRemove = (index) => {
		setSelectedImages((prev) => {
			const next = [...prev];
			const [removed] = next.splice(index, 1);
			if (removed) {
				revokePreview(removed);
			}
			return next;
		});
	};

	return (
		<section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/40">
			<header className="mb-6">
				<h1 className="text-2xl font-semibold text-slate-900">
					Create a new post
				</h1>
				<p className="mt-1 text-sm text-slate-500">
					Draft your story and publish it to share with your readers.
				</p>
			</header>

			<form className="space-y-5" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700" htmlFor="title">
						Post title
					</label>
					<input
						className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
						id="title"
						placeholder="A catchy headline"
						required
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700" htmlFor="content">
						Post content
					</label>
					<textarea
						className="h-48 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
						id="content"
						placeholder="Write your story here..."
						required
						value={content}
						onChange={(event) => setContent(event.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<p className="text-sm font-medium text-slate-700">Post images</p>
					<div className="flex flex-wrap items-center gap-3">
						<button
							className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
							onClick={handleImageButtonClick}
							type="button"
						>
							<ImageIcon aria-hidden className="h-4 w-4" />
							<span>Upload images</span>
						</button>
						<input
							accept="image/*"
							className="hidden"
							ref={imageInputRef}
							type="file"
							multiple
							onChange={handleImageSelect}
						/>
					</div>
					{selectedImages.length > 0 ? (
						<div className="grid gap-4 sm:grid-cols-2">
							{selectedImages.map((image, index) => (
								<div key={image.id} className="relative overflow-hidden rounded-2xl border border-slate-200">
									<img className="h-48 w-full object-cover" src={image.preview} alt={`Post preview ${index + 1}`} />
									<button
										className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-white/90 p-2 text-xs font-semibold text-slate-600 shadow hover:bg-white"
										onClick={() => handleImageRemove(index)}
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
					<button
						className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
						disabled={isSubmitting}
						type="submit"
					>
						{isSubmitting ? 'Saving…' : 'Publish post'}
					</button>
				</div>
			</form>
		</section>
	);
}

export default CreatePost;
