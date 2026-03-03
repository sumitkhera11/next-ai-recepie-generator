import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/recipe(.*)",
  "/recipes(.*)",
  "/pantry(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // if (isProtectedRoute(req)) {
  //   auth.protect();
  // }
});
// for development
export const config = {
  matcher: ["/(.*)"],
}

// for production
// export const config = {
//   matcher: [
//     "/((?!_next|.*\\..*).*)",
//     "/(api|trpc)(.*)",
//   ],
// };
