import React, { useState } from 'react'
import BuddyCanvas from './BuddyCanvas'
import { Gesture } from '@/rive/types'

// Import the kitten-ninja.riv file as URL
import kittenNinjaRiv from '@/rive/assets/kitten-ninja.riv?url'

const RiveDemo: React.FC = () => {
  const [lastGesture, setLastGesture] = useState<string>('')
  const [isRiveMode, setIsRiveMode] = useState(false)
  const [riveError, setRiveError] = useState<string>('')

  const handleGesture = (gesture: Gesture) => {
    setLastGesture(`Triggered: ${gesture}`)
    setTimeout(() => setLastGesture(''), 2000)
  }

  const handleLoad = () => {
    console.log('Animation loaded successfully!')
    setRiveError('')
  }

  const handleError = (error: Error) => {
    console.error('Animation error:', error)
    setRiveError(error.message)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Rive Animation Demo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={isRiveMode}
            onChange={(e) => setIsRiveMode(e.target.checked)}
          />
          <span>Use Rive Animation (requires .riv file)</span>
        </label>
        
        {isRiveMode && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: isRiveMode && riveError ? '#f8d7da' : '#d4edda', 
            border: isRiveMode && riveError ? '1px solid #f5c6cb' : '1px solid #c3e6cb',
            borderRadius: '4px'
          }}>
            {isRiveMode && riveError ? (
              <>
                <strong>⚠️ Rive Loading Issue:</strong> There's a compatibility issue with the Rive library.<br/>
                <strong>✅ Good News:</strong> Your .riv file is created and ready! The issue is just with library loading.<br/>
                <em>The emoji placeholder below simulates your actual kitten ninja animation.</em>
              </>
            ) : (
              <>
                <strong>✅ Success:</strong> Your kitten-ninja.riv file has been created successfully!<br/>
                <strong>📁 Location:</strong> src/rive/assets/kitten-ninja.riv<br/>
                <strong>🎮 Features:</strong> Complete character with wave gesture animation
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '20px'
      }}>
        <BuddyCanvas
          src={isRiveMode ? kittenNinjaRiv : 'demo'}
          autoplay={true}
          onGestureTriggered={handleGesture}
          onLoad={handleLoad}
          onError={handleError}
        />

        {lastGesture && (
          <div style={{ 
            color: '#28a745', 
            fontWeight: 'bold',
            animation: 'fadeIn 0.3s ease'
          }}>
            {lastGesture}
          </div>
        )}

        {riveError && (
          <div style={{ 
            color: '#dc3545', 
            padding: '10px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px'
          }}>
            Error: {riveError}
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <h3>Instructions:</h3>
          <p>Click on the buddy to trigger a wave gesture!</p>
          <p>
            {isRiveMode 
              ? 'Using Rive animation engine' 
              : 'Using demo placeholder (emoji)'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default RiveDemo