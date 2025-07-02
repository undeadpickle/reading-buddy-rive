export enum Gesture {
  Wave = 'wave',
  Jump = 'jump',
  Sad = 'sad',
  Cheer = 'cheer',
  Idle = 'idle',
  Hatch = 'hatch',
}

export enum AccessoryCategory {
  Hat = 'hat',
  Glasses = 'glasses',
  Helmet = 'helmet',
  Costume = 'costume',
}

export enum BuddyState {
  Egg = 'egg',
  Hatching = 'hatching',
  Active = 'active',
  Sleeping = 'sleeping',
}

export enum CharacterType {
  KittenNinja = 'kitten-ninja',
  PuppyWizard = 'puppy-wizard',
  BearKnight = 'bear-knight',
  DragonMage = 'dragon-mage',
}

export interface BuddyConfig {
  id: string
  name: string
  characterType: CharacterType
  artboardName: string
  stateMachineName: string
  rivFilePath: string
  audioPath: string
  accessories: AccessoryConfig[]
  unlockMilestone: string
  schemaVersion: string
}

export interface AccessoryConfig {
  id: string
  name: string
  category: AccessoryCategory
  imagePath: string
  unlockMilestone: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface EggConfig {
  buddyId: string
  eggImagePath: string
  crackedImagePath: string
  hatchSoundPath: string
  progress: number
  milestone: string
}

export interface AudioConfig {
  gesture: Gesture
  filePath: string
  locale: string
  transcript: string
}

export interface RiveLoadConfig {
  src: string
  artboard?: string
  stateMachines?: string[]
  autoplay?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
}

export interface MultiArtboardConfig {
  filePath: string // 'humanoid-buddies.riv'
  characters: Record<CharacterType, {
    artboardName: string
    stateMachineName: string
    assetMappings?: Record<string, string> // For character-specific textures
  }>
  sharedAssets: {
    baseTextures: string[]
    animations: string[]
    stateMachines: string[]
  }
}

export interface AssetLoadEvent {
  assetName: string
  assetType: 'image' | 'font' | 'audio'
  characterType: CharacterType
  success: boolean
}

export interface BuddyInteractionEvent {
  buddyId: string
  gesture: Gesture
  timestamp: number
  userId?: string
}

export interface AnalyticsEvent {
  type: 'buddy_hatched' | 'gesture_triggered' | 'accessory_equipped' | 'reading_milestone_met' | 'buddy_interaction_tick'
  payload: Record<string, unknown>
  timestamp: number
  userId?: string
}

export type RiveInstanceRef = {
  cleanup: () => void
  trigger: (inputName: string) => void
  setBooleanState: (inputName: string, value: boolean) => void
  setNumberState: (inputName: string, value: number) => void
}