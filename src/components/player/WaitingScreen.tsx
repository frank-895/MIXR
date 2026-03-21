export function WaitingScreen() {
  return (
    <main className="screen center">
      <div
        className="waiting-overlay-box"
        style={{ border: '4px solid #000', padding: 32 }}
      >
        <span
          className="material-symbols-outlined animate-spin"
          aria-hidden="true"
          style={{ fontSize: 64, marginBottom: 24, display: 'block' }}
        >
          hourglass_empty
        </span>
        <h2 style={{ marginBottom: 16 }}>
          WAITING
          <br />
          FOR HOST...
        </h2>
      </div>
    </main>
  )
}
