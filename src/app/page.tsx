"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logout from './(components)/Logout';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check if the userSession is present in sessionStorage
    const userSession = sessionStorage.getItem('userSession');
    console.log(userSession)
    if (userSession) {
      const userData = JSON.parse(userSession);
      console.log(userData);
      setUsername(userData.user.username); // Assuming the user object has a username field
    }
  }, []);

  return (
    <div>
      {username ? (
        <div>
          <p>Currently logged in as: @{username}</p>
          <Logout />
        </div>
      ) : (
        <Link href="/login">
          <button className="bg-black p-2 text-white rounded-2xl px-4">
            Get started
          </button>
        </Link>
      )}
    </div>
  );
}
