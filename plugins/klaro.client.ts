import * as Klaro from 'klaro'
import 'klaro/dist/klaro-no-translations.css'
import klaroConfig from '~/klaro.config'

export default defineNuxtPlugin(() => {
  Klaro.setup(klaroConfig)
})
