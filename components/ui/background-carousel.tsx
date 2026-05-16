"use client"

import type React from "react"

import { useEffect, useState } from "react"

const backgroundImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250921-WA0135.jpg-YjwSS1SEVXou9kE9XzvmPs5ITtgekv.jpeg", // Turquoise lake with boats
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250921-WA0138.jpg-molOsuUI0GROTpLedNmuw57g63KFYs.jpeg", // Snow-capped mountains
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250921-WA0134.jpg-cVcPZuzjt6qy0kMZAPlpSbQ7Z6zetc.jpeg", // Waterfalls in lush mountains
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250921-WA0136.jpg-FaRjWI0Nb96JxVklNJRE93cKhzTvb1.jpeg", // Rolling green hills
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250921-WA0133.jpg-DokpXUAt2Nb4Nxkc7aJjc13ZVx71mr.jpeg", // Sunset lake with boat
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250921-WA0137.jpg-jpVWrSNuVvvFGoodCHwynwHtSWHWA2.jpeg", // Traditional monastery
]

interface BackgroundCarouselProps {
  children: React.ReactNode
  interval?: number
  className?: string
}

export function BackgroundCarousel({ children, interval = 8000, className = "" }: BackgroundCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Preload all images
    const preloadImages = async () => {
      const imagePromises = backgroundImages.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = resolve
          img.onerror = reject
          img.src = src
        })
      })

      try {
        await Promise.all(imagePromises)
        setIsLoaded(true)
      } catch (error) {
        console.error("Failed to preload images:", error)
        setIsLoaded(true) // Continue anyway
      }
    }

    preloadImages()
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, interval)

    return () => clearInterval(timer)
  }, [interval, isLoaded])

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Background Images */}
      <div className="fixed inset-0 -z-10">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-background/5 to-background/10" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
