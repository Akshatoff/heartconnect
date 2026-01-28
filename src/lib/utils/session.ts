import { createClient } from "@/lib/supabase/client";

/**
 * Refresh session if needed
 */
export async function refreshSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    console.error("Session refresh error:", error);
    return null;
  }

  return data.session;
}

/**
 * Check if session is valid
 */
export async function isSessionValid(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return false;

  const expiresAt = new Date(session.expires_at! * 1000);
  const now = new Date();

  // Session expires in less than 5 minutes
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    await refreshSession();
  }

  return true;
}

/**
 * Sign out and clear session
 */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();

  // Clear any cached data
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
