"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const supabase = createClientSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm bg-gray-900 border-gray-800 text-white">
      <CardHeader className="text-center">
        <Link href="/" className="text-amber-400 font-bold text-lg block mb-2">
          LumenCity
        </Link>
        <CardTitle>Kayıt Ol</CardTitle>
        <CardDescription className="text-gray-400">
          Google hesabınızla saniyeler içinde başlayın.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <Button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold flex items-center justify-center gap-3"
        >
          <GoogleIcon />
          {loading ? "Yönlendiriliyor..." : "Google ile Kayıt Ol"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="text-amber-400 hover:underline">
            Giriş yap
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
    </svg>
  );
}
