"use client"

export function HaloLogo3D() {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="absolute w-full h-full border-4 border-primary/60 rounded-full animate-spin"
          style={{ animationDuration: "20s" }}
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-accent rounded-full transform -translate-x-1/2 translate-y-1/2" />
          <div className="absolute left-0 top-1/2 w-2 h-2 bg-chart-3 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute right-0 top-1/2 w-2 h-2 bg-primary rounded-full transform translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Middle ring */}
        <div
          className="absolute w-3/4 h-3/4 border-2 border-accent/40 rounded-full animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        >
          <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-accent rounded-full" />
          <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-chart-3 rounded-full" />
        </div>

        {/* Inner core */}
        <div className="absolute w-1/2 h-1/2 bg-gradient-to-br from-primary via-accent to-chart-3 rounded-full animate-glow-pulse flex items-center justify-center">
          <div className="text-4xl md:text-5xl font-bold text-primary-foreground">H</div>
        </div>

        {/* Wireframe grid overlay */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/20"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  )
}
