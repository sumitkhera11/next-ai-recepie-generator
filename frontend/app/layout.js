import { Inter } from "next/font/google";
import "./globals.css";
import { Heart } from "lucide-react";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/Toaster";
import { PantryModalProvider } from "@/context/PantryModalContext";
import Providers from "@/components/Providers";


const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  metadataBase: new URL("http://localhost:3000"), // ✅ DEV
  title: "Serve - AI Recipes Platform",
  description: "Discover AI-generated recipes",
};


export default async function RootLayout({ children }) {

  return (


    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
        <Providers>
          <PantryModalProvider>
            <Header/>
            <main className="min-h-screen">
              <Toaster richColors />
              {children}
            </main>
            <footer className="mt-20 border-t border-gray-200 bg-stone-50">

              <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="grid md:grid-cols-3 gap-8 items-center">

                  {/* Brand */}
                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      AI Recipe Generator
                    </h2>

                    <p className="text-sm text-gray-600 mt-2">
                      Discover delicious recipes generated with AI.
                      Cook smarter, eat better.
                    </p>

                  </div>


                  {/* Links */}
                  <div className="flex justify-center gap-6 text-sm text-gray-600">

                    <a
                      href="/recipes"
                      className="hover:text-orange-600 transition"
                    >
                      Recipes
                    </a>

                    <a
                      href="/about"
                      className="hover:text-orange-600 transition"
                    >
                      About
                    </a>

                    <a
                      href="/privacy"
                      className="hover:text-orange-600 transition"
                    >
                      Privacy
                    </a>

                  </div>


                  {/* Credit */}
                  <div className="flex justify-end items-center text-sm text-stone-500">

                    <span>Made with</span>

                    <Heart className="mx-2 h-4 w-4 text-red-500 fill-red-500" />

                    <span className="font-medium">
                      Sumit Khera
                    </span>

                  </div>

                </div>


                {/* Bottom Line */}

                <div className="border-t border-gray-200 mt-8 pt-6 text-center text-xs text-gray-500">

                  © {new Date().getFullYear()} AI Recipe Generator. All rights reserved.

                </div>

              </div>

            </footer>
          </PantryModalProvider>
          </Providers>
      </body>
    </html>

  );
}