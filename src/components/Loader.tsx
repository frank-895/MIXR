export function Loader({ size = 48 }: { size?: number }) {
  return (
    <svg
      className="loader-square"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Loading"
    >
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeDasharray="345 23"
        className="loader-square-path"
      />
    </svg>
  )
}
