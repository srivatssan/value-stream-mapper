import { useState, useEffect } from 'react'
import './Visualization.css'

function Visualization({ data, initialFocusedPhaseId, onClearFocus }) {
  const [selectedPhase, setSelectedPhase] = useState(null)
  const [focusedPhaseId, setFocusedPhaseId] = useState(initialFocusedPhaseId || null)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)

  // Update focused phase when initialFocusedPhaseId changes
  useEffect(() => {
    if (initialFocusedPhaseId) {
      setFocusedPhaseId(initialFocusedPhaseId)
      const phase = data.phases.find(p => p.id === initialFocusedPhaseId)
      if (phase) {
        setSelectedPhase(phase)
        setDetailPanelOpen(true)
      }
    }
  }, [initialFocusedPhaseId, data.phases])

  const handlePhaseClick = (phase) => {
    // Toggle focus: if clicking the same phase, unfocus it
    if (focusedPhaseId === phase.id) {
      setFocusedPhaseId(null)
    } else {
      setFocusedPhaseId(phase.id)
    }

    // Always open detail panel with phase info
    setSelectedPhase(phase)
    setDetailPanelOpen(true)
  }

  const closeDetailPanel = () => {
    setDetailPanelOpen(false)
  }

  const clearFocus = () => {
    setFocusedPhaseId(null)
    setDetailPanelOpen(false)
    if (onClearFocus) {
      onClearFocus()
    }
  }

  // Calculate total duration in weeks
  const totalWeeks = 12

  // Swim lanes configuration
  const swimLanes = [
    { name: 'Operating Officer', role: 'Strategic Oversight', phases: [1, 3, 8] },
    { name: 'Product Owner', role: 'Requirements & Value', phases: [1, 5, 8] },
    { name: 'PMO / TPM', role: 'Program Management', phases: [2, 5, 8] },
    { name: 'Architecture Team', role: 'Technical Design', phases: [3, 5] },
    { name: 'Development Team', role: 'Implementation', phases: [4, 5, 7] },
    { name: 'Rollout / Ops Team', role: 'Deployment & Operations', phases: [6, 7] },
    { name: 'Customer / Users', role: 'Feedback & Adoption', phases: [1, 5, 8] }
  ]

  const getPhaseById = (id) => {
    return data.phases.find(p => p.id === id)
  }

  return (
    <div className="visualization">
      {focusedPhaseId && (
        <div className="focus-banner">
          <span>Focused on Phase {focusedPhaseId}: {data.phases.find(p => p.id === focusedPhaseId)?.name}</span>
          <button onClick={clearFocus} className="clear-focus-btn">Clear Focus ✕</button>
        </div>
      )}

      <div className="metrics-summary">
        <div className="metric-card">
          <h3>Total Lead Time Target</h3>
          <div className="value">8-12 <span style={{fontSize: '0.5em'}}>weeks</span></div>
        </div>
        <div className="metric-card green">
          <h3>Process Efficiency Target</h3>
          <div className="value">60-70<span style={{fontSize: '0.5em'}}>%</span></div>
        </div>
        <div className="metric-card orange">
          <h3>Total Phases</h3>
          <div className="value">{data.phases.length}</div>
        </div>
        <div className="metric-card red">
          <h3>Stakeholder Groups</h3>
          <div className="value">{swimLanes.length}</div>
        </div>
      </div>

      <div className="timeline-bar">
        <h3>Project Timeline (8-12 weeks total)</h3>
        <div className="timeline-visual">
          {data.phases.map((phase, index) => {
            const colors = ['#047857', '#059669', '#0d9488', '#10b981', '#14b8a6', '#34d399', '#6ee7b7', '#a7f3d0']
            return (
              <div
                key={phase.id}
                className="timeline-segment"
                style={{
                  flex: index === 4 ? 6 : 1.5,
                  background: colors[index]
                }}
                title={`Phase ${phase.id}: ${phase.name}`}
                onClick={() => handlePhaseClick(phase)}
              >
                P{phase.id}
              </div>
            )
          })}
        </div>
      </div>

      <div className="value-stream-container">
        <div className="swim-lanes">
          {swimLanes.map((lane, laneIndex) => (
            <div key={laneIndex} className="swim-lane">
              <div className="lane-header">
                <h3>{lane.name}</h3>
                <span className="role">{lane.role}</span>
              </div>
              <div className="lane-content">
                {lane.phases.map((phaseId, idx) => {
                  const phase = getPhaseById(phaseId)
                  if (!phase) return null

                  // Highlight this phase if it matches the focused phase ID
                  const isFocused = focusedPhaseId === phase.id

                  return (
                    <div key={phaseId} style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                      {idx > 0 && <span className="arrow">→</span>}
                      <div
                        className={`process-box ${isFocused ? 'active' : ''}`}
                        onClick={() => handlePhaseClick(phase)}
                      >
                        <div className="phase-number">{phase.id}</div>
                        <div className="phase-title">{phase.name}</div>
                        <div className="duration">{phase.metadata.duration}</div>
                        <div className="activities">
                          <ul>
                            {phase.outputs.slice(0, 3).map((output, i) => (
                              <li key={i}>{output.output.substring(0, 40)}{output.output.length > 40 ? '...' : ''}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="metric-badge">{phase.metadata.valueAddTime} Value-Add</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="legend">
        <h3>Interactive Guide</h3>
        <p className="legend-description">Click on any phase box to focus and see details. All instances of that phase will highlight across swim lanes.</p>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-box" style={{background: '#0f172a', border: '2px solid #10b981'}}></div>
            <span>Clickable Phase</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{background: '#10b981'}}></div>
            <span>Focused Phase (Your Selection)</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7'}}></div>
            <span>Duration Indicator</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{background: '#fef3c7', border: '1px solid #92400e'}}></div>
            <span>Value-Add Metric</span>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div className={`detail-panel ${detailPanelOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={closeDetailPanel}>Close ✕</button>
        {selectedPhase && (
          <div className="detail-content">
            <h2>Phase {selectedPhase.id}: {selectedPhase.name}</h2>

            <div className="stakeholder-tags">
              <strong>Key Stakeholders:</strong><br/>
              {selectedPhase.metadata.keyStakeholders.map((s, i) => (
                <span key={i} className="stakeholder-tag">{s}</span>
              ))}
            </div>

            <div className="metadata-box">
              <strong>Owner:</strong> {selectedPhase.metadata.phaseOwner}<br/>
              <strong>Duration:</strong> {selectedPhase.metadata.duration}<br/>
              <strong>Value-Add Time:</strong> {selectedPhase.metadata.valueAddTime}
            </div>

            <div className="detail-section">
              <h4>📥 Inputs</h4>
              <ul className="detail-list">
                {selectedPhase.inputs.map((input, i) => (
                  <li key={i}>{input.input}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4>📤 Outputs (Artifacts)</h4>
              <ul className="detail-list">
                {selectedPhase.outputs.map((output, i) => (
                  <li key={i}>{output.output}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4>✅ Exit Criteria</h4>
              <ul className="detail-list">
                {selectedPhase.exitCriteria.map((criteria, i) => (
                  <li key={i}>{criteria.criteria}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4>📊 Key Metrics</h4>
              <div className="metrics-grid">
                {selectedPhase.metrics.map((metric, i) => (
                  <div key={i} className="metric-item">
                    <strong>{metric.metric}</strong>
                    <span>{metric.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Visualization
