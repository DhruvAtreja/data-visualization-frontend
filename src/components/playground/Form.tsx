import React, { useState } from 'react'

const Form = ({
  selectedQuestion = '',
  setSelectedQuestion,
  onFormSubmit,
}: {
  selectedQuestion?: string
  setSelectedQuestion: (question: string) => void
  onFormSubmit: () => void
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onFormSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className='flex fixed top-20 w-full justify-center'>
      <input
        type='text'
        value={selectedQuestion}
        onChange={(e) => setSelectedQuestion(e.target.value)}
        placeholder='Ask a question to visualize your data'
        className='px-4 py-2 w-1/4 rounded-l text-white border-2 border-r-0 border-gray-500 ring-0 focus:outline-none focus:border-gray-500 bg-black'
        required
      />
      <button
        type='submit'
        className='px-6 py-2 rounded-r bg-white text-black font-semibold hover:bg-gray-200 transition-colors duration-300'
      >
        Ask Question
      </button>
    </form>
  )
}

export default Form
