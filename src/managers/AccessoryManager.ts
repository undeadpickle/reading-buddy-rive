import { AccessoryConfig, AccessoryCategory } from '@/rive/types'

export interface AccessoryInventory {
  owned: Set<string>
  unlocked: Set<string>
  equipped: Map<string, string>
}

export class AccessoryManager {
  private accessoryConfigs: Map<string, AccessoryConfig> = new Map()
  private inventory: AccessoryInventory = {
    owned: new Set(),
    unlocked: new Set(),
    equipped: new Map()
  }
  private inventoryListeners: Set<(inventory: AccessoryInventory) => void> = new Set()

  constructor() {
    this.loadInventory()
  }

  async initialize(): Promise<void> {
    try {
      await this.loadAccessoryConfigs()
      this.loadInventory()
    } catch (error) {
      console.error('Failed to initialize AccessoryManager:', error)
    }
  }

  addInventoryListener(listener: (inventory: AccessoryInventory) => void): () => void {
    this.inventoryListeners.add(listener)
    return () => this.inventoryListeners.delete(listener)
  }

  unlockAccessory(accessoryId: string): boolean {
    const accessory = this.accessoryConfigs.get(accessoryId)
    if (!accessory) {
      console.warn(`Accessory ${accessoryId} not found`)
      return false
    }

    if (this.inventory.unlocked.has(accessoryId)) {
      console.log(`Accessory ${accessoryId} already unlocked`)
      return true
    }

    this.inventory.unlocked.add(accessoryId)
    this.inventory.owned.add(accessoryId)
    this.saveInventory()
    this.notifyInventoryListeners()

    this.emitAnalyticsEvent('accessory_unlocked', {
      accessoryId,
      category: accessory.category,
      rarity: accessory.rarity
    })

    return true
  }

  equipAccessory(buddyId: string, accessoryId: string): boolean {
    if (!this.inventory.owned.has(accessoryId)) {
      console.warn(`Accessory ${accessoryId} not owned`)
      return false
    }

    const accessory = this.accessoryConfigs.get(accessoryId)
    if (!accessory) {
      console.warn(`Accessory ${accessoryId} not found`)
      return false
    }

    const currentEquipped = this.inventory.equipped.get(buddyId)
    if (currentEquipped) {
      const currentAccessory = this.accessoryConfigs.get(currentEquipped)
      if (currentAccessory && currentAccessory.category === accessory.category) {
        this.inventory.equipped.delete(buddyId)
      }
    }

    this.inventory.equipped.set(buddyId, accessoryId)
    this.saveInventory()
    this.notifyInventoryListeners()

    this.emitAnalyticsEvent('accessory_equipped', {
      buddyId,
      accessoryId,
      category: accessory.category
    })

    return true
  }

  unequipAccessory(buddyId: string, accessoryId: string): boolean {
    const currentEquipped = this.inventory.equipped.get(buddyId)
    if (currentEquipped !== accessoryId) {
      console.warn(`Accessory ${accessoryId} not equipped on buddy ${buddyId}`)
      return false
    }

    this.inventory.equipped.delete(buddyId)
    this.saveInventory()
    this.notifyInventoryListeners()

    this.emitAnalyticsEvent('accessory_unequipped', {
      buddyId,
      accessoryId
    })

    return true
  }

  getOwnedAccessories(): AccessoryConfig[] {
    return Array.from(this.inventory.owned)
      .map(id => this.accessoryConfigs.get(id))
      .filter(Boolean) as AccessoryConfig[]
  }

  getAccessoriesByCategory(category: AccessoryCategory): AccessoryConfig[] {
    return Array.from(this.accessoryConfigs.values())
      .filter(accessory => accessory.category === category)
  }

  getEquippedAccessories(buddyId: string): AccessoryConfig[] {
    const equippedId = this.inventory.equipped.get(buddyId)
    if (!equippedId) return []

    const accessory = this.accessoryConfigs.get(equippedId)
    return accessory ? [accessory] : []
  }

  isAccessoryUnlocked(accessoryId: string): boolean {
    return this.inventory.unlocked.has(accessoryId)
  }

  isAccessoryOwned(accessoryId: string): boolean {
    return this.inventory.owned.has(accessoryId)
  }

  isAccessoryEquipped(buddyId: string, accessoryId: string): boolean {
    return this.inventory.equipped.get(buddyId) === accessoryId
  }

  getAccessoryConfig(accessoryId: string): AccessoryConfig | null {
    return this.accessoryConfigs.get(accessoryId) || null
  }

  getAllAccessories(): AccessoryConfig[] {
    return Array.from(this.accessoryConfigs.values())
  }

  getUnlockProgress(): { unlocked: number; total: number; percentage: number } {
    const total = this.accessoryConfigs.size
    const unlocked = this.inventory.unlocked.size
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0

    return { unlocked, total, percentage }
  }

  grantStarterAccessories(): void {
    const starterAccessories = Array.from(this.accessoryConfigs.values())
      .filter(accessory => accessory.rarity === 'common')
      .slice(0, 3)

    starterAccessories.forEach(accessory => {
      this.unlockAccessory(accessory.id)
    })
  }

  private async loadAccessoryConfigs(): Promise<void> {
    try {
      const response = await fetch('/public/assets/accessories/index.json')
      if (!response.ok) {
        throw new Error(`Failed to load accessory configs: ${response.statusText}`)
      }

      const configs: AccessoryConfig[] = await response.json()
      configs.forEach(config => {
        this.accessoryConfigs.set(config.id, config)
      })
    } catch (error) {
      console.error('Failed to load accessory configs:', error)
      this.createFallbackAccessoryConfigs()
    }
  }

  private createFallbackAccessoryConfigs(): void {
    const fallbackConfigs: AccessoryConfig[] = [
      {
        id: 'red-hat',
        name: 'Red Hat',
        category: AccessoryCategory.Hat,
        imagePath: '/public/assets/accessories/hats/red-hat.png',
        unlockMilestone: 'read_1_book',
        rarity: 'common'
      },
      {
        id: 'cool-glasses',
        name: 'Cool Glasses',
        category: AccessoryCategory.Glasses,
        imagePath: '/public/assets/accessories/glasses/cool-glasses.png',
        unlockMilestone: 'read_5_books',
        rarity: 'rare'
      }
    ]

    fallbackConfigs.forEach(config => {
      this.accessoryConfigs.set(config.id, config)
    })
  }

  private loadInventory(): void {
    try {
      const saved = localStorage.getItem('reading-buddies-accessory-inventory')
      if (saved) {
        const inventoryData = JSON.parse(saved)
        
        this.inventory.owned = new Set(inventoryData.owned || [])
        this.inventory.unlocked = new Set(inventoryData.unlocked || [])
        this.inventory.equipped = new Map(Object.entries(inventoryData.equipped || {}))
      }
    } catch (error) {
      console.error('Failed to load accessory inventory from storage:', error)
    }
  }

  private saveInventory(): void {
    try {
      const inventoryData = {
        owned: Array.from(this.inventory.owned),
        unlocked: Array.from(this.inventory.unlocked),
        equipped: Object.fromEntries(this.inventory.equipped)
      }
      
      localStorage.setItem('reading-buddies-accessory-inventory', JSON.stringify(inventoryData))
    } catch (error) {
      console.error('Failed to save accessory inventory to storage:', error)
    }
  }

  private notifyInventoryListeners(): void {
    this.inventoryListeners.forEach(listener => {
      try {
        listener(this.inventory)
      } catch (error) {
        console.error('Error in inventory listener:', error)
      }
    })
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