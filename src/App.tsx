import React, { Suspense, useState } from 'react'
import { RiveProvider } from '@/rive/RiveContext'
import { useBuddy } from '@/hooks/useBuddy'
import { useEggProgress } from '@/hooks/useEggProgress'
import { Gesture } from '@/rive/types'
import './App.css'

// Lazy load the BuddyCanvas for better performance
const BuddyCanvas = React.lazy(() => import('@/components/BuddyCanvas'))
const RiveDemo = React.lazy(() => import('@/components/RiveDemo'))

function BuddyDemo() {
  const { 
    buddyConfig, 
    isLoading, 
    error, 
    loadBuddy, 
    triggerGesture 
  } = useBuddy()

  const { 
    buddyProgress, 
    progressPercentage, 
    isReadyToHatch, 
    updateProgress, 
    createEgg, 
    hatchEgg 
  } = useEggProgress({ buddyId: 'kitten-ninja' })

  const handleLoadBuddy = async () => {
    try {
      await loadBuddy('kitten-ninja')
    } catch (err) {
      console.error('Failed to load buddy:', err)
    }
  }

  const handleCreateEgg = () => {
    createEgg('kitten-ninja', 'read_3_days', 100)
  }

  const handleAddProgress = () => {
    updateProgress('kitten-ninja', 10)
  }

  const handleHatchEgg = () => {
    if (isReadyToHatch) {
      hatchEgg('kitten-ninja')
      handleLoadBuddy()
    }
  }

  return (
    <div className="buddy-demo">
      <div className="buddy-container">
        <h2>Buddy Canvas</h2>
        {buddyConfig ? (
          <Suspense fallback={<div>Loading buddy animation...</div>}>
            <BuddyCanvas
              src={buddyConfig.rivFilePath}
              artboard={buddyConfig.artboardName}
              stateMachines={[buddyConfig.stateMachineName]}
              className="buddy-display"
              width={300}
              height={300}
              onGestureTriggered={(gesture) => console.log('Gesture triggered:', gesture)}
              shouldReduceMotion={window.matchMedia('(prefers-reduced-motion: reduce)').matches}
            />
          </Suspense>
        ) : (
          <div className="buddy-placeholder">
            <p>No buddy loaded</p>
            {error && <p className="error">Error: {error}</p>}
          </div>
        )}
      </div>

      <div className="controls">
        <h3>Buddy Controls</h3>
        <div className="button-group">
          <button onClick={handleLoadBuddy} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load Buddy'}
          </button>
          <button onClick={() => triggerGesture(Gesture.Wave)} disabled={!buddyConfig}>
            Wave
          </button>
          <button onClick={() => triggerGesture(Gesture.Jump)} disabled={!buddyConfig}>
            Jump
          </button>
          <button onClick={() => triggerGesture(Gesture.Cheer)} disabled={!buddyConfig}>
            Cheer
          </button>
        </div>

        <h3>Egg Progress</h3>
        <div className="egg-controls">
          {buddyProgress ? (
            <div className="progress-display">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p>{progressPercentage}% Complete</p>
              <p>Milestone: {buddyProgress.milestone}</p>
              <button onClick={handleAddProgress}>Add Progress (+10)</button>
              {isReadyToHatch && (
                <button onClick={handleHatchEgg} className="hatch-button">
                  🥚 Hatch Buddy!
                </button>
              )}
            </div>
          ) : (
            <div>
              <p>No egg progress found</p>
              <button onClick={handleCreateEgg}>Create Egg</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<'demo' | 'rive'>('demo')

  return (
    <RiveProvider>
      <div className="App">
        <header className="App-header">
          <h1>Reading Buddies</h1>
          <p>Rive-Powered Buddy System</p>
        </header>
        
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '2px solid #e0e0e0',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setActiveTab('demo')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'demo' ? '#007bff' : 'transparent',
              color: activeTab === 'demo' ? 'white' : '#333',
              border: 'none',
              borderBottom: activeTab === 'demo' ? '3px solid #0056b3' : 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === 'demo' ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            Buddy System Demo
          </button>
          <button
            onClick={() => setActiveTab('rive')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'rive' ? '#007bff' : 'transparent',
              color: activeTab === 'rive' ? 'white' : '#333',
              border: 'none',
              borderBottom: activeTab === 'rive' ? '3px solid #0056b3' : 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === 'rive' ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            Rive Animation Test
          </button>
        </div>

        <main>
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>}>
            {activeTab === 'demo' ? <BuddyDemo /> : <RiveDemo />}
          </Suspense>
        </main>
      </div>
    </RiveProvider>
  )
}

export default App