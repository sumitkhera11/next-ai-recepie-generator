const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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

    // async jwt({ token, user, account }) {

    //   // ✅ GOOGLE LOGIN FLOW
    //   if (account?.provider === "google") {
    //     // try {
    //     //   console.log("🔥 GOOGLE LOGIN START");
    //     //   const res = await fetch(`${STRAPI_URL}/api/connect/google/callback?access_token=${account.access_token}`);
    //     //   const data = await res.json();

    //     //   console.log("GOOGLE STRAPI RESPONSE:", data);

    //     //   if (data.jwt) {
    //     //     token.jwt = data.jwt;
    //     //     token.id = data.user.id;
    //     //     token.email = data.user.email;
    //     //   }
    //     // } catch (err) {
    //     //   console.error("Google Auth Error:", err);
    //     // }
    //     const res = await fetch(
    //       `${STRAPI_URL}/api/auth/google/callback?access_token=${account.access_token}`
    //     );

    //     // ❗ IMPORTANT: pehle text lo
    //     const text = await res.text();

    //     console.log("🔥 RAW STRAPI RESPONSE:", text);

    //     let data;

    //     try {
    //       data = JSON.parse(text);
    //     } catch (err) {
    //       console.error("❌ NOT JSON RESPONSE");
    //       return false;
    //     }
    //   }

    //   // ✅ NORMAL LOGIN (credentials)
    //   if (user) {
    //     token.jwt = user.jwt;
    //     token.id = user.id;
    //     token.email = user.email;
    //   }

    //   return token;
    // },
    async jwt({ token, account }) {

      // ✅ GOOGLE LOGIN
      // if (account?.provider === "google" && account.access_token) {
      //   try {
      //     console.log("🔥 GOOGLE JWT FLOW");

      //     const res = await fetch(
      //       `${STRAPI_URL}/api/connect/google/callback?access_token=${account.access_token}`
      //     );
      //     const text = await res.text(); // 🔥 IMPORTANT
      //     console.log("RAW_STRAPI_GOOGLE_RESPONSE:", text);

      //     const data = JSON.parse(text); // then parse

      //     // const data = await res.json();

      //     console.log("✅ STRAPI GOOGLE RESPONSE:", data);

      //     if (data.jwt) {
      //       token.jwt = data.jwt;
      //       token.id = data.user.id;   // ✅ IMPORTANT (Strapi user id)
      //       token.email = data.user.email;
      //     }

      //   } catch (err) {
      //     console.error("❌ Google JWT Error:", err);
      //   }
      // }
      if (account?.provider === "google" && account.access_token) {
        try {
          // console.log("🔥 GOOGLE JWT FLOW");

          const res = await fetch(
            `${STRAPI_URL}/api/auth/google/callback?access_token=${account.access_token}`
          );

          const data = await res.json(); // ✅ no text parsing needed

          // console.log("✅ STRAPI GOOGLE RESPONSE:", data);

          if (data.jwt) {
            token.jwt = data.jwt;        // ✅ FIXED
            token.id = data.user.id;     // ✅ STRAPI USER ID
            token.email = data.user.email;
          }

        } catch (err) {
          console.error("❌ Google Auth Error:", err);
        }
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