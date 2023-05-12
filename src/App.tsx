import React, { useEffect, useRef, useState } from 'react'
import './App.css'
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
        isContainerReady ? <Header element={containerRef.current} /> : null
      }

      <div id="container" ref={containerRef}></div>
    </>
  )
}

export default App

