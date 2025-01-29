import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

export default function Navbar() {
  return (
    <nav className="bg-background shadow fixed z-10 w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16">
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary transition-colors hover:text-foreground">
            Foodie
          </Link>
        </div>
        <div className="flex items-center gap-2">
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
  )
}

