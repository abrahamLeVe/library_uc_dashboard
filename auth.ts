import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { Role } from "./app/lib/definitions";
import { authConfig } from "./auth.config";
import { getUser } from "./app/lib/data";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        const role = user?.rol;

        if (!role || role === "ALUMNO") return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return {
          id: String(user.id),
          name: user.nombre,
          email: user.email,
          role: user.rol,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // recomendable si usas Credentials
    maxAge: 60 * 60, // 1 hora (en segundos)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as Role,
        },
      };
    },
  },
});
