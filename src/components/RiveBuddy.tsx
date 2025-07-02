import React, { useCallback, useEffect } from 'react'
import { useRive, Layout, Fit, Alignment, EventType, RiveEventType } from '@rive-app/react-canvas'
import { Gesture, CharacterType, AssetLoadEvent } from '@/rive/types'

interface RiveBuddyProps {
  src: string
  artboard?: string
  characterType?: CharacterType
  stateMachines?: string | string[]
  autoplay?: boolean
  width?: number
  height?: number
  onGestureComplete?: (gesture: Gesture) => void
  onLoad?: () => void
  onError?: (error: Error) => void
  onAssetLoad?: (event: AssetLoadEvent) => void
  onStateChange?: (event: any) => void
  onRiveEvent?: (event: any) => void
  shouldReduceMotion?: boolean
  className?: string
  enableRiveAssetCDN?: boolean
}

const RiveBuddy: React.FC<RiveBuddyProps> = ({
  src,
  artboard,
  characterType,
  stateMachines,
  autoplay = false,
  width = 300,
  height = 300,
  onGestureComplete,
  onLoad,
  onError,
  onAssetLoad,
  onStateChange,
  onRiveEvent,
  shouldReduceMotion = false,
  className,
  enableRiveAssetCDN = true
}) => {
  // Asset Handler for dynamic character asset loading
  const createAssetLoader = useCallback((characterType?: CharacterType) => {
    return (asset: any, bytes: Uint8Array) => {
      console.log('Asset loader called:', {
        name: asset.name,
        fileExtension: asset.fileExtension,
        cdnUuid: asset.cdnUuid,
        isFont: asset.isFont,
        isImage: asset.isImage,
        isAudio: asset.isAudio,
        characterType,
        bytesLength: bytes.length
      })

      // If asset has CDN UUID or embedded bytes, let runtime handle it
      if (asset.cdnUuid.length > 0 || bytes.length > 0) {
        onAssetLoad?.({
          assetName: asset.name,
          assetType: asset.isImage ? 'image' : asset.isFont ? 'font' : 'audio',
          characterType: characterType || CharacterType.KittenNinja,
          success: true
        })
        return false
      }

      // For character-specific assets, let Rive handle them automatically
      // since we're using the official React integration
      if (asset.isImage && characterType) {
        console.log(`Letting Rive handle character asset automatically: ${asset.name}`)
        onAssetLoad?.({
          assetName: asset.name,
          assetType: 'image',
          characterType,
          success: true
        })
        return false // Let Rive runtime handle it
      }

      return false // Let runtime handle other assets
    }
  }, [characterType, onAssetLoad])

  // Use the official useRive hook
  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines,
    autoplay,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    assetLoader: createAssetLoader(characterType),
    enableRiveAssetCDN,
    onLoad: () => {
      console.log('Rive animation loaded with useRive hook')
      onLoad?.()
    },
    onLoadError: (error: any) => {
      console.error('Rive load error:', error)
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onStateChange: (event: any) => {
      console.log('State changed:', event.data)
      onStateChange?.(event)
    }
  })

  // Set up Rive event listeners
  useEffect(() => {
    if (!rive) return

    const handleRiveEvent = (riveEvent: any) => {
      const eventData = riveEvent.data
      console.log('Rive event received:', eventData)

      if (eventData.type === RiveEventType.General) {
        // Handle gesture completion events
        if (eventData.name === 'gesture_complete') {
          const gesture = eventData.properties?.gesture as Gesture
          if (gesture) {
            onGestureComplete?.(gesture)
          }
        }
      }

      onRiveEvent?.(riveEvent)
    }

    rive.on(EventType.RiveEvent, handleRiveEvent)

    return () => {
      rive.off(EventType.RiveEvent, handleRiveEvent)
    }
  }, [rive, onGestureComplete, onRiveEvent])

  // Trigger gesture animation using state machine inputs
  const triggerGesture = useCallback((gesture: Gesture) => {
    if (!rive) {
      console.warn('Rive instance not ready')
      return
    }

    console.log(`Triggering gesture: ${gesture}`)
    
    try {
      // For now, just use direct animation play since we don't have proper state machines set up
      console.log('Using direct animation play (state machines not configured)')
      rive.play('gesture_wave')
      
      // Simulate gesture completion callback after animation duration
      setTimeout(() => {
        onGestureComplete?.(gesture)
      }, 2000)
      
    } catch (error) {
      console.error('Error triggering gesture:', error)
    }
  }, [rive, onGestureComplete])

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
      <RiveComponent
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