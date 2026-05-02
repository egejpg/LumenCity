"use client";

import { useRole } from "@/hooks/useRole";
import Link from "next/link";

export default function RoleSwitcher() {
  const { role, switchRole } = useRole();

  return (
    <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full p-1">
      <Link href="/app">
        <button
          onClick={() => switchRole("citizen")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            role === "citizen"
              ? "bg-amber-500 text-gray-950"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Vatandaşım
        </button>
      </Link>
      <Link href="/admin">
        <button
          onClick={() => switchRole("municipality")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            role === "municipality"
              ? "bg-amber-500 text-gray-950"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Belediyeyim
        </button>
      </Link>
    </div>
  );
}
