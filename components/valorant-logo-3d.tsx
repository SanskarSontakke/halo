"use client"

import { useEffect, useRef } from "react"

export function ValorantLogo3D() {
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const logo = logoRef.current
    if (!logo) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = logo.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      const rotateX = (y / rect.height) * 15
      const rotateY = (x / rect.width) * 15

      logo.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`
    }

    const handleMouseLeave = () => {
      logo.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
    }

    logo.addEventListener("mousemove", handleMouseMove)
    logo.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      logo.removeEventListener("mousemove", handleMouseMove)
      logo.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-orange-500/20 blur-3xl animate-pulse" />

      {/* Main logo container */}
      <div
        ref={logoRef}
        className="relative transition-transform duration-300 ease-out cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background geometric shapes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-2 border-purple-500/30 rotate-45 animate-spin-slow" />
          <div className="absolute w-24 h-24 border border-cyan-500/40 rotate-12 animate-reverse-spin" />
          <div className="absolute w-16 h-16 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rotate-45" />
        </div>

        {/* Central H logo */}
        <div className="relative z-10 flex items-center justify-center w-32 h-32">
          <div className="text-6xl font-black text-gradient animate-glow-pulse select-none">H</div>

          {/* Floating particles */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-purple-400 rounded-full animate-float" />
          <div
            className="absolute bottom-4 right-3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-6 right-2 w-1 h-1 bg-orange-400 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Energy lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
          <div
            className="absolute w-0.5 h-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Corner accents */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-purple-500 animate-pulse" />
        <div
          className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-500 animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-orange-500 animate-pulse"
          style={{ animationDelay: "0.6s" }}
        />
        <div
          className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-purple-500 animate-pulse"
          style={{ animationDelay: "0.9s" }}
        />
      </div>

      <div className="relative mt-8 flex items-center space-x-2">
        {["P", "R", "O", "J", "E", "C", "T", " ", "H", "A", "L", "O"].map((letter, index) => (
          <div
            key={`project-halo-${letter}-${index}`}
            className={`wireframe-letter text-4xl md:text-5xl font-black select-none animate-letter-emerge ${
              letter === " " ? "w-4" : ""
            }`}
            style={{
              animationDelay: `${1 + index * 0.15}s`,
              animationFillMode: "both",
            }}
          >
            {letter !== " " ? letter : ""}
          </div>
        ))}
      </div>

      {/* Animated underline */}
      <div className="mt-2 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-orange-500 animate-gradient-x" />
    </div>
  )
}
