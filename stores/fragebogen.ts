import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  DAYS, GARANTIE_BETRAG, H1S, LETTER, LIEFERUMFANG, PAIRS, PATTERN, PHASE1, PREIS_OPTIONEN, SENTS, SKEPSIS, TERMS, ZEIT,
  type FbScreen,
} from '~/data/fragebogen'

const KEY = 'th-form-v3'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Timing { ms: number; first?: string; last?: string }
interface FbState {
  v: 3
  runId: string
  idx: number
  startedAt: string | null
  submittedAt: string | null
  saved: boolean
  pending: Record<string, unknown> | null
  seed: { terms: number[]; flips: boolean[]; sents: number[]; h1: number[] }
  answers: Record<string, any>
  timing: Record<string, Timing>
  device: Record<string, unknown>
}

function shuffle<T>(list: T[]): T[] {
  const a = list.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function deviceInfo() {
  const ua = navigator.userAgent || ''
  const w = window.innerWidth
  let touch = false
  try { touch = window.matchMedia('(pointer:coarse)').matches } catch { /* ignore */ }
  let type = 'desktop'
  if (/iPad|Tablet/i.test(ua) || (touch && w >= 768 && w < 1100)) type = 'tablet'
  else if (/Mobi|Android|iPhone/i.test(ua) || (touch && w < 768)) type = 'mobile'
  return { type, width: w, height: window.innerHeight, touch, language: navigator.language || '', userAgent: ua }
}

function freshState(): FbState {
  return {
    v: 3,
    runId: `r${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`,
    idx: 0,
    startedAt: null,
    submittedAt: null,
    saved: false,
    pending: null,
    seed: {
      terms: shuffle(TERMS.map((_, i) => i)),
      flips: PAIRS.map(() => Math.random() < 0.5),
      sents: shuffle(SENTS.map((_, i) => i)),
      h1: shuffle(H1S.map((_, i) => i)),
    },
    answers: {},
    timing: {},
    device: deviceInfo(),
  }
}

function loadState(): FbState | null {
  try {
    const o = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (o && o.v === 3 && o.seed && o.answers) return o as FbState
  } catch { /* ignore */ }
  return null
}

export const useFragebogenStore = defineStore('fragebogen', () => {
  const S = ref<FbState | null>(null)
  const busy = ref(false)
  const devOn = ref(false)
  const devOpen = ref(true)
  let enteredAt = 0

  // ---------- Aufbau der Seitenfolge ----------
  const screens = computed<FbScreen[]>(() => {
    if (!S.value) return []
    const list: FbScreen[] = [{ id: 'intro', kind: 'intro' }]
    let n = 0
    PHASE1.forEach((q) => { n++; list.push({ id: q.id, kind: q.kind, step: n, phase: 1, q }) })
    list.push({ id: 'uebergang1', kind: 'transition1' })
    n++
    S.value.seed.terms.forEach((t, k) => {
      const term = TERMS[t]!
      list.push({ id: `s9-${term.key}`, kind: 'term', step: n, phase: 2, sub: k + 1, term, lock: true })
    })
    n++; list.push({ id: 's10', kind: 'pairs', step: n, phase: 2, lock: true })
    n++; list.push({ id: 's11', kind: 'ads', step: n, phase: 2, lock: true })
    n++; list.push({ id: 'h1test', kind: 'headline', step: n, phase: 2, lock: true })
    n++; list.push({ id: SKEPSIS.id, kind: 'long', step: n, phase: 2, q: SKEPSIS, lock: true })
    list.push({ id: 'uebergang2', kind: 'transition2', lock: true })
    n++; list.push({ id: 'plan', kind: 'plan', step: n, phase: 3 })
    n++; list.push({ id: 'angebot', kind: 'offer', step: n, phase: 3 })
    n++; list.push({ id: 's14', kind: 'email', step: n, phase: 3 })
    list.push({ id: 'danke', kind: 'thanks', lock: true })
    return list
  })
  const totalSteps = computed(() => Math.max(0, ...screens.value.map((s) => s.step || 0)))
  const idx = computed(() => S.value?.idx ?? 0)
  const current = computed<FbScreen | null>(() => screens.value[Math.min(idx.value, screens.value.length - 1)] ?? null)
  const counted = computed(() => screens.value.filter((s) => s.step))
  const progressPct = computed(() => (current.value?.step ? ((counted.value.indexOf(current.value) + 1) / counted.value.length) * 100 : 0))
  const canBack = computed(() => idx.value > 0 && !current.value?.lock && !screens.value[idx.value - 1]?.lock)
  const answers = computed(() => S.value?.answers ?? {})
  const saved = computed(() => !!S.value?.saved)
  const pending = computed(() => S.value?.pending ?? null)

  // ---------- Antworten ----------
  function setAnswer(id: string, value: unknown) {
    if (S.value) S.value.answers[id] = value
  }
  function setField(id: string, field: string, value: unknown) {
    if (!S.value) return
    S.value.answers[id] = { ...(S.value.answers[id] || {}), [field]: value }
  }
  function isValid(sc: FbScreen | null): boolean {
    if (!sc || !S.value) return false
    const a = S.value.answers[sc.id]
    if (sc.kind === 'reagiert') return !!(a && a.ueberreagiert)
    if (sc.q?.required) return typeof a === 'string' && a.trim().length > 0
    if (sc.kind === 'email') {
      const m = String(a?.email || '').trim()
      return !m || (EMAIL_RE.test(m) && !!a?.consent)
    }
    return true
  }
  const nextDisabled = computed(() => busy.value || !isValid(current.value))

  // ---------- Startplan ----------
  const plan = computed(() => {
    const A = answers.value
    const anders = A.plan?.passt === 'anders'
    const z = anders ? A.plan || {} : {}
    const zeit: number = z.zeit || 120
    const n: number = z.einheiten || 3
    const keys = ['kraft', 'ausdauer', 'mind'] as const
    const sequence = Array.from({ length: n }, (_, i) => keys[i % 3]!)
    const pattern = PATTERN[n] || PATTERN[3]!
    const week = DAYS.map((d, di) => {
      const at = pattern.indexOf(di)
      const pillar = at > -1 ? sequence[at] : null
      return { day: d, pillar, letter: pillar ? LETTER[pillar] : '' }
    })
    return {
      zeit, n, anders, week,
      minuten: Math.max(5, Math.round(zeit / n / 5) * 5),
      usedDefault: anders && (!z.zeit || !z.einheiten),
      zeitLabel: ZEIT.find((x) => x.v === zeit)?.l || '',
    }
  })

  // ---------- Zeiterfassung und Navigation ----------
  function flush() {
    if (!S.value || !current.value || !enteredAt) return
    const now = Date.now()
    const t = S.value.timing[current.value.id] || { ms: 0 }
    t.ms += now - enteredAt
    t.first = t.first || new Date(enteredAt).toISOString()
    t.last = new Date(now).toISOString()
    S.value.timing[current.value.id] = t
    enteredAt = now
  }
  function markEntered() { enteredAt = Date.now() }
  function jump(i: number) {
    if (!S.value || i < 0 || i >= screens.value.length) return
    flush()
    S.value.idx = i
    markEntered()
  }
  function next() {
    if (!S.value || !current.value || !isValid(current.value)) return
    if (current.value.kind === 'intro' && !S.value.startedAt) S.value.startedAt = new Date().toISOString()
    if (current.value.kind === 'email') { void submit(false); return }
    jump(idx.value + 1)
  }
  function back() { if (canBack.value) jump(idx.value - 1) }

  // ---------- Absenden ----------
  function buildPayload() {
    const s = S.value!
    const now = Date.now()
    s.submittedAt = new Date(now).toISOString()
    const active = Object.values(s.timing).reduce((sum, t) => sum + (t.ms || 0), 0)
    const answersCopy = JSON.parse(JSON.stringify(s.answers))
    const mail = String(answersCopy.s14?.email || '').trim()
    const consent = !!answersCopy.s14?.consent
    delete answersCopy.s14
    const record = {
      schema: 'th-form-v3',
      runId: s.runId,
      startedAt: s.startedAt,
      submittedAt: s.submittedAt,
      durationMs: s.startedAt ? now - Date.parse(s.startedAt) : null,
      activeMs: active,
      device: s.device,
      randomization: {
        terms: s.seed.terms.map((i) => TERMS[i]!.key),
        pairFlips: s.seed.flips,
        sentences: s.seed.sents.map((i) => SENTS[i]!.id),
        headlines: s.seed.h1.map((i) => H1S[i]!.id),
      },
      stimuli: {
        sentences: SENTS, headlines: H1S, pairs: PAIRS, terms: TERMS,
        offer: { prices: PREIS_OPTIONEN, guarantee: true, guaranteeAmount: GARANTIE_BETRAG, items: LIEFERUMFANG },
      },
      screenOrder: screens.value.map((x) => x.id),
      timing: s.timing,
      answers: answersCopy,
      emailGiven: !!mail,
    }
    const contact = mail && consent ? { runId: s.runId, email: mail, consent: true, consentAt: new Date(now).toISOString() } : null
    return { record, contact }
  }
  async function submit(retry: boolean) {
    if (busy.value || !S.value) return
    busy.value = true
    if (!retry) { flush(); S.value.pending = buildPayload() }
    let ok = false
    try {
      await $fetch('/api/fragebogen', { method: 'POST', body: S.value.pending })
      ok = true
    } catch { ok = false }
    busy.value = false
    S.value.saved = ok
    if (ok) S.value.pending = null
    S.value.idx = screens.value.length - 1
    markEntered()
  }

  // ---------- Lebenszyklus ----------
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(S.value)) } catch { /* ignore */ }
  }
  function init() {
    if (S.value) return
    S.value = loadState() || freshState()
    try {
      devOn.value = localStorage.getItem('th-dev') === '1' || /#dev\b/.test(location.hash)
      const o = localStorage.getItem('th-dev-open')
      if (o !== null) devOpen.value = o === '1'
    } catch { /* ignore */ }
    markEntered()
    watch(S, persist, { deep: true })
    persist()
  }
  function restart() {
    S.value = freshState()
    markEntered()
  }
  function setDev(on: boolean) {
    devOn.value = on
    try { localStorage.setItem('th-dev', on ? '1' : '0') } catch { /* ignore */ }
  }
  function setDevOpen(open: boolean) {
    devOpen.value = open
    try { localStorage.setItem('th-dev-open', open ? '1' : '0') } catch { /* ignore */ }
  }

  return {
    S, busy, devOn, devOpen,
    screens, totalSteps, idx, current, progressPct, canBack, answers, saved, pending, plan, nextDisabled,
    setAnswer, setField, isValid, jump, next, back, submit, flush, init, restart, setDev, setDevOpen,
  }
})
