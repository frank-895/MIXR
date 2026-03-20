const ITEMS = [
  'BIGCHUNGUS',
  'DATBOI',
  'DOGE',
  'PEPE',
  'NYANCAT',
  'TROLLFACE',
  'HARAMBE',
  'RICKASTLEY',
]

const track = ITEMS.map((s) => `* ${s} `).join('')
const doubled = `${track}${track}`

export function Marquee() {
  return (
    <footer className="marquee-container">
      <div className="marquee-track">{doubled}</div>
    </footer>
  )
}
