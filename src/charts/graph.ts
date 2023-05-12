import * as echarts from 'echarts/core'
import {
  TitleComponent,
  type TitleComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  LegendComponent,
  type LegendComponentOption
} from 'echarts/components'
import { GraphChart, type GraphSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import data from './graph.json'

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer
])

interface GraphNode {
  symbolSize: number
  label?: {
    show?: boolean
  }
}

type EChartsOption = echarts.ComposeOption<
| TitleComponentOption
| TooltipComponentOption
| LegendComponentOption
| GraphSeriesOption
>

export const graph = (element: HTMLDivElement): void => {
  const chart = echarts.init(element)

  chart.hideLoading()

  data.nodes.forEach((element: GraphNode) => {
    element.label = {
      show: element.symbolSize > 30
    }
  })

  const option: EChartsOption = {
    title: {
      text: 'Les Miserables',
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right'
    },
    tooltip: {},
    legend: [
      {
        data: data.categories.map((a: { name: string }) => {
          return a.name
        })
      }
    ],
    animationDuration: 1500,
    animationEasingUpdata: 'quinticInOut',
    series: [
      {
        name: 'Les Miserables',
        type: 'graph',
        layout: 'none',
        data: data.nodes,
        links: data.links,
        categories: data.categories,
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 10
          }
        }
      }
    ]
  }

  chart.setOption(option)
}
