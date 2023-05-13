import React, { memo } from 'react'
import { graph } from '~/charts'

type Render = (e: HTMLDivElement, clear?: boolean) => void

const charts: Record<string, Render> = {
  网络关系图: graph
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
