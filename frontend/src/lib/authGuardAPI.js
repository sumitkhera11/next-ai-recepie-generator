import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function authGuardAPI() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: "Unauthorized",
      status: 401,
    };
  }
  return {
    session,
    jwt: session.jwt,
    email: session.user?.email,
    id: session.user?.id,
  };
}