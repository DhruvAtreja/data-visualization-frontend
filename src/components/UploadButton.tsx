import React, { useRef, useState } from 'react'

interface UploadButtonProps {
  onFileUpload: (file: File) => void
  disabled?: boolean
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File size should be less than 1 MB')
        return
      }
      if (file.name.endsWith('.sqlite') || file.name.endsWith('.csv')) {
        setFileName(file.name)
        onFileUpload(file)
      } else {
        alert('Please select a valid .sqlite or .csv file')
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleClick = () => {
    triggerFileInput()
  }

  return (
    <div className='fixed top-4 right-4 z-50'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        name='file'
        accept='.sqlite,.csv'
        className='hidden'
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {fileName ? (disabled ? `Uploading: ${fileName}` : `Uploaded: ${fileName}`) : 'Upload Database'}
      </button>
    </div>
  )
}

export default UploadButton
