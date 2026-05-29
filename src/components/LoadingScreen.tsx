import { useEffect, useState } from 'react'

const SIM_DURATION = 4000 // ms

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / SIM_DURATION, 1)
      // Ease out: rápido al principio, más lento al final
      setProgress(Math.round(t * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="loading-screen">
      <div className="loading-screen__inner">
        <div className="loading-screen__logo-wrap">
          <img
            src="/img/logo.png"
            alt="Logo Ra"
            className="loading-screen__logo"
          />
        </div>
        <div className="loading-screen__bar-wrap loading-screen__bar-wrap--visible">
          <div className="loading-bar">
            <div
              className="loading-bar__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="loading-screen__percent">{progress}%</p>
        </div>
        <p className="loading-screen__tip">
          Investiga en mi rincón de trabajo para averiguar todo sobre mí
        </p>
      </div>
    </div>
  )
}
