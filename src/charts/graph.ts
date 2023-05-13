import * as echarts from 'echarts/core'
import {
  TitleComponent,
  type TitleComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  LegendComponent,
  type LegendComponentOption,
  ToolboxComponent,
} from 'echarts/components'
import { GraphChart, type GraphSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import data from './graph.json'

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer,
  ToolboxComponent,
])

interface GraphNode {
  id?: string
  name?: string
  symbolSize?: number
  label?: {
    show?: boolean
  }
  category?: number
}

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | GraphSeriesOption
>

const organizations: GraphNode[] = [
  {
    id: '0',
    name: '农业农村部',
    symbolSize: 20,
    category: 0,
  },
  {
    id: '1',
    name: '生态环境部',
    symbolSize: 13,
    category: 1,
  },
  {
    id: '2',
    name: '国家发展与改革委员会',
    symbolSize: 10,
    category: 2,
  },
  {
    id: '3',
    name: '国家能源局',
    symbolSize: 2,
    category: 3,
  },
]

interface GraphLink {
  source: number
  target: number
  lineStyle: {
    width: number
  }
}

const links: GraphLink[] = [
  {
    source: 0,
    target: 1,
    lineStyle: {
      width: 8,
    },
  },
  {
    source: 1,
    target: 2,
    lineStyle: {
      width: 3,
    },
  },
  {
    source: 2,
    target: 3,
    lineStyle: {
      width: 2,
    },
  },
]

interface Category {
  name?: string
}

const categories: Category[] = organizations.map(({ name }) => ({ name }))

const title = '机关间联合发文关系'

export const graph = (element: HTMLDivElement, clear = false): void => {
  clear && echarts.dispose(element)

  const chart = echarts.init(element)

  chart.hideLoading()

  data.nodes.forEach((element: GraphNode) => {
    element.label = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      show: element.symbolSize! > 30,
    }
  })

  const option: EChartsOption = {
    title: {
      text: title,
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
        },
      },
    },
    tooltip: {},
    legend: [
      {
        data: categories.map((a) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return a.name!
        }),
      },
    ],
    animationDuration: 1500,
    animationEasingUpdata: 'quinticInOut',
    series: [
      {
        name: title,
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 100,
          edgeLength: [30, 120],
        },
        data: organizations,
        links: links,
        categories: categories,
        roam: true,
        draggable: true,
        label: {
          position: 'right',
          formatter: '{b}',
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 10,
          },
        },
      },
    ],
  }

  chart.setOption(option)
}
