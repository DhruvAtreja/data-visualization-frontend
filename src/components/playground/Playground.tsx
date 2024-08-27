import React, { useState, useEffect, useCallback, useRef } from 'react'
import Form from './Form'
import Logo from '../Logo'
import { Client } from '@langchain/langgraph-sdk'
import { QuestionDisplay } from './QuestionDisplay'
import { Stream } from './Stream'
import { graphDictionary, InputType } from '../graphs/graphDictionary'
import UploadButton from '../UploadButton'
import { Sidebar } from './Sidebar'

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
  uuid: string
  parsed_question: { [key: string]: any }
  unique_nouns: string[]
  sql_query: string
  sql_valid: boolean
  sql_issues: string
  results: any[]
  answer: string
  error: string
  visualization: string
  visualization_reason: string
  formatted_data_for_visualization: { [key: string]: any }
}

export default function Playground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>([])
  const [graphState, setGraphState] = useState<GraphState | null>(null)
  const [databaseUuid, setDatabaseUuid] = useState<string | null>(null)
  const [databaseFileName, setDatabaseFileName] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const uploadDatabase = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SQLITE_URL + '/upload-file', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.uuid
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }, [])

  const uploadDefaultDatabase = useCallback(async () => {
    try {
      const response = await fetch('/data.sqlite')
      const blob = await response.blob()
      const file = new File([blob], 'data.sqlite', { type: 'application/x-sqlite3' })
      const uuid = await uploadDatabase(file)
      setDatabaseUuid(uuid)
      console.log('uuid', uuid)
      setDatabaseFileName('data.sqlite')
      console.log(`Default database "data.sqlite" uploaded successfully. UUID: ${uuid}`)
      return uuid
    } catch (error) {
      console.error('Failed to upload default database:', error)
      alert('Failed to upload default database')
    }
  }, [uploadDatabase, setDatabaseUuid, setDatabaseFileName])

  const run = useCallback(
    async (question: string) => {
      let defaultDatabaseUuid = null
      if (!databaseUuid) {
        defaultDatabaseUuid = await uploadDefaultDatabase()
      }

      const client = new Client({
        apiKey: process.env.NEXT_PUBLIC_LANGSMITH_API_KEY,
        apiUrl: process.env.NEXT_PUBLIC_LANGSMITH_API_URL,
      })

      const thread = await client.threads.create()

      console.log('thread', databaseUuid)

      const streamResponse = client.runs.stream(thread['thread_id'], 'my_agent', {
        input: { question, uuid: databaseUuid || defaultDatabaseUuid },
      })

      for await (const chunk of streamResponse) {
        if (chunk.data && chunk.data.question) {
          setGraphState(chunk.data)
          console.log(chunk.data)
        }
      }
    },
    [databaseUuid, uploadDefaultDatabase],
  )

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const uuid = await uploadDatabase(file)
        setDatabaseUuid(uuid)
        setDatabaseFileName(file.name)
        console.log(`File "${file.name}" uploaded successfully. UUID: ${uuid}`)
      } catch (error) {
        console.error('Failed to upload file:', error)
        alert('Failed to upload file')
      }
    },
    [uploadDatabase, setDatabaseUuid, setDatabaseFileName],
  )

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowSidebar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question)
  }

  const onFormSubmit = () => {
    run(selectedQuestion)
    setSelectedQuestion('')
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#204544] m-0 p-0'>
      <Logo />
      <UploadButton onFileUpload={handleFileUpload} />

      <Form selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} onFormSubmit={onFormSubmit} />
      {!graphState && (
        <QuestionDisplay displayedQuestions={displayedQuestions} handleQuestionClick={handleQuestionClick} />
      )}

      {graphState && !graphState.formatted_data_for_visualization && (
        <div className='flex  w-2/3 items-start  items-center justify-center mt-60'>
          <Stream graphState={graphState} />
        </div>
      )}

      {graphState && graphState.formatted_data_for_visualization && (
        <div id='answer_canvas' className='p-10 w-full flex flex-col items-center justify-center relative'>
          <button
            onClick={toggleSidebar}
            className='absolute top-12 right-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Stream
          </button>
          <div className='flex w-full flex-col p-10 rounded-[10px] bg-white items-center justify-center'>
            <div className='text-sm mb-10 mx-20'>
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
          {showSidebar && (
            <div ref={sidebarRef}>
              <Sidebar graphState={graphState} onClose={toggleSidebar} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
