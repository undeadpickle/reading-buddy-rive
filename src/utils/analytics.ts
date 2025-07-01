import { AnalyticsEvent } from '@/rive/types'

export interface AnalyticsConfig {
  enabled: boolean
  batchSize: number
  flushInterval: number
  endpoint?: string
  debug: boolean
}

class AnalyticsManager {
  private config: AnalyticsConfig = {
    enabled: true,
    batchSize: 10,
    flushInterval: 30000, // 30 seconds
    debug: import.meta.env?.DEV ?? false
  }
  
  private eventQueue: AnalyticsEvent[] = []
  private flushTimer: ReturnType<typeof setTimeout> | null = null
  private userId: string | null = null

  constructor() {
    this.loadConfig()
    this.setupEventListeners()
    this.startFlushTimer()
    
    // Flush queue on page unload
    window.addEventListener('beforeunload', () => {
      this.flush()
    })
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  track(type: string, payload: Record<string, unknown>): void {
    if (!this.config.enabled) return

    const event: AnalyticsEvent = {
      type: type as AnalyticsEvent['type'],
      payload: {
        ...payload,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: this.getSessionId()
      },
      timestamp: Date.now(),
      userId: this.userId || undefined
    }

    this.eventQueue.push(event)

    if (this.config.debug) {
      console.log('Analytics Event:', event)
    }

    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush()
    }
  }

  flush(): void {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    if (this.config.endpoint) {
      this.sendEvents(events)
    } else {
      this.storageBackup(events)
    }

    if (this.config.debug) {
      console.log(`Flushed ${events.length} analytics events`)
    }
  }

  setConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.saveConfig()
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.startFlushTimer()
    }
  }

  getConfig(): AnalyticsConfig {
    return { ...this.config }
  }

  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.endpoint) return

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          metadata: {
            appVersion: '1.0.0',
            platform: 'web',
            timestamp: Date.now()
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Analytics request failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to send analytics events:', error)
      this.storageBackup(events)
    }
  }

  private storageBackup(events: AnalyticsEvent[]): void {
    try {
      const existing = localStorage.getItem('reading-buddies-analytics-backup')
      const backupEvents = existing ? JSON.parse(existing) : []
      
      backupEvents.push(...events)
      
      // Keep only last 100 events to prevent storage overflow
      const recentEvents = backupEvents.slice(-100)
      
      localStorage.setItem('reading-buddies-analytics-backup', JSON.stringify(recentEvents))
    } catch (error) {
      console.error('Failed to backup analytics events:', error)
    }
  }

  private setupEventListeners(): void {
    // Listen for buddy analytics events
    window.addEventListener('buddy-analytics', (event: Event) => {
      const customEvent = event as CustomEvent
      const { type, payload } = customEvent.detail
      this.track(type, payload)
    })

    // Listen for egg analytics events
    window.addEventListener('egg-ready-to-hatch', (event: Event) => {
      const customEvent = event as CustomEvent
      this.track('egg_ready_to_hatch', {
        buddyId: customEvent.detail.buddyId
      })
    })
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('reading-buddies-session-id')
    
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
      sessionStorage.setItem('reading-buddies-session-id', sessionId)
    }
    
    return sessionId
  }

  private loadConfig(): void {
    try {
      const saved = localStorage.getItem('reading-buddies-analytics-config')
      if (saved) {
        const savedConfig = JSON.parse(saved)
        this.config = { ...this.config, ...savedConfig }
      }
    } catch (error) {
      console.error('Failed to load analytics config:', error)
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('reading-buddies-analytics-config', JSON.stringify(this.config))
    } catch (error) {
      console.error('Failed to save analytics config:', error)
    }
  }
}

export const analytics = new AnalyticsManager()

// Convenience functions
export const trackBuddyHatched = (buddyId: string) => {
  analytics.track('buddy_hatched', { buddyId })
}

export const trackGestureTriggered = (buddyId: string, gesture: string) => {
  analytics.track('gesture_triggered', { buddyId, gesture })
}

export const trackAccessoryEquipped = (buddyId: string, accessoryId: string) => {
  analytics.track('accessory_equipped', { buddyId, accessoryId })
}

export const trackReadingMilestone = (milestone: string, progress?: number) => {
  analytics.track('reading_milestone_met', { milestone, progress })
}

export const trackBuddyInteraction = (buddyId: string) => {
  analytics.track('buddy_interaction_tick', { buddyId, count: 1 })
}