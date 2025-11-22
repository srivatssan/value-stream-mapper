import { useState } from 'react'
import MetadataEditor from './MetadataEditor'
import EditableTable from './EditableTable'
import './PhaseDetail.css'

function PhaseDetail({ phase, onUpdate }) {
  const [localPhase, setLocalPhase] = useState(phase)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(phase.name)

  const handleTitleChange = () => {
    if (titleInput.trim() && titleInput !== localPhase.name) {
      const updated = { ...localPhase, name: titleInput.trim() }
      setLocalPhase(updated)
      onUpdate(updated)
    } else {
      setTitleInput(localPhase.name)
    }
    setIsEditingTitle(false)
  }

  const handleMetadataChange = (updatedMetadata) => {
    const updated = { ...localPhase, metadata: updatedMetadata }
    setLocalPhase(updated)
    onUpdate(updated)
  }

  const handleInputsChange = (updatedInputs) => {
    const updated = { ...localPhase, inputs: updatedInputs }
    setLocalPhase(updated)
    onUpdate(updated)
  }

  const handleOutputsChange = (updatedOutputs) => {
    const updated = { ...localPhase, outputs: updatedOutputs }
    setLocalPhase(updated)
    onUpdate(updated)
  }

  const handleExitCriteriaChange = (updatedExitCriteria) => {
    const updated = { ...localPhase, exitCriteria: updatedExitCriteria }
    setLocalPhase(updated)
    onUpdate(updated)
  }

  const handleMetricsChange = (updatedMetrics) => {
    const updated = { ...localPhase, metrics: updatedMetrics }
    setLocalPhase(updated)
    onUpdate(updated)
  }

  return (
    <div className="phase-detail">
      <div className="phase-title-section">
        <div className="phase-number-badge">Phase {localPhase.id}</div>
        {isEditingTitle ? (
          <div className="title-edit-container">
            <input
              type="text"
              className="title-input"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTitleChange()}
              onBlur={handleTitleChange}
              autoFocus
            />
          </div>
        ) : (
          <h2 className="phase-title" onClick={() => setIsEditingTitle(true)}>
            {localPhase.name}
            <span className="edit-hint">Click to edit</span>
          </h2>
        )}
      </div>

      <MetadataEditor
        metadata={localPhase.metadata}
        onChange={handleMetadataChange}
      />

      <section className="phase-section">
        <h3>Inputs</h3>
        <EditableTable
          data={localPhase.inputs}
          columns={[
            { key: 'input', label: 'Input', type: 'text' },
            { key: 'producedBy', label: 'Produced By', type: 'text' }
          ]}
          onChange={handleInputsChange}
        />
      </section>

      <section className="phase-section">
        <h3>Outputs (Artifacts)</h3>
        <EditableTable
          data={localPhase.outputs}
          columns={[
            { key: 'output', label: 'Output', type: 'text' },
            { key: 'producedBy', label: 'Produced By', type: 'text' }
          ]}
          onChange={handleOutputsChange}
        />
      </section>

      <section className="phase-section">
        <h3>Exit Criteria</h3>
        <EditableTable
          data={localPhase.exitCriteria}
          columns={[
            { key: 'criteria', label: 'Criteria', type: 'text' },
            { key: 'approver', label: 'Approver', type: 'text' }
          ]}
          onChange={handleExitCriteriaChange}
        />
      </section>

      <section className="phase-section">
        <h3>Metrics</h3>
        <EditableTable
          data={localPhase.metrics}
          columns={[
            { key: 'metric', label: 'Metric', type: 'text' },
            { key: 'target', label: 'Target', type: 'text' }
          ]}
          onChange={handleMetricsChange}
        />
      </section>
    </div>
  )
}

export default PhaseDetail
