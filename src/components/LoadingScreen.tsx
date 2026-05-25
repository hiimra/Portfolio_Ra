interface Props {
  progress: number
}

export function LoadingScreen({ progress }: Props) {
  return (
    <div className="loading-screen">
      <div className="loading-screen__inner">
        <h1 className="loading-screen__title">PORTFOLIO</h1>
        <p className="loading-screen__subtitle">Ra</p>
        <div className="loading-bar">
          <div
            className="loading-bar__fill"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <p className="loading-screen__percent">{Math.round(progress)}%</p>
        <p className="loading-screen__hint">Cargando escena 3D…</p>
      </div>
    </div>
  )
}
