export type SportMode = 'runner' | 'cyclist'

const STORAGE_KEY = 'sport-mode'

export const useSportMode = () => {
  const sportMode = useState<SportMode | null>('sportMode', () => {
    if (process.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'runner' || stored === 'cyclist') return stored
    }
    return null
  })

  const setSportMode = (mode: SportMode) => {
    sportMode.value = mode
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, mode)
    }
  }

  const toggleSportMode = () => {
    if (sportMode.value === 'runner') {
      setSportMode('cyclist')
    } else {
      // null or cyclist → runner
      setSportMode('runner')
    }
  }

  return { sportMode, setSportMode, toggleSportMode }
}
