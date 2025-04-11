"use client";
import Link from 'next/link';

export default function Home() {

  return (
    <div>
      <Link
      href="/login"
      >
      <button className="bg-black p-2 text-white rounded-2xl px-4">
        Get started
      </button>
      </Link>
    </div>
  );
}
