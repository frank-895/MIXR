import { Loader } from '../Loader'

export function WaitingScreen() {
  return (
    <main className="screen center">
      <div
        className="waiting-overlay-box"
        style={{ border: '4px solid #000', padding: 32 }}
      >
        <Loader size={64} />
        <h2 style={{ marginBottom: 16 }}>
          WAITING
          <br />
          FOR HOST...
        </h2>
      </div>
    </main>
  )
}
