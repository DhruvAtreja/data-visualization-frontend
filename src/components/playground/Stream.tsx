import { StreamRow } from './StreamRow'
import { GraphState } from './Playground'

export const Stream = ({ graphState }: { graphState: GraphState }) => {
  return (
    <div className='w-2/3 mb-10 items-center  '>
      {graphState.question && <StreamRow heading='Question' information={graphState.question} />}
      {/* {graphState.parsed_question && <StreamRow heading='Parsed Question' information={graphState.parsed_question} />} */}
      {graphState.sql_query && <StreamRow heading='SQL Query' information={graphState.sql_query} />}
      {graphState.sql_valid && <StreamRow heading='SQL Valid' information={graphState.sql_valid.toString()} />}
      {graphState.results && <StreamRow heading='Results' information={graphState.results.toString()} />}
      {graphState.answer && <StreamRow heading='Answer' information={graphState.answer} />}
      {graphState.visualization && <StreamRow heading='Visualization' information={graphState.visualization} />}
      {graphState.visualization_reason && (
        <StreamRow heading='Visualization Reason' information={graphState.visualization_reason} />
      )}
      {graphState.visualization_reason && graphState.visualization != 'none' && (
        <StreamRow heading='Formatting data' information={'Loading...'} />
      )}
    </div>
  )
}
