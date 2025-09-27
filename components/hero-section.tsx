"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative bg-black">
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            HALO
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Project Halo</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300">Create Perfect Exams</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Generate professional exam papers and educational content with AI-powered precision.
          </p>
        </div>

        <div className="pt-8">
          <Button size="lg" className="px-12 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white" asChild>
            <Link href="/create">Start Creating Exams</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
