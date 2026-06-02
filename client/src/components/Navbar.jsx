import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar({ currentUser = null, onLogout = () => {} }) {
	const [imgError, setImgError] = useState(false);
	const initials = (currentUser?.name
		?.split(' ')
		.filter(Boolean)
		.map((part) => part[0].toUpperCase())
		.slice(0, 2)
		.join('')) || 'YOU';

	return (
		<header className="bg-white shadow-sm shadow-slate-200">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<Link className="text-lg font-semibold text-indigo-600" to="/">
					Personal Blog
				</Link>

				<nav className="flex items-center gap-3 sm:gap-4">
					<NavLink
						className={({ isActive }) =>
							`rounded-full px-4 py-2 text-sm font-medium transition ${
								isActive
									? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
									: 'text-slate-600 hover:bg-slate-100'
							}`
						}
						to="/create"
					>
						Create a post
					</NavLink>

					{!currentUser ? (
						<Link
							className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
							to="/login"
						>
							Sign in
						</Link>
					) : null}

					{currentUser ? (
						<div className="flex items-center gap-3">
							<Link
								className="flex items-center gap-3 rounded-full bg-slate-100 px-3 py-2 transition hover:bg-slate-200"
								to="/profile"
							>
								<div className="relative h-9 w-9 rounded-full overflow-hidden bg-indigo-600 text-sm font-semibold text-white">
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
								<div className="hidden text-left text-sm sm:block">
									
									<p className="text-s text-slate-500">My profile</p>
								</div>
							</Link>
							<button
								className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
								onClick={onLogout}
								type="button"
							>
								Logout
							</button>
						</div>
					) : null}
				</nav>
			</div>
		</header>
	);
}

export default Navbar;
