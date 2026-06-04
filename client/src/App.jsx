import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import CreatePost from './pages/CreatePost.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import api from './api/axios.js';

function App() {
	// Track the signed-in user and posts list
	const [currentUser, setCurrentUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [isLoadingPosts, setIsLoadingPosts] = useState(true);

	// Auth modal states
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

	const openAuthModal = (mode = 'login') => {
		setAuthModalMode(mode);
		setIsAuthModalOpen(true);
	};

	const closeAuthModal = () => {
		setIsAuthModalOpen(false);
	};

	// Helper to read a friendly error message
	const extractErrorMessage = useCallback((error, fallbackMessage) => {
		return error?.response?.data?.message ?? fallbackMessage;
	}, []);

	// Ask the API for the current user on first load
	const fetchCurrentUser = useCallback(async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			setCurrentUser(null);
			return;
		}

		try {
			const { data } = await api.get('/auth/me');
			setCurrentUser(data.user);
		} catch (error) {
			localStorage.removeItem('token');
			setCurrentUser(null);
		}
	}, []);

	useEffect(() => {
		fetchCurrentUser();
	}, [fetchCurrentUser]);

	useEffect(() => {
		// Load the latest posts whenever the page mounts
		const fetchPosts = async () => {
			setIsLoadingPosts(true);
			try {
				const { data } = await api.get('/posts');
				setPosts(data.posts ?? []);
			} catch (error) {
				const message = extractErrorMessage(error, 'Unable to load posts.');
				toast.error(message);
			} finally {
				setIsLoadingPosts(false);
			}
		};

		fetchPosts();
	}, [extractErrorMessage]);

	// Auth handlers that manage login/register flows
	const handleLogin = async ({ email, password }) => {
		try {
			const { data } = await api.post('/auth/login', { email, password });
			localStorage.setItem('token', data.token);
			setCurrentUser(data.user);
			toast.success('Welcome back!');
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to sign in.');
			toast.error(message);
			throw new Error(message);
		}
	};

	const handleRegister = async ({ name, email, password, bio }) => {
		try {
			const { data } = await api.post('/auth/register', {
				name,
				email,
				password,
				bio,
			});
			localStorage.setItem('token', data.token);
			setCurrentUser(data.user);
			toast.success('Account created successfully!');
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to create account.');
			toast.error(message);
			throw new Error(message);
		}
	};

	// Clear auth state on logout
	const handleLogout = () => {
		localStorage.removeItem('token');
		setCurrentUser(null);
	};

	// Post CRUD helpers shared across pages
	const handleCreatePost = async ({ title, content, files }) => {
		if (!currentUser) {
			toast.error('Please sign in to create a post.');
			throw new Error('Authentication required');
		}

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('content', content);
			(files ?? []).forEach((file) => {
				formData.append('images', file);
			});

			const { data } = await api.post('/posts', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setPosts((prev) => [data.post, ...prev]);
			toast.success('Post published successfully!');
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to publish post.');
			toast.error(message);
			throw new Error(message);
		}
	};

	const handleUpdatePost = async ({ id, title, content, files, existingImages }) => {
		if (!currentUser) {
			toast.error('Please sign in to update posts.');
			throw new Error('Authentication required');
		}

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('content', content);
			if (existingImages) {
				formData.append('existingImages', JSON.stringify(existingImages));
			}
			(files ?? []).forEach((file) => {
				formData.append('images', file);
			});

			const { data } = await api.put(`/posts/${id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setPosts((prev) =>
				prev.map((post) => (post.id === id ? data.post : post)),
			);
			toast.success('Post updated');
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to update post.');
			toast.error(message);
			throw new Error(message);
		}
	};

	const handleDeletePost = async (id) => {
		if (!currentUser) {
			toast.error('Please sign in to delete posts.');
			throw new Error('Authentication required');
		}

		try {
			await api.delete(`/posts/${id}`);
			setPosts((prev) => prev.filter((post) => post.id !== id));
			toast.success('Post deleted');
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to delete post.');
			toast.error(message);
			throw new Error(message);
		}
	};

	const handleToggleLike = async (postId) => {
		if (!currentUser) {
			toast.error('Please sign in to like posts.');
			throw new Error('Authentication required');
		}

		try {
			const { data } = await api.post(`/posts/${postId}/like`);
			setPosts((prev) => prev.map((post) => (post.id === postId ? data.post : post)));
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to update like.');
			toast.error(message);
			throw new Error(message);
		}
	};

	const handleAddComment = async (postId, text) => {
		if (!currentUser) {
			toast.error('Please sign in to comment.');
			throw new Error('Authentication required');
		}

		try {
			const { data } = await api.post(`/posts/${postId}/comments`, { text });
			setPosts((prev) =>
				prev.map((post) => {
					if (post.id !== postId) {
						return post;
					}
					return {
						...post,
						comments: [...(post.comments ?? []), data.comment],
					};
				}),
			);
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to add comment.');
			toast.error(message);
			throw new Error(message);
		}
	};

	const handleDeleteComment = async (postId, commentId) => {
		if (!currentUser) {
			toast.error('Please sign in to delete comments.');
			throw new Error('Authentication required');
		}

		try {
			await api.delete(`/posts/${postId}/comments/${commentId}`);
			setPosts((prev) =>
				prev.map((post) => {
					if (post.id !== postId) {
						return post;
					}
					return {
						...post,
						comments: (post.comments ?? []).filter((comment) => comment.id !== commentId),
					};
				}),
			);
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to delete comment.');
			toast.error(message);
			throw new Error(message);
		}
	};

	// Profile helpers for updating user info
	const handleUpdateBio = async (bio) => {
		if (!currentUser) {
			toast.error('Please sign in to update your bio.');
			throw new Error('Authentication required');
		}

		try {
			const { data } = await api.patch('/auth/bio', { bio });
			setCurrentUser(data.user);
			toast.success('Bio updated');
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to update bio.');
			toast.error(message);
			throw new Error(message);
		}
	};

	const handleUpdateAvatar = async (file) => {
		if (!currentUser) {
			toast.error('Please sign in to update your avatar.');
			throw new Error('Authentication required');
		}

		try {
			const formData = new FormData();
			formData.append('avatar', file);
			const { data } = await api.patch('/auth/avatar', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setCurrentUser(data.user);
			toast.success('Profile photo updated');
		} catch (error) {
			const message = extractErrorMessage(error, 'Unable to update avatar.');
			toast.error(message);
			throw new Error(message);
		}
	};

	// Helper route guard that redirects to '/' and auto-opens login modal
	const RequireAuth = ({ children }) => {
		useEffect(() => {
			if (!currentUser) {
				openAuthModal('login');
			}
		}, [currentUser]);

		return currentUser ? children : <Navigate to="/" replace />;
	};

	// Routes wire up the pages with their handlers
	return (
		<BrowserRouter>
			<div className="min-h-screen bg-slate-100">
				<Navbar currentUser={currentUser} onLogout={handleLogout} onOpenAuth={openAuthModal} />
				<main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
					<Routes>
						<Route
							path="/"
							element={
								<Home
									posts={posts}
									currentUser={currentUser}
									isLoading={isLoadingPosts}
									onToggleLike={handleToggleLike}
									onAddComment={handleAddComment}
									onDeleteComment={handleDeleteComment}
									onOpenAuth={openAuthModal}
								/>
							}
						/>
						<Route
							path="/create"
							element={
								<RequireAuth>
									<CreatePost
										currentUser={currentUser}
										onCreatePost={handleCreatePost}
									/>
								</RequireAuth>
							}
						/>
						<Route
							path="/profile"
							element={
								<RequireAuth>
									<Profile
										currentUser={currentUser}
										posts={posts}
										onUpdatePost={handleUpdatePost}
										onDeletePost={handleDeletePost}
										onUpdateBio={handleUpdateBio}
										onUpdateAvatar={handleUpdateAvatar}
										onToggleLike={handleToggleLike}
										onAddComment={handleAddComment}
										onDeleteComment={handleDeleteComment}
									/>
								</RequireAuth>
							}
						/>
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
				<ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover={false} />
			</div>

			{/* Unified Auth Modal Overlay */}
			{isAuthModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
					{/* Modal backdrop click to close */}
					<div className="absolute inset-0" onClick={closeAuthModal} />
					<div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
						{authModalMode === 'login' ? (
							<Login 
								onLogin={handleLogin} 
								onClose={closeAuthModal} 
								onSwitchToRegister={() => setAuthModalMode('register')} 
							/>
						) : (
							<Register 
								onRegister={handleRegister} 
								onClose={closeAuthModal} 
								onSwitchToLogin={() => setAuthModalMode('login')} 
							/>
						)}
					</div>
				</div>
			)}
		</BrowserRouter>
	);
}

export default App;
