import { useRef } from 'react'
import './ImportExport.css'

function ImportExport({ data, onImport }) {
  const fileInputRef = useRef(null)

  const handleExport = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `value-stream-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result)
        // Validate the structure
        if (importedData.valueStream && importedData.valueStream.phases) {
          onImport(importedData)
          alert('Data imported successfully!')
        } else {
          alert('Invalid file format. Please select a valid value stream JSON file.')
        }
      } catch (error) {
        alert('Error parsing JSON file: ' + error.message)
      }
    }
    reader.readAsText(file)
    // Reset the input so the same file can be imported again
    event.target.value = ''
  }

  return (
    <div className="import-export">
      <button className="export-btn" onClick={handleExport}>
        Export JSON
      </button>
      <button className="import-btn" onClick={handleImportClick}>
        Import JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ImportExport
