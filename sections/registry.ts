import AnimatedHeaderProgressbar from '~/components/AnimatedHeaderProgressbar.vue'
import Angebot from '~/components/Angebot.vue'
import BannerTypo from '~/components/BannerTypo.vue'
import ClosingSection from '~/components/ClosingSection.vue'
import FAQSection from '~/components/FAQSection.vue'
import FrameworkSection from '~/components/FrameworkSection.vue'
import HaltungSection from '~/components/HaltungSection.vue'
import HeroSection from '~/components/HeroSection.vue'
import IdentificationSection from '~/components/IdentificationSection.vue'
import IntegrationSection from '~/components/IntegrationSection.vue'
import ProofSection from '~/components/ProofSection.vue'
import ProtocolTimelineSection from '~/components/ProtocolTimelineSection.vue'
import RucksackExopek from '~/components/RucksackExopek.vue'
import RoutineSection from '~/components/RoutineSection.vue'
import TrainHybridMethod from '~/components/TrainHybridMethod.vue'
import YesIdent from '~/components/YesIdent.vue'

export const sectionRegistry = {
  animatedHeaderProgressbar: AnimatedHeaderProgressbar,
  angebot: Angebot,
  bannerTypo: BannerTypo,
  faq: FAQSection,
  hero: HeroSection,
  framework: FrameworkSection,
  frameworkProtocol: FrameworkSection,
  proof: ProofSection,
  protocolTimeline: ProtocolTimelineSection,
  integration: IntegrationSection,
  identification: IdentificationSection,
  haltung: HaltungSection,
  rucksackExopek: RucksackExopek,
  routine: RoutineSection,
  trainHybridMethod: TrainHybridMethod,
  yesIdent: YesIdent,
  closing: ClosingSection,
} as const

export type SectionType = keyof typeof sectionRegistry
