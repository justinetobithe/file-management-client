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

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <h1 className="text-4xl md:text-5xl font-bold text-white shadow-lg">
            Welcome{user ? `, ${user.first_name} ${user.last_name}` : ""}!
          </h1>
        </div>
      </div>
    </div>
  );
}
