"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/recent-activity", label: "Activity" },
  { href: "/event-reports", label: "MOM" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/links", label: "Useful Links" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-2 z-50 mx-4 rounded-xl border border-gray-200 bg-white backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-12 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <img src="/optica_logo.png" alt="Optica_logo" className="h-9 object-contain" />
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-base font-medium transition ${
                pathname === href ? "text-ieee-red" : "text-gray-800 hover:text-ieee-navy"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden rounded p-2 text-gray-800 hover:bg-gray-100"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 bg-white rounded-b-xl md:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded px-3 py-2 text-base font-medium ${
                  pathname === href ? "bg-ieee-red/10 text-ieee-red" : "text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
