"use client"

import { Button } from "@/components/ui/button"
import { HaloLogo3D } from "@/components/halo-logo-3d"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative">
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="flex justify-center mb-8">
          <HaloLogo3D />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Project Halo</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">Create Perfect Exams</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate professional exam papers and educational content with AI-powered precision.
          </p>
        </div>

        <div className="pt-8">
          <Button size="lg" className="px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary/90" asChild>
            <Link href="/start">Start Creating Exams</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
