import { EggConfig } from '@/rive/types'

export interface EggProgress {
  buddyId: string
  currentProgress: number
  targetProgress: number
  milestone: string
  isReadyToHatch: boolean
}

export class EggManager {
  private eggConfigs: Map<string, EggConfig> = new Map()
  private eggProgress: Map<string, EggProgress> = new Map()
  private progressListeners: Set<(progress: EggProgress) => void> = new Set()

  constructor() {
    this.loadEggProgress()
  }

  async initialize(): Promise<void> {
    try {
      await this.loadEggConfigs()
      this.loadEggProgress()
    } catch (error) {
      console.error('Failed to initialize EggManager:', error)
    }
  }

  addProgressListener(listener: (progress: EggProgress) => void): () => void {
    this.progressListeners.add(listener)
    return () => this.progressListeners.delete(listener)
  }

  updateProgress(buddyId: string, increment: number): void {
    const progress = this.eggProgress.get(buddyId)
    if (!progress) {
      console.warn(`No egg progress found for buddy ${buddyId}`)
      return
    }

    const newProgress = Math.min(progress.currentProgress + increment, progress.targetProgress)
    const updatedProgress: EggProgress = {
      ...progress,
      currentProgress: newProgress,
      isReadyToHatch: newProgress >= progress.targetProgress
    }

    this.eggProgress.set(buddyId, updatedProgress)
    this.saveEggProgress()
    this.notifyProgressListeners(updatedProgress)

    if (updatedProgress.isReadyToHatch) {
      this.emitHatchReadyEvent(buddyId)
    }
  }

  getProgress(buddyId: string): EggProgress | null {
    return this.eggProgress.get(buddyId) || null
  }

  getAllProgress(): EggProgress[] {
    return Array.from(this.eggProgress.values())
  }

  createEgg(buddyId: string, milestone: string, targetProgress: number = 100): void {
    const eggConfig = this.eggConfigs.get(buddyId)
    if (!eggConfig) {
      console.warn(`No egg config found for buddy ${buddyId}`)
      return
    }

    const progress: EggProgress = {
      buddyId,
      currentProgress: 0,
      targetProgress,
      milestone,
      isReadyToHatch: false
    }

    this.eggProgress.set(buddyId, progress)
    this.saveEggProgress()
    this.notifyProgressListeners(progress)

    this.emitAnalyticsEvent('egg_created', {
      buddyId,
      milestone,
      targetProgress
    })
  }

  hatchEgg(buddyId: string): boolean {
    const progress = this.eggProgress.get(buddyId)
    if (!progress || !progress.isReadyToHatch) {
      console.warn(`Egg for buddy ${buddyId} is not ready to hatch`)
      return false
    }

    this.eggProgress.delete(buddyId)
    this.saveEggProgress()

    this.emitAnalyticsEvent('egg_hatched', {
      buddyId,
      milestone: progress.milestone
    })

    return true
  }

  getEggConfig(buddyId: string): EggConfig | null {
    return this.eggConfigs.get(buddyId) || null
  }

  getProgressPercentage(buddyId: string): number {
    const progress = this.eggProgress.get(buddyId)
    if (!progress) return 0
    
    return Math.round((progress.currentProgress / progress.targetProgress) * 100)
  }

  simulateProgress(buddyId: string): void {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('simulateProgress is only available in development mode')
      return
    }

    const progress = this.eggProgress.get(buddyId)
    if (!progress) {
      console.warn(`No progress found for buddy ${buddyId}`)
      return
    }

    const remainingProgress = progress.targetProgress - progress.currentProgress
    const increment = Math.min(remainingProgress, 10)
    this.updateProgress(buddyId, increment)
  }

  private async loadEggConfigs(): Promise<void> {
    try {
      const response = await fetch('/assets/eggs/index.json')
      if (!response.ok) {
        throw new Error(`Failed to load egg configs: ${response.statusText}`)
      }

      const data = await response.json()
      const configs: EggConfig[] = data.eggs || data
      configs.forEach(config => {
        this.eggConfigs.set(config.buddyId, config)
      })
    } catch (error) {
      console.error('Failed to load egg configs:', error)
      this.createFallbackEggConfigs()
    }
  }

  private createFallbackEggConfigs(): void {
    const fallbackConfigs: EggConfig[] = [
      {
        buddyId: 'kitten-ninja',
        eggImagePath: '/public/assets/eggs/kitten-ninja/egg.png',
        crackedImagePath: '/public/assets/eggs/kitten-ninja/egg-cracked.png',
        hatchSoundPath: '/public/assets/eggs/kitten-ninja/hatch.mp3',
        progress: 0,
        milestone: 'read_3_days'
      }
    ]

    fallbackConfigs.forEach(config => {
      this.eggConfigs.set(config.buddyId, config)
    })
  }

  private loadEggProgress(): void {
    try {
      const saved = localStorage.getItem('reading-buddies-egg-progress')
      if (saved) {
        const progressData = JSON.parse(saved)
        Object.entries(progressData).forEach(([buddyId, progress]) => {
          this.eggProgress.set(buddyId, progress as EggProgress)
        })
      }
    } catch (error) {
      console.error('Failed to load egg progress from storage:', error)
    }
  }

  private saveEggProgress(): void {
    try {
      const progressData = Object.fromEntries(this.eggProgress.entries())
      localStorage.setItem('reading-buddies-egg-progress', JSON.stringify(progressData))
    } catch (error) {
      console.error('Failed to save egg progress to storage:', error)
    }
  }

  private notifyProgressListeners(progress: EggProgress): void {
    this.progressListeners.forEach(listener => {
      try {
        listener(progress)
      } catch (error) {
        console.error('Error in progress listener:', error)
      }
    })
  }

  private emitHatchReadyEvent(buddyId: string): void {
    const event = new CustomEvent('egg-ready-to-hatch', {
      detail: { buddyId }
    })
    window.dispatchEvent(event)
  }

  private emitAnalyticsEvent(type: string, payload: Record<string, unknown>): void {
    const event = new CustomEvent('buddy-analytics', {
      detail: {
        type,
        payload,
        timestamp: Date.now()
      }
    })
    window.dispatchEvent(event)
  }
}