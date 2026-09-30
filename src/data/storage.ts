import type { Facility } from './facility'
import type { Reservation } from './reservation'

const LAST_SUCCESS_KEY = 'parking:lastSuccess'
const RESERVATIONS_KEY = 'parking:reservations'

interface CachedFacilities {
  facilities: Facility[]
  fetchedAt: string
}

export function readCachedFacilities(): CachedFacilities | null {
  const raw = localStorage.getItem(LAST_SUCCESS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CachedFacilities
  } catch {
    return null
  }
}

export function writeCachedFacilities(facilities: Facility[]): void {
  const cached: CachedFacilities = { facilities, fetchedAt: new Date().toISOString() }
  localStorage.setItem(LAST_SUCCESS_KEY, JSON.stringify(cached))
}

export function readReservations(): Reservation[] {
  const raw = localStorage.getItem(RESERVATIONS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Reservation[]
  } catch {
    return []
  }
}

export function writeReservations(reservations: Reservation[]): void {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations))
}
