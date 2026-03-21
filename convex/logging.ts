export function logBoundaryEvent(
  event: string,
  details: Record<string, unknown>
) {
  console.info('[mixr-boundary]', {
    event,
    ...details,
  })
}
