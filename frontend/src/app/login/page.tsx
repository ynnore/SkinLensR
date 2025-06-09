// src/app/login/page.tsx
'use client'; // This component needs to be a client component for interactivity

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // For navigation
import Link from 'next/link'; // For client-side navigation to other pages

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // --- Mock Implementation ---
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    if (email === 'user@example.com' && password === 'password') {
      // Simulate successful login
      console.log('Login successful!');
      router.push('/dashboard'); // Redirect to a protected page
    } else {
      setError('Invalid email or password. (Hint: user@example.com / password)');
    }
    setIsLoading(false);
    // --- End Mock Implementation ---
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {/* La classe shadow-xl a été retirée de la ligne ci-dessous */}
      <div className="w-full max-w-md rounded-lg bg-white p-8"> {/* <--- MODIFICATION ICI */}
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Login
        </h1>

        {error && (
          <div
            className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              {/* You can add a "Forgot password?" link here */}
              {/* <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link> */}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isLoading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Not a member?{' '}
          <Link
            href="/signup" // Or your registration page
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}