"use client";
import Link from 'next/link';
import useRedirectToHome from '../hooks/useRedirectToHome';

export default function Home() {
  useRedirectToHome();
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-2">
      Hero Section
      <Link href="/login" className="text-lg font-semibold animate-pulse bg-black text-white p-2 px-4 rounded-lg">
        Get Started
      </Link>
    </div>
  );
}
