import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Answer Survey", path: "/SurveyAnswer" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="flex items-center justify-center h-20 shadow-lg">
        <h1 className="text-2xl font-bold">Consumer Page</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
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
      </nav>
    </div>
  );
};

export default Sidebar;
