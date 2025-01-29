"use client"
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Import shadcn Popover components
import { Button } from "./ui/button"; // Import shadcn Button
import { useUserRole } from "@/hooks/useUserRole";

export default function Navbar() {
  const router = useRouter();
  const rolle = useUserRole();
  const { user, isLoaded } = useUser();
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
    setCookie('role', role, { maxAge: 60 * 60 * 24 });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-background shadow fixed z-10 w-full mx-auto px-4 sm:px-6 lg:px-8">
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16">
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary transition-colors hover:text-foreground">
            Foodie
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div id="google_translate_element" className="translate-container"></div>

          <ModeToggle />
          <div className="flex gap-4">
            <SignedOut>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Sign In</Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-4">
                  <div className="flex flex-col gap-2">
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setSelection("customer")}
                      >
                        Sign in as Customer
                      </Button>
                    </SignInButton>

                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setSelection("vendor")}
                      >
                        Sign in as Vendor
                      </Button>
                    </SignInButton>

                    <SignInButton mode="modal">
                      <Button
                        variant="default"
                        className="w-full justify-start"
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
                <Button variant="ghost" onClick={() => router.push(`/${rolle}`)}>Go To Dashboard</Button>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
