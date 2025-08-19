'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const scrollRef = useRef<number>(0)
  const tickingRef = useRef<boolean>(false)

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Optimized scroll progress indicator with throttling and RAF
    const handleScroll = () => {
      scrollRef.current = window.pageYOffset
      
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          updateScrollProgress(scrollRef.current)
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    const updateScrollProgress = (scrollTop: number) => {
      const docHeight = document.body.offsetHeight - window.innerHeight
      const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100)
      
      const indicator = document.querySelector('.scroll-indicator') as HTMLElement
      if (indicator) {
        // Use CSS custom property for better performance
        indicator.style.setProperty('--scroll-progress', `${scrollPercent}%`)
        indicator.style.width = `${scrollPercent}%`
      }
    }

    // Enhanced throttled scroll listener for better mobile performance
    let timeoutId: NodeJS.Timeout
    let isScrolling = false
    
    const throttledScrollHandler = () => {
      if (!isScrolling) {
        isScrolling = true
        handleScroll()
        
        // Reset scrolling flag after a short delay
        setTimeout(() => {
          isScrolling = false
        }, 16) // ~60fps
      }
    }

    // Use different throttling for mobile vs desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const throttleDelay = isMobile ? 32 : 16 // Slower updates on mobile for better performance

    const mobileOptimizedHandler = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(throttledScrollHandler, throttleDelay)
    }

    window.addEventListener('scroll', mobileOptimizedHandler, { passive: true })
    
    // Add touch event handling for mobile
    if (isMobile) {
      window.addEventListener('touchmove', mobileOptimizedHandler, { passive: true })
      window.addEventListener('touchend', () => {
        // Final update after touch ends
        setTimeout(() => {
          updateScrollProgress(window.pageYOffset)
        }, 100)
      }, { passive: true })
    }
    
    return () => {
      window.removeEventListener('scroll', mobileOptimizedHandler)
      if (isMobile) {
        window.removeEventListener('touchmove', mobileOptimizedHandler)
        window.removeEventListener('touchend', () => {})
      }
      clearTimeout(timeoutId)
    }
  }, [])

  // Add scroll progress indicator to DOM
  useEffect(() => {
    const indicator = document.createElement('div')
    indicator.className = 'scroll-indicator'
    document.body.appendChild(indicator)
    
    return () => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator)
      }
    }
  }, [])

  return (
    <div className={`page-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {children}
    </div>
  )
}

// Enhanced navigation hook for fluid transitions
export function useFluidNavigation() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const navigateWithTransition = (href: string, delay: number = 300) => {
    setIsNavigating(true)
    
    // Add exit animation
    document.body.style.overflow = 'hidden'
    
    setTimeout(() => {
      router.push(href)
      setIsNavigating(false)
      document.body.style.overflow = 'unset'
    }, delay)
  }

  return { navigateWithTransition, isNavigating }
}

// Scroll animation hook
export function useScrollAnimation() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    // Observe all elements with scroll-animate class
    const elements = document.querySelectorAll('.scroll-animate')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

// Smooth scroll to element
export function useSmoothScroll() {
  const scrollToElement = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return { scrollToElement, scrollToTop }
}

