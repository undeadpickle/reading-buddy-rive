import React, { createContext, useContext, useRef, useCallback } from 'react'
import { RiveLoadConfig, RiveInstanceRef } from './types'

interface RiveContextValue {
  loadRive: (config: RiveLoadConfig) => Promise<RiveInstanceRef>
  getRiveInstance: (src: string, artboard?: string) => RiveInstanceRef | null
  cleanupAll: () => void
  getLoadedCount: () => number
}

const RiveContext = createContext<RiveContextValue | null>(null)

export function useRiveContext(): RiveContextValue {
  const context = useContext(RiveContext)
  if (!context) {
    throw new Error('useRiveContext must be used within a RiveProvider')
  }
  return context
}

interface RiveProviderProps {
  children: React.ReactNode
}

export function RiveProvider({ children }: RiveProviderProps): React.ReactElement {
  const loadedRivesRef = useRef<Map<string, RiveInstanceRef>>(new Map())
  const riveModuleRef = useRef<any>(null)

  const initializeRiveModule = useCallback(async () => {
    if (riveModuleRef.current) return riveModuleRef.current

    try {
      const rive = await import('@rive-app/react-canvas')
      riveModuleRef.current = rive
      return rive
    } catch (error) {
      console.error('Failed to load Rive module:', error)
      throw new Error('Rive module could not be loaded')
    }
  }, [])

  const loadRive = useCallback(async (config: RiveLoadConfig): Promise<RiveInstanceRef> => {
    const riveModule = await initializeRiveModule()
    const cacheKey = `${config.src}-${config.artboard || 'default'}`
    
    if (loadedRivesRef.current.has(cacheKey)) {
      return loadedRivesRef.current.get(cacheKey)!
    }

    return new Promise((resolve, reject) => {
      let riveInstance: any = null

      try {
        const riveConfig = {
          src: config.src,
          artboard: config.artboard,
          stateMachines: config.stateMachines,
          autoplay: config.autoplay ?? true,
          onLoad: () => {
            const ref: RiveInstanceRef = {
              cleanup: () => {
                if (riveInstance) {
                  riveInstance.cleanup?.()
                  loadedRivesRef.current.delete(cacheKey)
                }
              },
              trigger: (inputName: string) => {
                if (riveInstance?.stateMachineInputs) {
                  const input = riveInstance.stateMachineInputs.find(
                    (i: any) => i.name === inputName
                  )
                  if (input) {
                    input.fire()
                  }
                }
              },
              setBooleanState: (inputName: string, value: boolean) => {
                if (riveInstance?.stateMachineInputs) {
                  const input = riveInstance.stateMachineInputs.find(
                    (i: any) => i.name === inputName && i.type === 'Boolean'
                  )
                  if (input) {
                    input.value = value
                  }
                }
              },
              setNumberState: (inputName: string, value: number) => {
                if (riveInstance?.stateMachineInputs) {
                  const input = riveInstance.stateMachineInputs.find(
                    (i: any) => i.name === inputName && i.type === 'Number'
                  )
                  if (input) {
                    input.value = value
                  }
                }
              },
            }

            loadedRivesRef.current.set(cacheKey, ref)
            config.onLoad?.()
            resolve(ref)
          },
          onLoadError: (error: Error) => {
            config.onError?.(error)
            reject(error)
          },
        }

        riveInstance = new riveModule.Rive(riveConfig)
      } catch (error) {
        config.onError?.(error as Error)
        reject(error)
      }
    })
  }, [initializeRiveModule])

  const getRiveInstance = useCallback((src: string, artboard?: string): RiveInstanceRef | null => {
    const cacheKey = `${src}-${artboard || 'default'}`
    return loadedRivesRef.current.get(cacheKey) || null
  }, [])

  const cleanupAll = useCallback(() => {
    loadedRivesRef.current.forEach(riveRef => {
      riveRef.cleanup()
    })
    loadedRivesRef.current.clear()
  }, [])

  const getLoadedCount = useCallback(() => {
    return loadedRivesRef.current.size
  }, [])

  const contextValue: RiveContextValue = {
    loadRive,
    getRiveInstance,
    cleanupAll,
    getLoadedCount
  }

  return (
    <RiveContext.Provider value={contextValue}>
      {children}
    </RiveContext.Provider>
  )
}