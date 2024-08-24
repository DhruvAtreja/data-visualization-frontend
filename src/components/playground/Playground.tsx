import React, { useState, useEffect } from 'react'
import Form from './Form'
import Logo from '../Logo'
import { createThread } from '@/utils/thread'
import { Client } from '@langchain/langgraph-sdk'

const LANGSMITH_API_KEY = process.env.LANGSMITH_API_KEY

const sampleQuestions = [
  'How has revenue changed over time?',
  'What are our top-selling products?',
  'Show the market share of products',
  'Spending habits of men and women',
  'Show the % of payments done by Card?',
]

export default function Playground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>([])

  const run = async (question: string) => {
    const client = new Client({
      apiUrl: 'https://ht-candid-kettledrum-53-9f27eecbc4335921bd2bfa8a8e3ce0d2.default.us.langgraph.app',
      defaultHeaders: {
        'X-Api-Key': LANGSMITH_API_KEY as string,
        'Content-Type': 'application/json',
      },
    })

    const thread = await client.threads.create()

    const streamResponse = client.runs.stream(thread['thread_id'], 'my_agent', {
      input: { question },
    })

    for await (const chunk of streamResponse) {
      console.log(chunk)
    }
  }

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sampleQuestions.length)
    }, 3000)

    return () => clearInterval(rotateInterval)
  }, [])

  useEffect(() => {
    const startIndex = currentIndex
    const endIndex = (currentIndex + 5) % sampleQuestions.length
    if (startIndex < endIndex) {
      setDisplayedQuestions(sampleQuestions.slice(startIndex, endIndex))
    } else {
      setDisplayedQuestions([...sampleQuestions.slice(startIndex), ...sampleQuestions.slice(0, endIndex)])
    }
  }, [currentIndex])

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question)
  }

  const onFormSubmit = () => {
    run(selectedQuestion)
    setSelectedQuestion('')
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-[#204544]'>
      <Logo />
      <div className='mb-8 w-5/6 text-center'>
        {displayedQuestions.map((question, index) => (
          <div
            key={index}
            className={`text-white cursor-pointer mb-4 hover:text-yellow-300 transition-all duration-300 transform hover:scale-105 ${
              index === 1 || index === 3
                ? 'text-3xl opacity-60'
                : index === 2
                ? 'text-4xl opacity-100'
                : 'text-xl opacity-50'
            }`}
            style={{
              animation: `float ${Math.random() * 2 + 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
            onClick={() => handleQuestionClick(question)}
          >
            {question}
          </div>
        ))}
      </div>
      <Form selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} onFormSubmit={onFormSubmit} />
    </div>
  )
}
