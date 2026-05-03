"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Mode = "citizen" | "staff";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? null;
  const typeParam = searchParams.get("type");

  const [mode, setMode] = useState<Mode>(typeParam === "staff" ? "staff" : "citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClientSupabaseClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
      return;
    }

    // Personel modundaysa rol kontrolü yap
    if (mode === "staff") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "staff") {
        await supabase.auth.signOut();
        setError("Bu hesap personel yetkisine sahip değil.");
        setLoading(false);
        return;
      }

      router.push(nextPath ?? "/admin");
    } else {
      router.push(nextPath ?? "/app");
    }

    router.refresh();
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Logo */}
      <div className="text-center">
        <Link href="/">
          <span className="text-3xl font-bold text-amber-400">LumenCity</span>
        </Link>
        <p className="text-gray-500 text-sm mt-1">Akıllı şehir aydınlatma platformu</p>
      </div>

      <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm">
        {/* Mod toggle */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => { setMode("citizen"); setError(null); }}
            className={`flex-1 py-3 text-sm font-medium transition rounded-tl-xl ${
              mode === "citizen"
                ? "text-amber-400 border-b-2 border-amber-400 bg-amber-500/5"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            👤 Kullanıcı Girişi
          </button>
          <button
            onClick={() => { setMode("staff"); setError(null); }}
            className={`flex-1 py-3 text-sm font-medium transition rounded-tr-xl ${
              mode === "staff"
                ? "text-amber-400 border-b-2 border-amber-400 bg-amber-500/5"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            🏛️ Personel Girişi
          </button>
        </div>

        <CardHeader className="pb-1 pt-4 space-y-0.5">
          <h1 className="text-lg font-semibold text-white">
            {mode === "citizen" ? "Vatandaş Girişi" : "Belediye Personeli"}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === "citizen"
              ? "Giriş yap, ışık israfını bildir."
              : "Belediye paneline erişin."}
          </p>
        </CardHeader>

        <CardContent className="pt-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">E-posta</label>
              <Input
                type="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 h-10"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Şifre</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 h-10"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-10 font-semibold transition ${
                mode === "citizen"
                  ? "bg-amber-500 hover:bg-amber-400 text-gray-950"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : mode === "citizen" ? (
                "Giriş Yap →"
              ) : (
                "Panele Giriş →"
              )}
            </Button>

            {mode === "citizen" && (
              <p className="text-center text-sm text-gray-500 pt-1">
                Hesabın yok mu?{" "}
                <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium">
                  Kayıt ol
                </Link>
              </p>
            )}

            {mode === "staff" && (
              <p className="text-center text-xs text-gray-600 pt-1">
                Personel hesabı için sistem yöneticinizle iletişime geçin.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
