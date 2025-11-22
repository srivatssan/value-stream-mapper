import { useState } from 'react'
import MetadataEditor from './MetadataEditor'
import EditableTable from './EditableTable'
import './PhaseDetail.css'

function PhaseDetail({ phase, onUpdate }) {
  const [localPhase, setLocalPhase] = useState(phase)

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
      <h2 className="phase-title">
        Phase {localPhase.id}: {localPhase.name}
      </h2>

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
