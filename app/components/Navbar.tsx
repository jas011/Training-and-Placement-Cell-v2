"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contact", href: "/contact" },
];

export default function NavBar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="h-14 flex items-center justify-between px-4 md:px-8 bg-white/90 backdrop-blur-sm border">
        {/* Logo */}
        <Link href={"/"}>
          <div className="text-md items-center gap-2 flex md:text-lg font-semibold">
            <Image src={"/tnplogo.webp"} alt="TNP" width={40} height={40} />
            Training & Placement Cell
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu (Popover) */}
        <div className="md:hidden">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                aria-label="Toggle Menu"
                className="relative flex h-8 w-8 items-center justify-center"
              >
                <div className="relative size-4">
                  {/* top bar */}
                  <span
                    className={`bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-200 ${
                      open ? "top-[0.4rem] -rotate-45" : "top-1 rotate-0"
                    }`}
                  />
                  {/* bottom bar */}
                  <span
                    className={`bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-200 ${
                      open ? "top-[0.4rem] rotate-45" : "top-2.5 rotate-0"
                    }`}
                  />
                </div>
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-screen h-[calc(100vh-56px)] mt-2 bg-white/90 backdrop-blur-md rounded-none shadow-lg p-6 border-0"
            >
              <div className="flex flex-col gap-6">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-2xl font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </header>
  );
}
