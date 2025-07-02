import React, { lazy, Suspense } from 'react'
import { Gesture } from '@/rive/types'

// Lazy load the RiveBuddy component for better performance
const RiveBuddy = lazy(() => import('./RiveBuddy'))

interface BuddyCanvasProps {
  src: string
  artboard?: string
  stateMachines?: string[]
  autoplay?: boolean
  className?: string
  width?: number
  height?: number
  onGestureTriggered?: (gesture: Gesture) => void
  onLoad?: () => void
  onError?: (error: Error) => void
  shouldReduceMotion?: boolean
}

const BuddyCanvas: React.FC<BuddyCanvasProps> = ({
  src,
  artboard,
  stateMachines,
  autoplay = true,
  className,
  width = 300,
  height = 300,
  onGestureTriggered,
  onLoad,
  onError,
  shouldReduceMotion = false
}) => {
  // Check if src is a .riv file
  const isRiveFile = src.endsWith('.riv')
  
  // Use first state machine if provided, otherwise let Rive auto-detect
  const stateMachine = stateMachines?.[0]
  const containerStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    border: '2px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer'
  }

  const handleClick = () => {
    onGestureTriggered?.(Gesture.Wave)
    console.log('Buddy clicked - would trigger wave gesture')
  }

  React.useEffect(() => {
    // Simulate successful load
    setTimeout(() => {
      onLoad?.()
    }, 100)
  }, [onLoad])

  if (shouldReduceMotion) {
    return (
      <div 
        className={`buddy-canvas-static ${className || ''}`}
        style={containerStyle}
        role="img"
        aria-label="Buddy character (static image)"
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            fontSize: '48px',
            filter: 'grayscale(100%)'
          }}>🐱</div>
          <span style={{ color: '#666', fontSize: '14px' }}>
            Buddy (Motion Reduced)
          </span>
        </div>
      </div>
    )
  }

  // If it's a .riv file, use the RiveBuddy component
  if (isRiveFile) {
    return (
      <Suspense fallback={
        <div style={containerStyle}>
          <div style={{ color: '#999' }}>Loading Rive animation...</div>
        </div>
      }>
        <RiveBuddy
          src={src}
          artboard={artboard}
          stateMachines={stateMachine}
          autoplay={autoplay}
          width={width}
          height={height}
          onGestureComplete={onGestureTriggered}
          onLoad={onLoad}
          onError={onError}
          shouldReduceMotion={shouldReduceMotion}
          className={className}
        />
      </Suspense>
    )
  }

  // Otherwise, use the demo placeholder
  return (
    <div 
      className={`buddy-canvas ${className || ''}`}
      style={containerStyle}
      role="img"
      aria-label="Interactive buddy character"
      onClick={handleClick}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        transition: 'transform 0.2s ease'
      }}>
        <div style={{
          fontSize: '64px',
          animation: autoplay ? 'bounce 2s infinite' : 'none'
        }}>🐱</div>
        <span style={{ color: '#666', fontSize: '12px' }}>
          Kitten Ninja (Demo)
        </span>
        <span style={{ color: '#999', fontSize: '10px' }}>
          Click to wave!
        </span>
      </div>
    </div>
  )
}

export default BuddyCanvas