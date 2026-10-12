const klaroConfig = {
  version: 1,
  acceptAll: true,
  hideDeclineAll: false,
  hideLearnMore: false,
  lang: 'de',
  storageMethod: 'localStorage' as const,
  storageName: 'klaro',
  cookieDomain: undefined,

  translations: {
    de: {
      privacyPolicyUrl: '/datenschutz',
      consentNotice: {
        description:
          'Wir nutzen Cookies, um dir die beste Erfahrung auf unserer Website zu bieten. Einige sind notwendig, andere helfen uns, unsere Inhalte zu verbessern.',
        learnMore: 'Einstellungen',
      },
      consentModal: {
        title: 'Datenschutzeinstellungen',
        description:
          'Hier kannst du einsehen und anpassen, welche Informationen wir über dich sammeln. Einträge ohne Auswahlmöglichkeit sind für den Betrieb der Website notwendig.',
        privacyPolicy: {
          text: 'Mehr dazu in unserer {privacyPolicy}.',
          name: 'Datenschutzerklärung',
        },
      },
      acceptAll: 'Alle akzeptieren',
      acceptSelected: 'Auswahl speichern',
      decline: 'Nur notwendige',
      close: 'Schließen',
      ok: 'Alle akzeptieren',
      save: 'Speichern',
      purposes: {
        functional: {
          title: 'Notwendig',
          description:
            'Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.',
        },
        analytics: {
          title: 'Analyse',
          description:
            'Diese Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen.',
        },
        marketing: {
          title: 'Marketing',
          description:
            'Diese Cookies ermöglichen es uns, relevante Werbung zu schalten.',
        },
      },
      service: {
        disableAll: {
          title: 'Alle deaktivieren',
          description: 'Alle optionalen Dienste deaktivieren.',
        },
        optOut: {
          title: '(Opt-out)',
          description:
            'Dieser Dienst ist standardmäßig aktiviert. Du kannst ihn jederzeit deaktivieren.',
        },
        required: {
          title: '(immer aktiv)',
          description:
            'Dieser Dienst ist für die Funktion der Website notwendig.',
        },
        purpose: 'Zweck',
        purposes: 'Zwecke',
      },
    },
  },

  services: [
    {
      name: 'session',
      title: 'Sitzungs-Cookies',
      purposes: ['functional'],
      required: true,
      translations: {
        de: {
          description:
            'Speichert deine Einstellungen (z. B. Login-Status) für die Dauer deines Besuchs.',
        },
      },
    },
    {
      name: 'google-analytics',
      title: 'Google Analytics',
      purposes: ['analytics'],
      cookies: [/^_ga/, /^_gid/, /^_gat/],
      translations: {
        de: {
          description:
            'Analysiert das Nutzerverhalten, um unsere Inhalte und Performance zu verbessern. Daten werden anonymisiert an Google übermittelt.',
        },
      },
      onAccept: `
        if (window.gtag) {
          window['ga-disable-G-XXXXXXXXXX'] = false;
        }
      `,
      onDecline: `
        window['ga-disable-G-XXXXXXXXXX'] = true;
      `,
    },
    {
      name: 'meta-pixel',
      title: 'Meta Pixel',
      purposes: ['marketing'],
      cookies: ['_fbp', '_fbc'],
      translations: {
        de: {
          description:
            'Wird von Meta (Facebook/Instagram) verwendet, um die Wirksamkeit von Werbeanzeigen zu messen.',
        },
      },
    },
  ],
}

export default klaroConfig
