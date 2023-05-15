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

const categories: Category[] = []

central.nodes.forEach((n) => {
  n.x = Math.random() * 1000
  n.y = Math.random() * 1000

  categories.push({ name: n.name })
})

const title = '机关间联合发文关系'

export const graph = (element: HTMLDivElement, clear = false): void => {
  clear && echarts.dispose(element)

  const chart = echarts.init(element)

  chart.hideLoading()

  central.nodes.forEach((element: GraphNode) => {
    element.label = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      show: element.symbolSize! > 30,
    }
  })

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
        layout: 'none',
        force: {
          repulsion: 400,
          edgeLength: [800, 300],
        },
        data: central.nodes,
        links: central.links,
        categories: categories,
        roam: true,
        draggable: false,
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

  initInvisibleGraphic()

  function initInvisibleGraphic() {
    // Add shadow circles (which is not visible) to enable drag.
    chart.setOption({
      graphic: echarts.util.map(
        option.series[0].data,
        function (item, dataIndex) {
          //使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
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
  chart.on('graphRoam', updatePosition)
  function updatePosition() {
    //更新节点定位的函数
    chart.setOption({
      graphic: echarts.util.map(
        option.series[0].data,
        function (item, dataIndex) {
          const tmpPos = chart.convertToPixel({ seriesIndex: 0 }, [
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
