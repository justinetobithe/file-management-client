"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import AppNavBurger from "./AppNavBurger";
import { Bell, LogOut, User } from "lucide-react";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";

const AppHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const userSession = await getSession();
      setSession(userSession);
    }
    fetchSession();
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <ul className="flex items-center justify-center bg-white px-5 py-3 shadow-md">
      <li className="flex items-center">
        <AppNavBurger />
        <Link href="/home" className="flex items-center space-x-2">
          <Image src="/img/logo.png" width={48} height={48} alt="Logo" />
          <span className="text-[1.25rem] font-bold">File Management System</span>
        </Link>
      </li>

      <li className="ml-auto inline-block">
        <div className="flex items-center space-x-3">
          <span className="hidden text-[0.8rem] font-bold sm:inline">
            {session?.user?.name}
          </span>

          <div className="relative">
            <Avatar onClick={toggleDropdown} className="cursor-pointer">
              <AvatarImage
                src={session?.user?.image ?? undefined}
                alt="@shadcn"
                className="object-cover"
              />
              <AvatarFallback>
                {session?.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48 py-2">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </li>
    </ul>
  );
};

export default AppHeader;
