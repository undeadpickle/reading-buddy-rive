import React, { useState, useCallback } from 'react'
import RiveBuddy from './RiveBuddy'
import { CharacterType, AssetLoadEvent } from '@/rive/types'

const MultiCharacterDemo: React.FC = () => {
  const [currentCharacter, setCurrentCharacter] = useState<CharacterType>(CharacterType.KittenNinja)
  const [assetEvents, setAssetEvents] = useState<AssetLoadEvent[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCharacterChange = (character: CharacterType) => {
    setCurrentCharacter(character)
    setIsLoaded(false)
    setError(null)
    setAssetEvents([]) // Clear previous asset events
  }

  const handleAssetLoad = useCallback((event: AssetLoadEvent) => {
    setAssetEvents(prev => [...prev, event])
  }, [])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    console.log('Multi-artboard character loaded:', currentCharacter)
  }, [currentCharacter])

  const handleError = useCallback((error: Error) => {
    setError(error.message)
    console.error('Multi-artboard load error:', error)
  }, [])

  const getCharacterDisplayName = (characterType: CharacterType): string => {
    const names = {
      [CharacterType.KittenNinja]: 'Kitten Ninja',
      [CharacterType.PuppyWizard]: 'Puppy Wizard', 
      [CharacterType.BearKnight]: 'Bear Knight',
      [CharacterType.DragonMage]: 'Dragon Mage'
    }
    return names[characterType]
  }

  const assetStats = {
    total: assetEvents.length,
    successful: assetEvents.filter(e => e.success).length,
    failed: assetEvents.filter(e => !e.success).length
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🎭 Multi-Character Artboard Demo</h2>
      <p>
        <strong>Architecture:</strong> Single humanoid-buddies.riv file with multiple artboards + Asset Handler API
      </p>
      
      {/* Character Selection */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Character:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.values(CharacterType).map((character) => (
            <button
              key={character}
              onClick={() => handleCharacterChange(character)}
              style={{
                padding: '8px 16px',
                backgroundColor: currentCharacter === character ? '#007bff' : '#f8f9fa',
                color: currentCharacter === character ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {getCharacterDisplayName(character)}
            </button>
          ))}
        </div>
      </div>

      {/* Status Display */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ 
          padding: '10px', 
          backgroundColor: isLoaded ? '#d4edda' : '#fff3cd', 
          border: `1px solid ${isLoaded ? '#c3e6cb' : '#ffeaa7'}`,
          borderRadius: '4px'
        }}>
          <strong>Status:</strong> {isLoaded ? 'Loaded ✅' : 'Loading...'} 
        </div>
        
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#e2e3e5', 
          border: '1px solid #d6d8db',
          borderRadius: '4px'
        }}>
          <strong>Character:</strong> {getCharacterDisplayName(currentCharacter)}
        </div>

        <div style={{ 
          padding: '10px', 
          backgroundColor: '#cce5ff', 
          border: '1px solid #b3d7ff',
          borderRadius: '4px'
        }}>
          <strong>Assets:</strong> {assetStats.successful}/{assetStats.total} loaded
          {assetStats.failed > 0 && ` (${assetStats.failed} failed)`}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Character Display */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '20px',
        minHeight: '300px',
        alignItems: 'center'
      }}>
        <RiveBuddy
          src="/src/rive/assets/humanoid-buddies.riv" 
          artboard={currentCharacter}
          characterType={currentCharacter}
          width={300}
          height={300}
          onLoad={handleLoad}
          onError={handleError}
          onAssetLoad={handleAssetLoad}
          className="multi-character-buddy"
        />
      </div>

      {/* Asset Load Events */}
      {assetEvents.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Asset Load Events ({assetEvents.length}):</h3>
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f8f9fa'
          }}>
            {assetEvents.map((event, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '8px 12px',
                  borderBottom: index < assetEvents.length - 1 ? '1px solid #e9ecef' : 'none',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              >
                <span style={{ 
                  color: event.success ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {event.success ? '✅' : '❌'}
                </span>
                {' '}
                <strong>{event.assetName}</strong>
                {' '}
                <span style={{ color: '#6c757d' }}>
                  ({event.assetType}) - {event.characterType}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Benefits */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e7f5ff', borderRadius: '4px' }}>
        <h3>🚀 Performance Benefits</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>File Size:</strong> Single 400KB file vs 4×300KB+ separate files (70% reduction)</li>
          <li><strong>Character Switching:</strong> Instant artboard switching (no network requests)</li>
          <li><strong>Memory Efficiency:</strong> Shared bone structure and animations</li>
          <li><strong>Asset Handler:</strong> Dynamic texture loading per character</li>
        </ul>
      </div>
    </div>
  )
}

export default MultiCharacterDemo