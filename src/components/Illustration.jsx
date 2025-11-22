import { useState } from 'react'
import './Illustration.css'

function Illustration({ data, onPhaseClick }) {
  const [hoveredPhaseId, setHoveredPhaseId] = useState(null)
  const [selectedIOType, setSelectedIOType] = useState('both') // 'inputs', 'outputs', 'both'

  return (
    <div className="illustration">
      <div className="illustration-header">
        <div>
          <h2>Value Stream Flow</h2>
          <p className="illustration-description">
            Follow the left-to-right flow of value creation. Click any phase to see details in the Visualize view.
          </p>
        </div>
        <div className="io-toggle">
          <button
            className={`toggle-btn ${selectedIOType === 'inputs' ? 'active' : ''}`}
            onClick={() => setSelectedIOType('inputs')}
          >
            Show Inputs
          </button>
          <button
            className={`toggle-btn ${selectedIOType === 'both' ? 'active' : ''}`}
            onClick={() => setSelectedIOType('both')}
          >
            Show All
          </button>
          <button
            className={`toggle-btn ${selectedIOType === 'outputs' ? 'active' : ''}`}
            onClick={() => setSelectedIOType('outputs')}
          >
            Show Outputs
          </button>
        </div>
      </div>

      <div className="flow-container">
        <div className="flow-scroll">
          <div className="flow-timeline">
            {data.phases.map((phase, index) => (
              <div key={phase.id} className="flow-phase-wrapper">
                {/* Inputs Section */}
                {(selectedIOType === 'inputs' || selectedIOType === 'both') && (
                  <div className="io-section inputs-section">
                    <div className="io-header">
                      <span className="io-icon">📥</span>
                      <span className="io-title">Inputs ({phase.inputs.length})</span>
                    </div>
                    <div className="io-items">
                      {phase.inputs.slice(0, 3).map((input, i) => (
                        <div key={i} className="io-item input-item">
                          <div className="io-connector"></div>
                          <div className="io-content">
                            {input.input}
                          </div>
                          {input.producedBy && (
                            <div className="io-source">from: {input.producedBy}</div>
                          )}
                        </div>
                      ))}
                      {phase.inputs.length > 3 && (
                        <div className="io-item io-more">
                          +{phase.inputs.length - 3} more inputs
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phase Box */}
                <div
                  className={`flow-phase-box ${hoveredPhaseId === phase.id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredPhaseId(phase.id)}
                  onMouseLeave={() => setHoveredPhaseId(null)}
                  onClick={() => onPhaseClick(phase.id)}
                >
                  <div className="phase-badge">Phase {phase.id}</div>
                  <h3 className="flow-phase-title">{phase.name}</h3>

                  <div className="phase-meta">
                    <div className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      <span>{phase.metadata.duration}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">👤</span>
                      <span>{phase.metadata.phaseOwner}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📊</span>
                      <span>{phase.metadata.valueAddTime} Value</span>
                    </div>
                  </div>

                  <div className="phase-stats">
                    <div className="stat">
                      <div className="stat-value">{phase.inputs.length}</div>
                      <div className="stat-label">Inputs</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">{phase.outputs.length}</div>
                      <div className="stat-label">Outputs</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">{phase.exitCriteria.length}</div>
                      <div className="stat-label">Criteria</div>
                    </div>
                  </div>

                  <div className="click-hint">Click for details →</div>
                </div>

                {/* Outputs Section */}
                {(selectedIOType === 'outputs' || selectedIOType === 'both') && (
                  <div className="io-section outputs-section">
                    <div className="io-header">
                      <span className="io-icon">📤</span>
                      <span className="io-title">Outputs ({phase.outputs.length})</span>
                    </div>
                    <div className="io-items">
                      {phase.outputs.slice(0, 3).map((output, i) => (
                        <div key={i} className="io-item output-item">
                          <div className="io-connector"></div>
                          <div className="io-content">
                            {output.output}
                          </div>
                          {output.producedBy && (
                            <div className="io-source">by: {output.producedBy}</div>
                          )}
                        </div>
                      ))}
                      {phase.outputs.length > 3 && (
                        <div className="io-item io-more">
                          +{phase.outputs.length - 3} more outputs
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Arrow between phases */}
                {index < data.phases.length - 1 && (
                  <div className="flow-arrow">
                    <div className="arrow-line"></div>
                    <div className="arrow-head">▶</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flow-legend">
        <h3>Flow Guide</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon">📥</span>
            <span>Inputs flow into each phase</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">📤</span>
            <span>Outputs are produced by each phase</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">▶</span>
            <span>Value flows left to right</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">👆</span>
            <span>Click any phase to explore details</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Illustration
