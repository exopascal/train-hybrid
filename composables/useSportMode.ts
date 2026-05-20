export type SportMode = 'runner' | 'cyclist'

const STORAGE_KEY = 'sport-mode'

export const useSportMode = () => {
  const route = useRoute()

  const sportMode = useState<SportMode | null>('sportMode', () => {
    if (route.path === '/laeufer') return 'runner'
    if (route.path === '/radfahrer') return 'cyclist'
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
    setSportMode(sportMode.value === 'runner' ? 'cyclist' : 'runner')
  }

  return { sportMode, setSportMode, toggleSportMode }
}
