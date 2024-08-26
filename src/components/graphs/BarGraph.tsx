import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'

export interface BarGraphProps {
  data: {
    labels: string[]
    values: { data: number[]; label: string }[]
  }
}

export const exampleData: BarGraphProps = {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [{ data: [21.5, 25.0, 47.5, 64.8, 105.5, 133.2], label: 'Income' }],
  },
}

const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  return <BarChart xAxis={[{ scaleType: 'band', data: data.labels }]} series={data.values} height={300} />
}

export default BarGraph
