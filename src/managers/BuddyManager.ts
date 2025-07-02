import { 
  Gesture, 
  BuddyConfig, 
  AccessoryConfig, 
  BuddyState, 
  RiveInstanceRef,
  BuddyInteractionEvent,
  CharacterType,
  MultiArtboardConfig,
  AssetLoadEvent
} from '@/rive/types'

export class BuddyManager {
  private buddyConfig: BuddyConfig | null = null
  private riveInstance: RiveInstanceRef | null = null
  private currentState: BuddyState = BuddyState.Egg
  private equippedAccessories: Set<string> = new Set()
  private interactionHistory: BuddyInteractionEvent[] = []
  private multiArtboardConfig: MultiArtboardConfig | null = null
  private assetLoadEvents: AssetLoadEvent[] = []

  constructor(
    private riveLoader: { loadRive: (config: any) => Promise<RiveInstanceRef> },
    private onStateChange?: (state: BuddyState) => void,
    private onAssetLoad?: (event: AssetLoadEvent) => void
  ) {}

  async load(buddyId: string): Promise<void> {
    try {
      const config = await this.fetchBuddyConfig(buddyId)
      this.buddyConfig = config

      // Load multi-artboard config if buddy uses shared humanoid file
      if (config.rivFilePath.includes('humanoid-buddies.riv')) {
        this.multiArtboardConfig = await this.fetchMultiArtboardConfig()
      }

      this.riveInstance = await this.riveLoader.loadRive({
        src: config.rivFilePath,
        artboard: config.artboardName,
        characterType: config.characterType,
        stateMachines: [config.stateMachineName],
        onLoad: () => {
          this.currentState = BuddyState.Active
          this.onStateChange?.(this.currentState)
        },
        onError: (error: Error) => {
          console.error(`Failed to load buddy ${buddyId}:`, error)
          throw error
        },
        onAssetLoad: (event: AssetLoadEvent) => {
          this.handleAssetLoad(event)
        }
      })
    } catch (error) {
      console.error('BuddyManager load failed:', error)
      throw error
    }
  }

  async switchCharacter(characterType: CharacterType): Promise<void> {
    if (!this.multiArtboardConfig) {
      console.warn('Cannot switch character: Multi-artboard config not loaded')
      return
    }

    if (!this.buddyConfig) {
      console.warn('Cannot switch character: Buddy config not loaded')
      return
    }

    const characterConfig = this.multiArtboardConfig.characters[characterType]
    if (!characterConfig) {
      console.error(`Character type ${characterType} not found in multi-artboard config`)
      return
    }

    try {
      // Update buddy config
      this.buddyConfig.characterType = characterType
      this.buddyConfig.artboardName = characterConfig.artboardName
      
      // Reload with new artboard
      await this.cleanup()
      await this.load(this.buddyConfig.id)
      
      this.emitAnalyticsEvent('character_switched', {
        buddyId: this.buddyConfig.id,
        fromCharacter: this.buddyConfig.characterType,
        toCharacter: characterType
      })
    } catch (error) {
      console.error('Failed to switch character:', error)
      throw error
    }
  }

  private handleAssetLoad(event: AssetLoadEvent): void {
    this.assetLoadEvents.push(event)
    this.onAssetLoad?.(event)
    
    if (!event.success) {
      console.warn(`Asset load failed: ${event.assetName} for ${event.characterType}`)
    }
  }

