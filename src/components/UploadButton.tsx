import React, { useRef, useState } from 'react'

interface UploadButtonProps {
  onFileUpload: (file: File) => void
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith('.sqlite')) {
      setFileName(file.name)
      onFileUpload(file)
    } else {
      alert('Please select a valid .sqlite file')
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='fixed top-4 right-4 z-50'>
      <input type='file' ref={fileInputRef} onChange={handleFileChange} accept='.sqlite' className='hidden' />
      <button
        onClick={triggerFileInput}
        className='px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors duration-300'
      >
        {fileName ? `Uploaded: ${fileName}` : 'Upload Database'}
      </button>
    </div>
  )
}

export default UploadButton
