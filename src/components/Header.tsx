import React, { memo } from 'react'
import { circular } from '~/charts/graph'
import { multilayer } from "~/charts/bar"

type Render = (e: HTMLDivElement, clear?: boolean) => void

const charts: Record<string, Render> = {
  网络关系图: circular,
  多层柱状图: multilayer
}

interface HeaderProps {
  element: HTMLDivElement
}

const Header = memo(({ element }: HeaderProps) => {
  const render = (name: string): void => {
    charts[name](element, true)
  }

  return (
    <div id="charts">
      {Object.keys(charts).map((name, idx) => (
        <button
          key={idx}
          onClick={() => {
            render(name)
          }}
        >
          {name}
        </button>
      ))}
    </div>
  )
})

Header.displayName = 'Header'

export default Header
