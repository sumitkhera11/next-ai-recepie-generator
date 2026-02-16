import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/recipe(.*)",
  "/recipes(.*)",
  "/pantry(.*)",
  "/dashboard(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
