const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        console.log("🔥 AUTH CALLED");
        console.log("📩 credentials:", credentials);
        //login to Strapi and get user + JWT
        try {
          const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          console.log("🧾 STRAPI RESPONSE:", data);

          // ❌ login failed
          if (!res.ok) {
            console.log("❌ LOGIN FAILED");
            return null;
          }

          // ✅ login success
          console.log("✅ LOGIN SUCCESS");

          return {
            id: data.user.id,
            email: data.user.email,
            jwt: data.jwt,
          };

        } catch (error) {
          console.error("❌ AUTH ERROR:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },


  callbacks: {

    async jwt({ token, user }) {
      console.log("🪪 JWT CALLBACK:", { token, user });

      if (user) {
        token.jwt = user.jwt;//store Strapi JWT in token for later use
        token.id = user.id;
        token.email = user.email;

      }

      return token;
    },

    async session({ session, token }) {
      console.log("📦 SESSION CALLBACK:", { session, token });

      session.user.id = token.id;
      session.user.email = token.email;
      session.jwt = token.jwt;//expose JWT

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};