import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import Header from '~/components/Header'

const App: React.FC = () => {
  const containerRef = useRef(null)
  const [isContainerReady, setIsContainerReady] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      setIsContainerReady(true)
    }
  }, [containerRef])

  return (
    <>
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        isContainerReady ? <Header element={containerRef.current!} /> : null
      }

      <div id="container" ref={containerRef}></div>
    </>
  )
}

export default App
