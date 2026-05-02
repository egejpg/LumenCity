import { createSessionSupabaseClient } from "@/lib/supabase/server";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  role: "citizen" | "staff";
  avatar_url: string | null;
  created_at: string;
}

export interface CurrentUser {
  user: { id: string; email: string | undefined };
  profile: Profile;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const supabase = await createSessionSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, full_name, role, avatar_url, created_at")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return null;

    return {
      user: { id: user.id, email: user.email },
      profile: profile as Profile,
    };
  } catch {
    return null;
  }
}
