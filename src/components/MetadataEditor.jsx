import { useState, useEffect } from 'react'
import './MetadataEditor.css'

function MetadataEditor({ metadata, onChange }) {
  const [localMetadata, setLocalMetadata] = useState(metadata)
  const [isEditingStakeholders, setIsEditingStakeholders] = useState(false)
  const [stakeholderInput, setStakeholderInput] = useState('')

  // Update local state when metadata prop changes (switching phases)
  useEffect(() => {
    setLocalMetadata(metadata)
    setIsEditingStakeholders(false)
    setStakeholderInput('')
  }, [metadata])

  const handleChange = (field, value) => {
    const updated = { ...localMetadata, [field]: value }
    setLocalMetadata(updated)
    onChange(updated)
  }

  const handleStakeholderAdd = () => {
    if (stakeholderInput.trim()) {
      const updated = {
        ...localMetadata,
        keyStakeholders: [...localMetadata.keyStakeholders, stakeholderInput.trim()]
      }
      setLocalMetadata(updated)
      onChange(updated)
      setStakeholderInput('')
    }
  }

  const handleStakeholderRemove = (index) => {
    const updated = {
      ...localMetadata,
      keyStakeholders: localMetadata.keyStakeholders.filter((_, i) => i !== index)
    }
    setLocalMetadata(updated)
    onChange(updated)
  }

  return (
    <div className="metadata-editor">
      <h3>Phase Information</h3>
      <div className="metadata-grid">
        <div className="metadata-field full-width">
          <label>Phase Description</label>
          <textarea
            value={localMetadata.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe what this phase is about..."
            rows={3}
          />
        </div>

        <div className="metadata-field">
          <label>Phase Owner</label>
          <input
            type="text"
            value={localMetadata.phaseOwner}
            onChange={(e) => handleChange('phaseOwner', e.target.value)}
          />
        </div>

        <div className="metadata-field">
          <label>Duration</label>
          <input
            type="text"
            value={localMetadata.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
          />
        </div>

        <div className="metadata-field">
          <label>Value-Add Time</label>
          <input
            type="text"
            value={localMetadata.valueAddTime}
            onChange={(e) => handleChange('valueAddTime', e.target.value)}
          />
        </div>

        <div className="metadata-field">
          <label>First Actor</label>
          <input
            type="text"
            value={localMetadata.firstActor}
            onChange={(e) => handleChange('firstActor', e.target.value)}
          />
        </div>

        <div className="metadata-field full-width">
          <label>Next Actor in Stream</label>
          <input
            type="text"
            value={localMetadata.nextActor}
            onChange={(e) => handleChange('nextActor', e.target.value)}
          />
        </div>

        <div className="metadata-field full-width">
          <label>Key Stakeholders</label>
          <div className="stakeholders-container">
            <div className="stakeholders-list">
              {localMetadata.keyStakeholders.map((stakeholder, index) => (
                <span key={index} className="stakeholder-tag">
                  {stakeholder}
                  <button
                    className="remove-btn"
                    onClick={() => handleStakeholderRemove(index)}
                    aria-label="Remove stakeholder"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {isEditingStakeholders ? (
              <div className="add-stakeholder">
                <input
                  type="text"
                  value={stakeholderInput}
                  onChange={(e) => setStakeholderInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStakeholderAdd()}
                  placeholder="Enter stakeholder name"
                  autoFocus
                />
                <button onClick={handleStakeholderAdd}>Add</button>
                <button onClick={() => {
                  setIsEditingStakeholders(false)
                  setStakeholderInput('')
                }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="add-btn"
                onClick={() => setIsEditingStakeholders(true)}
              >
                + Add Stakeholder
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetadataEditor
