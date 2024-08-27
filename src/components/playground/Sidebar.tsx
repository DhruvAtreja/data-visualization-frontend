import React from 'react'
import { Stream } from './Stream'
import { GraphState } from './Playground'

interface SidebarProps {
  graphState: GraphState
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ graphState, onClose }) => {
  return (
    <div className='fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg overflow-y-auto z-50 transition-transform duration-300 ease-in-out bg-emerald-950'>
      <button onClick={onClose} className='absolute top-4 right-4 text-gray-600 hover:text-gray-800'>
        ✕
      </button>
      <div className='p-4'>
        <Stream graphState={graphState} />
      </div>
    </div>
  )
}
