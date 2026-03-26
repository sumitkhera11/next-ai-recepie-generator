import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      {/* Header height = ~64px */}
      <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}