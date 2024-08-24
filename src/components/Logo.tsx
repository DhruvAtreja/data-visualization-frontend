import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <div className='fixed top-4 left-4 z-50'>
      <Image src='/langgraph.svg' alt='LangGraph Logo' width={120} height={40} priority />
    </div>
  )
}

export default Logo
