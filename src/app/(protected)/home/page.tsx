"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import User from "@/types/User";
import { api } from "@/lib/api";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get<{ data: User }>("/api/me");
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src="/img/CF-GR.png"
          alt="Design Background"
          layout="fill"
          objectFit="cover"
          objectPosition="bottom" 
          className="w-full"
        />
      </div>

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome{user ? `, ${user.first_name} ${user.last_name}` : ""}!
        </h1>
        <p className="text-gray-600 mt-2">
          Stay updated with the latest files and notifications.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-blue-700">Recent Files</h2>
            <p className="text-sm text-gray-600 mt-1">
              Browse and access your recently uploaded documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
