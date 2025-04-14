"use client";
import useRedirectToHome from '../hooks/useRedirectToHome';

export default function Home() {
  useRedirectToHome();
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-2">
      Hero Section
    </div>
  );
}
