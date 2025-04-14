"use client";
import Link from 'next/link';
import useRedirectToHome from '../hooks/useRedirectToHome';

export default function Home() {
  useRedirectToHome();
  return (
    <div>
      <Link href="/login">
          <button className="bg-black p-2 text-white rounded-2xl px-4">
            Get started
          </button>
        </Link>
    </div>
  );
}
