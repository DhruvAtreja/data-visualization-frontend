import React from 'react'
import { ScatterChart } from '@mui/x-charts/ScatterChart'

export interface ScatterPlotProps {
  data: {
    series: {
      data: { x: number; y: number; id: number }[]
      label?: string
    }[]
  }
}

export const exampleData = {
  series: [
    {
      data: [
        {
          x: 0,
          y: 0,
          id: 1,
        },
      ],
      label: '',
    },
  ],
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  console.log(data)
  return <ScatterChart width={1000} height={300} series={data.series} />
}

export default ScatterPlot
