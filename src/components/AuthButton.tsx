"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@supabase/supabase-js";

interface Profile {
  username: string | null;
  avatar_url: string | null;
  role: "citizen" | "staff";
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("username, avatar_url, role")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    }

    load();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold">
          Giriş Yap
        </Button>
      </Link>
    );
  }

  const displayName = profile?.username ?? user.email ?? "Kullanıcı";
  const initial = displayName[0].toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none ring-2 ring-transparent hover:ring-amber-500 transition">
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-amber-500 text-gray-950 text-sm font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-800 text-white">
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate">{displayName}</p>
          {profile?.role === "staff" && (
            <p className="text-xs text-amber-400">Belediye Yetkilisi</p>
          )}
        </div>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
          <Link href={profile?.role === "staff" ? "/dashboard" : "/feed"}>
            {profile?.role === "staff" ? "Dashboard" : "Akış"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
          <Link href="/profile">Profil</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-400 hover:bg-gray-800 focus:bg-gray-800 hover:text-red-400 focus:text-red-400"
        >
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
