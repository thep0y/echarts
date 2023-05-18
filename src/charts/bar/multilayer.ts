// 有多层的柱状图
import * as echarts from 'echarts'
import data from './data.json'
import { EChartsOption } from 'echarts'

const orgs = Object.keys(data)

const title = '各机关主办、协办发文统计'

const run = (element: HTMLDivElement, clear = true) => {
  clear && echarts.dispose(element)

  const chart = echarts.init(element, undefined, {
    width: 1920,
    height: 1080,
    renderer: 'canvas',
  })

  const option: EChartsOption = {
    title: {
      text: title,
    },
    toolbox: {
      feature: {
        saveAsImage: {
          show: true,
          title: '保存为图片',
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: orgs,
        axisLabel: {
          show: true,
          interval: 0,
          rotate: 45,
          // margin: 16,
          formatter: (value) => {
            // return splitIntoLines(value, 3)
            let idx = value.indexOf('（')

            if (idx === -1) {
              idx = value.indexOf('(')
            }

            if (idx >= 0) return value.slice(0, idx)

            return value
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: ['主办机关', '协办机关'].map((k) => {
      return {
        name: k.slice(0, 2),
        type: 'bar',
        stack: '数量',
        emphasis: {
          focus: 'series',
        },
        data: orgs.map((o) => (data[o][k] as number | undefined) ?? 0),
      }
    }),
  }

  chart.setOption(option)
}

export { run as multilayer }
