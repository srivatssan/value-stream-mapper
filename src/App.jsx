import { useState } from 'react'
import './App.css'
import initialData from './value-stream-data.json'
import PhaseDetail from './components/PhaseDetail'
import ImportExport from './components/ImportExport'
import Visualization from './components/Visualization'
import Illustration from './components/Illustration'

function App() {
  const [valueStreamData, setValueStreamData] = useState(initialData.valueStream)
  const [activePhaseId, setActivePhaseId] = useState(1)
  const [currentView, setCurrentView] = useState('editor') // 'editor', 'visualization', or 'illustration'
  const [focusedPhaseId, setFocusedPhaseId] = useState(null)

  const handlePhaseUpdate = (phaseId, updatedPhase) => {
    setValueStreamData(prev => ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === phaseId ? updatedPhase : phase
      )
    }))
  }

  const handleImport = (importedData) => {
    setValueStreamData(importedData.valueStream)
    setActivePhaseId(1)
    // Switch to visualization view after import
    setCurrentView('visualization')
  }

  const handlePhaseClick = (phaseId) => {
    setFocusedPhaseId(phaseId)
    setCurrentView('visualization')
  }

  const activePhase = valueStreamData.phases.find(p => p.id === activePhaseId)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>{valueStreamData.name}</h1>
          <p className="description">{valueStreamData.description}</p>
        </div>
        <div className="header-right">
          <div className="view-switcher">
            <button
              className={`view-btn ${currentView === 'editor' ? 'active' : ''}`}
              onClick={() => setCurrentView('editor')}
            >
              Editor
            </button>
            <button
              className={`view-btn ${currentView === 'visualization' ? 'active' : ''}`}
              onClick={() => setCurrentView('visualization')}
            >
              Visualize
            </button>
            <button
              className={`view-btn ${currentView === 'illustration' ? 'active' : ''}`}
              onClick={() => setCurrentView('illustration')}
            >
              Illustrate
            </button>
          </div>
          <ImportExport
            data={{ valueStream: valueStreamData }}
            onImport={handleImport}
          />
          <div className="logo-container">
            <img src={`${import.meta.env.BASE_URL}srignosis-logo.svg`} alt="SriGnosis Logo" />
          </div>
        </div>
      </header>

      {currentView === 'editor' ? (
        <>
          <div className="tabs-container">
            <div className="tabs">
              {valueStreamData.phases.map(phase => (
                <button
                  key={phase.id}
                  className={`tab ${activePhaseId === phase.id ? 'active' : ''}`}
                  onClick={() => setActivePhaseId(phase.id)}
                >
                  <span className="phase-number">Phase {phase.id}</span>
                  <span className="phase-name">{phase.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="content">
            {activePhase && (
              <PhaseDetail
                phase={activePhase}
                onUpdate={(updatedPhase) => handlePhaseUpdate(activePhaseId, updatedPhase)}
              />
            )}
          </div>
        </>
      ) : currentView === 'visualization' ? (
        <Visualization
          data={valueStreamData}
          initialFocusedPhaseId={focusedPhaseId}
          onClearFocus={() => setFocusedPhaseId(null)}
        />
      ) : (
        <Illustration
          data={valueStreamData}
          onPhaseClick={handlePhaseClick}
        />
      )}
    </div>
  )
}

export default App
