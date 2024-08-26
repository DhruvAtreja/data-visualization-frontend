import React, { useState, useEffect } from 'react'
import Form from './Form'
import Logo from '../Logo'
import { Client } from '@langchain/langgraph-sdk'
import { QuestionDisplay } from './QuestionDisplay'
import { Stream } from './Stream'
import { graphDictionary, InputType } from '../graphs/graphDictionary'

type GraphComponentProps = InputType & { data: any }

const sampleQuestions = [
  'Relation b/w income and rating in men',
  'Avg unit price in sports vs food',
  'What is the market share of products?',
  'Spending across categories and gender',
  'Will I get into YC?',
]

export type GraphState = {
  question: string
  parsed_question: string
  sql_query: string
  sql_valid: boolean
  results: any[]
  answer: string
  visualization: keyof typeof graphDictionary | '' | 'none'
  visualization_reason: string
  formatted_data_for_visualization: any
}

export default function Playground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>([])
  const [graphState, setGraphState] = useState<GraphState | null>(null)

  const run = async (question: string) => {
    const client = new Client({
      apiKey: process.env.NEXT_PUBLIC_LANGSMITH_API_KEY,
      apiUrl: 'https://ht-candid-kettledrum-53-9f27eecbc4335921bd2bfa8a8e3ce0d2.default.us.langgraph.app',
    })

    const thread = await client.threads.create()

    const streamResponse = client.runs.stream(thread['thread_id'], 'my_agent', {
      input: { question },
    })

    for await (const chunk of streamResponse) {
      if (chunk.data && chunk.data.question) {
        setGraphState(chunk.data)
        console.log(chunk.data)
      }
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
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#204544] m-0 p-0'>
      <Logo />

      <Form selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} onFormSubmit={onFormSubmit} />
      {!graphState && (
        <QuestionDisplay displayedQuestions={displayedQuestions} handleQuestionClick={handleQuestionClick} />
      )}

      {graphState && !graphState.formatted_data_for_visualization && (
        <div className='flex  w-full items-start  items-center justify-center mt-60'>
          <Stream graphState={graphState} />
        </div>
      )}

      {graphState && graphState.formatted_data_for_visualization && (
        <div className='p-10  w-full flex flex-col  items-center justify-center'>
          <div className='flex w-full flex-col p-10 rounded-[10px] bg-white items-center justify-center'>
            <div className=' text-sm mb-10 '>
              {graphState.answer && <div className='markdown-content'>{graphState.answer}</div>}
            </div>
            {React.createElement(
              graphDictionary[graphState.visualization as keyof typeof graphDictionary]
                .component as React.ComponentType<any>,
              {
                data: graphState.formatted_data_for_visualization,
              },
            )}
          </div>
        </div>
      )}
    </div>
  )
}
