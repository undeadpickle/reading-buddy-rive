import { useState, useEffect, useCallback, useRef } from 'react'
import { EggManager, EggProgress } from '@/managers/EggManager'
import { EggConfig } from '@/rive/types'

export interface UseEggProgressOptions {
  autoInitialize?: boolean
  buddyId?: string
}

export interface UseEggProgressReturn {
  eggManager: EggManager | null
  allProgress: EggProgress[]
  buddyProgress: EggProgress | null
  eggConfig: EggConfig | null
  progressPercentage: number
  isReadyToHatch: boolean
  isLoading: boolean
  error: string | null
  updateProgress: (buddyId: string, increment: number) => void
  createEgg: (buddyId: string, milestone: string, targetProgress?: number) => void
  hatchEgg: (buddyId: string) => boolean
  simulateProgress: (buddyId: string) => void
  cleanup: () => void
}

export function useEggProgress(options: UseEggProgressOptions = {}): UseEggProgressReturn {
  const { autoInitialize = true, buddyId } = options
  
  const [allProgress, setAllProgress] = useState<EggProgress[]>([])
  const [buddyProgress, setBuddyProgress] = useState<EggProgress | null>(null)
  const [eggConfig, setEggConfig] = useState<EggConfig | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const eggManagerRef = useRef<EggManager | null>(null)
  const progressListenerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (autoInitialize) {
      initializeEggManager()
    }

    return () => {
      cleanup()
    }
  }, [autoInitialize])

  useEffect(() => {
    if (buddyId && eggManagerRef.current) {
      updateBuddyProgress(buddyId)
    }
  }, [buddyId])

  const initializeEggManager = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!eggManagerRef.current) {
        eggManagerRef.current = new EggManager()
        await eggManagerRef.current.initialize()
      }

      // Set up progress listener
      if (progressListenerRef.current) {
        progressListenerRef.current()
      }

      progressListenerRef.current = eggManagerRef.current.addProgressListener((progress) => {
        setAllProgress(eggManagerRef.current!.getAllProgress())
        
        if (buddyId && progress.buddyId === buddyId) {
          setBuddyProgress(progress)
        }
      })

      // Load initial progress
      setAllProgress(eggManagerRef.current.getAllProgress())
      
      if (buddyId) {
        updateBuddyProgress(buddyId)
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Failed to initialize EggManager:', err)
      setError(err instanceof Error ? err.message : 'Initialization failed')
      setIsLoading(false)
    }
  }, [buddyId])

  const updateBuddyProgress = useCallback((targetBuddyId: string) => {
    if (!eggManagerRef.current) return

    const progress = eggManagerRef.current.getProgress(targetBuddyId)
    setBuddyProgress(progress)

    const config = eggManagerRef.current.getEggConfig(targetBuddyId)
    setEggConfig(config)
  }, [])

  const updateProgress = useCallback((targetBuddyId: string, increment: number) => {
    if (!eggManagerRef.current) {
      console.warn('Cannot update progress: EggManager not initialized')
      return
    }

    try {
      eggManagerRef.current.updateProgress(targetBuddyId, increment)
      
      // Update local state if this is the tracked buddy
      if (targetBuddyId === buddyId) {
        updateBuddyProgress(targetBuddyId)
      }
    } catch (err) {
      console.error('Failed to update egg progress:', err)
      setError(err instanceof Error ? err.message : 'Failed to update progress')
    }
  }, [buddyId, updateBuddyProgress])

  const createEgg = useCallback((targetBuddyId: string, milestone: string, targetProgress = 100) => {
    if (!eggManagerRef.current) {
      console.warn('Cannot create egg: EggManager not initialized')
      return
    }

    try {
      eggManagerRef.current.createEgg(targetBuddyId, milestone, targetProgress)
      
      // Update local state if this is the tracked buddy
      if (targetBuddyId === buddyId) {
        updateBuddyProgress(targetBuddyId)
      }
    } catch (err) {
      console.error('Failed to create egg:', err)
      setError(err instanceof Error ? err.message : 'Failed to create egg')
    }
  }, [buddyId, updateBuddyProgress])

  const hatchEgg = useCallback((targetBuddyId: string): boolean => {
    if (!eggManagerRef.current) {
      console.warn('Cannot hatch egg: EggManager not initialized')
      return false
    }

    try {
      const success = eggManagerRef.current.hatchEgg(targetBuddyId)
      
      if (success && targetBuddyId === buddyId) {
        setBuddyProgress(null)
        setEggConfig(null)
      }
      
      return success
    } catch (err) {
      console.error('Failed to hatch egg:', err)
      setError(err instanceof Error ? err.message : 'Failed to hatch egg')
      return false
    }
  }, [buddyId])

  const simulateProgress = useCallback((targetBuddyId: string) => {
    if (!eggManagerRef.current) {
      console.warn('Cannot simulate progress: EggManager not initialized')
      return
    }

    try {
      eggManagerRef.current.simulateProgress(targetBuddyId)
    } catch (err) {
      console.error('Failed to simulate progress:', err)
      setError(err instanceof Error ? err.message : 'Failed to simulate progress')
    }
  }, [])

  const cleanup = useCallback(() => {
    if (progressListenerRef.current) {
      progressListenerRef.current()
      progressListenerRef.current = null
    }

    eggManagerRef.current = null
    setAllProgress([])
    setBuddyProgress(null)
    setEggConfig(null)
    setError(null)
    setIsLoading(false)
  }, [])

  // Computed values
  const progressPercentage = buddyProgress 
    ? Math.round((buddyProgress.currentProgress / buddyProgress.targetProgress) * 100)
    : 0

  const isReadyToHatch = buddyProgress?.isReadyToHatch ?? false

  return {
    eggManager: eggManagerRef.current,
    allProgress,
    buddyProgress,
    eggConfig,
    progressPercentage,
    isReadyToHatch,
    isLoading,
    error,
    updateProgress,
    createEgg,
    hatchEgg,
    simulateProgress,
    cleanup
  }
}