"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    // Kullanıcıyı backend üzerinden oluştur (email doğrulaması yok)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error ?? "Kayıt olurken hata oluştu.");
      setLoading(false);
      return;
    }

    // Hemen giriş yap
    const supabase = createClientSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Hesap oluşturuldu fakat giriş yapılamadı. Lütfen giriş sayfasından deneyin.");
      setLoading(false);
      return;
    }

    router.push("/app");
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
        <CardHeader className="pb-1 pt-4 space-y-0.5">
          <h1 className="text-lg font-semibold text-white">Hesap Oluştur</h1>
          <p className="text-gray-400 text-sm">
            Kayıt ol, ışık israfını bildirmeye başla.
          </p>
        </CardHeader>

        <CardContent className="pt-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Kullanıcı Adı</label>
              <Input
                type="text"
                placeholder="kullanici_adi"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                required
                minLength={3}
                maxLength={30}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 h-10"
              />
              <p className="text-xs text-gray-600 mt-0.5">Küçük harf, rakam ve alt çizgi.</p>
            </div>

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
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 h-10"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Şifre Tekrar</label>
              <Input
                type="password"
                placeholder="Şifreyi tekrar gir"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 h-10 ${
                  passwordConfirm && password !== passwordConfirm
                    ? "border-red-500"
                    : passwordConfirm && password === passwordConfirm
                    ? "border-green-600"
                    : ""
                }`}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || (!!passwordConfirm && password !== passwordConfirm)}
              className="w-full h-10 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                "Kayıt Ol →"
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 pt-1">
              Zaten hesabın var mı?{" "}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium">
                Giriş yap
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
