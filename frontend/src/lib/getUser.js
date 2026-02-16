// import { auth } from "@clerk/nextjs/server";

// export async function getUser() {
//   const { userId } = await auth();
//   console.log("GET USERID1:", userId);

//   if (!userId) return null;

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[clerkId][$eq]=${userId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//       },
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     console.error("Strapi fetch failed");
//     return null;
//   }

//   const data = await res.json();
//   console.log("LAYOUT STRAPI DATA:", data);

//   return data[0] || null;
// }

import { checkUserServer } from "@/lib/checkUserServer";

export async function getUser() {
   const user = await checkUserServer();
  //  console.log("LAYOUT USER:", user);
   return user;
}
