import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { email, password, username } = await req.json();

  if (!email || !password || !username) {
    return NextResponse.json({ error: "Tüm alanlar zorunlu." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // Kullanıcı adı daha önce alınmış mı?
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Bu kullanıcı adı zaten alınmış." }, { status: 400 });
  }

  // Servis rolüyle kullanıcı oluştur — email doğrulaması atlanır
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kayıtlı." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Trigger profili otomatik oluşturur ama username'i güncelle
  await supabase
    .from("profiles")
    .update({ username })
    .eq("id", data.user.id);

  return NextResponse.json({ success: true });
}
