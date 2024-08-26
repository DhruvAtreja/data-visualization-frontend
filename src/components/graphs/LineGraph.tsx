import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart'

export interface LineGraphProps {
  data: {
    xValues: number[] | string[]
    yValues: { data: number[]; label: string }[]
  }
}

// Example usage:
export const exampleData: LineGraphProps = {
  data: {
    xValues: [1, 2, 3, 4, 5],
    yValues: [
      { data: [2, 5.5, 2, 8.5, 1.5], label: '' },
      { data: [2, 5.5, 2, 8.5, 1.5], label: '' },
    ],
  },
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  return (
    <LineChart xAxis={[{ scaleType: 'point', data: data.xValues }]} series={data.yValues} width={1000} height={300} />
  )
}

export default LineGraph
