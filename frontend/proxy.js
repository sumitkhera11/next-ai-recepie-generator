import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ======================
// Protected Routes
// ======================
const isProtectedRoute = createRouteMatcher([
  "/recipe(.*)",
  "/recipes(.*)",
  "/pantry(.*)",
  "/dashboard(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId, redirectToSignIn } = auth();

  // 🔹 Free Mode: only redirect if not signed in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn(); // removed async/await & extra auth call
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals & static files
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
