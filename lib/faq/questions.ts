/**
 * FAQ questions organized by category with cached answers.
 * Layer 1: Static, SEO-friendly, instant load.
 * Layer 2: AI-generated on-demand for freeform questions.
 */

export interface FAQQuestion {
  id: string;
  question: Record<string, string>; // locale -> question text
  answer: Record<string, string>;   // locale -> cached answer
  sources?: { label: string; href: string }[];
  category: string;
}

export interface FAQCategory {
  id: string;
  label: Record<string, string>;
  icon: string;
  questions: FAQQuestion[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'protocol',
    label: { en: 'The Protocol', fr: 'Le Protocole', es: 'El Protocolo', pt: 'O Protocolo', zh: '协议', ru: 'Протокол' },
    icon: '🧠',
    questions: [
      {
        id: 'what-is-mind-protocol',
        category: 'protocol',
        question: {
          en: 'What is Mind Protocol?',
          fr: "Qu'est-ce que Mind Protocol ?",
          es: '¿Qué es Mind Protocol?',
          pt: 'O que é o Mind Protocol?',
          zh: '什么是Mind Protocol？',
          ru: 'Что такое Mind Protocol?',
        },
        answer: {
          en: 'Mind Protocol is an open-source infrastructure for personal AI agents that understand your body, your mind, and eventually the people around you. It combines biometric data from wearables (Garmin, etc.) with AI (Claude) to create a persistent, context-aware companion that tracks your stress, sleep, HRV, and substance intake — then uses that data to provide personalized insights and co-regulation with your partner.',
          fr: "Mind Protocol est une infrastructure open-source pour des agents IA personnels qui comprennent votre corps, votre esprit, et éventuellement les personnes autour de vous. Il combine les données biométriques de vos wearables (Garmin, etc.) avec l'IA (Claude) pour créer un compagnon persistant et contextuel qui suit votre stress, sommeil, VRC et substances — puis utilise ces données pour fournir des insights personnalisés et de la co-régulation avec votre partenaire.",
        },
        sources: [
          { label: 'Whitepaper', href: '/whitepaper' },
          { label: 'Manifesto', href: '/manifesto' },
        ],
      },
      {
        id: 'what-is-mind-home',
        category: 'protocol',
        question: {
          en: 'What is Mind Home?',
          fr: "Qu'est-ce que Mind Home ?",
        },
        answer: {
          en: "Mind Home is Mind Protocol's core AI daemon — the always-on orchestrator that manages Claude sessions, reads biometric data, handles conversations across Telegram and WhatsApp, and dispatches autonomous tasks. Think of it as the 'nervous system' that connects your wearable data to AI intelligence.",
          fr: "Mind Home est le daemon IA central de Mind Protocol — l'orchestrateur toujours actif qui gère les sessions Claude, lit les données biométriques, gère les conversations via Telegram et WhatsApp, et dispatche des tâches autonomes. C'est le 'système nerveux' qui connecte vos données wearable à l'intelligence artificielle.",
        },
        sources: [{ label: 'self.md', href: '/self' }],
      },
      {
        id: 'what-is-duo',
        category: 'protocol',
        question: {
          en: 'What is Duo Mode / co-regulation?',
          fr: "Qu'est-ce que le mode Duo / co-régulation ?",
        },
        answer: {
          en: "Duo Mode lets two people share their biometric data through Mind Protocol. The AI computes synchrony (correlation between stress, HR, sleep patterns) and detects relationship phases: co-activation (both stressed), co-regulation (calming each other), divergent, or rebound. It surfaces insights like 'Your partner's stress is 2x yours today' and suggests when co-regulation support might help.",
          fr: "Le mode Duo permet à deux personnes de partager leurs données biométriques via Mind Protocol. L'IA calcule la synchronie (corrélation entre stress, FC, patterns de sommeil) et détecte les phases relationnelles : co-activation (les deux stressés), co-régulation (s'apaiser mutuellement), divergence ou rebond. Il fait remonter des insights comme 'Le stress de ton/ta partenaire est 2x le tien aujourd'hui'.",
        },
        sources: [{ label: 'Whitepaper', href: '/whitepaper' }],
      },
      {
        id: 'how-different',
        category: 'protocol',
        question: {
          en: 'How is this different from Apple Health or Fitbit?',
          fr: "En quoi c'est différent d'Apple Health ou Fitbit ?",
        },
        answer: {
          en: "Apple Health and Fitbit are data silos — they collect metrics but don't reason about them. Mind Protocol adds an AI layer that cross-references your biometrics with your context (substances, events, mood) and generates actionable insights. Plus, your data stays yours: open-source, self-hostable, no ads, no data sales. And it works across people, not just individuals.",
          fr: "Apple Health et Fitbit sont des silos de données — ils collectent des métriques mais ne raisonnent pas dessus. Mind Protocol ajoute une couche IA qui croise vos biométriques avec votre contexte (substances, événements, humeur) et génère des insights actionnables. En plus, vos données restent les vôtres : open-source, auto-hébergeable, pas de pub, pas de revente. Et ça fonctionne entre personnes, pas juste individuellement.",
        },
      },
    ],
  },
  {
    id: 'token',
    label: { en: '$MIND Token', fr: 'Token $MIND', es: 'Token $MIND', pt: 'Token $MIND', zh: '$MIND代币', ru: 'Токен $MIND' },
    icon: '💰',
    questions: [
      {
        id: 'what-is-mind-token',
        category: 'token',
        question: {
          en: 'What is $MIND and where can I buy it?',
          fr: "Qu'est-ce que $MIND et où l'acheter ?",
        },
        answer: {
          en: "$MIND is the native token of Mind Protocol on Solana (Token-2022 standard). It has 1M total supply, 9 decimals, and a 1% transfer fee that funds protocol development. You can buy it on Jupiter (jup.ag) — search for the mint address. We recommend Jupiter over Phantom for best Token-2022 compatibility.",
          fr: "$MIND est le token natif de Mind Protocol sur Solana (standard Token-2022). Il a 1M de supply total, 9 décimales, et 1% de frais de transfert qui finance le développement du protocole. Vous pouvez l'acheter sur Jupiter (jup.ag) — cherchez l'adresse du mint. On recommande Jupiter plutôt que Phantom pour la meilleure compatibilité Token-2022.",
        },
        sources: [
          { label: 'Token page', href: '/token' },
          { label: 'Tokenomics', href: '/tokenomics' },
        ],
      },
      {
        id: 'transfer-fee',
        category: 'token',
        question: {
          en: 'How does the 1% transfer fee work?',
          fr: 'Comment fonctionne le frais de transfert de 1% ?',
        },
        answer: {
          en: "Every $MIND transfer incurs a 1% fee that goes to the protocol treasury. This is enforced at the token level (Token-2022 TransferFee extension) — it can't be bypassed. The fee funds development, infrastructure, and eventually protocol rewards. It's like a micro-tax that sustains the ecosystem.",
          fr: "Chaque transfert de $MIND implique un frais de 1% qui va au trésor du protocole. C'est appliqué au niveau du token (extension TransferFee de Token-2022) — impossible à contourner. Les frais financent le développement, l'infrastructure, et à terme les récompenses du protocole.",
        },
        sources: [{ label: 'Tokenomics', href: '/tokenomics' }],
      },
      {
        id: 'lp-lock',
        category: 'token',
        question: {
          en: 'Is the liquidity locked?',
          fr: 'La liquidité est-elle verrouillée ?',
        },
        answer: {
          en: 'Yes. 100% of LP tokens are locked via Streamflow until February 2027. The pool is on FluxBeam. This means the founding team cannot pull liquidity — it ensures stability for holders.',
          fr: "Oui. 100% des tokens LP sont verrouillés via Streamflow jusqu'en février 2027. Le pool est sur FluxBeam. Cela signifie que l'équipe fondatrice ne peut pas retirer la liquidité — ça assure la stabilité pour les holders.",
        },
        sources: [{ label: 'Token page', href: '/token' }],
      },
    ],
  },
  {
    id: 'biometrics',
    label: { en: 'Biometrics & Tracker', fr: 'Biométrie & Tracker', es: 'Biometría & Tracker', pt: 'Biometria & Tracker', zh: '生物识别与追踪', ru: 'Биометрия и трекер' },
    icon: '📊',
    questions: [
      {
        id: 'what-garmin-data',
        category: 'biometrics',
        question: {
          en: 'What Garmin data does Mind Protocol read?',
          fr: 'Quelles données Garmin lit Mind Protocol ?',
        },
        answer: {
          en: 'We read: resting heart rate, HRV (Heart Rate Variability), stress levels (real-time + daily), sleep duration and quality, steps, Body Battery, and active workout data (HR zones, calories, distance). All data is pulled via Garmin Connect API using your saved credentials — nothing is stored on Garmin\'s servers by us.',
          fr: "On lit : fréquence cardiaque au repos, VRC (Variabilité de la Fréquence Cardiaque), niveaux de stress (temps réel + quotidien), durée et qualité du sommeil, pas, Body Battery, et données d'entraînement actif. Tout est récupéré via l'API Garmin Connect avec vos identifiants sauvegardés.",
        },
        sources: [{ label: 'Tracker', href: '/tracker' }],
      },
      {
        id: 'other-watches',
        category: 'biometrics',
        question: {
          en: 'Can I connect Apple Watch or Fitbit?',
          fr: 'Puis-je connecter une Apple Watch ou Fitbit ?',
        },
        answer: {
          en: "Not yet. Garmin is our primary integration because it exposes the richest API (especially real-time stress and HRV). Apple Watch support is on the roadmap but requires a companion iOS app due to HealthKit restrictions. Fitbit/Google Health Connect is also planned.",
          fr: "Pas encore. Garmin est notre intégration principale car il expose l'API la plus riche (surtout le stress temps réel et la VRC). Le support Apple Watch est prévu mais nécessite une app iOS compagnon à cause des restrictions HealthKit. Fitbit/Google Health Connect est aussi planifié.",
        },
      },
      {
        id: 'substance-tracking',
        category: 'biometrics',
        question: {
          en: 'What substances can I track?',
          fr: 'Quelles substances puis-je suivre ?',
        },
        answer: {
          en: 'Anything you consume: caffeine, alcohol, supplements (magnesium, vitamin D, etc.), medications, nootropics, cannabis, nicotine, and more. The AI cross-references your intake timestamps with your biometric data to find correlations — like how your afternoon coffee affects your evening HRV, or how magnesium impacts your sleep quality.',
          fr: "Tout ce que vous consommez : caféine, alcool, suppléments (magnésium, vitamine D, etc.), médicaments, nootropiques, cannabis, nicotine, et plus. L'IA croise vos heures de prise avec vos données biométriques pour trouver des corrélations — comme l'effet de votre café d'après-midi sur votre VRC du soir.",
        },
        sources: [{ label: 'Tracker', href: '/tracker' }],
      },
    ],
  },
  {
    id: 'privacy',
    label: { en: 'Privacy & Data', fr: 'Vie privée & Données', es: 'Privacidad & Datos', pt: 'Privacidade & Dados', zh: '隐私与数据', ru: 'Конфиденциальность' },
    icon: '🔒',
    questions: [
      {
        id: 'data-shared',
        category: 'privacy',
        question: {
          en: 'Is my biometric data shared with anyone?',
          fr: 'Mes données biométriques sont-elles partagées ?',
        },
        answer: {
          en: "No. Your biometric data is processed locally by Mind Home and never shared with third parties. In Duo Mode, only computed metrics (synchrony scores, phase detection) are shared with your partner — never raw data. The AI processes your data in-session and doesn't retain it after the conversation ends.",
          fr: "Non. Vos données biométriques sont traitées localement par Mind Home et jamais partagées avec des tiers. En mode Duo, seules les métriques calculées (scores de synchronie, détection de phase) sont partagées avec votre partenaire — jamais les données brutes.",
        },
        sources: [{ label: 'Privacy Policy', href: '/privacy' }],
      },
      {
        id: 'data-storage',
        category: 'privacy',
        question: {
          en: 'Where is my data stored?',
          fr: 'Où sont stockées mes données ?',
        },
        answer: {
          en: 'Biometric data is stored locally on the Mind Home server (JSONL files). The web platform stores user profiles and health records in Supabase (PostgreSQL). All communication is encrypted in transit (TLS). The entire codebase is open-source — you can audit exactly what is collected and how.',
          fr: "Les données biométriques sont stockées localement sur le serveur Mind Home (fichiers JSONL). La plateforme web stocke les profils et dossiers santé dans Supabase (PostgreSQL). Toutes les communications sont chiffrées en transit (TLS). Le code est entièrement open-source — vous pouvez auditer exactement ce qui est collecté.",
        },
        sources: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'GitHub', href: 'https://github.com/mind-protocol' },
        ],
      },
      {
        id: 'delete-data',
        category: 'privacy',
        question: {
          en: 'Can I delete my data?',
          fr: 'Puis-je supprimer mes données ?',
        },
        answer: {
          en: 'Yes. You can request full data deletion at any time via the /deletion page. This removes your user profile, biometric history, conversation logs, and Garmin tokens. Deletion is irreversible and processed within 48 hours.',
          fr: "Oui. Vous pouvez demander la suppression complète de vos données à tout moment via la page /deletion. Cela supprime votre profil, historique biométrique, logs de conversation et tokens Garmin. La suppression est irréversible et traitée sous 48h.",
        },
        sources: [{ label: 'Data Deletion', href: '/deletion' }],
      },
    ],
  },
  {
    id: 'getting-started',
    label: { en: 'Getting Started', fr: 'Premiers pas', es: 'Primeros pasos', pt: 'Começando', zh: '入门指南', ru: 'Начало работы' },
    icon: '👥',
    questions: [
      {
        id: 'how-register',
        category: 'getting-started',
        question: {
          en: 'How do I register?',
          fr: 'Comment créer un compte ?',
        },
        answer: {
          en: 'Go to /register and create an account with your email. You\'ll become a "citizen" of the protocol. From there, you can connect your Garmin watch, start tracking substances, and chat with the AI via the website, Telegram (@mind_protocol_bot), or WhatsApp.',
          fr: "Allez sur /register et créez un compte avec votre email. Vous deviendrez un 'citoyen' du protocole. De là, vous pouvez connecter votre montre Garmin, commencer à tracker vos substances, et discuter avec l'IA via le site, Telegram (@mind_protocol_bot), ou WhatsApp.",
        },
        sources: [{ label: 'Register', href: '/register' }],
      },
      {
        id: 'connect-garmin',
        category: 'getting-started',
        question: {
          en: 'How do I connect my Garmin watch?',
          fr: 'Comment connecter ma montre Garmin ?',
        },
        answer: {
          en: "After registering, go to the Tracker page and click 'Link Garmin'. Enter your Garmin Connect credentials (email + password). If you have MFA enabled, you'll need to enter the code within 5 minutes. Your credentials are used once to obtain session tokens — we never store your password.",
          fr: "Après inscription, allez sur la page Tracker et cliquez 'Lier Garmin'. Entrez vos identifiants Garmin Connect (email + mot de passe). Si vous avez la MFA activée, vous devrez entrer le code dans les 5 minutes. Vos identifiants sont utilisés une seule fois pour obtenir des tokens de session — on ne stocke jamais votre mot de passe.",
        },
        sources: [{ label: 'Tracker', href: '/tracker' }],
      },
      {
        id: 'talk-to-ai',
        category: 'getting-started',
        question: {
          en: 'How do I talk to the AI?',
          fr: "Comment parler à l'IA ?",
        },
        answer: {
          en: 'Three ways: (1) The chat widget on this website (bottom-right corner), (2) Telegram — search for @mind_protocol_bot, (3) WhatsApp — message the number linked on our channels. The AI understands English, French, Chinese, and auto-detects your language.',
          fr: "Trois façons : (1) Le widget chat sur ce site (coin bas-droit), (2) Telegram — cherchez @mind_protocol_bot, (3) WhatsApp — envoyez un message au numéro partagé sur nos canaux. L'IA comprend le français, l'anglais, le chinois, et détecte automatiquement votre langue.",
        },
      },
    ],
  },
  {
    id: 'technical',
    label: { en: 'Technical', fr: 'Technique', es: 'Técnico', pt: 'Técnico', zh: '技术', ru: 'Техническое' },
    icon: '🛠️',
    questions: [
      {
        id: 'tech-stack',
        category: 'technical',
        question: {
          en: "What's the tech stack?",
          fr: 'Quel est le stack technique ?',
        },
        answer: {
          en: 'Backend: Python (Flask/FastAPI), Claude Code as AI engine, systemd services on Linux. Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Three.js for 3D. Data: Supabase (PostgreSQL), JSONL files for biometrics. Blockchain: Solana (Token-2022). Messaging: Telegram Bot API, WAHA (WhatsApp). Deployment: Render (API), Vercel (frontend).',
          fr: "Backend : Python (Flask/FastAPI), Claude Code comme moteur IA, services systemd sur Linux. Frontend : Next.js 14 (App Router), TypeScript, Tailwind CSS, Three.js pour la 3D. Données : Supabase (PostgreSQL), fichiers JSONL pour la biométrie. Blockchain : Solana (Token-2022). Messagerie : Telegram Bot API, WAHA (WhatsApp). Déploiement : Render (API), Vercel (frontend).",
        },
        sources: [{ label: 'GitHub', href: 'https://github.com/mind-protocol' }],
      },
      {
        id: 'open-source',
        category: 'technical',
        question: {
          en: 'Is Mind Protocol open source?',
          fr: 'Mind Protocol est-il open source ?',
        },
        answer: {
          en: "Yes. The core repositories (mind-home, mind-platform, mind-mcp) are open-source on GitHub under the mind-protocol organization. You can self-host the entire stack. We believe transparency is essential for a protocol that handles personal health data.",
          fr: "Oui. Les dépôts principaux (mind-home, mind-platform, mind-mcp) sont open-source sur GitHub sous l'organisation mind-protocol. Vous pouvez auto-héberger tout le stack. On croit que la transparence est essentielle pour un protocole qui gère des données de santé personnelles.",
        },
        sources: [{ label: 'GitHub', href: 'https://github.com/mind-protocol' }],
      },
    ],
  },
];

/** Flatten all questions for search */
export function getAllQuestions(): FAQQuestion[] {
  return FAQ_CATEGORIES.flatMap((cat) => cat.questions);
}

/** Get question by ID */
export function getQuestionById(id: string): FAQQuestion | undefined {
  return getAllQuestions().find((q) => q.id === id);
}
