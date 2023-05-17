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
import { generateColors, generateRandomColors } from '~/lib/color'
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
  value: number
}

const central = data['中央']

const nodes = central.nodes.sort((a, b) => b.symbolSize - a.symbolSize)

const categories: Category[] = []

nodes.forEach((node, idx) => {
  // n.x = Math.random() * 1000
  // n.y = Math.random() * 1000
  node.category = idx
  categories.push({ name: node.name })
})

const title = '机关间联合发文关系'

export const graph = (element: HTMLDivElement, clear = false): void => {
  clear && echarts.dispose(element)

  const chart = echarts.init(element)

  chart.hideLoading()

  nodes.forEach((element: GraphNode) => {
    element.label = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // show: element.symbolSize! > 30,
      show: true,
      fontSize: 16,
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
        force: {
          repulsion: 1000,
          edgeLength: [1000, 300],
        },
        data: nodes,
        links: central.links,
        categories: categories,
        roam: true,
        draggable: true,
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

  // initInvisibleGraphic()

  function initInvisibleGraphic() {
    // Add shadow circles (which is not visible) to enable drag.
    chart.setOption({
      graphic: echarts.util.map(
        option.series[0].data,
        function (item, dataIndex) {
          //使用图形素组件在节点上划出一个隐形的图形覆盖住节点
          const tmpPos = chart.convertToPixel({ seriesIndex: 0 }, [
            item.x,
            item.y,
          ])

          return {
            type: 'circle',
            id: dataIndex,
            position: tmpPos,
            shape: {
              cx: 0,
              cy: 0,
              r: 20,
            },
            // silent:true,
            invisible: true,
            draggable: true,
            ondrag: echarts.util.curry(onPointDragging, dataIndex),
            z: 100, //使图层在最高层
          }
        }
      ),
    })
    window.addEventListener('resize', updatePosition)
    chart.on('dataZoom', updatePosition)
  }
  // chart.on('graphRoam', updatePosition)
  function updatePosition() {
    //更新节点定位的函数
    chart.setOption({
      graphic: echarts.util.map(
        option.series[0].data,
        function (item, dataIndex) {
          const mpPos = chart.convertToPixel({ seriesIndex: 0 }, [
            item.x,
            item.y,
          ])

          return {
            position: tmpPos,
          }
        }
      ),
    })
  }
  function onPointDragging(dataIndex) {
    //节点上图层拖拽执行的函数
    const tmpPos = chart.convertFromPixel({ seriesIndex: 0 }, this.position)

    option.series[0].data[dataIndex].x = tmpPos[0]
    option.series[0].data[dataIndex].y = tmpPos[1]
    chart.setOption(option)
    updatePosition()
  }
}

export const getLayouts = (chart: echarts.ECharts): void => {
  const layouts = chart.getModel().getSeriesByIndex(0).getData()._itemLayouts

  console.log(layouts)
}
