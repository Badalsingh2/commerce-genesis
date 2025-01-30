"use client";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Script from "next/script";
import { useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "./ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const { isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,gu,kn,ml,mr,pa,ta,te,bn,ur,as,or",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
  }, []);

  const setSelection = (role: string) => {
    setSelectedRole(role);
    setCookie("role", role, { maxAge: 60 * 60 * 24 });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-background/80 backdrop-blur-md shadow-sm fixed z-10 w-full">
      <div>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-2xl font-bold text-primary hover:text-foreground transition-colors">
            Foodie
          </Link>
        </motion.div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Google Translate */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div id="google_translate_element" className="translate-container"></div>
          </motion.div>

          {/* Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ModeToggle />
          </motion.div>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <SignedOut>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="hover:bg-primary/10">
                    Sign In
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-4 bg-background/90 backdrop-blur-md border border-border/50">
                  <div className="flex flex-col gap-2">
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-primary/10"
                        onClick={() => setSelection("customer")}
                      >
                        Sign in as Customer
                      </Button>
                    </SignInButton>

                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-primary/10"
                        onClick={() => setSelection("vendor")}
                      >
                        Sign in as Vendor
                      </Button>
                    </SignInButton>

                    <SignInButton mode="modal">
                      <Button
                        variant="default"
                        className="w-full justify-start bg-primary hover:bg-primary/90"
                        onClick={() => setSelection("admin")}
                      >
                        Sign in as Admin
                      </Button>
                    </SignInButton>
                  </div>
                </PopoverContent>
              </Popover>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="hover:bg-primary/10"
                  onClick={() => router.push(`/${selectedRole}`)}
                >
                  Go To Dashboard
                </Button>
                <UserButton />
              </div>
            </SignedIn>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
