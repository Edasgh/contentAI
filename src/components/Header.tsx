"use client";
import Link from "next/link"
import Agentpulse from "./Agentpulse"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"


const Header = () => {
  return (
    <header className="sticky top-0 left-0 right-0 md:px-0 px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-4">
              <Agentpulse size="small" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Agentube
              </h1>
            </Link>
          </div>
          {/* Right */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <Button
                variant="outline"
                className="mr-4 bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text"
              >
                <Link href="/manage_plan">Manage Plan</Link>
              </Button>

              <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full border bg-blue-100 border-blue-200 ">
                <UserButton />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton
                mode="modal"
                fallbackRedirectUrl={"/"}
                forceRedirectUrl={"/"}
              >
                <Button
                  variant={"ghost"}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text cursor-pointer"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header