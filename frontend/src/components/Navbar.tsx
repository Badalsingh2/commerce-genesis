"use client"
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Script from "next/script";
import { useEffect } from "react";

export default function Navbar() {
  useEffect(() => {
    window.googleTranslateElementInit = function() {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,gu,kn,ml,mr,pa,ta,te,bn,ur,as,or", // Indian languages
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <nav className="bg-background shadow fixed z-10 w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Google Translate Script */}
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
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

