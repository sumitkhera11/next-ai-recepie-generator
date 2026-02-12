import { SignIn } from "@clerk/nextjs";

export default function AuthLayout({children}) {
  return (
    <div className="flex  justify-center p-40">
      {children}
    </div>
  );
}
