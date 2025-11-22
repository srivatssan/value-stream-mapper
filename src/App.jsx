import { useState, useRef, useEffect } from 'react'
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
  const [showScrollLeft, setShowScrollLeft] = useState(false)
  const [showScrollRight, setShowScrollRight] = useState(false)
  const tabsRef = useRef(null)

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

  const handleAddPhase = () => {
    const newId = Math.max(...valueStreamData.phases.map(p => p.id)) + 1
    const newPhase = {
      id: newId,
      name: `New Phase ${newId}`,
      metadata: {
        description: "Description of this phase...",
        phaseOwner: "Owner",
        duration: "1-2 weeks",
        valueAddTime: "50%",
        keyStakeholders: [],
        firstActor: "",
        nextActor: ""
      },
      inputs: [],
      outputs: [],
      exitCriteria: [],
      metrics: []
    }
    setValueStreamData(prev => ({
      ...prev,
      phases: [...prev.phases, newPhase]
    }))
    setActivePhaseId(newId)
  }

  const handleDeletePhase = (phaseId) => {
    if (valueStreamData.phases.length === 1) {
      alert("Cannot delete the last phase. At least one phase is required.")
      return
    }

    if (confirm(`Are you sure you want to delete Phase ${phaseId}?`)) {
      setValueStreamData(prev => ({
        ...prev,
        phases: prev.phases.filter(p => p.id !== phaseId)
      }))

      // Set active phase to first remaining phase if current is deleted
      if (activePhaseId === phaseId) {
        const remainingPhases = valueStreamData.phases.filter(p => p.id !== phaseId)
        setActivePhaseId(remainingPhases[0].id)
      }
    }
  }

  const checkScrollButtons = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
      setShowScrollLeft(scrollLeft > 0)
      setShowScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 300
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const handleResize = () => checkScrollButtons()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [valueStreamData.phases])

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
            {showScrollLeft && (
              <button className="scroll-arrow left" onClick={() => scrollTabs('left')}>
                ◀
              </button>
            )}
            <div className="tabs" ref={tabsRef} onScroll={checkScrollButtons}>
              {valueStreamData.phases.map((phase, index) => (
                <button
                  key={phase.id}
                  className={`tab ${activePhaseId === phase.id ? 'active' : ''}`}
                  onClick={() => setActivePhaseId(phase.id)}
                >
                  <span className="phase-number">{index + 1}</span>
                  <span className="phase-name">{phase.name}</span>
                </button>
              ))}
              <button className="tab add-phase-tab" onClick={handleAddPhase}>
                <span className="add-icon">+</span>
                <span className="add-label">Add Phase</span>
              </button>
            </div>
            {showScrollRight && (
              <button className="scroll-arrow right" onClick={() => scrollTabs('right')}>
                ▶
              </button>
            )}
          </div>

          <div className="content">
            {activePhase && (
              <>
                <div className="phase-actions">
                  <button
                    className="delete-phase-btn"
                    onClick={() => handleDeletePhase(activePhaseId)}
                    disabled={valueStreamData.phases.length === 1}
                  >
                    Delete This Phase
                  </button>
                </div>
                <PhaseDetail
                  phase={activePhase}
                  onUpdate={(updatedPhase) => handlePhaseUpdate(activePhaseId, updatedPhase)}
                />
              </>
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
