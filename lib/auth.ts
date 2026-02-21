import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./api";


export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                try {
                    const res = await login(
                        credentials.email as string,
                        credentials.password as string
                    );
                    return {
                        id: res.user._id,
                        name: res.user.name,
                        email: res.user.email,
                        role: res.user.role,
                        token: res.token,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = (user as { role?: string }).role;
                token.token = (user as { token?: string }).token;
            }
            return token;
        },

        // session callback to include user info and token in the session object
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id ?? "";
                session.user.name = token.name ?? "";
                session.user.email = token.email ?? "";
                session.user.role = (token.role as "admin" | "team_lead" | "employee") ?? "employee";
            }
            (session as { token?: string }).token = token.token as string;
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60
    },
});