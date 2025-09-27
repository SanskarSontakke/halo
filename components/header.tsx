"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-700 bg-black">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Project Halo
        </Link>
      </div>
    </header>
  )
}
