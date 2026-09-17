import type { Facility, FacilityStatus } from './facility'

// A facility with 10% or less of its capacity free reads as "filling up" rather than plain "open".
const FILLING_UP_RATIO = 0.1

export function deriveStatus(facility: Facility, effectiveFreeSpaces: number): FacilityStatus {
  if (!facility.isOpenNow) return 'closed'
  if (effectiveFreeSpaces <= 0) return 'full'
  if (effectiveFreeSpaces / facility.totalCapacity <= FILLING_UP_RATIO) return 'filling-up'
  return 'open'
}
