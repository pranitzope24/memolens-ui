"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function AnimatedHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    console.log(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="fixed w-full top-0 left-0 right-0 p-4 shadow-md bg-white/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <Link href="/" className="outline-none">
          <motion.div layoutId="logoWrapper" className="flex items-center gap-2 px-2">
            <motion.div layoutId="logoImage">
              <Image src={logo} alt="MemoLens Logo" width={40} height={40} />
            </motion.div>
            <motion.span
              layoutId="logoText"
              className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
            >
              MemoLens
            </motion.span>
          </motion.div>
        </Link>

        {/* --- NAVIGATION --- */}
        <nav className="flex items-center gap-2 ml-4">

          {/* Always Visible */}
          <Link 
            href="/upload"
            className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all"
          >
            Upload
          </Link>

          <Link 
            href="/search"
            className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all"
          >
            Search Memories
          </Link>

          {/* If NOT logged in */}
          {!isLoggedIn && (
            <>
              <Link 
                href="/login"
                className="px-4 py-2 rounded-lg font-medium text-blue-600 hover:bg-blue-50 transition-all"
              >
                Login
              </Link>

              <Link 
                href="/register"
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                Register
              </Link>
            </>
          )}

          {/* If logged in */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
