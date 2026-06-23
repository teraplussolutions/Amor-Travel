"use server";

import { tryCreateAdminClient } from "@/lib/supabase/admin";

export type AgentUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
};

export async function listUsers(): Promise<{ users?: AgentUser[]; error?: string }> {
  const admin = tryCreateAdminClient();
  if (!admin) return { error: "Supabase admin not configured." };

  const { data, error } = await admin.auth.admin.listUsers({ perPage: 100 });
  if (error) return { error: error.message };

  const users: AgentUser[] = data.users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    name: (u.user_metadata?.full_name as string) ?? (u.email ?? ""),
    role: (u.user_metadata?.role as string) ?? "agent",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));

  return { users };
}

export async function createUser(
  email: string,
  password: string,
  fullName: string,
  role: "agent" | "admin" = "agent",
): Promise<{ error?: string; id?: string }> {
  const admin = tryCreateAdminClient();
  if (!admin) return { error: "Supabase admin not configured." };

  if (!email || !password || password.length < 8) {
    return { error: "Email and password (min 8 chars) are required." };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (error) return { error: error.message };
  return { id: data.user?.id };
}

export async function changePassword(
  userId: string,
  newPassword: string,
): Promise<{ error?: string }> {
  const admin = tryCreateAdminClient();
  if (!admin) return { error: "Supabase admin not configured." };

  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const { error } = await admin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) return { error: error.message };
  return {};
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  const admin = tryCreateAdminClient();
  if (!admin) return { error: "Supabase admin not configured." };

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  return {};
}
