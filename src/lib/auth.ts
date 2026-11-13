
import { supabase } from "./supabase";

export async function registerWithEmail(
  fullName: string,
  phoneNumber: string,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phoneNumber,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  if (error) throw error;
  return data;
}

export async function loginWithEmail(
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${window.location.origin}/`,
    }
  );

  if (error) throw error;
  return data;
}

export async function syncProfileWithBackend() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session?.access_token) {
    throw new Error("Please log in before syncing your profile.");
  }

  const response = await fetch(
    "http://127.0.0.1:8000/api/profile/sync/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Profile synchronization failed.");
  }

  return result;
}
