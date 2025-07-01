import { Gesture, AudioConfig } from '@/rive/types'

export interface AudioSettings {
  enabled: boolean
  volume: number
  mutedBySystem: boolean
  voiceLinesEnabled: boolean
  sfxEnabled: boolean
  currentLocale: string
}

export class AudioManager {
  private audioContext: AudioContext | null = null
  private loadedAudio: Map<string, AudioBuffer> = new Map()
  private audioConfigs: Map<string, AudioConfig[]> = new Map()
  private settings: AudioSettings = {
    enabled: true,
    volume: 0.7,
    mutedBySystem: false,
    voiceLinesEnabled: true,
    sfxEnabled: true,
    currentLocale: 'en-US'
  }
  private settingsListeners: Set<(settings: AudioSettings) => void> = new Set()

  constructor() {
    this.loadSettings()
    this.detectSystemMute()
  }

  async initialize(): Promise<void> {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      await this.loadAudioConfigs()
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error)
      this.settings.enabled = false
      this.notifySettingsListeners()
    }
  }

  addSettingsListener(listener: (settings: AudioSettings) => void): () => void {
    this.settingsListeners.add(listener)
    return () => this.settingsListeners.delete(listener)
  }

  async playGestureAudio(buddyId: string, gesture: Gesture): Promise<void> {
    if (!this.settings.enabled || !this.settings.voiceLinesEnabled) {
      return
    }

    try {
      const audioConfigs = this.audioConfigs.get(buddyId)
      if (!audioConfigs) {
        console.warn(`No audio configs found for buddy ${buddyId}`)
        return
      }

      const gestureAudio = audioConfigs.find(
        config => config.gesture === gesture && config.locale === this.settings.currentLocale
      )

      if (!gestureAudio) {
        const fallbackAudio = audioConfigs.find(
          config => config.gesture === gesture && config.locale === 'en-US'
        )
        
        if (fallbackAudio) {
          await this.playAudioFile(fallbackAudio.filePath)
        }
        return
      }

      await this.playAudioFile(gestureAudio.filePath)
      
      this.emitAccessibilityEvent(gestureAudio.transcript)
    } catch (error) {
      console.error('Failed to play gesture audio:', error)
    }
  }

  async playSfx(soundPath: string): Promise<void> {
    if (!this.settings.enabled || !this.settings.sfxEnabled) {
      return
    }

    try {
      await this.playAudioFile(soundPath)
    } catch (error) {
      console.error('Failed to play SFX:', error)
    }
  }

  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
    this.notifySettingsListeners()
  }

  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled
    this.saveSettings()
    this.notifySettingsListeners()
  }

  setVoiceLinesEnabled(enabled: boolean): void {
    this.settings.voiceLinesEnabled = enabled
    this.saveSettings()
    this.notifySettingsListeners()
  }

  setSfxEnabled(enabled: boolean): void {
    this.settings.sfxEnabled = enabled
    this.saveSettings()
    this.notifySettingsListeners()
  }

  setLocale(locale: string): void {
    this.settings.currentLocale = locale
    this.saveSettings()
    this.notifySettingsListeners()
  }

  getSettings(): AudioSettings {
    return { ...this.settings }
  }

  getAudioTranscript(buddyId: string, gesture: Gesture): string | null {
    const audioConfigs = this.audioConfigs.get(buddyId)
    if (!audioConfigs) return null

    const gestureAudio = audioConfigs.find(
      config => config.gesture === gesture && config.locale === this.settings.currentLocale
    )

    return gestureAudio?.transcript || null
  }

  preloadBuddyAudio(buddyId: string): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        const audioConfigs = this.audioConfigs.get(buddyId)
        if (!audioConfigs) {
          resolve()
          return
        }

        const loadPromises = audioConfigs
          .filter(config => config.locale === this.settings.currentLocale)
          .map(config => this.loadAudioBuffer(config.filePath))

        await Promise.allSettled(loadPromises)
        resolve()
      } catch (error) {
        console.error('Failed to preload buddy audio:', error)
        resolve()
      }
    })
  }

  cleanup(): void {
    this.loadedAudio.clear()
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
      this.audioContext = null
    }
  }

  private async playAudioFile(filePath: string): Promise<void> {
    if (!this.audioContext || !this.settings.enabled) {
      return
    }

    try {
      let audioBuffer = this.loadedAudio.get(filePath)
      
      if (!audioBuffer) {
        audioBuffer = await this.loadAudioBuffer(filePath)
      }

      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = audioBuffer
      gainNode.gain.value = this.settings.volume
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start()
    } catch (error) {
      console.error(`Failed to play audio file ${filePath}:`, error)
    }
  }

  private async loadAudioBuffer(filePath: string): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized')
    }

    try {
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      
      this.loadedAudio.set(filePath, audioBuffer)
      return audioBuffer
    } catch (error) {
      console.error(`Failed to load audio buffer for ${filePath}:`, error)
      throw error
    }
  }

  private async loadAudioConfigs(): Promise<void> {
    try {
      const response = await fetch('/public/assets/audio/index.json')
      if (!response.ok) {
        console.warn('No audio config file found, using fallback')
        this.createFallbackAudioConfigs()
        return
      }

      const configsByBuddy = await response.json()
      Object.entries(configsByBuddy).forEach(([buddyId, configs]) => {
        this.audioConfigs.set(buddyId, configs as AudioConfig[])
      })
    } catch (error) {
      console.error('Failed to load audio configs:', error)
      this.createFallbackAudioConfigs()
    }
  }

  private createFallbackAudioConfigs(): void {
    const fallbackConfigs: AudioConfig[] = [
      {
        gesture: Gesture.Wave,
        filePath: '/public/assets/audio/wave.mp3',
        locale: 'en-US',
        transcript: 'Hello there!'
      },
      {
        gesture: Gesture.Cheer,
        filePath: '/public/assets/audio/cheer.mp3',
        locale: 'en-US',
        transcript: 'Great job!'
      }
    ]

    this.audioConfigs.set('default', fallbackConfigs)
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('reading-buddies-audio-settings')
      if (saved) {
        const savedSettings = JSON.parse(saved)
        this.settings = { ...this.settings, ...savedSettings }
      }
    } catch (error) {
      console.error('Failed to load audio settings:', error)
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('reading-buddies-audio-settings', JSON.stringify(this.settings))
    } catch (error) {
      console.error('Failed to save audio settings:', error)
    }
  }

  private detectSystemMute(): void {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then(result => {
        if (result.state === 'denied') {
          this.settings.mutedBySystem = true
          this.notifySettingsListeners()
        }
      }).catch(() => {
        // Ignore permission check failures
      })
    }
  }

  private notifySettingsListeners(): void {
    this.settingsListeners.forEach(listener => {
      try {
        listener(this.settings)
      } catch (error) {
        console.error('Error in settings listener:', error)
      }
    })
  }

  private emitAccessibilityEvent(transcript: string): void {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = transcript
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}