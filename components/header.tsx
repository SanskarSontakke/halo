"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/50">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-foreground">
          Project Halo
        </Link>
      </div>
    </header>
  )
}
