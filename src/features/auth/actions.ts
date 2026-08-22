"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/shared/lib/auth";
import { loginRateLimit } from "@/shared/lib/rate-limit";
import { loginSchema } from "@/features/auth/schema";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  const { email, password } = parsed.data;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await loginRateLimit.limit(`${ip}:${email}`);
  if (!success) {
    return { error: "Demasiados intentos. Probá de nuevo en unos minutos." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/backoffice",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email o contraseña incorrectos" };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/backoffice/login" });
}
