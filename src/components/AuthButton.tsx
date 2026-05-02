"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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
        <Button
          size="sm"
          className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold"
        >
          Giriş Yap
        </Button>
      </Link>
    );
  }

  const initial = (user.user_metadata?.username ?? user.email ?? "?")[0].toUpperCase();

  return (
    <div className="flex items-center gap-2">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-gray-950 font-bold text-sm select-none">
        {initial}
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={handleLogout}
        className="border-gray-700 text-gray-300 hover:bg-gray-800 text-xs"
      >
        Çıkış
      </Button>
    </div>
  );
}