  private async fetchMultiArtboardConfig(): Promise<MultiArtboardConfig> {
    try {
      const response = await fetch('/public/assets/humanoid-buddies-config.json')
      if (!response.ok) {
        throw new Error(`Failed to fetch multi-artboard config: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch multi-artboard config:', error)
      
      // Return fallback config
      return {
        filePath: 'humanoid-buddies.riv',
        characters: {
          [CharacterType.KittenNinja]: {
            artboardName: 'KittenNinja',
            stateMachineName: 'EmotionSM'
          },
          [CharacterType.PuppyWizard]: {
            artboardName: 'PuppyWizard',
            stateMachineName: 'EmotionSM'
          },
          [CharacterType.BearKnight]: {
            artboardName: 'BearKnight',
            stateMachineName: 'EmotionSM'
          },
          [CharacterType.DragonMage]: {
            artboardName: 'DragonMage',
            stateMachineName: 'EmotionSM'
          }
        },
        sharedAssets: {
          baseTextures: ['body-base.png', 'face-base.png'],
          animations: ['idle', 'wave', 'jump', 'sad', 'cheer'],
          stateMachines: ['EmotionSM', 'InteractionSM']
        }
      }
    }
  }

  trigger(gesture: Gesture): void {
    if (!this.riveInstance || !this.buddyConfig) {
      console.warn('Cannot trigger gesture: Buddy not loaded')
      return
    }

    if (this.currentState !== BuddyState.Active) {
      console.warn('Cannot trigger gesture: Buddy not in active state')
      return
    }

    try {
      this.riveInstance.trigger(gesture)
      
      const event: BuddyInteractionEvent = {
        buddyId: this.buddyConfig.id,
        gesture,
        timestamp: Date.now()
      }
      
      this.interactionHistory.push(event)
      this.trimInteractionHistory()
      
      this.emitAnalyticsEvent('gesture_triggered', {
        buddyId: this.buddyConfig.id,
        gesture
      })
    } catch (error) {
      console.error('Failed to trigger gesture:', error)
    }
  }

  equip(accessoryId: string): void {
    if (!this.buddyConfig) {
      console.warn('Cannot equip accessory: Buddy not loaded')
      return
    }

    const accessory = this.buddyConfig.accessories.find(a => a.id === accessoryId)
    if (!accessory) {
      console.warn(`Accessory ${accessoryId} not found for buddy ${this.buddyConfig.id}`)
      return
    }

    if (this.equippedAccessories.has(accessoryId)) {
      this.equippedAccessories.delete(accessoryId)
    } else {
      this.equippedAccessories.add(accessoryId)
    }

    this.emitAnalyticsEvent('accessory_equipped', {
      accessoryId,
      buddyId: this.buddyConfig.id,
      equipped: this.equippedAccessories.has(accessoryId)
    })
  }

  hatch(): void {
    if (this.currentState !== BuddyState.Egg) {
      console.warn('Cannot hatch: Buddy is not in egg state')
      return
    }

    this.currentState = BuddyState.Hatching
    this.onStateChange?.(this.currentState)

    if (this.riveInstance) {
      this.riveInstance.trigger(Gesture.Hatch)
      
      setTimeout(() => {
        this.currentState = BuddyState.Active
        this.onStateChange?.(this.currentState)
        
        if (this.buddyConfig) {
          this.emitAnalyticsEvent('buddy_hatched', {
            buddyId: this.buddyConfig.id
          })
        }
      }, 2000)
    }
  }

  getState(): BuddyState {
    return this.currentState
  }

  getBuddyConfig(): BuddyConfig | null {
    return this.buddyConfig
  }

  getEquippedAccessories(): AccessoryConfig[] {
    if (!this.buddyConfig) return []
    
    return this.buddyConfig.accessories.filter(accessory => 
      this.equippedAccessories.has(accessory.id)
    )
  }

  getInteractionCount(timeframeMs: number = 3600000): number {
    const cutoff = Date.now() - timeframeMs
    return this.interactionHistory.filter(event => event.timestamp > cutoff).length
  }

  getCharacterType(): CharacterType | null {
    return this.buddyConfig?.characterType || null
  }

  getAvailableCharacters(): CharacterType[] {
    if (!this.multiArtboardConfig) return []
    return Object.keys(this.multiArtboardConfig.characters) as CharacterType[]
  }

  getAssetLoadStatus(): { total: number; successful: number; failed: number } {
    const total = this.assetLoadEvents.length
    const successful = this.assetLoadEvents.filter(event => event.success).length
    const failed = total - successful
    
    return { total, successful, failed }
  }

  isMultiArtboardEnabled(): boolean {
    return this.multiArtboardConfig !== null
  }

  cleanup(): void {
    if (this.riveInstance) {
      this.riveInstance.cleanup()
      this.riveInstance = null
    }
    this.buddyConfig = null
    this.currentState = BuddyState.Egg
    this.equippedAccessories.clear()
    this.interactionHistory = []
    this.assetLoadEvents = []
    // Keep multiArtboardConfig for reuse
  }

  private async fetchBuddyConfig(buddyId: string): Promise<BuddyConfig> {
    try {
      const response = await fetch(`/public/assets/buddies/${buddyId}/config.json`)
      if (!response.ok) {
        throw new Error(`Failed to fetch buddy config: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch buddy config:', error)
      
      return this.createFallbackConfig(buddyId)
    }
  }

  private createFallbackConfig(buddyId: string): BuddyConfig {
    return {
      id: buddyId,
      name: 'Default Buddy',
      characterType: CharacterType.KittenNinja,
      artboardName: 'DefaultBuddy',
      stateMachineName: 'EmotionSM',
      rivFilePath: '/rive/buddies.riv',
      audioPath: '/public/assets/buddies/default/audio/',
      accessories: [],
      unlockMilestone: 'default',
      schemaVersion: '1.0.0'
    }
  }

  private trimInteractionHistory(): void {
    const maxHistorySize = 100
    if (this.interactionHistory.length > maxHistorySize) {
      this.interactionHistory = this.interactionHistory.slice(-maxHistorySize)
    }
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