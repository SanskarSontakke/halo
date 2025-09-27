"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full px-6 py-12 border-t border-gray-700 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              Project Halo
            </Link>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Support →
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Blog →
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Gallery →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Social</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Discord
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                YouTube
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
