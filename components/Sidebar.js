import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from '../lib/supabaseClient';

const Sidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError('Error signing out: ' + error.message);
      console.error('ERROR:', error);
    } else {
      window.location.href = '/login';
    }
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Create Survey", path: "/Survey" },
    { name: "Answer Survey", path: "/SurveyAnswer" },
    { name: "Results", path: "/results" },
    
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
  <div className="flex items-center justify-center h-20 shadow-lg">
    <h1 className="text-2xl font-bold">Swipe Select</h1>
  </div>
  <nav className="flex-1 flex flex-col px-4 py-6 space-y-2">
    <div className="flex-1 space-y-2">
      {menuItems.map((item, index) => (
        <Link href={item.path} key={index}>
          <div
            className={`block px-4 py-2 rounded-lg transition-all hover:bg-gray-700 ${
              router.pathname === item.path ? "bg-blue-500" : ""
            }`}
          >
            {item.name}
          </div>
        </Link>
      ))}
    </div>
    <div className="flex flex-col items-center justify-center space-y-4 py-4">
      <div className="text-center">
        {user ? (
          <>
            <p className="text-lg mb-4">Logged in as: {user.email}</p>
            <button
              type="button"
              className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </>
        ) : (
          <p className="text-lg">No user is currently logged in.</p>
        )}
      </div>
    </div>
  </nav>
</div>

  );
};

export default Sidebar;
