import './FreeSpacesDisplay.css'

interface FreeSpacesDisplayProps {
  freeSpaces: number
  totalCapacity: number
}

export function FreeSpacesDisplay({ freeSpaces, totalCapacity }: FreeSpacesDisplayProps) {
  return (
    <div className="free-spaces">
      <span className="free-spaces__count">{freeSpaces}</span>
      <span className="free-spaces__of"> / {totalCapacity} free</span>
    </div>
  )
}
