import { useState, useEffect, useCallback, useRef } from 'react'
import { BuddyManager } from '@/managers/BuddyManager'
import { AudioManager } from '@/managers/AudioManager'
import { useRiveContext } from '@/rive/RiveContext'
import { Gesture, BuddyState, BuddyConfig, AccessoryConfig } from '@/rive/types'

export interface UseBuddyOptions {
  autoInitialize?: boolean
  preloadAudio?: boolean
}

export interface UseBuddyReturn {
  buddyManager: BuddyManager | null
  audioManager: AudioManager | null
  buddyState: BuddyState
  buddyConfig: BuddyConfig | null
  equippedAccessories: AccessoryConfig[]
  isLoading: boolean
  error: string | null
  loadBuddy: (buddyId: string) => Promise<void>
  triggerGesture: (gesture: Gesture) => void
  equipAccessory: (accessoryId: string) => void
  hatchBuddy: () => void
  cleanup: () => void
}

export function useBuddy(options: UseBuddyOptions = {}): UseBuddyReturn {
  const { autoInitialize = true, preloadAudio = true } = options
  const riveContext = useRiveContext()
  
  const [buddyState, setBuddyState] = useState<BuddyState>(BuddyState.Egg)
  const [buddyConfig, setBuddyConfig] = useState<BuddyConfig | null>(null)
  const [equippedAccessories, setEquippedAccessories] = useState<AccessoryConfig[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buddyManagerRef = useRef<BuddyManager | null>(null)
  const audioManagerRef = useRef<AudioManager | null>(null)

  useEffect(() => {
    if (autoInitialize) {
      initializeManagers()
    }

    return () => {
      cleanup()
    }
  }, [autoInitialize])

  const initializeManagers = useCallback(async () => {
    try {
      if (!audioManagerRef.current) {
        audioManagerRef.current = new AudioManager()
        await audioManagerRef.current.initialize()
      }

      if (!buddyManagerRef.current) {
        buddyManagerRef.current = new BuddyManager(riveContext, (state) => {
          setBuddyState(state)
        })
      }
    } catch (err) {
      console.error('Failed to initialize buddy managers:', err)
      setError(err instanceof Error ? err.message : 'Initialization failed')
    }
  }, [])

  const loadBuddy = useCallback(async (buddyId: string) => {
    if (!buddyManagerRef.current) {
      await initializeManagers()
    }

    if (!buddyManagerRef.current) {
      throw new Error('BuddyManager not initialized')
    }

    setIsLoading(true)
    setError(null)

    try {
      await buddyManagerRef.current.load(buddyId)
      
      const config = buddyManagerRef.current.getBuddyConfig()
      setBuddyConfig(config)
      
      const accessories = buddyManagerRef.current.getEquippedAccessories()
      setEquippedAccessories(accessories)

      if (preloadAudio && audioManagerRef.current) {
        await audioManagerRef.current.preloadBuddyAudio(buddyId)
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Failed to load buddy:', err)
      setError(err instanceof Error ? err.message : 'Failed to load buddy')
      setIsLoading(false)
      throw err
    }
  }, [initializeManagers, preloadAudio, riveContext])

  const triggerGesture = useCallback(async (gesture: Gesture) => {
    if (!buddyManagerRef.current || !buddyConfig) {
      console.warn('Cannot trigger gesture: Buddy not loaded')
      return
    }

    try {
      buddyManagerRef.current.trigger(gesture)
      
      if (audioManagerRef.current) {
        await audioManagerRef.current.playGestureAudio(buddyConfig.id, gesture)
      }
    } catch (err) {
      console.error('Failed to trigger gesture:', err)
      setError(err instanceof Error ? err.message : 'Failed to trigger gesture')
    }
  }, [buddyConfig])

  const equipAccessory = useCallback((accessoryId: string) => {
    if (!buddyManagerRef.current) {
      console.warn('Cannot equip accessory: BuddyManager not initialized')
      return
    }

    try {
      buddyManagerRef.current.equip(accessoryId)
      const accessories = buddyManagerRef.current.getEquippedAccessories()
      setEquippedAccessories(accessories)
    } catch (err) {
      console.error('Failed to equip accessory:', err)
      setError(err instanceof Error ? err.message : 'Failed to equip accessory')
    }
  }, [])

  const hatchBuddy = useCallback(() => {
    if (!buddyManagerRef.current) {
      console.warn('Cannot hatch buddy: BuddyManager not initialized')
      return
    }

    try {
      buddyManagerRef.current.hatch()
    } catch (err) {
      console.error('Failed to hatch buddy:', err)
      setError(err instanceof Error ? err.message : 'Failed to hatch buddy')
    }
  }, [])

  const cleanup = useCallback(() => {
    if (buddyManagerRef.current) {
      buddyManagerRef.current.cleanup()
      buddyManagerRef.current = null
    }
    
    if (audioManagerRef.current) {
      audioManagerRef.current.cleanup()
      audioManagerRef.current = null
    }

    setBuddyState(BuddyState.Egg)
    setBuddyConfig(null)
    setEquippedAccessories([])
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    buddyManager: buddyManagerRef.current,
    audioManager: audioManagerRef.current,
    buddyState,
    buddyConfig,
    equippedAccessories,
    isLoading,
    error,
    loadBuddy,
    triggerGesture,
    equipAccessory,
    hatchBuddy,
    cleanup
  }
}