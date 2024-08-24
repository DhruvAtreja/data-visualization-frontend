const LANGSMITH_API_KEY = process.env.LANGSMITH_API_KEY

export const createThread = async (): Promise<any> => {
  try {
    const response = await fetch(
      'https://ht-candid-kettledrum-53-9f27eecbc4335921bd2bfa8a8e3ce0d2.default.us.langgraph.app/threads',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': LANGSMITH_API_KEY as string,
        },
        body: JSON.stringify({
          metadata: {},
        }),
      },
    )

    if (!response.ok) {
      console.log(response)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating thread:', error)
    throw error
  }
}

// Output:
// {'thread_id': 'bfc68029-1f7b-400f-beab-6f9032a52da4',
//  'created_at': '2024-06-24T21:30:07.980789+00:00',
//  'updated_at': '2024-06-24T21:30:07.980789+00:00',
//  'metadata': {},
//  'status': 'idle',
//  'config': {}}
