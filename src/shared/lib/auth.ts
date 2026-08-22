import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { authConfig } from "@/shared/lib/auth.config";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const validPassword = await argon2.verify(user.passwordHash, password);
        if (!validPassword) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tokenVersion: user.tokenVersion,
        };
      },
    }),
  ],
});

/**
 * Chequeo de autorización real (server actions/route handlers/queries).
 * Valida contra la DB que el usuario sigue existiendo, sigue siendo ADMIN
 * y que su tokenVersion no fue revocado — el middleware solo filtra por JWT.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("No autenticado");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN" || user.tokenVersion !== session.user.tokenVersion) {
    throw new Error("Sesión inválida");
  }

  return user;
}
