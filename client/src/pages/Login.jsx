import { useState } from 'react';
import { X } from 'lucide-react';

function Login({ 
	onLogin = async () => {}, 
	onClose = () => {}, 
	onSwitchToRegister = () => {} 
}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');

		try {
			setIsSubmitting(true);
			await onLogin({ email: email.trim(), password });
			onClose();
		} catch (loginError) {
			setError(loginError?.message ?? 'Unable to sign in.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full max-w-md rounded-2xl bg-white p-8 relative border border-slate-100 shadow-2xl">
			{/* Close button */}
			<button
				onClick={onClose}
				className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
				type="button"
				aria-label="Close modal"
			>
				<X className="h-4.5 w-4.5" />
			</button>

			<h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
			<p className="mt-2 text-sm text-slate-500">Access your personal blog dashboard.</p>

			<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
				{error ? (
					<p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
						{error}
					</p>
				) : null}
				
				<div className="space-y-2">
					<label className="text-sm font-semibold text-slate-700" htmlFor="email">
						Email
					</label>
					<input
						className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
						id="email"
						type="email"
						required
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="you@example.com"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-semibold text-slate-700" htmlFor="password">
						Password
					</label>
					<input
						className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
						id="password"
						type="password"
						required
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						placeholder="Enter your password"
					/>
				</div>

				<button
					className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70 shadow-md shadow-indigo-600/10"
					disabled={isSubmitting}
					type="submit"
				>
					{isSubmitting ? 'Signing in…' : 'Continue'}
				</button>
			</form>

			<p className="mt-6 text-center text-sm text-slate-500">
				New here?{' '}
				<button
					onClick={onSwitchToRegister}
					className="font-bold text-indigo-600 hover:text-indigo-700 transition"
					type="button"
				>
					Create an account
				</button>
			</p>
		</div>
	);
}

export default Login;
