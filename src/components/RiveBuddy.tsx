import React, { useCallback, useRef, useEffect } from 'react'
import { Gesture } from '@/rive/types'

interface RiveBuddyProps {
  src: string
  artboard?: string
  stateMachine?: string
  autoplay?: boolean
  width?: number  // Optional - will use artboard natural size if not provided
  height?: number // Optional - will use artboard natural size if not provided
  onGestureComplete?: (gesture: Gesture) => void
  onLoad?: () => void
  onError?: (error: Error) => void
  shouldReduceMotion?: boolean
  className?: string
}

const RiveBuddy: React.FC<RiveBuddyProps> = ({
  src,
  artboard,
  autoplay = false,
  width = 300,
  height = 300,
  onGestureComplete,
  onLoad,
  onError,
  shouldReduceMotion = false,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const riveInstanceRef = useRef<any>(null)

  // Trigger gesture animation
  const triggerGesture = useCallback((gesture: Gesture) => {
    if (!riveInstanceRef.current) {
      console.warn('Rive instance not ready')
      return
    }

    console.log(`Triggering gesture: ${gesture}`)
    
    try {
      // Play the gesture_wave animation directly
      riveInstanceRef.current.play('gesture_wave')
      
      // Simulate gesture completion callback after animation duration
      setTimeout(() => {
        onGestureComplete?.(gesture)
      }, 2000)
    } catch (error) {
      console.error('Error playing animation:', error)
    }
  }, [onGestureComplete])

  useEffect(() => {
    const loadRive = async () => {
      try {
        // Check if Rive is already loaded globally via CDN
        if (typeof window !== 'undefined' && (window as any).rive) {
          const { Rive, Layout, Fit, Alignment } = (window as any).rive
          
          if (!canvasRef.current) return

          const riveInstance = new Rive({
            src,
            canvas: canvasRef.current,
            artboard,
            autoplay,
            layout: new Layout({
              fit: Fit.Contain,
              alignment: Alignment.Center,
            }),
            onLoad: () => {
              console.log('Rive animation loaded via CDN')
              riveInstanceRef.current = riveInstance
              
              // Get artboard dimensions dynamically
              if (riveInstance.artboard) {
                const artboardBounds = riveInstance.artboard.bounds
                const naturalWidth = artboardBounds.maxX - artboardBounds.minX
                const naturalHeight = artboardBounds.maxY - artboardBounds.minY
                
                console.log('Artboard natural dimensions:', {
                  width: naturalWidth,
                  height: naturalHeight,
                  bounds: artboardBounds
                })
                
                // Resize canvas to match artboard's natural size
                if (canvasRef.current) {
                  canvasRef.current.width = naturalWidth
                  canvasRef.current.height = naturalHeight
                  
                  // Resize the drawing surface to match the new canvas dimensions
                  riveInstance.resizeDrawingSurfaceToCanvas()
                }
              }
              
              onLoad?.()
            },
            onLoadError: (error: any) => {
              console.error('Rive load error:', error)
              onError?.(error instanceof Error ? error : new Error(String(error)))
            }
          })

          return () => {
            if (riveInstanceRef.current) {
              riveInstanceRef.current.cleanup()
              riveInstanceRef.current = null
            }
          }
        } else {
          // Fallback: Load from CDN dynamically
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/@rive-app/canvas@2.30.1/rive.js'
          script.onload = () => {
            console.log('Rive CDN loaded, retrying...')
            // Retry after CDN loads
            setTimeout(() => loadRive(), 100)
          }
          script.onerror = () => {
            console.error('Failed to load Rive from CDN')
            onError?.(new Error('Failed to load Rive from CDN'))
          }
          document.head.appendChild(script)
        }
      } catch (error) {
        console.error('Failed to load Rive:', error)
        onError?.(error instanceof Error ? error : new Error(String(error)))
      }
    }

    loadRive()
  }, [src, artboard, autoplay, onLoad, onError])

  // Handle reduced motion preference
  if (shouldReduceMotion) {
    return (
      <div 
        className={`rive-buddy-static ${className || ''}`}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          border: '2px solid #ddd',
          borderRadius: '8px'
        }}
        role="img"
        aria-label="Buddy character (animation disabled)"
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', filter: 'grayscale(100%)' }}>🐱</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
            Animation Disabled
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`rive-buddy ${className || ''}`}
      style={{
        width,
        height,
        cursor: 'pointer'
      }}
      onClick={() => triggerGesture(Gesture.Wave)}
      role="img"
      aria-label="Interactive buddy character"
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default RiveBuddy