import { RiveLoadConfig, RiveInstanceRef } from './types'

class RiveLoader {
  private static instance: RiveLoader
  private loadedRives = new Map<string, RiveInstanceRef>()
  private riveModule: any = null

  private constructor() {}

  static getInstance(): RiveLoader {
    if (!RiveLoader.instance) {
      RiveLoader.instance = new RiveLoader()
    }
    return RiveLoader.instance
  }

  async initialize(): Promise<void> {
    if (this.riveModule) return

    try {
      const rive = await import('@rive-app/react-canvas')
      this.riveModule = rive
    } catch (error) {
      console.error('Failed to load Rive module:', error)
      throw new Error('Rive module could not be loaded')
    }
  }

  async loadRive(config: RiveLoadConfig): Promise<RiveInstanceRef> {
    await this.initialize()

    const cacheKey = `${config.src}-${config.artboard || 'default'}`
    
    if (this.loadedRives.has(cacheKey)) {
      return this.loadedRives.get(cacheKey)!
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
                  this.loadedRives.delete(cacheKey)
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

            this.loadedRives.set(cacheKey, ref)
            config.onLoad?.()
            resolve(ref)
          },
          onLoadError: (error: Error) => {
            config.onError?.(error)
            reject(error)
          },
        }

        riveInstance = new this.riveModule.Rive(riveConfig)
      } catch (error) {
        config.onError?.(error as Error)
        reject(error)
      }
    })
  }

  getRiveInstance(src: string, artboard?: string): RiveInstanceRef | null {
    const cacheKey = `${src}-${artboard || 'default'}`
    return this.loadedRives.get(cacheKey) || null
  }

  cleanupAll(): void {
    this.loadedRives.forEach(riveRef => {
      riveRef.cleanup()
    })
    this.loadedRives.clear()
  }

  getLoadedCount(): number {
    return this.loadedRives.size
  }
}

export const riveLoader = RiveLoader.getInstance()

export * from './types'