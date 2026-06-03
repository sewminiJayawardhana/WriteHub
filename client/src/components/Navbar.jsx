import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles, LogOut, PenTool, Compass, User } from 'lucide-react';

function Navbar({ currentUser = null, onLogout = () => {} }) {
	const [imgError, setImgError] = useState(false);
	const initials = (currentUser?.name
		?.split(' ')
		.filter(Boolean)
		.map((part) => part[0].toUpperCase())
		.slice(0, 2)
		.join('')) || 'YOU';

	// Styled standard links with active indicator
	const getLinkClass = ({ isActive }) =>
		`flex items-center gap-2 py-1 px-1.5 text-sm font-semibold transition-all duration-200 border-b-2 ${
			isActive 
				? 'text-indigo-600 border-indigo-600' 
				: 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
		}`;

	return (
		<header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
				
				{/* Left: Branding Logo */}
				<Link className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-900 transition-all hover:scale-102" to="/">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
						<Sparkles className="h-4 w-4" />
					</div>
					<span className="bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
						WriteHub
					</span>
				</Link>

				{/* Center: Main Navigation */}
				<nav className="hidden md:flex items-center gap-6">
					<NavLink className={getLinkClass} to="/" end>
						<Compass className="h-4 w-4" />
						<span>Explore</span>
					</NavLink>
					
					<NavLink className={getLinkClass} to="/create">
						<PenTool className="h-4 w-4" />
						<span>Write Story</span>
					</NavLink>

					{currentUser ? (
						<NavLink className={getLinkClass} to="/profile">
							<User className="h-4 w-4" />
							<span>My Profile</span>
						</NavLink>
					) : null}
				</nav>

				{/* Right: Actions / Profile */}
				<div className="flex items-center gap-4">
					
					{/* Mobile Write navigation fallback */}
					<NavLink 
						className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition" 
						to="/create"
						title="Write a Post"
					>
						<PenTool className="h-4 w-4" />
					</NavLink>

					{!currentUser ? (
						<div className="flex items-center gap-3">
							<Link className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition" to="/login">
								Sign in
							</Link>
							<Link className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800" to="/register">
								Get Started
							</Link>
						</div>
					) : (
						<div className="flex items-center gap-3">
							<Link
								className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition hover:bg-slate-50"
								to="/profile"
							>
								<div className="relative h-6 w-6 rounded-full overflow-hidden bg-indigo-600 text-[10px] font-bold text-white">
									{currentUser.avatar && !imgError ? (
										<img
											src={currentUser.avatar}
											alt={`${currentUser.name}'s avatar`}
											className="h-full w-full object-cover"
											onError={() => setImgError(true)}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">{initials}</div>
									)}
								</div>
								<span className="hidden text-xs font-bold text-slate-700 sm:block">
									{currentUser.name.split(' ')[0]}
								</span>
							</Link>

							<button
								className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
								onClick={onLogout}
								title="Logout"
								type="button"
							>
								<LogOut className="h-3.5 w-3.5" />
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

export default Navbar;
