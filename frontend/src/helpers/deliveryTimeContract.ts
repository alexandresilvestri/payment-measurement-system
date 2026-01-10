export function obtainDeliveryTime(start: Date, expiration: Date): number {
  const startDateMs = start.getTime()
  const endDateMs = expiration.getTime()

  const differenceMs = Math.abs(endDateMs - startDateMs)

  const millisecondsPerDay = 1000 * 60 * 60 * 24
  const daysDifference = Math.floor(differenceMs / millisecondsPerDay)

  return daysDifference
}
