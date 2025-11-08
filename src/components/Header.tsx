// src/components/Header.tsx

import Link from "next/link";
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg">
      
      {/* Modern Next.js <Link> usage (No <a> tag inside) */}
      <Link href="/" className="text-2xl font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors">
        Leetpeers
      </Link>

      <nav className="flex items-center space-x-4">
        {/* Conditional rendering based on session */}
        {session ? (
          <>
            <Link 
              href="/dashboard" 
              className="px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
            {/* ... logout button component goes here ... */}
          </>
        ) : (
          <>
            {/* Modern Next.js <Link> usage */}
            <Link 
              href="/auth/signin" 
              className="px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Log In
            </Link>
            
            {/* Modern Next.js <Link> usage */}
            <Link 
              href="/auth/signup" 
              className="bg-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-md"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
