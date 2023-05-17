import * as echarts from 'echarts/core'
import {
  TitleComponent,
  type TitleComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  LegendComponent,
  type LegendComponentOption,
  ToolboxComponent,
  GraphicComponent,
} from 'echarts/components'
import { GraphChart, type GraphSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import data from './data.json'
import { splitIntoLines } from '~/lib/string'

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer,
  ToolboxComponent,
  GraphicComponent,
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

interface Category {
  name?: string
}

const central = data['中央']

// 从大到小排列
const nodes = central.nodes.sort((a, b) => b.symbolSize - a.symbolSize)

const categories: Category[] = []

nodes.forEach((node, idx) => {
  categories.push({ name: node.name })
})

const title = '机关间联合发文关系'

export const circular = (element: HTMLDivElement, clear = false): void => {
  clear && echarts.dispose(element)

  const chart = echarts.init(element)

  nodes.forEach((elemente) => {
    elemente.label = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // show: element.symbolSize! > 30,
      show: true,
      fontSize: 24,
    }
  })

  // const colors = generateColors(nodes.length)
  const colors = [
    '#E91E63',
    '#03A9F4',
    '#4CAF50',
    '#9C27B0',
    '#FFC107',
    '#673AB7',
    '#009688',
    '#FF5722',
    '#795548',
    '#607D8B',
    '#FFEB3B',
    '#2196F3',
    '#8BC34A',
    '#CDDC39',
    '#FF9800',
    '#9E9E9E',
    '#de7a74',
    '#00BCD4',
    '#3F51B5',
    '#FFEB3B',
  ]
  const option: EChartsOption = {
    title: {
      text: title,
      top: 'bottom',
      left: 'right',
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          pixelRatio: 3,
        },
        myPrintLayouts: {
          show: true,
          title: '打印节点坐标',
          icon: 'image:///src/assets/svg/printer.svg',
          onclick: () => {
            getLayouts(chart)
          },
        },
      },
    },
    tooltip: {},
    color: colors,
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
        layout: 'circular',
        // force: {
        //   repulsion: 1000,
        //   edgeLength: [1000, 300],
        // },
        circular: {
          rotateLabel: true,
        },
        data: nodes,
        links: central.links,
        categories: categories,
        roam: true,
        // draggable: true,
        label: {
          position: 'right',
          formatter: (params): string => {
            return splitIntoLines(params.name, 6)
          },
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

export const getLayouts = (chart: echarts.ECharts): void => {
  const layouts = chart.getModel().getSeriesByIndex(0).getData()._itemLayouts

  console.log(layouts)
}
