import { useState, useEffect } from 'react'
import './EditableTable.css'

function EditableTable({ data, columns, onChange }) {
  const [localData, setLocalData] = useState(data)
  const [editingCell, setEditingCell] = useState(null)

  // Update local state when data prop changes (switching phases)
  useEffect(() => {
    setLocalData(data)
    setEditingCell(null)
  }, [data])

  const handleCellChange = (rowIndex, columnKey, value) => {
    const updated = localData.map((row, idx) =>
      idx === rowIndex ? { ...row, [columnKey]: value } : row
    )
    setLocalData(updated)
    onChange(updated)
  }

  const handleAddRow = () => {
    const newRow = {}
    columns.forEach(col => {
      newRow[col.key] = ''
    })
    const updated = [...localData, newRow]
    setLocalData(updated)
    onChange(updated)
  }

  const handleDeleteRow = (rowIndex) => {
    const updated = localData.filter((_, idx) => idx !== rowIndex)
    setLocalData(updated)
    onChange(updated)
  }

  const handleCellClick = (rowIndex, columnKey) => {
    setEditingCell({ rowIndex, columnKey })
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  return (
    <div className="editable-table-container">
      <table className="editable-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(col => {
                const isEditing = editingCell?.rowIndex === rowIndex &&
                                 editingCell?.columnKey === col.key
                return (
                  <td
                    key={col.key}
                    className={isEditing ? 'editing' : ''}
                    onClick={() => handleCellClick(rowIndex, col.key)}
                  >
                    {isEditing ? (
                      <textarea
                        value={row[col.key] || ''}
                        onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                        onBlur={handleCellBlur}
                        autoFocus
                        rows={3}
                      />
                    ) : (
                      <div className="cell-content">
                        {row[col.key] || <span className="empty-cell">Click to edit</span>}
                      </div>
                    )}
                  </td>
                )
              })}
              <td className="actions-cell">
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteRow(rowIndex)}
                  aria-label="Delete row"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-row-btn" onClick={handleAddRow}>
        + Add Row
      </button>
    </div>
  )
}

export default EditableTable
