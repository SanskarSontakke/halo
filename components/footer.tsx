"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full px-6 py-12 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-foreground">
              Project Halo
            </Link>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support →
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog →
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Gallery →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Social</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Discord
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                YouTube
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
