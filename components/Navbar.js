import React from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  const handleSignInClick = () => {
    router.push('/login');
  };

  return (
    <div className="relative">
      <nav className="bg-slate-50 bg-opacity-40 backdrop-blur shadow-md top-0 left-0 w-full z-50 fixed">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-lg font-semibold"></div>
          <div className="flex space-x-4">
            <button
              onClick={handleSignInClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
