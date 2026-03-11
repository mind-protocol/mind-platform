/* ─── Substance Database — Layer 1: Public Harm Reduction ─── */

export type SubstanceClass =
  | 'stimulant'
  | 'psychedelic'
  | 'empathogen'
  | 'depressant'
  | 'opioid'
  | 'cannabinoid'
  | 'dissociative'
  | 'inhalant';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'extreme';

export interface BiometricImpact {
  hrv: { direction: 'down' | 'up' | 'variable'; magnitude: string };
  heartRate: { direction: 'up' | 'down' | 'variable'; magnitude: string };
  sleep: string;
  stress: string;
  bodyBattery: string;
  recoveryTime: string;
}

export interface Interaction {
  substance: string;
  risk: RiskLevel;
  description: Record<string, string>;
}

export interface Substance {
  id: string;
  name: Record<string, string>;
  class: SubstanceClass;
  aliases: Record<string, string[]>;
  legalStatusFR: Record<string, string>;
  color: string;
  summary: Record<string, string>;
  effects: {
    shortTerm: Record<string, string>;
    longTerm: Record<string, string>;
    duration: string;
  };
  dependence: {
    physical: RiskLevel;
    psychological: RiskLevel;
  };
  overdoseRisk: RiskLevel;
  topInteractions: Interaction[];
  biometric: BiometricImpact;
  keyFact: Record<string, string>;
  sources: string[];
}

export interface SubstanceCategory {
  id: string;
  label: Record<string, string>;
  icon: string;
  color: string;
  substances: string[]; // substance IDs
}

/* ─── Categories ─── */

export const CATEGORIES: SubstanceCategory[] = [
  {
    id: 'stimulants',
    label: { en: 'Stimulants', fr: 'Stimulants' },
    icon: '\u26A1',
    color: '#f59e0b',
    substances: ['cocaine', 'crack', 'amphetamines', '3mmc', 'captagon', 'tobacco', 'caffeine', 'methylphenidate', 'mephedrone'],
  },
  {
    id: 'psychedelics',
    label: { en: 'Psychedelics', fr: 'Psych\u00e9d\u00e9liques' },
    icon: '\uD83C\uDF00',
    color: '#8b5cf6',
    substances: ['lsd', 'psilocybin', 'dmt', 'twocb'],
  },
  {
    id: 'empathogen',
    label: { en: 'Empathogens', fr: 'Empathog\u00e8nes' },
    icon: '\uD83D\uDC9C',
    color: '#ec4899',
    substances: ['mdma'],
  },
  {
    id: 'cannabinoids',
    label: { en: 'Cannabis', fr: 'Cannabis' },
    icon: '\uD83C\uDF3F',
    color: '#22c55e',
    substances: ['cannabis', 'synthetic-cannabinoids'],
  },
  {
    id: 'opioids',
    label: { en: 'Opioids', fr: 'Opio\u00efdes' },
    icon: '\uD83D\uDEA8',
    color: '#ef4444',
    substances: ['heroin', 'codeine', 'fentanyl', 'tramadol', 'kratom'],
  },
  {
    id: 'depressants',
    label: { en: 'Depressants', fr: 'D\u00e9presseurs' },
    icon: '\uD83E\uDEE7',
    color: '#6366f1',
    substances: ['alcohol', 'ghb', 'benzodiazepines', 'pregabalin'],
  },
  {
    id: 'dissociatives',
    label: { en: 'Dissociatives', fr: 'Dissociatifs' },
    icon: '\uD83C\uDF00',
    color: '#06b6d4',
    substances: ['ketamine', 'salvia', 'dxm'],
  },
  {
    id: 'inhalants',
    label: { en: 'Inhalants', fr: 'Inhalants' },
    icon: '\uD83D\uDCA8',
    color: '#64748b',
    substances: ['nitrous', 'poppers'],
  },
];

/* ─── Substances ─── */

export const SUBSTANCES: Record<string, Substance> = {
  cannabis: {
    id: 'cannabis',
    name: { en: 'Cannabis', fr: 'Cannabis' },
    class: 'cannabinoid',
    aliases: {
      en: ['weed', 'marijuana', 'hash', 'pot', 'THC'],
      fr: ['beuh', 'weed', 'shit', 'hasch', 'herbe', 'joint', 'p\u00e9tard', 'teuch'],
    },
    legalStatusFR: {
      en: 'Illegal — classified as stup\u00e9fiant',
      fr: 'Ill\u00e9gal — class\u00e9 stup\u00e9fiant',
    },
    color: '#22c55e',
    summary: {
      en: 'Most widely used illegal substance in France (45% of adults have tried it). Effects range from relaxation and euphoria to anxiety and paranoia depending on strain, dose, and individual.',
      fr: 'Substance ill\u00e9gale la plus consomm\u00e9e en France (45% des adultes ont essay\u00e9). Effets allant de la relaxation et l\u2019euphorie \u00e0 l\u2019anxi\u00e9t\u00e9 et la parano\u00efa selon la vari\u00e9t\u00e9, le dosage et l\u2019individu.',
    },
    effects: {
      shortTerm: {
        en: 'Relaxation, euphoria, altered perception, increased appetite, dry mouth, red eyes, impaired short-term memory and coordination',
        fr: 'Relaxation, euphorie, perception alt\u00e9r\u00e9e, app\u00e9tit augment\u00e9, bouche s\u00e8che, yeux rouges, m\u00e9moire court terme et coordination r\u00e9duites',
      },
      longTerm: {
        en: 'Cognitive impairment (largely reversible), respiratory issues if smoked, possible amotivational syndrome (debated), cannabis use disorder in ~9% of users',
        fr: 'Alt\u00e9ration cognitive (largement r\u00e9versible), probl\u00e8mes respiratoires si fum\u00e9, possible syndrome amotivationnel (d\u00e9battu), trouble de l\u2019usage chez ~9% des consommateurs',
      },
      duration: '2-4h (smoked) / 4-8h (edibles)',
    },
    dependence: { physical: 'low', psychological: 'moderate' },
    overdoseRisk: 'low',
    topInteractions: [
      { substance: 'Alcohol', risk: 'moderate', description: { en: 'Suppresses vomiting reflex — risk of alcohol poisoning', fr: 'Supprime le r\u00e9flexe de vomissement — risque d\u2019intoxication alcoolique' } },
      { substance: 'Psychedelics', risk: 'high', description: { en: 'Potentiates effects unpredictably — common bad trip trigger', fr: 'Potentialise les effets de mani\u00e8re impr\u00e9visible — d\u00e9clencheur fr\u00e9quent de bad trip' } },
      { substance: 'Synthetic cannabinoids', risk: 'extreme', description: { en: 'NOT cannabis — completely different risk profile, seizures, death', fr: 'PAS du cannabis — profil de risque totalement diff\u00e9rent, convulsions, d\u00e9c\u00e8s' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '10-25%' },
      heartRate: { direction: 'up', magnitude: '+10-30 bpm' },
      sleep: 'REM suppression, less deep sleep architecture',
      stress: 'Moderate elevation (30-50 range)',
      bodyBattery: 'Incomplete recharge pattern overnight',
      recoveryTime: '24-48h for occasional use',
    },
    keyFact: {
      en: 'The #1 danger in the French cannabis market is not cannabis itself — it\u2019s synthetic cannabinoids sprayed on low-quality flower or hash. These are completely different substances with seizure and death risk.',
      fr: 'Le danger #1 sur le march\u00e9 fran\u00e7ais n\u2019est pas le cannabis lui-m\u00eame — ce sont les cannabino\u00efdes synth\u00e9tiques pulv\u00e9ris\u00e9s sur du shit ou de la weed de mauvaise qualit\u00e9. Ce sont des substances totalement diff\u00e9rentes avec risque de convulsions et de d\u00e9c\u00e8s.',
    },
    sources: ['PubMed: Volkow et al. 2014', 'PsychonautWiki', 'Erowid', 'OFDT 2023', 'EMCDDA'],
  },

  cocaine: {
    id: 'cocaine',
    name: { en: 'Cocaine', fr: 'Coca\u00efne' },
    class: 'stimulant',
    aliases: {
      en: ['coke', 'blow', 'snow', 'powder'],
      fr: ['coke', 'C', 'CC', 'blanche', 'neige', 'p\u00e9ruvienne', 'poudre'],
    },
    legalStatusFR: {
      en: 'Illegal — classified as stup\u00e9fiant',
      fr: 'Ill\u00e9gal — class\u00e9 stup\u00e9fiant',
    },
    color: '#f59e0b',
    summary: {
      en: 'Powerful short-acting stimulant. 5.6% of French adults have tried it. Extremely addictive, especially in freebase/crack form. Street purity in France averages 10-50%, with dangerous adulterants.',
      fr: 'Stimulant puissant \u00e0 courte dur\u00e9e. 5,6% des adultes fran\u00e7ais ont essay\u00e9. Extr\u00eamement addictif, surtout sous forme crack/freebase. Puret\u00e9 de rue en France 10-50% en moyenne, avec des adulterants dangereux.',
    },
    effects: {
      shortTerm: {
        en: 'Intense euphoria, energy, confidence, alertness, reduced appetite, dilated pupils, increased heart rate and blood pressure',
        fr: '\u00c9uphorie intense, \u00e9nergie, confiance, vigilance, app\u00e9tit r\u00e9duit, pupilles dilat\u00e9es, rythme cardiaque et pression art\u00e9rielle augment\u00e9s',
      },
      longTerm: {
        en: 'Cardiovascular damage, nasal septum perforation, cognitive decline, paranoia, depression, financial ruin',
        fr: 'Dommages cardiovasculaires, perforation septum nasal, d\u00e9clin cognitif, parano\u00efa, d\u00e9pression, ruine financi\u00e8re',
      },
      duration: '15-30 min (snorted) / 5-10 min (smoked)',
    },
    dependence: { physical: 'moderate', psychological: 'high' },
    overdoseRisk: 'high',
    topInteractions: [
      { substance: 'Alcohol', risk: 'extreme', description: { en: 'Forms cocaethylene in liver — 18-25x increased cardiac death risk', fr: 'Forme de la coca\u00e9thyl\u00e8ne dans le foie — risque de mort cardiaque multipli\u00e9 par 18-25' } },
      { substance: 'Opioids (speedball)', risk: 'extreme', description: { en: 'Cocaine wears off before opioid — respiratory depression unmasked', fr: 'La coca\u00efne s\u2019estompe avant l\u2019opio\u00efde — d\u00e9pression respiratoire d\u00e9masqu\u00e9e' } },
      { substance: 'MAOIs', risk: 'extreme', description: { en: 'Hypertensive crisis — potentially lethal', fr: 'Crise hypertensive — potentiellement l\u00e9tale' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '30-60%' },
      heartRate: { direction: 'up', magnitude: '+20-50 bpm' },
      sleep: 'Architecture destroyed — minimal deep sleep, fragmented REM',
      stress: 'Extreme elevation (70-100 range)',
      bodyBattery: 'Rapid drain, poor overnight recovery',
      recoveryTime: '48-72h for single session',
    },
    keyFact: {
      en: 'Mixing cocaine with alcohol creates cocaethylene in your liver — a unique compound that multiplies cardiac death risk by 18-25x. This is the #1 most dangerous common drug combination.',
      fr: 'M\u00e9langer coca\u00efne et alcool cr\u00e9e de la coca\u00e9thyl\u00e8ne dans le foie — un compos\u00e9 unique qui multiplie le risque de mort cardiaque par 18-25. C\u2019est LA combinaison courante la plus dangereuse.',
    },
    sources: ['PubMed: Andrews 1997 (cocaethylene)', 'OFDT/SINTES', 'PsychonautWiki', 'DanceSafe', 'EMCDDA'],
  },

  crack: {
    id: 'crack',
    name: { en: 'Crack Cocaine', fr: 'Crack' },
    class: 'stimulant',
    aliases: {
      en: ['crack', 'rock', 'freebase'],
      fr: ['caillou', 'galette', 'roche', 'caillasse', 'pierre'],
    },
    legalStatusFR: {
      en: 'Illegal — classified as stup\u00e9fiant',
      fr: 'Ill\u00e9gal — class\u00e9 stup\u00e9fiant',
    },
    color: '#dc2626',
    summary: {
      en: 'Smokable form of cocaine with near-instant onset (5-10 seconds) and very short peak (5-15 min). This extreme speed creates one of the most compulsive patterns of any substance. Strongly linked to homelessness and extreme precarity.',
      fr: 'Forme fumable de la coca\u00efne avec onset quasi instantan\u00e9 (5-10 secondes) et pic tr\u00e8s court (5-15 min). Cette vitesse extr\u00eame cr\u00e9e un des patterns les plus compulsifs. Fortement li\u00e9 \u00e0 l\u2019itin\u00e9rance et la pr\u00e9carit\u00e9 extr\u00eame.',
    },
    effects: {
      shortTerm: {
        en: 'Intense but extremely brief euphoria, extreme energy, paranoia, agitation, dilated pupils',
        fr: '\u00c9uphorie intense mais extr\u00eamement br\u00e8ve, \u00e9nergie extr\u00eame, parano\u00efa, agitation, pupilles dilat\u00e9es',
      },
      longTerm: {
        en: 'Pulmonary damage ("crack lung"), cardiovascular disease, dental destruction, severe malnutrition, psychosis',
        fr: 'Dommages pulmonaires, maladies cardiovasculaires, destruction dentaire, malnutrition s\u00e9v\u00e8re, psychose',
      },
      duration: '5-15 min peak, crash within 30 min',
    },
    dependence: { physical: 'moderate', psychological: 'extreme' },
    overdoseRisk: 'high',
    topInteractions: [
      { substance: 'Opioids', risk: 'extreme', description: { en: 'Speedball pattern — #1 cause of death in polydrug users', fr: 'Pattern speedball — cause #1 de d\u00e9c\u00e8s chez les polyconsommateurs' } },
      { substance: 'Alcohol', risk: 'extreme', description: { en: 'Cocaethylene + dehydration + malnutrition = cardiac risk', fr: 'Coca\u00e9thyl\u00e8ne + d\u00e9shydratation + malnutrition = risque cardiaque' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '40-70%' },
      heartRate: { direction: 'up', magnitude: '+30-60 bpm (sawtooth pattern during binges)' },
      sleep: 'Destroyed — binge-crash cycles visible on data',
      stress: 'Extreme (80-100 sustained)',
      bodyBattery: 'Permanently pinned at 5-30 during active use',
      recoveryTime: '3-7 days minimum',
    },
    keyFact: {
      en: 'Crack creates a distinctive "sawtooth" heart rate pattern visible on Garmin — repeated spikes of 30-60 bpm at 3 AM while stationary. This biometric signature is essentially unmistakable.',
      fr: 'Le crack cr\u00e9e un pattern de fr\u00e9quence cardiaque en "dents de scie" visible sur Garmin — pics r\u00e9p\u00e9t\u00e9s de 30-60 bpm \u00e0 3h du matin immobile. Cette signature biom\u00e9trique est quasi impossible \u00e0 confondre.',
    },
    sources: ['PubMed', 'OFDT', 'EMCDDA', 'SCMR Paris data'],
  },

  amphetamines: {
    id: 'amphetamines',
    name: { en: 'Amphetamines', fr: 'Amph\u00e9tamines' },
    class: 'stimulant',
    aliases: {
      en: ['speed', 'meth', 'ice', 'crystal', 'adderall'],
      fr: ['speed', 'amph\u00e8t', 'p\u00e9ta', 'p\u00e2te', 'ice', 'cristal'],
    },
    legalStatusFR: {
      en: 'Illegal (street) / Strictly controlled prescription (Elvanse)',
      fr: 'Ill\u00e9gal (rue) / Prescription contr\u00f4l\u00e9e (Elvanse)',
    },
    color: '#f97316',
    summary: {
      en: 'Long-acting stimulant (4-8h+ vs cocaine\u2019s 30 min). Street amphetamine ("speed") is often sold as paste with variable purity. Methamphetamine is far more potent and neurotoxic.',
      fr: 'Stimulant \u00e0 longue dur\u00e9e (4-8h+ vs 30 min coca\u00efne). Le speed de rue est souvent vendu en p\u00e2te avec une puret\u00e9 variable. La m\u00e9thamph\u00e9tamine est bien plus puissante et neurotoxique.',
    },
    effects: {
      shortTerm: {
        en: 'Intense focus, energy, euphoria, appetite suppression, jaw clenching, rapid speech, insomnia',
        fr: 'Concentration intense, \u00e9nergie, euphorie, coupe-faim, serrement de m\u00e2choire, logorrh\u00e9e, insomnie',
      },
      longTerm: {
        en: 'Neurotoxicity (especially meth), psychosis (threshold: 36h+ without sleep), cardiovascular damage, dental destruction (meth), malnutrition',
        fr: 'Neurotoxicit\u00e9 (surtout m\u00e9th), psychose (seuil : 36h+ sans sommeil), dommages cardiovasculaires, destruction dentaire (m\u00e9th), malnutrition',
      },
      duration: '4-8h (speed) / 8-24h (meth)',
    },
    dependence: { physical: 'moderate', psychological: 'high' },
    overdoseRisk: 'high',
    topInteractions: [
      { substance: 'MAOIs', risk: 'extreme', description: { en: 'Hypertensive crisis — potentially lethal', fr: 'Crise hypertensive — potentiellement l\u00e9tale' } },
      { substance: 'Other stimulants', risk: 'high', description: { en: 'Additive cardiovascular strain', fr: 'Surcharge cardiovasculaire additive' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '30-60%' },
      heartRate: { direction: 'up', magnitude: '+20-40 bpm (sustained for hours)' },
      sleep: 'Severely disrupted for 12-24h+ — 3-5x longer than cocaine',
      stress: 'Sustained high (60-90) for hours',
      bodyBattery: 'Deep drain, 2-3 day recovery',
      recoveryTime: '48-96h',
    },
    keyFact: {
      en: 'Amphetamine-induced psychosis can occur after 36+ hours without sleep. The brain cannot distinguish it from schizophrenia. Risk increases with each episode (kindling effect).',
      fr: 'La psychose amph\u00e9taminique peut survenir apr\u00e8s 36h+ sans sommeil. Le cerveau ne la distingue pas de la schizophr\u00e9nie. Le risque augmente \u00e0 chaque \u00e9pisode (effet kindling).',
    },
    sources: ['PubMed: Volkow, Sato', 'EMCDDA', 'PsychonautWiki', 'OFDT'],
  },

  '3mmc': {
    id: '3mmc',
    name: { en: '3-MMC', fr: '3-MMC' },
    class: 'stimulant',
    aliases: {
      en: ['3-methylmethcathinone', 'metaphedrone', '3M'],
      fr: ['3M', 'm\u00e9ph\u00e9', 'cristaux'],
    },
    legalStatusFR: {
      en: 'Illegal since 2021 — classified as stup\u00e9fiant',
      fr: 'Ill\u00e9gal depuis 2021 — class\u00e9 stup\u00e9fiant',
    },
    color: '#e879f9',
    summary: {
      en: 'Synthetic cathinone with stimulant + empathogenic effects. Positioned between MDMA and cocaine. Short duration drives extreme compulsive redosing — the defining danger of this substance.',
      fr: 'Cathinone synth\u00e9tique avec effets stimulants + empathog\u00e8nes. Positionn\u00e9 entre MDMA et coca\u00efne. La courte dur\u00e9e pousse au redosage compulsif extr\u00eame — le danger d\u00e9finissant de cette substance.',
    },
    effects: {
      shortTerm: {
        en: 'Euphoria, empathy, energy, confidence, sexual arousal, jaw clenching, sweating',
        fr: '\u00c9uphorie, empathie, \u00e9nergie, confiance, excitation sexuelle, serrement de m\u00e2choire, transpiration',
      },
      longTerm: {
        en: 'Limited research — suspected neurotoxicity, high psychological dependence, binge-crash cycles, cardiovascular strain',
        fr: 'Recherche limit\u00e9e — neurotoxicit\u00e9 suspect\u00e9e, forte d\u00e9pendance psychologique, cycles binge-crash, surcharge cardiovasculaire',
      },
      duration: '1-2h (oral) / 30-60 min (nasal) — drives redosing',
    },
    dependence: { physical: 'low', psychological: 'extreme' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'MAOIs', risk: 'extreme', description: { en: 'Potentially fatal serotonergic crisis', fr: 'Crise s\u00e9rotoninergique potentiellement fatale' } },
      { substance: 'GHB/GBL', risk: 'extreme', description: { en: 'Life-threatening respiratory/cardiac interaction', fr: 'Interaction respiratoire/cardiaque potentiellement mortelle' } },
      { substance: 'Other stimulants', risk: 'high', description: { en: 'Additive cardiovascular load', fr: 'Surcharge cardiovasculaire additive' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '25-50%' },
      heartRate: { direction: 'up', magnitude: '+15-40 bpm (escalates with redosing)' },
      sleep: 'Severe disruption, especially with evening/night use',
      stress: 'Elevated (50-80), spikes with each redose',
      bodyBattery: 'Drain proportional to binge duration',
      recoveryTime: '24-48h (single dose) / 4-7 days (heavy binge)',
    },
    keyFact: {
      en: 'The redosing trap: 3-MMC\u2019s short peak shifts from serotonin (empathy) to dopamine (compulsion) on redose. Each redose gives less euphoria but stronger urge to redose. The cycle can consume 48h+ without the user intending it.',
      fr: 'Le pi\u00e8ge du redosage : le pic court de la 3-MMC passe de la s\u00e9rotonine (empathie) \u00e0 la dopamine (compulsion) au redosage. Chaque redose donne moins d\u2019euphorie mais une envie plus forte. Le cycle peut durer 48h+ sans que l\u2019utilisateur l\u2019ait voulu.',
    },
    sources: ['PubMed: Zwartsen, Simmler', 'EMCDDA', 'PsychonautWiki', 'OFDT'],
  },

  captagon: {
    id: 'captagon',
    name: { en: 'Captagon', fr: 'Captagon' },
    class: 'stimulant',
    aliases: {
      en: ['fenethylline', 'abu hilalain', 'jihadi drug'],
      fr: ['captagon', 'la m\u00e8re rose', 'drogue des jihadistes'],
    },
    legalStatusFR: {
      en: 'Illegal — fenethylline banned since 1986',
      fr: 'Ill\u00e9gal — f\u00e9n\u00e9thylline interdite depuis 1986',
    },
    color: '#a3a3a3',
    summary: {
      en: 'Media-mythologized as a "superhuman drug" but pharmacologically just amphetamine + theophylline. Fewer than 5% of seized "Captagon" pills contain actual fenethylline — most are amphetamine + caffeine of unknown dose.',
      fr: 'Mythifi\u00e9 par les m\u00e9dias comme "drogue des super-soldats" mais pharmacologiquement c\u2019est amph\u00e9tamine + th\u00e9ophylline. Moins de 5% des pilules saisies contiennent de la f\u00e9n\u00e9thylline — la plupart sont amph\u00e9tamine + caf\u00e9ine \u00e0 dose inconnue.',
    },
    effects: {
      shortTerm: {
        en: 'Alertness, suppressed fear/pain/fatigue, euphoria, confidence, insomnia — essentially amphetamine effects',
        fr: 'Vigilance, suppression peur/douleur/fatigue, euphorie, confiance, insomnie — essentiellement des effets amph\u00e9taminiques',
      },
      longTerm: {
        en: 'Cardiovascular damage, psychosis risk, dependence — same as amphetamine',
        fr: 'Dommages cardiovasculaires, risque de psychose, d\u00e9pendance — identique \u00e0 l\u2019amph\u00e9tamine',
      },
      duration: '4-8h',
    },
    dependence: { physical: 'moderate', psychological: 'high' },
    overdoseRisk: 'high',
    topInteractions: [
      { substance: 'MAOIs', risk: 'extreme', description: { en: 'Hypertensive crisis', fr: 'Crise hypertensive' } },
      { substance: 'Other stimulants', risk: 'high', description: { en: 'Additive cardiovascular strain', fr: 'Surcharge cardiovasculaire additive' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '40-70%' },
      heartRate: { direction: 'up', magnitude: '+25-50 bpm' },
      sleep: 'Impossible for 8-16h',
      stress: 'Extreme (70-100)',
      bodyBattery: 'Severe drain',
      recoveryTime: '48-96h',
    },
    keyFact: {
      en: 'Most "Captagon" pills contain zero fenethylline. You are taking unknown doses of amphetamine + caffeine + potentially anything else. The "jihadi super-drug" narrative is media fiction — the pharmacology is ordinary stimulant.',
      fr: 'La plupart des pilules "Captagon" ne contiennent z\u00e9ro f\u00e9n\u00e9thylline. Vous prenez des doses inconnues d\u2019amph\u00e9tamine + caf\u00e9ine + potentiellement n\u2019importe quoi d\u2019autre. Le r\u00e9cit "super-drogue jihadiste" est une fiction m\u00e9diatique.',
    },
    sources: ['UNODC', 'EMCDDA', 'PubMed', 'Wikipedia: Fenethylline'],
  },

  tobacco: {
    id: 'tobacco',
    name: { en: 'Tobacco', fr: 'Tabac' },
    class: 'stimulant',
    aliases: {
      en: ['nicotine', 'cigarettes', 'cigs', 'smokes'],
      fr: ['clope', 's\u00e8che', 'cigarette', 'tabac', 'tige'],
    },
    legalStatusFR: {
      en: 'Legal — heavily taxed (~12\u20AC/pack), age-restricted 18+',
      fr: 'L\u00e9gal — fortement tax\u00e9 (~12\u20AC/paquet), interdit aux -18 ans',
    },
    color: '#78716c',
    summary: {
      en: 'The substance that kills more people than all illegal drugs combined — by orders of magnitude. 75,000 deaths/year in France. Nicotine has the highest capture rate of any commonly used substance (~32%).',
      fr: 'La substance qui tue plus que toutes les drogues ill\u00e9gales combin\u00e9es — de plusieurs ordres de grandeur. 75 000 d\u00e9c\u00e8s/an en France. La nicotine a le taux de capture le plus \u00e9lev\u00e9 de toute substance courante (~32%).',
    },
    effects: {
      shortTerm: {
        en: 'Biphasic: stimulant at low doses, relaxant at higher. Alertness, appetite suppression, stress relief (paradox: subjective relief but objective stress increase)',
        fr: 'Biphasique : stimulant \u00e0 faible dose, relaxant \u00e0 forte dose. Vigilance, coupe-faim, soulagement du stress (paradoxe : soulagement subjectif mais augmentation objective du stress)',
      },
      longTerm: {
        en: 'Cancer (lung, throat, bladder+), COPD, cardiovascular disease, stroke. The REAL killer: 75,000 deaths/year in France vs ~500 for all illegal drug ODs',
        fr: 'Cancer (poumon, gorge, vessie+), BPCO, maladies cardiovasculaires, AVC. Le VRAI tueur : 75 000 d\u00e9c\u00e8s/an vs ~500 pour toutes les overdoses ill\u00e9gales',
      },
      duration: 'Seconds onset, 1-2h before craving returns',
    },
    dependence: { physical: 'extreme', psychological: 'extreme' },
    overdoseRisk: 'low',
    topInteractions: [
      { substance: 'Oral contraceptives', risk: 'high', description: { en: 'Synergistic blood clot risk — most under-communicated lethal interaction', fr: 'Risque de caillots sanguins synergique — interaction l\u00e9tale la plus sous-communiqu\u00e9e' } },
      { substance: 'Other stimulants', risk: 'moderate', description: { en: 'Additive cardiovascular strain', fr: 'Surcharge cardiovasculaire additive' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '20-40% (chronic suppression)' },
      heartRate: { direction: 'up', magnitude: 'Elevated baseline +5-10 bpm' },
      sleep: 'Disrupted, especially late-night smoking',
      stress: 'Sawtooth pattern — graphs the addiction cycle itself',
      bodyBattery: 'Lower baseline, slower recovery',
      recoveryTime: 'HRV improvement visible within 48-72h of quitting',
    },
    keyFact: {
      en: 'Tobacco kills 75,000 people per year in France. All illegal drug overdoses combined kill ~500. The clearest proof that drug policy is not based on harm.',
      fr: 'Le tabac tue 75 000 personnes par an en France. Toutes les overdoses de drogues ill\u00e9gales combin\u00e9es tuent ~500. La preuve la plus claire que la politique des drogues n\u2019est pas bas\u00e9e sur les risques.',
    },
    sources: ['Sant\u00e9 Publique France', 'WHO', 'OFDT', 'PubMed: Doll 2004, Anthony 1994'],
  },

  lsd: {
    id: 'lsd',
    name: { en: 'LSD', fr: 'LSD' },
    class: 'psychedelic',
    aliases: {
      en: ['acid', 'tabs', 'blotter', 'lucy'],
      fr: ['acide', 'buvard', 'trip', 'carton', 'goutte'],
    },
    legalStatusFR: {
      en: 'Illegal — classified as stup\u00e9fiant',
      fr: 'Ill\u00e9gal — class\u00e9 stup\u00e9fiant',
    },
    color: '#a78bfa',
    summary: {
      en: 'Powerful long-acting psychedelic (8-12h). No physical dependence, no lethal dose documented in humans. Primary risks are psychological (bad trips, psychosis in predisposed). Set and setting matter more than dosage.',
      fr: 'Psych\u00e9d\u00e9lique puissant \u00e0 longue dur\u00e9e (8-12h). Pas de d\u00e9pendance physique, pas de dose l\u00e9tale document\u00e9e chez l\u2019humain. Risques principalement psychologiques (bad trips, psychose chez les pr\u00e9dispos\u00e9s). Set et setting comptent plus que le dosage.',
    },
    effects: {
      shortTerm: {
        en: 'Visual distortions, synesthesia, altered time perception, emotional amplification, introspection, nausea, jaw tension, dilated pupils',
        fr: 'Distorsions visuelles, synesth\u00e9sie, perception temporelle alt\u00e9r\u00e9e, amplification \u00e9motionnelle, introspection, naus\u00e9e, tension de la m\u00e2choire, pupilles dilat\u00e9es',
      },
      longTerm: {
        en: 'HPPD (rare), no neurotoxicity established, potential therapeutic applications (MAPS research). Can precipitate psychosis in those with predisposition.',
        fr: 'HPPD (rare), pas de neurotoxicit\u00e9 \u00e9tablie, applications th\u00e9rapeutiques potentielles (recherche MAPS). Peut pr\u00e9cipiter une psychose chez les personnes pr\u00e9dispos\u00e9es.',
      },
      duration: '8-12h (up to 16h before sleep is possible)',
    },
    dependence: { physical: 'low', psychological: 'low' },
    overdoseRisk: 'low',
    topInteractions: [
      { substance: 'Lithium', risk: 'extreme', description: { en: 'SEIZURE RISK — critical warning. Do NOT combine.', fr: 'RISQUE DE CONVULSIONS — avertissement critique. NE PAS combiner.' } },
      { substance: 'Cannabis', risk: 'high', description: { en: 'Unpredictable amplification — #1 bad trip trigger', fr: 'Amplification impr\u00e9visible — d\u00e9clencheur #1 de bad trip' } },
      { substance: 'MAOIs', risk: 'high', description: { en: 'Extreme potentiation of effects', fr: 'Potentialisation extr\u00eame des effets' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '20-40%' },
      heartRate: { direction: 'up', magnitude: '+10-20 bpm' },
      sleep: 'Impossible for 8-12h, architecture disrupted for 24h',
      stress: 'Extremely elevated (60-90+) even when user feels fine — do NOT interpret as distress',
      bodyBattery: 'Significant drain, 24-48h recovery',
      recoveryTime: '24-72h',
    },
    keyFact: {
      en: 'LSD + Lithium = seizure risk. This is the most critical drug interaction for psychedelics. If you are on lithium for bipolar disorder, psychedelics are absolutely contraindicated. Garmin will show extreme stress scores even during positive experiences — this is normal.',
      fr: 'LSD + Lithium = risque de convulsions. C\u2019est l\u2019interaction la plus critique pour les psych\u00e9d\u00e9liques. Si vous prenez du lithium pour troubles bipolaires, les psych\u00e9d\u00e9liques sont absolument contre-indiqu\u00e9s. Garmin montrera des scores de stress extr\u00eames m\u00eame pendant des exp\u00e9riences positives — c\u2019est normal.',
    },
    sources: ['PubMed: Nichols 2016, Holze 2022', 'MAPS', 'PsychonautWiki', 'Erowid', 'TripSit'],
  },

  psilocybin: {
    id: 'psilocybin',
    name: { en: 'Psilocybin Mushrooms', fr: 'Champignons Psilocybine' },
    class: 'psychedelic',
    aliases: {
      en: ['shrooms', 'magic mushrooms', 'psilo'],
      fr: ['champi', 'champis magiques', 'psilo'],
    },
    legalStatusFR: {
      en: 'Illegal — classified as stup\u00e9fiant',
      fr: 'Ill\u00e9gal — class\u00e9 stup\u00e9fiant',
    },
    color: '#7c3aed',
    summary: {
      en: 'Natural psychedelic (4-6h, shorter than LSD). Strong therapeutic potential (Johns Hopkins, Imperial College). P. semilanceata grows wild in France (Brittany, Normandy, autumn). Main risk: misidentification with toxic species.',
      fr: 'Psych\u00e9d\u00e9lique naturel (4-6h, plus court que le LSD). Fort potentiel th\u00e9rapeutique (Johns Hopkins, Imperial College). P. semilanceata pousse en France (Bretagne, Normandie, automne). Risque principal : confusion avec des esp\u00e8ces toxiques.',
    },
    effects: {
      shortTerm: {
        en: 'Visual distortions, emotional depth, nausea (common onset), body load, laughter, introspection, altered time perception',
        fr: 'Distorsions visuelles, profondeur \u00e9motionnelle, naus\u00e9e (fr\u00e9quente au d\u00e9but), lourdeur corporelle, fous rires, introspection, perception temporelle alt\u00e9r\u00e9e',
      },
      longTerm: {
        en: 'HPPD (very rare), no established neurotoxicity, therapeutic potential for depression, PTSD, end-of-life anxiety',
        fr: 'HPPD (tr\u00e8s rare), pas de neurotoxicit\u00e9 \u00e9tablie, potentiel th\u00e9rapeutique pour d\u00e9pression, PTSD, anxi\u00e9t\u00e9 fin de vie',
      },
      duration: '4-6h (significantly shorter than LSD)',
    },
    dependence: { physical: 'low', psychological: 'low' },
    overdoseRisk: 'low',
    topInteractions: [
      { substance: 'Lithium', risk: 'extreme', description: { en: 'Seizure risk — same as LSD', fr: 'Risque de convulsions — identique au LSD' } },
      { substance: 'Cannabis', risk: 'high', description: { en: 'Potentiates effects unpredictably', fr: 'Potentialise les effets de mani\u00e8re impr\u00e9visible' } },
      { substance: 'MAOIs', risk: 'high', description: { en: 'Extreme potentiation (psilohuasca)', fr: 'Potentialisation extr\u00eame (psilohuasca)' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '15-30%' },
      heartRate: { direction: 'up', magnitude: '+5-15 bpm' },
      sleep: 'Disrupted for 6-8h, less than LSD',
      stress: 'Elevated (50-80) — similar pattern to LSD but shorter',
      bodyBattery: 'Moderate drain, 12-24h recovery',
      recoveryTime: '12-36h',
    },
    keyFact: {
      en: 'NEVER eat wild mushrooms you cannot identify with 100% certainty. Confusion with Galerina marginata (deadly amatoxins) or Amanita phalloides kills. If in doubt, bring to a CAARUD or call Centre Antipoison.',
      fr: 'NE JAMAIS manger de champignons sauvages que vous ne pouvez pas identifier \u00e0 100%. La confusion avec Galerina marginata (amatoxines mortelles) ou Amanita phalloides tue. En cas de doute, amenez au CAARUD ou appelez le Centre Antipoison.',
    },
    sources: ['PubMed: Griffiths (Johns Hopkins), Carhart-Harris (Imperial)', 'PsychonautWiki', 'Erowid', 'Shroomery'],
  },

  mdma: {
    id: 'mdma',
    name: { en: 'MDMA / Ecstasy', fr: 'MDMA / Ecstasy' },
    class: 'empathogen',
    aliases: {
      en: ['ecstasy', 'molly', 'mandy', 'E', 'X'],
      fr: ['taz', 'ecsta', 'MD', 'pill', 'cachetons'],
    },
    legalStatusFR: {
      en: 'Illegal — classified as stup\u00e9fiant',
      fr: 'Ill\u00e9gal — class\u00e9 stup\u00e9fiant',
    },
    color: '#ec4899',
    summary: {
      en: 'Empathogenic stimulant producing intense euphoria, empathy, and connection. ~5% lifetime use in France. Major risks: neurotoxicity, serotonin syndrome (with MAOIs), hyperthermia, and adulterated pills (PMA/PMMA kills).',
      fr: 'Stimulant empathog\u00e8ne produisant euphorie intense, empathie et connexion. ~5% usage lifetime en France. Risques majeurs : neurotoxicit\u00e9, syndrome s\u00e9rotoninergique (avec IMAO), hyperthermie, et pilules adult\u00e9r\u00e9es (PMA/PMMA tue).',
    },
    effects: {
      shortTerm: {
        en: 'Euphoria, empathy, emotional openness, energy, jaw clenching (bruxism), dilated pupils, increased heart rate, hyperthermia',
        fr: '\u00c9uphorie, empathie, ouverture \u00e9motionnelle, \u00e9nergie, bruxisme, pupilles dilat\u00e9es, rythme cardiaque augment\u00e9, hyperthermie',
      },
      longTerm: {
        en: 'Serotonin neurotoxicity (SERT density reduction), memory impairment, depression with frequent use. "Tuesday blues" — serotonin crash 2-4 days after use.',
        fr: 'Neurotoxicit\u00e9 s\u00e9rotoninergique (r\u00e9duction densit\u00e9 SERT), troubles de la m\u00e9moire, d\u00e9pression avec usage fr\u00e9quent. "Blues du mardi" — crash s\u00e9rotonine 2-4 jours apr\u00e8s.',
      },
      duration: '3-5h (peak), aftereffects 24-72h',
    },
    dependence: { physical: 'low', psychological: 'moderate' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'MAOIs', risk: 'extreme', description: { en: 'SEROTONIN SYNDROME — THIS KILLS. Absolute contraindication.', fr: 'SYNDROME S\u00c9ROTONINERGIQUE — CECI TUE. Contre-indication absolue.' } },
      { substance: 'PMA/PMMA (in pills)', risk: 'extreme', description: { en: 'Slow onset tricks redosing — lethal hyperthermia', fr: 'Onset lent pousse au redosage — hyperthermie l\u00e9tale' } },
      { substance: 'SSRIs', risk: 'moderate', description: { en: 'Blunts effects, some serotonin syndrome risk', fr: 'Att\u00e9nue les effets, certain risque de syndrome s\u00e9rotoninergique' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '30-60%' },
      heartRate: { direction: 'up', magnitude: '+20-40 bpm' },
      sleep: 'Architecture destroyed for 1-3 nights',
      stress: 'High during use (60-90), extended post-use elevation',
      bodyBattery: 'Severe drain, 3-7 day full recovery',
      recoveryTime: '3-7 days',
    },
    keyFact: {
      en: 'The 3-month rule: minimum 3 months between uses to allow serotonin system recovery. MDMA + MAOIs = serotonin syndrome = medical emergency = death. Always test your pills (CAARUD offers free testing in France).',
      fr: 'La r\u00e8gle des 3 mois : minimum 3 mois entre chaque prise pour permettre la r\u00e9cup\u00e9ration du syst\u00e8me s\u00e9rotoninergique. MDMA + IMAO = syndrome s\u00e9rotoninergique = urgence m\u00e9dicale = d\u00e9c\u00e8s. Toujours tester vos pilules (le CAARUD offre des tests gratuits).',
    },
    sources: ['PubMed: Ricaurte, Liechti', 'DanceSafe', 'PsychonautWiki', 'Techno+', 'OFDT'],
  },

  heroin: {
    id: 'heroin',
    name: { en: 'Heroin', fr: 'H\u00e9ro\u00efne' },
    class: 'opioid',
    aliases: {
      en: ['smack', 'H', 'dope', 'junk', 'brown'],
      fr: ['h\u00e9ro', 'rabla', 'brown', 'blanche', 'came', 'poudre'],
    },
    legalStatusFR: {
      en: 'Illegal — classified as stup\u00e9fiant. Substitution (methadone, buprenorphine) available.',
      fr: 'Ill\u00e9gal — class\u00e9 stup\u00e9fiant. Substitution (m\u00e9thadone, bupr\u00e9norphine) disponible.',
    },
    color: '#991b1b',
    summary: {
      en: 'Full mu-opioid agonist. Physical dependence develops within 3-5 days of continuous use. The #1 overdose killer worldwide, now amplified by fentanyl contamination. Street purity in France: 10-50%.',
      fr: 'Agoniste mu-opio\u00efde complet. D\u00e9pendance physique en 3-5 jours d\u2019usage continu. Tueur #1 par overdose dans le monde, amplifi\u00e9 par la contamination au fentanyl. Puret\u00e9 de rue en France : 10-50%.',
    },
    effects: {
      shortTerm: {
        en: 'Intense euphoria ("rush"), warmth, pain suppression, heavy sedation, respiratory depression, pinpoint pupils, nausea',
        fr: '\u00c9uphorie intense ("rush"), chaleur, suppression de la douleur, s\u00e9dation lourde, d\u00e9pression respiratoire, myosis, naus\u00e9e',
      },
      longTerm: {
        en: 'Severe physical dependence, collapsed veins (IV), infections (endocarditis, HCV, HIV), constipation, immune suppression, social destruction',
        fr: 'D\u00e9pendance physique s\u00e9v\u00e8re, veines collaps\u00e9es (IV), infections (endocardite, VHC, VIH), constipation, immunosuppression, destruction sociale',
      },
      duration: '4-6h (varies by ROA)',
    },
    dependence: { physical: 'extreme', psychological: 'extreme' },
    overdoseRisk: 'extreme',
    topInteractions: [
      { substance: 'Benzodiazepines', risk: 'extreme', description: { en: 'Synergistic respiratory depression — found in 50-80% of fatal opioid ODs', fr: 'D\u00e9pression respiratoire synergique — pr\u00e9sent dans 50-80% des OD opio\u00efdes fatales' } },
      { substance: 'Alcohol', risk: 'extreme', description: { en: 'Same mechanism — respiratory depression', fr: 'M\u00eame m\u00e9canisme — d\u00e9pression respiratoire' } },
      { substance: 'Cocaine (speedball)', risk: 'extreme', description: { en: 'Cocaine masks opioid sedation, wears off first — unmasked OD', fr: 'La coca\u00efne masque la s\u00e9dation opio\u00efde, s\u2019estompe en premier — OD d\u00e9masqu\u00e9e' } },
    ],
    biometric: {
      hrv: { direction: 'variable', magnitude: 'Up during use (paradoxical), crashes in withdrawal' },
      heartRate: { direction: 'down', magnitude: 'Bradycardia during use, tachycardia in withdrawal' },
      sleep: 'REM suppression during use, severe insomnia in withdrawal',
      stress: 'Low during use, extreme during withdrawal (90-100)',
      bodyBattery: 'Artificially stable during use, collapses in withdrawal',
      recoveryTime: 'Acute withdrawal: 7-10 days. Full recovery: months to years.',
    },
    keyFact: {
      en: 'NALOXONE (Nyxoid) saves lives. Available without prescription at pharmacies and CAARUD in France. If someone is unresponsive with slow/no breathing: call SAMU 15, administer naloxone, place in recovery position. You are legally protected when calling for help.',
      fr: 'La NALOXONE (Nyxoid) sauve des vies. Disponible sans ordonnance en pharmacie et en CAARUD. Si quelqu\u2019un est inconscient avec respiration lente/absente : appelez SAMU 15, administrez naloxone, mettez en PLS. Vous \u00eates l\u00e9galement prot\u00e9g\u00e9 quand vous appelez \u00e0 l\u2019aide.',
    },
    sources: ['PubMed: Strang (naloxone), Degenhardt', 'OFDT/SINTES', 'EMCDDA', 'INSERM', 'Harm Reduction International'],
  },

  methylphenidate: {
    id: 'methylphenidate',
    name: { en: 'Methylphenidate (Ritalin)', fr: 'Méthylphénidate (Ritaline)' },
    class: 'stimulant',
    aliases: {
      en: ['ritalin', 'concerta', 'methylphenidate', 'MPH', 'study drug'],
      fr: ['ritaline', 'rita', 'concerta', 'méthylphénidate'],
    },
    legalStatusFR: {
      en: 'Prescription only — strictly controlled (Schedule II equivalent). Illegal without prescription.',
      fr: 'Sur ordonnance uniquement — contrôlé strictement. Illégal sans ordonnance.',
    },
    color: '#3b82f6',
    summary: {
      en: 'Prescription stimulant for ADHD that is massively misused as a "study drug." Structurally similar to cocaine (both are dopamine reuptake inhibitors). Safe at therapeutic doses but carries significant cardiovascular and psychological risks at recreational doses. Prescription does NOT mean safe at higher doses.',
      fr: 'Stimulant prescrit pour le TDAH massivement détourné comme « drogue d\'étude ». Structurellement similaire à la cocaïne (les deux sont des inhibiteurs de recapture de la dopamine). Sûr à doses thérapeutiques mais risques cardiovasculaires et psychologiques significatifs à doses récréatives. Ordonnance NE SIGNIFIE PAS sûr à fortes doses.',
    },
    effects: {
      shortTerm: {
        en: 'Increased focus, alertness, energy, appetite suppression, elevated heart rate, insomnia, anxiety at high doses, euphoria when snorted/injected',
        fr: 'Concentration accrue, vigilance, énergie, coupe-faim, rythme cardiaque élevé, insomnie, anxiété à fortes doses, euphorie si sniffé/injecté',
      },
      longTerm: {
        en: 'Cardiovascular strain (hypertension, arrhythmia), growth suppression in adolescents, psychological dependence, psychosis at high doses, sleep architecture disruption',
        fr: 'Surcharge cardiovasculaire (hypertension, arythmie), retard de croissance chez les adolescents, dépendance psychologique, psychose à fortes doses, perturbation de l\'architecture du sommeil',
      },
      duration: '3-4h (immediate release) / 8-12h (extended release)',
    },
    dependence: { physical: 'low', psychological: 'moderate' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'MAOIs', risk: 'extreme', description: { en: 'Hypertensive crisis — potentially lethal', fr: 'Crise hypertensive — potentiellement létale' } },
      { substance: 'Other stimulants', risk: 'high', description: { en: 'Additive cardiovascular strain — cocaine + methylphenidate is especially dangerous', fr: 'Surcharge cardiovasculaire additive — cocaïne + méthylphénidate est particulièrement dangereux' } },
      { substance: 'Alcohol', risk: 'moderate', description: { en: 'Masks intoxication, increases cardiovascular risk', fr: 'Masque l\'ivresse, augmente le risque cardiovasculaire' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '15-35%' },
      heartRate: { direction: 'up', magnitude: '+10-30 bpm (dose-dependent)' },
      sleep: 'Significant disruption if taken after noon — delayed sleep onset, reduced deep sleep',
      stress: 'Moderate elevation (40-65 range)',
      bodyBattery: 'Incomplete overnight recharge, especially with evening dosing',
      recoveryTime: '24-48h for recreational doses',
    },
    keyFact: {
      en: 'Methylphenidate and cocaine are structurally similar — both block the dopamine transporter. The difference is speed of onset: oral Ritalin is slow (safe), but crushed and snorted it hits like cocaine. "It\'s prescribed" does not mean "it\'s safe to abuse."',
      fr: 'Le méthylphénidate et la cocaïne sont structurellement similaires — les deux bloquent le transporteur de dopamine. La différence est la vitesse d\'onset : la Ritaline orale est lente (sûre), mais écrasée et sniffée elle frappe comme la cocaïne. « C\'est prescrit » ne veut pas dire « c\'est sûr d\'en abuser ».',
    },
    sources: ['PubMed: Volkow et al. 2001', 'ANSM', 'PsychonautWiki', 'OFDT', 'EMCDDA'],
  },

  mephedrone: {
    id: 'mephedrone',
    name: { en: 'Mephedrone (4-MMC)', fr: 'Méphédrone (4-MMC)' },
    class: 'stimulant',
    aliases: {
      en: ['4-MMC', 'meow meow', 'M-CAT', 'meph', 'drone'],
      fr: ['méphédrone', 'meow meow', '4-MMC', 'M-CAT', 'miaou miaou'],
    },
    legalStatusFR: {
      en: 'Illegal — classified as stupéfiant since 2010',
      fr: 'Illégal — classé stupéfiant depuis 2010',
    },
    color: '#d946ef',
    summary: {
      en: 'Synthetic cathinone and predecessor to 3-MMC. More serotonergic than 3-MMC (closer to MDMA in profile), producing stronger empathogenic effects but also greater neurotoxicity concerns. Banned but still circulating in Europe. "Meow meow" — the original bath salt stimulant.',
      fr: 'Cathinone synthétique et prédécesseur de la 3-MMC. Plus sérotoninergique que la 3-MMC (profil plus proche de la MDMA), produisant des effets empathogènes plus forts mais aussi des préoccupations de neurotoxicité plus importantes. Interdite mais toujours en circulation en Europe.',
    },
    effects: {
      shortTerm: {
        en: 'Euphoria, empathy (stronger than 3-MMC), energy, confidence, sexual arousal, bruxism, sweating, vasoconstriction (blue/cold extremities), nose burns when snorted',
        fr: 'Euphorie, empathie (plus forte que la 3-MMC), énergie, confiance, excitation sexuelle, bruxisme, transpiration, vasoconstriction (extrémités bleues/froides), brûlures nasales si sniffée',
      },
      longTerm: {
        en: 'Suspected serotonin neurotoxicity (worse than 3-MMC), cardiovascular damage, memory impairment, severe psychological dependence, binge patterns',
        fr: 'Neurotoxicité sérotoninergique suspectée (pire que la 3-MMC), dommages cardiovasculaires, troubles de la mémoire, dépendance psychologique sévère, patterns de binge',
      },
      duration: '2-3h (oral) / 45-90 min (nasal) — drives compulsive redosing',
    },
    dependence: { physical: 'low', psychological: 'extreme' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'MAOIs', risk: 'extreme', description: { en: 'Serotonin syndrome — potentially fatal due to strong serotonergic activity', fr: 'Syndrome sérotoninergique — potentiellement fatal en raison de l\'activité sérotoninergique forte' } },
      { substance: 'MDMA', risk: 'extreme', description: { en: 'Combined serotonin toxicity — dramatically increased neurotoxicity', fr: 'Toxicité sérotoninergique combinée — neurotoxicité dramatiquement augmentée' } },
      { substance: 'GHB/GBL', risk: 'extreme', description: { en: 'Respiratory/cardiac failure risk — common in chemsex contexts', fr: 'Risque d\'insuffisance respiratoire/cardiaque — courant en contexte chemsex' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '30-55%' },
      heartRate: { direction: 'up', magnitude: '+20-45 bpm (escalates with redosing)' },
      sleep: 'Severely disrupted for 12-24h, worse than 3-MMC due to longer serotonin depletion',
      stress: 'High (55-85), sustained post-use elevation for 2-4 days',
      bodyBattery: 'Deep drain, 3-5 day recovery for heavy sessions',
      recoveryTime: '48-96h (single session) / 5-10 days (heavy binge)',
    },
    keyFact: {
      en: 'Mephedrone is more serotonergic than 3-MMC — meaning it feels more like MDMA, but it also carries higher neurotoxicity risk. The "meow meow" era (2009-2010) showed us what happens when a highly compulsive serotonergic stimulant is widely available: the binge patterns were devastating.',
      fr: 'La méphédrone est plus sérotoninergique que la 3-MMC — elle ressemble plus à la MDMA, mais elle comporte aussi un risque de neurotoxicité plus élevé. L\'ère "meow meow" (2009-2010) a montré ce qui se passe quand un stimulant sérotoninergique hautement compulsif est largement disponible : les patterns de binge étaient dévastateurs.',
    },
    sources: ['PubMed: Hadlock, Baumann, Simmler', 'EMCDDA', 'PsychonautWiki', 'OFDT', 'TripSit'],
  },

  salvia: {
    id: 'salvia',
    name: { en: 'Salvia Divinorum', fr: 'Salvia Divinorum' },
    class: 'dissociative',
    aliases: {
      en: ['salvia', 'diviner\'s sage', 'ska maría pastora', 'sally D'],
      fr: ['salvia', 'sauge divinatoire', 'sauge des devins'],
    },
    legalStatusFR: {
      en: 'Legal in France — not classified as stupéfiant (as of 2025)',
      fr: 'Légal en France — non classé stupéfiant (en 2025)',
    },
    color: '#059669',
    summary: {
      en: 'Unique dissociative acting on kappa-opioid receptors (NOT serotonin like classic psychedelics). Produces intensely bizarre, often dysphoric experiences lasting only 5-15 minutes when smoked. Feels NOTHING like LSD, mushrooms, or ketamine. Legal in France but not recreational in any traditional sense — most users do not repeat the experience.',
      fr: 'Dissociatif unique agissant sur les récepteurs kappa-opioïdes (PAS la sérotonine comme les psychédéliques classiques). Produit des expériences intensément bizarres, souvent dysphoriques, durant seulement 5-15 minutes fumée. Ne ressemble EN RIEN au LSD, aux champignons ou à la kétamine. Légal en France mais pas récréatif au sens traditionnel — la plupart des utilisateurs ne répètent pas l\'expérience.',
    },
    effects: {
      shortTerm: {
        en: 'Complete dissociation from reality, uncontrollable laughter or terror, sensation of being pulled/twisted through dimensions, loss of body awareness, inability to speak or move coherently, dysphoria common',
        fr: 'Dissociation complète de la réalité, rire incontrôlable ou terreur, sensation d\'être tiré/tordu à travers les dimensions, perte de conscience corporelle, incapacité de parler ou bouger de façon cohérente, dysphorie fréquente',
      },
      longTerm: {
        en: 'No established neurotoxicity, no physical dependence, no lethal dose documented. Rare HPPD-like symptoms. Most users self-limit due to dysphoric nature.',
        fr: 'Pas de neurotoxicité établie, pas de dépendance physique, pas de dose létale documentée. Rares symptômes type HPPD. La plupart des utilisateurs s\'autolimitent en raison de la nature dysphorique.',
      },
      duration: '5-15 min (smoked) / 30-60 min (chewed/sublingual)',
    },
    dependence: { physical: 'low', psychological: 'low' },
    overdoseRisk: 'low',
    topInteractions: [
      { substance: 'Cannabis', risk: 'moderate', description: { en: 'Can extend and intensify dissociation unpredictably', fr: 'Peut prolonger et intensifier la dissociation de manière imprévisible' } },
      { substance: 'Other dissociatives', risk: 'moderate', description: { en: 'Compounding dissociative effects — increased confusion and injury risk', fr: 'Effets dissociatifs cumulés — confusion accrue et risque de blessure' } },
    ],
    biometric: {
      hrv: { direction: 'variable', magnitude: '10-30% (brief disruption)' },
      heartRate: { direction: 'variable', magnitude: '+5-20 bpm (brief, anxiety-driven)' },
      sleep: 'Minimal disruption due to very short duration',
      stress: 'Acute spike (60-90) during experience, normalizes within 30 min',
      bodyBattery: 'Minor drain — experience too short for significant impact',
      recoveryTime: '1-4h (physical), psychological processing may take longer',
    },
    keyFact: {
      en: 'Salvia is NOT a party drug and NOT a typical psychedelic. It acts on kappa-opioid receptors (dysphoria, not euphoria). The #1 physical danger: users can stand up, walk, or fall during the experience while completely unaware of their body. ALWAYS have a sober sitter. ALWAYS sit down before smoking.',
      fr: 'La salvia N\'EST PAS une drogue festive et N\'EST PAS un psychédélique typique. Elle agit sur les récepteurs kappa-opioïdes (dysphorie, pas euphorie). Le danger physique #1 : les utilisateurs peuvent se lever, marcher ou tomber pendant l\'expérience sans conscience de leur corps. TOUJOURS avoir un trip-sitter sobre. TOUJOURS s\'asseoir avant de fumer.',
    },
    sources: ['PubMed: Roth, MacLean', 'PsychonautWiki', 'Erowid', 'TripSit'],
  },

  dxm: {
    id: 'dxm',
    name: { en: 'DXM (Dextromethorphan)', fr: 'DXM (Dextrométhorphane)' },
    class: 'dissociative',
    aliases: {
      en: ['DXM', 'robo', 'robotripping', 'dex', 'tussin', 'cough syrup'],
      fr: ['DXM', 'sirop', 'toux', 'dextrométhorphane'],
    },
    legalStatusFR: {
      en: 'Legal — available OTC in cough medicines. No age restriction but pharmacist may refuse sale.',
      fr: 'Légal — disponible sans ordonnance dans les sirops antitussifs. Pas de restriction d\'âge mais le pharmacien peut refuser la vente.',
    },
    color: '#0891b2',
    summary: {
      en: 'Dissociative found in over-the-counter cough syrups, making it highly accessible to teenagers. Unique "plateau" system: 4 distinct dose ranges produce radically different effects, from mild stimulation to full dissociation. Major risks: serotonin syndrome with SSRIs, and liver damage from paracetamol/guaifenesin in combination syrups.',
      fr: 'Dissociatif présent dans les sirops antitussifs en vente libre, le rendant très accessible aux adolescents. Système unique de « plateaux » : 4 paliers de doses produisent des effets radicalement différents, de la stimulation légère à la dissociation complète. Risques majeurs : syndrome sérotoninergique avec les ISRS, et dommages hépatiques du paracétamol/guaïfénésine dans les sirops combinés.',
    },
    effects: {
      shortTerm: {
        en: 'Plateau 1: mild stimulation, music enhancement. Plateau 2: euphoria, closed-eye visuals, inebriation. Plateau 3: strong dissociation, altered time. Plateau 4: complete dissociation, out-of-body experience, loss of motor control',
        fr: 'Plateau 1 : stimulation légère, musique amplifiée. Plateau 2 : euphorie, visuels yeux fermés, ivresse. Plateau 3 : forte dissociation, temps altéré. Plateau 4 : dissociation complète, expérience hors du corps, perte de contrôle moteur',
      },
      longTerm: {
        en: 'Cognitive impairment with chronic use ("permatrip" reports), psychological dependence, urinary tract issues, possible Olney\'s lesions (debated)',
        fr: 'Altération cognitive avec usage chronique (rapports de « permatrip »), dépendance psychologique, problèmes urinaires, possibles lésions d\'Olney (débattu)',
      },
      duration: '4-8h (dose-dependent, longer at higher plateaus)',
    },
    dependence: { physical: 'low', psychological: 'moderate' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'SSRIs/SNRIs', risk: 'extreme', description: { en: 'SEROTONIN SYNDROME — DXM is a serotonin reuptake inhibitor. This combination can be lethal.', fr: 'SYNDROME SÉROTONINERGIQUE — le DXM est un inhibiteur de recapture de la sérotonine. Cette combinaison peut être létale.' } },
      { substance: 'MAOIs', risk: 'extreme', description: { en: 'Serotonin syndrome + hypertensive crisis — absolute contraindication', fr: 'Syndrome sérotoninergique + crise hypertensive — contre-indication absolue' } },
      { substance: 'Paracetamol (in syrup)', risk: 'extreme', description: { en: 'Liver failure — NEVER use combination syrups. Check ingredients.', fr: 'Insuffisance hépatique — NE JAMAIS utiliser de sirops combinés. Vérifier les ingrédients.' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '20-50% (plateau-dependent)' },
      heartRate: { direction: 'up', magnitude: '+10-30 bpm (plateaus 1-2) / variable at higher plateaus' },
      sleep: 'Disrupted for 6-12h, REM suppression at higher plateaus',
      stress: 'Moderate to high (40-75), increases with plateau level',
      bodyBattery: 'Moderate drain, 24-48h recovery',
      recoveryTime: '24-48h (low plateaus) / 48-96h (plateau 3-4)',
    },
    keyFact: {
      en: 'The #1 DXM danger is not DXM itself — it\'s the OTHER ingredients in the syrup. Paracetamol (acetaminophen) causes fatal liver failure at recreational DXM doses. Guaifenesin causes violent vomiting. ALWAYS check ingredients: the ONLY acceptable active ingredient is DXM alone.',
      fr: 'Le danger #1 du DXM n\'est pas le DXM lui-même — ce sont les AUTRES ingrédients du sirop. Le paracétamol cause une insuffisance hépatique fatale aux doses récréatives de DXM. La guaïfénésine cause des vomissements violents. TOUJOURS vérifier les ingrédients : le SEUL principe actif acceptable est le DXM seul.',
    },
    sources: ['PubMed: Boyer, Burns', 'PsychonautWiki', 'Erowid', 'TripSit', 'ANSM'],
  },

  nitrous: {
    id: 'nitrous',
    name: { en: 'Nitrous Oxide', fr: 'Protoxyde d\u2019azote' },
    class: 'dissociative',
    aliases: {
      en: ['laughing gas', 'nos', 'nangs', 'whippets', 'balloons'],
      fr: ['proto', 'ballons', 'gaz hilarant'],
    },
    legalStatusFR: {
      en: 'Legal product, sale to minors prohibited since 2021. Recreational use increasingly targeted.',
      fr: 'Produit l\u00e9gal, vente aux mineurs interdite depuis 2021. Usage r\u00e9cr\u00e9atif de plus en plus cibl\u00e9.',
    },
    color: '#94a3b8',
    summary: {
      en: 'Short-acting dissociative inhalant hugely popular among French youth. Effects last 30-60 seconds. Single use is low-risk, but chronic heavy use causes severe B12 depletion leading to irreversible nerve damage (subacute combined degeneration). Empty cartridges littering streets are a visible marker.',
      fr: 'Inhalant dissociatif \u00e0 courte dur\u00e9e, extr\u00eamement populaire chez les jeunes fran\u00e7ais. Effets de 30-60 secondes. Usage unique \u00e0 faible risque, mais l\u2019usage chronique intensif cause une d\u00e9pl\u00e9tion s\u00e9v\u00e8re en B12 menant \u00e0 des l\u00e9sions nerveuses irr\u00e9versibles (scl\u00e9rose combin\u00e9e de la moelle). Les cartouches vides jonchant les rues sont un marqueur visible.',
    },
    effects: {
      shortTerm: {
        en: 'Brief euphoria, dissociation, dizziness, tingling, auditory distortions ("wah-wah"), laughter, loss of motor control',
        fr: '\u00c9uphorie br\u00e8ve, dissociation, vertiges, picotements, distorsions auditives ("wah-wah"), fous rires, perte de contr\u00f4le moteur',
      },
      longTerm: {
        en: 'B12 depletion \u2192 peripheral neuropathy, numbness in extremities, subacute combined degeneration of spinal cord (irreversible), megaloblastic anemia. Damage correlates with frequency, not single use.',
        fr: 'D\u00e9pl\u00e9tion B12 \u2192 neuropathie p\u00e9riph\u00e9rique, engourdissements des extr\u00e9mit\u00e9s, scl\u00e9rose combin\u00e9e de la moelle (irr\u00e9versible), an\u00e9mie m\u00e9galoblastique. Les dommages corr\u00e8lent avec la fr\u00e9quence, pas l\u2019usage unique.',
      },
      duration: '30-60 seconds (single inhalation)',
    },
    dependence: { physical: 'low', psychological: 'moderate' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'Alcohol', risk: 'high', description: { en: 'Combined sedation \u2014 vomiting while unconscious, aspiration risk', fr: 'S\u00e9dation combin\u00e9e \u2014 vomissement en \u00e9tat inconscient, risque d\u2019aspiration' } },
      { substance: 'Other depressants', risk: 'high', description: { en: 'Additive oxygen deprivation and loss of consciousness', fr: 'Privation d\u2019oxyg\u00e8ne additive et perte de conscience' } },
    ],
    biometric: {
      hrv: { direction: 'variable', magnitude: 'Brief fluctuation, undetectable on most readings' },
      heartRate: { direction: 'up', magnitude: '+5-15 bpm (spike lasts <60 seconds \u2014 too short for Garmin to reliably capture)' },
      sleep: 'No measurable impact from occasional use',
      stress: 'Brief spike, not captured in 3-min Garmin intervals',
      bodyBattery: 'Negligible impact per use; binge sessions may show minor drain',
      recoveryTime: 'Minutes (acute). B12 recovery: weeks to months with supplementation if caught early.',
    },
    keyFact: {
      en: 'The real danger is invisible: B12 depletion. You won\u2019t feel it until nerve damage is done. Tingling or numbness in hands/feet after heavy use = STOP IMMEDIATELY and get B12 blood test. Suffocation risk if used with bags over head or in enclosed spaces.',
      fr: 'Le vrai danger est invisible : la d\u00e9pl\u00e9tion en B12. Vous ne la sentirez pas avant que les nerfs soient endommag\u00e9s. Picotements ou engourdissements aux mains/pieds apr\u00e8s usage intensif = ARR\u00caTEZ IMM\u00c9DIATEMENT et faites un dosage sanguin B12. Risque d\u2019asphyxie si utilis\u00e9 avec un sac sur la t\u00eate ou en espace clos.',
    },
    sources: ['PubMed: Randhawa 2015, Thompson 2015', 'OFDT', 'ANSES', 'PsychonautWiki', 'TripSit'],
  },

  poppers: {
    id: 'poppers',
    name: { en: 'Poppers', fr: 'Poppers' },
    class: 'inhalant',
    aliases: {
      en: ['amyl nitrite', 'alkyl nitrites', 'rush', 'jungle juice'],
      fr: ['poppers', 'rush'],
    },
    legalStatusFR: {
      en: 'Legal grey area \u2014 sold as "room odorizers", periodic bans on specific formulations (isopropyl nitrite banned 2007-2013).',
      fr: 'Zone grise l\u00e9gale \u2014 vendus comme "d\u00e9sodorisants d\u2019ambiance", interdictions p\u00e9riodiques de formulations sp\u00e9cifiques (nitrite d\u2019isopropyle interdit 2007-2013).',
    },
    color: '#f43f5e',
    summary: {
      en: 'Alkyl nitrite inhalants causing brief vasodilation, head rush, and muscle relaxation. Widely used in club and sexual contexts. Effects last 1-5 minutes. NOT related to nitrous oxide \u2014 completely different pharmacology. Lethal interaction with Viagra/PDE5 inhibitors.',
      fr: 'Inhalants \u00e0 base de nitrites d\u2019alkyle causant une br\u00e8ve vasodilatation, une mont\u00e9e \u00e0 la t\u00eate et une relaxation musculaire. Tr\u00e8s utilis\u00e9 en contexte festif et sexuel. Effets de 1-5 minutes. AUCUN lien avec le protoxyde d\u2019azote \u2014 pharmacologie compl\u00e8tement diff\u00e9rente. Interaction l\u00e9tale avec le Viagra/inhibiteurs PDE5.',
    },
    effects: {
      shortTerm: {
        en: 'Head rush, warmth, dizziness, smooth muscle relaxation (anal sphincter), brief euphoria, flushing, headache, drop in blood pressure',
        fr: 'Mont\u00e9e \u00e0 la t\u00eate, chaleur, vertiges, relaxation des muscles lisses (sphincter anal), euphorie br\u00e8ve, rougissement, maux de t\u00eate, chute de pression art\u00e9rielle',
      },
      longTerm: {
        en: 'Methemoglobinemia (especially isopropyl nitrite), retinal damage (maculopathy \u2014 "poppers maculopathy"), chemical burns around nose/lips, crusty yellow skin lesions with chronic use',
        fr: 'M\u00e9th\u00e9moglobin\u00e9mie (surtout nitrite d\u2019isopropyle), l\u00e9sions r\u00e9tiniennes (maculopathie \u2014 "maculopathie au poppers"), br\u00fblures chimiques autour du nez/l\u00e8vres, l\u00e9sions cutan\u00e9es cro\u00fbteuses jaunes en usage chronique',
      },
      duration: '1-5 minutes',
    },
    dependence: { physical: 'low', psychological: 'low' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'Viagra / PDE5 inhibitors', risk: 'extreme', description: { en: 'LETHAL blood pressure crash \u2014 both are vasodilators. This combination kills. Absolute contraindication.', fr: 'Chute de pression art\u00e9rielle L\u00c9TALE \u2014 les deux sont des vasodilatateurs. Cette combinaison tue. Contre-indication absolue.' } },
      { substance: 'Blood pressure medications', risk: 'high', description: { en: 'Severe hypotension, syncope, potential cardiac event', fr: 'Hypotension s\u00e9v\u00e8re, syncope, \u00e9v\u00e9nement cardiaque possible' } },
      { substance: 'Stimulants', risk: 'moderate', description: { en: 'Opposing cardiovascular effects \u2014 cardiac strain', fr: 'Effets cardiovasculaires oppos\u00e9s \u2014 surcharge cardiaque' } },
    ],
    biometric: {
      hrv: { direction: 'variable', magnitude: 'Brief spike from vasodilation, returns to baseline in minutes' },
      heartRate: { direction: 'up', magnitude: '+10-30 bpm (reflex tachycardia from blood pressure drop, lasts 1-3 min)' },
      sleep: 'No measurable impact unless heavy session use',
      stress: 'Brief spike, rarely captured by Garmin 3-min intervals',
      bodyBattery: 'Negligible per use; headaches from heavy use may affect perceived recovery',
      recoveryTime: 'Minutes (acute). Maculopathy recovery: weeks to permanent.',
    },
    keyFact: {
      en: 'Poppers + Viagra = DEATH RISK. Both drop blood pressure \u2014 together they can cause fatal cardiovascular collapse. This is the #1 critical interaction for poppers and it occurs in exactly the sexual context where both are commonly combined.',
      fr: 'Poppers + Viagra = RISQUE DE D\u00c9C\u00c8S. Les deux font chuter la pression art\u00e9rielle \u2014 ensemble ils peuvent causer un collapsus cardiovasculaire fatal. C\u2019est L\u2019interaction critique #1 pour les poppers et elle survient exactement dans le contexte sexuel o\u00f9 les deux sont couramment combin\u00e9s.',
    },
    sources: ['PubMed: Rewbury 2017 (maculopathy), Davies 2019', 'OFDT', 'PsychonautWiki', 'TripSit', 'EMCDDA'],
  },

  dmt: {
    id: 'dmt',
    name: { en: 'DMT / Ayahuasca', fr: 'DMT / Ayahuasca' },
    class: 'psychedelic',
    aliases: {
      en: ['dimethyltryptamine', 'the spirit molecule', 'deems', 'aya', 'ayahuasca'],
      fr: ['DMT', 'aya', 'ayahuasca', 'la mol\u00e9cule de l\u2019esprit'],
    },
    legalStatusFR: {
      en: 'Illegal \u2014 DMT classified as stup\u00e9fiant. Ayahuasca ceremonies operate in legal grey area (religious exemption claims).',
      fr: 'Ill\u00e9gal \u2014 DMT class\u00e9 stup\u00e9fiant. Les c\u00e9r\u00e9monies d\u2019ayahuasca op\u00e8rent dans une zone grise l\u00e9gale (revendication d\u2019exemption religieuse).',
    },
    color: '#7c3aed',
    summary: {
      en: 'The most powerful classical psychedelic. Smoked/vaporized DMT produces an overwhelming 15-minute experience ("breakthrough"). Ayahuasca combines DMT with MAOIs for a 4-6h oral experience. Growing "psychedelic tourism" industry with real safety concerns around untrained facilitators.',
      fr: 'Le psych\u00e9d\u00e9lique classique le plus puissant. Le DMT fum\u00e9/vaporis\u00e9 produit une exp\u00e9rience submergeante de 15 minutes ("perc\u00e9e"). L\u2019ayahuasca combine le DMT avec des IMAO pour une exp\u00e9rience orale de 4-6h. Industrie croissante de "tourisme psych\u00e9d\u00e9lique" avec de vrais probl\u00e8mes de s\u00e9curit\u00e9 autour de facilitateurs non form\u00e9s.',
    },
    effects: {
      shortTerm: {
        en: 'Smoked: complete dissolution of reality, vivid geometric/entity hallucinations, ego death, time dilation. Ayahuasca: nausea/purging ("la purga"), emotional catharsis, visions, deep introspection over 4-6h.',
        fr: 'Fum\u00e9 : dissolution compl\u00e8te de la r\u00e9alit\u00e9, hallucinations g\u00e9om\u00e9triques/entit\u00e9s vivides, mort de l\u2019ego, dilatation temporelle. Ayahuasca : naus\u00e9es/purge ("la purga"), catharsis \u00e9motionnelle, visions, introspection profonde sur 4-6h.',
      },
      longTerm: {
        en: 'No established neurotoxicity. Potential therapeutic applications for depression, addiction, PTSD. Risk of precipitating psychosis in predisposed individuals. Ayahuasca MAOI component requires strict dietary adherence.',
        fr: 'Pas de neurotoxicit\u00e9 \u00e9tablie. Applications th\u00e9rapeutiques potentielles pour d\u00e9pression, addiction, PTSD. Risque de pr\u00e9cipiter une psychose chez les individus pr\u00e9dispos\u00e9s. Le composant IMAO de l\u2019ayahuasca n\u00e9cessite un r\u00e9gime alimentaire strict.',
      },
      duration: '15 min (smoked) / 4-6h (ayahuasca)',
    },
    dependence: { physical: 'low', psychological: 'low' },
    overdoseRisk: 'low',
    topInteractions: [
      { substance: 'SSRIs / SNRIs', risk: 'extreme', description: { en: 'SEROTONIN SYNDROME with ayahuasca (contains MAOI). Potentially fatal. Must taper SSRIs weeks before.', fr: 'SYNDROME S\u00c9ROTONINERGIQUE avec ayahuasca (contient IMAO). Potentiellement fatal. Sevrage des ISRS n\u00e9cessaire des semaines avant.' } },
      { substance: 'Tyramine-rich foods (with ayahuasca)', risk: 'high', description: { en: 'MAOI + tyramine = hypertensive crisis. Strict diet required 24h+ before and after. Aged cheese, cured meats, fermented foods all dangerous.', fr: 'IMAO + tyramine = crise hypertensive. R\u00e9gime strict requis 24h+ avant et apr\u00e8s. Fromages vieillis, charcuterie, aliments ferment\u00e9s tous dangereux.' } },
      { substance: 'Lithium', risk: 'extreme', description: { en: 'Seizure risk \u2014 same as LSD', fr: 'Risque de convulsions \u2014 identique au LSD' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '25-45% (ayahuasca). Smoked DMT too brief to capture.' },
      heartRate: { direction: 'up', magnitude: '+15-30 bpm (ayahuasca sustained). Smoked: brief spike often missed by Garmin.' },
      sleep: 'Ayahuasca: disrupted for 8-12h. Smoked: minimal impact if used early in day.',
      stress: 'Extreme elevation (70-95) during ayahuasca ceremony. Smoked: spike too brief to register.',
      bodyBattery: 'Ayahuasca: significant drain from 4-6h sympathetic activation + purging. Smoked: negligible.',
      recoveryTime: 'Smoked: 1-2h. Ayahuasca: 24-72h.',
    },
    keyFact: {
      en: 'Ayahuasca contains an MAOI \u2014 this makes the tyramine diet CRITICAL, not optional. Aged cheese, cured meats, soy sauce, wine, fermented foods can trigger hypertensive crisis. SSRIs must be tapered weeks in advance. Many "retreat centers" fail to screen for these interactions.',
      fr: 'L\u2019ayahuasca contient un IMAO \u2014 cela rend le r\u00e9gime sans tyramine CRITIQUE, pas optionnel. Fromages vieillis, charcuterie, sauce soja, vin, aliments ferment\u00e9s peuvent d\u00e9clencher une crise hypertensive. Les ISRS doivent \u00eatre sevr\u00e9s des semaines \u00e0 l\u2019avance. Beaucoup de "centres de retraite" ne d\u00e9pistent pas ces interactions.',
    },
    sources: ['PubMed: Strassman 2001, Palhano-Fontes 2019', 'ICEERS', 'PsychonautWiki', 'Erowid', 'TripSit'],
  },

  twocb: {
    id: 'twocb',
    name: { en: '2C-B', fr: '2C-B' },
    class: 'psychedelic',
    aliases: {
      en: ['2CB', 'nexus', 'venus', 'bees'],
      fr: ['2CB', 'nexus', 'v\u00e9nus'],
    },
    legalStatusFR: {
      en: 'Illegal \u2014 classified as stup\u00e9fiant',
      fr: 'Ill\u00e9gal \u2014 class\u00e9 stup\u00e9fiant',
    },
    color: '#d946ef',
    summary: {
      en: 'Psychedelic phenethylamine described as "between LSD and MDMA". Rising popularity in France. Extremely dose-sensitive: 2mg difference between mild visuals and overwhelming experience. Often sold in pressed pills mislabeled as "ecstasy", creating dosing confusion.',
      fr: 'Ph\u00e9n\u00e9thylamine psych\u00e9d\u00e9lique d\u00e9crite comme "\u00e0 mi-chemin entre LSD et MDMA". Popularit\u00e9 croissante en France. Extr\u00eamement sensible au dosage : 2mg de diff\u00e9rence entre des visuels l\u00e9gers et une exp\u00e9rience submergeante. Souvent vendu en pilules press\u00e9es \u00e9tiquet\u00e9es "ecstasy", cr\u00e9ant une confusion de dosage.',
    },
    effects: {
      shortTerm: {
        en: 'Colorful visuals, body tingling, euphoria, empathy (lower doses), nausea on come-up, enhanced sensory perception, less cognitive "headspace" than LSD',
        fr: 'Visuels color\u00e9s, picotements corporels, euphorie, empathie (faibles doses), naus\u00e9e \u00e0 la mont\u00e9e, perception sensorielle amplifi\u00e9e, moins de "charge mentale" qu\u2019avec le LSD',
      },
      longTerm: {
        en: 'Very limited research. No established neurotoxicity. HPPD theoretically possible. Less serotonin depletion than MDMA \u2014 no "Tuesday blues" typically.',
        fr: 'Recherche tr\u00e8s limit\u00e9e. Pas de neurotoxicit\u00e9 \u00e9tablie. HPPD th\u00e9oriquement possible. Moins de d\u00e9pl\u00e9tion s\u00e9rotoninergique que la MDMA \u2014 pas de "blues du mardi" en g\u00e9n\u00e9ral.',
      },
      duration: '4-6h (oral) / 2-4h (insufflated, very painful)',
    },
    dependence: { physical: 'low', psychological: 'low' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'Lithium', risk: 'extreme', description: { en: 'Seizure risk \u2014 same class warning as LSD/psilocybin', fr: 'Risque de convulsions \u2014 m\u00eame avertissement de classe que LSD/psilocybine' } },
      { substance: 'MAOIs', risk: 'high', description: { en: 'Unpredictable potentiation of effects', fr: 'Potentialisation impr\u00e9visible des effets' } },
      { substance: 'Cannabis', risk: 'moderate', description: { en: 'Amplifies psychedelic effects unpredictably', fr: 'Amplifie les effets psych\u00e9d\u00e9liques de mani\u00e8re impr\u00e9visible' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '15-30%' },
      heartRate: { direction: 'up', magnitude: '+10-25 bpm' },
      sleep: 'Disrupted for 6-8h if taken in evening',
      stress: 'Elevated (50-80) during experience',
      bodyBattery: 'Moderate drain, 12-24h recovery',
      recoveryTime: '12-24h',
    },
    keyFact: {
      en: '2C-B is EXTREMELY dose-sensitive. 15mg = mild and pleasant. 25mg = full psychedelic intensity. 35mg = potentially overwhelming. Always weigh with a milligram scale. Pills labeled "ecstasy" may contain 2C-B at unknown doses \u2014 this mismatch causes most bad experiences.',
      fr: 'Le 2C-B est EXTR\u00caMEMENT sensible au dosage. 15mg = l\u00e9ger et agr\u00e9able. 25mg = intensit\u00e9 psych\u00e9d\u00e9lique compl\u00e8te. 35mg = potentiellement submergeant. Toujours peser avec une balance milligr\u00e9e. Les pilules \u00e9tiquet\u00e9es "ecstasy" peuvent contenir du 2C-B \u00e0 des doses inconnues \u2014 ce d\u00e9calage cause la plupart des mauvaises exp\u00e9riences.',
    },
    sources: ['PubMed: Gonz\u00e1lez 2015, Papaseit 2018', 'EMCDDA', 'PsychonautWiki', 'Erowid', 'DanceSafe'],
  },

  caffeine: {
    id: 'caffeine',
    name: { en: 'Caffeine', fr: 'Caf\u00e9ine' },
    class: 'stimulant',
    aliases: {
      en: ['coffee', 'tea', 'energy drinks', 'guarana', 'caffeine pills'],
      fr: ['caf\u00e9', 'caf\u00e9ine', 'th\u00e9ine'],
    },
    legalStatusFR: {
      en: 'Legal \u2014 unregulated. Present in coffee, tea, energy drinks, supplements, medications.',
      fr: 'L\u00e9gal \u2014 non r\u00e9glement\u00e9. Pr\u00e9sent dans caf\u00e9, th\u00e9, boissons \u00e9nergisantes, compl\u00e9ments, m\u00e9dicaments.',
    },
    color: '#92400e',
    summary: {
      en: 'The most consumed psychoactive substance on Earth. Useful baseline comparison for understanding that "drug" is a pharmacological category, not a moral one. Withdrawal is clinically recognized (DSM-5), LD50 exists (~10g / ~100 cups), and interactions with many medications are real but rarely discussed.',
      fr: 'La substance psychoactive la plus consomm\u00e9e au monde. Utile comme r\u00e9f\u00e9rence pour comprendre que "drogue" est une cat\u00e9gorie pharmacologique, pas morale. Le sevrage est cliniquement reconnu (DSM-5), la DL50 existe (~10g / ~100 tasses), et les interactions avec de nombreux m\u00e9dicaments sont r\u00e9elles mais rarement discut\u00e9es.',
    },
    effects: {
      shortTerm: {
        en: 'Alertness, improved focus, reduced fatigue, increased heart rate, anxiety at high doses, diuresis, insomnia if taken late',
        fr: 'Vigilance, concentration am\u00e9lior\u00e9e, fatigue r\u00e9duite, rythme cardiaque augment\u00e9, anxi\u00e9t\u00e9 \u00e0 haute dose, diur\u00e8se, insomnie si prise tardive',
      },
      longTerm: {
        en: 'Tolerance develops rapidly (1-2 weeks). Physical dependence with real withdrawal syndrome (headaches, irritability, fatigue, difficulty concentrating for 2-9 days). Possible cardiovascular benefits at moderate doses (debated). Bone density concerns at very high intake.',
        fr: 'La tol\u00e9rance se d\u00e9veloppe rapidement (1-2 semaines). D\u00e9pendance physique avec vrai syndrome de sevrage (maux de t\u00eate, irritabilit\u00e9, fatigue, difficult\u00e9 de concentration pendant 2-9 jours). B\u00e9n\u00e9fices cardiovasculaires possibles \u00e0 dose mod\u00e9r\u00e9e (d\u00e9battu). Pr\u00e9occupations densit\u00e9 osseuse \u00e0 tr\u00e8s haute consommation.',
      },
      duration: '3-5h (half-life), residual effects up to 12h',
    },
    dependence: { physical: 'moderate', psychological: 'moderate' },
    overdoseRisk: 'low',
    topInteractions: [
      { substance: 'Stimulant medications (ADHD)', risk: 'moderate', description: { en: 'Additive cardiovascular strain \u2014 anxiety, palpitations, insomnia', fr: 'Surcharge cardiovasculaire additive \u2014 anxi\u00e9t\u00e9, palpitations, insomnie' } },
      { substance: 'Theophylline (asthma)', risk: 'moderate', description: { en: 'Both are xanthines \u2014 toxic accumulation possible', fr: 'Les deux sont des xanthines \u2014 accumulation toxique possible' } },
      { substance: 'MAOIs', risk: 'moderate', description: { en: 'Potentiated effects \u2014 hypertension risk', fr: 'Effets potentialis\u00e9s \u2014 risque d\u2019hypertension' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '5-15% (dose-dependent, tolerance reduces effect)' },
      heartRate: { direction: 'up', magnitude: '+5-15 bpm (attenuates with chronic use)' },
      sleep: 'Significant disruption if consumed within 6h of bedtime \u2014 even without subjective awareness',
      stress: 'Mild elevation (20-40 range), often masked by tolerance',
      bodyBattery: 'Masks fatigue without restoring actual recovery \u2014 creates debt illusion',
      recoveryTime: 'Withdrawal peaks at 24-48h, resolves in 2-9 days',
    },
    keyFact: {
      en: 'Caffeine is included here deliberately: it\u2019s a psychoactive drug with real dependence, withdrawal (DSM-5 recognized), a lethal dose (~10g), and drug interactions. The fact that it\u2019s legal and ubiquitous proves that drug policy is about culture, not pharmacology.',
      fr: 'La caf\u00e9ine est incluse ici d\u00e9lib\u00e9r\u00e9ment : c\u2019est une drogue psychoactive avec une vraie d\u00e9pendance, un sevrage (reconnu DSM-5), une dose l\u00e9tale (~10g), et des interactions m\u00e9dicamenteuses. Le fait qu\u2019elle soit l\u00e9gale et omnipr\u00e9sente prouve que la politique des drogues est une question de culture, pas de pharmacologie.',
    },
    sources: ['PubMed: Juliano & Griffiths 2004', 'DSM-5 (Caffeine Withdrawal)', 'EFSA', 'PsychonautWiki', 'Examine.com'],
  },

  'synthetic-cannabinoids': {
    id: 'synthetic-cannabinoids',
    name: { en: 'Synthetic Cannabinoids', fr: 'Cannabinoïdes de Synthèse' },
    class: 'cannabinoid',
    aliases: {
      en: ['K2', 'spice', 'synthetic weed', 'fake weed'],
      fr: ['spice', 'K2', 'synthé', 'cannabinoïdes de synthèse'],
    },
    legalStatusFR: {
      en: 'Illegal — classified as stupéfiant (JWH-018, ADB-BUTINACA, etc.)',
      fr: 'Illégal — classé stupéfiant (JWH-018, ADB-BUTINACA, etc.)',
    },
    color: '#b91c1c',
    summary: {
      en: 'NOT cannabis. Full agonists at CB1 receptors (cannabis is a partial agonist) — fundamentally different pharmacology with seizure, psychosis, and death risk. Sprayed on low-quality weed or hash, impossible to dose. The #1 hidden danger in the French cannabis market.',
      fr: 'PAS du cannabis. Agonistes complets des récepteurs CB1 (le cannabis est un agoniste partiel) — pharmacologie fondamentalement différente avec risque de convulsions, psychose et décès. Pulvérisés sur de la weed ou du haschich de mauvaise qualité, impossible à doser. Le danger caché #1 du marché français du cannabis.',
    },
    effects: {
      shortTerm: {
        en: 'Intense and unpredictable high, agitation, vomiting, tachycardia, seizures, psychosis, loss of consciousness, respiratory depression',
        fr: 'Effet intense et imprévisible, agitation, vomissements, tachycardie, convulsions, psychose, perte de connaissance, dépression respiratoire',
      },
      longTerm: {
        en: 'Kidney damage, psychosis (persistent), severe dependence, cognitive impairment, unknown long-term toxicity (new compounds constantly emerge)',
        fr: 'Dommages rénaux, psychose (persistante), dépendance sévère, altération cognitive, toxicité long terme inconnue (nouveaux composés émergent constamment)',
      },
      duration: '1-3h (highly variable — some compounds last 8h+)',
    },
    dependence: { physical: 'high', psychological: 'high' },
    overdoseRisk: 'extreme',
    topInteractions: [
      { substance: 'Any depressant', risk: 'extreme', description: { en: 'Synergistic respiratory depression — already dangerous alone', fr: 'Dépression respiratoire synergique — déjà dangereux seul' } },
      { substance: 'Stimulants', risk: 'high', description: { en: 'Extreme cardiovascular strain, seizure risk compounded', fr: 'Surcharge cardiovasculaire extrême, risque de convulsions multiplié' } },
      { substance: 'Cannabis', risk: 'high', description: { en: 'Users often unknowingly consume both — sprayed product', fr: 'Les usagers consomment souvent les deux sans le savoir — produit pulvérisé' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '40-80%' },
      heartRate: { direction: 'variable', magnitude: 'Erratic — tachycardia (+40-80 bpm) or bradycardia' },
      sleep: 'Severely disrupted, seizure risk during sleep',
      stress: 'Extreme and erratic (70-100)',
      bodyBattery: 'Catastrophic drain, unpredictable recovery',
      recoveryTime: '48-96h minimum, longer with repeated exposure',
    },
    keyFact: {
      en: 'These are NOT cannabis. Full CB1 agonists vs cannabis\u2019s partial agonism means there is no ceiling effect — overdose is real and kills. Sprayed on cheap weed/hash, they are invisible, odorless, and impossible to dose. If your cannabis feels "wrong" (seizures, extreme tachycardia, psychosis), call SAMU 15 immediately.',
      fr: 'Ce n\u2019est PAS du cannabis. Agonistes complets CB1 vs agonisme partiel du cannabis signifie qu\u2019il n\u2019y a pas d\u2019effet plafond — l\u2019overdose est réelle et tue. Pulvérisés sur du shit ou de la weed bon marché, ils sont invisibles, inodores et impossible à doser. Si votre cannabis semble "bizarre" (convulsions, tachycardie extrême, psychose), appelez le SAMU 15 immédiatement.',
    },
    sources: ['EMCDDA', 'OFDT/SINTES', 'PubMed: Castaneto 2014, Trecki 2015', 'PsychonautWiki', 'Euro-DEN Plus'],
  },

  fentanyl: {
    id: 'fentanyl',
    name: { en: 'Fentanyl', fr: 'Fentanyl' },
    class: 'opioid',
    aliases: {
      en: ['fent', 'china white', 'apache', 'dance fever'],
      fr: ['fenta', 'china white'],
    },
    legalStatusFR: {
      en: 'Controlled prescription (patches, lollipops). Illicit fentanyl and analogues classified as stupéfiant.',
      fr: 'Prescription contrôlée (patchs, sucettes). Fentanyl illicite et analogues classés stupéfiant.',
    },
    color: '#7f1d1d',
    summary: {
      en: '50-100x more potent than morphine. Active at microgram doses — a few grains can kill. The primary driver of the North American overdose crisis, now appearing in France (SINTES alerts). Invisible contamination: found in cocaine, pressed pills, and heroin without users\u2019 knowledge.',
      fr: '50-100x plus puissant que la morphine. Actif au microgramme — quelques grains peuvent tuer. Moteur principal de la crise d\u2019overdose nord-américaine, désormais détecté en France (alertes SINTES). Contamination invisible : trouvé dans la cocaïne, les cachets pressés et l\u2019héroïne à l\u2019insu des usagers.',
    },
    effects: {
      shortTerm: {
        en: 'Rapid intense euphoria, extreme sedation, respiratory depression (primary cause of death), pinpoint pupils, nausea, unconsciousness',
        fr: 'Euphorie rapide et intense, sédation extrême, dépression respiratoire (cause principale de décès), myosis, nausée, perte de connaissance',
      },
      longTerm: {
        en: 'Rapid tolerance escalation, severe physical dependence, high overdose mortality, cognitive impairment. Analogues (carfentanil) are 100x more potent still.',
        fr: 'Escalade rapide de la tolérance, dépendance physique sévère, forte mortalité par overdose, altération cognitive. Les analogues (carfentanil) sont encore 100x plus puissants.',
      },
      duration: '1-2h (IV/smoked) / 4-6h (insufflated) — rapid onset, short window to intervene',
    },
    dependence: { physical: 'extreme', psychological: 'extreme' },
    overdoseRisk: 'extreme',
    topInteractions: [
      { substance: 'Benzodiazepines', risk: 'extreme', description: { en: 'Synergistic respiratory depression — present in majority of fentanyl deaths', fr: 'Dépression respiratoire synergique — présent dans la majorité des décès au fentanyl' } },
      { substance: 'Alcohol', risk: 'extreme', description: { en: 'Additive CNS depression — lethal', fr: 'Dépression SNC additive — létal' } },
      { substance: 'Any opioid', risk: 'extreme', description: { en: 'Unknowing double-dosing when fentanyl contaminates heroin', fr: 'Double dosage involontaire quand le fentanyl contamine l\u2019héroïne' } },
    ],
    biometric: {
      hrv: { direction: 'variable', magnitude: 'Up during use (vagal), crashes to near-zero in OD' },
      heartRate: { direction: 'down', magnitude: 'Severe bradycardia (<50 bpm), arrest risk' },
      sleep: 'Extreme sedation mimics sleep but with respiratory compromise',
      stress: 'Artificially low during use, extreme in withdrawal (90-100)',
      bodyBattery: 'Deceptively stable during use, catastrophic collapse in withdrawal',
      recoveryTime: 'Acute withdrawal: 5-7 days. Post-acute: months.',
    },
    keyFact: {
      en: 'Fentanyl test strips save lives. A $1 strip can detect fentanyl in any drug. Even in France (SINTES alerts since 2023), fentanyl has been found in cocaine and pressed pills. NALOXONE (Nyxoid) reverses fentanyl OD but may require MULTIPLE doses due to potency. Call SAMU 15.',
      fr: 'Les bandelettes de détection du fentanyl sauvent des vies. Une bandelette à 1\u20AC peut détecter le fentanyl dans n\u2019importe quelle drogue. Même en France (alertes SINTES depuis 2023), du fentanyl a été trouvé dans la cocaïne et les cachets pressés. La NALOXONE (Nyxoid) inverse l\u2019OD au fentanyl mais peut nécessiter PLUSIEURS doses vu sa puissance. Appelez le SAMU 15.',
    },
    sources: ['CDC WONDER', 'OFDT/SINTES', 'EMCDDA', 'PubMed: Armenian 2018, Suzuki 2021', 'Harm Reduction International'],
  },

  tramadol: {
    id: 'tramadol',
    name: { en: 'Tramadol', fr: 'Tramadol' },
    class: 'opioid',
    aliases: {
      en: ['tram', 'ultram', 'tramal'],
      fr: ['trama', 'tramadol', 'Ixprim', 'Topalgic'],
    },
    legalStatusFR: {
      en: 'Prescription required — listed as stupéfiant since 2020. Widely prescribed (Ixprim, Topalgic).',
      fr: 'Ordonnance obligatoire — classé stupéfiant depuis 2020. Largement prescrit (Ixprim, Topalgic).',
    },
    color: '#ea580c',
    summary: {
      en: 'Atypical opioid with dual mechanism: mu-opioid agonist + serotonin-norepinephrine reuptake inhibitor (SNRI). The most prescribed opioid in France. Often the first opioid exposure. Key dangers: seizure threshold lowering (especially >400mg/day), serotonin syndrome with SSRIs/SNRIs, and underestimated addiction potential.',
      fr: 'Opioïde atypique à double mécanisme : agoniste mu-opioïde + inhibiteur de la recapture de la sérotonine et de la noradrénaline (IRSN). L\u2019opioïde le plus prescrit en France. Souvent la première exposition aux opioïdes. Dangers clés : abaissement du seuil épileptogène (surtout >400mg/jour), syndrome sérotoninergique avec ISRS/IRSN, et potentiel addictif sous-estimé.',
    },
    effects: {
      shortTerm: {
        en: 'Pain relief, mild euphoria, warmth, nausea, dizziness, constipation, sweating. Less respiratory depression than typical opioids at therapeutic doses.',
        fr: 'Soulagement de la douleur, légère euphorie, chaleur, nausée, vertiges, constipation, transpiration. Moins de dépression respiratoire que les opioïdes classiques à doses thérapeutiques.',
      },
      longTerm: {
        en: 'Physical dependence (often underestimated by prescribers), withdrawal syndrome, seizures at high doses, serotonin syndrome risk with common medications, cognitive fog',
        fr: 'Dépendance physique (souvent sous-estimée par les prescripteurs), syndrome de sevrage, convulsions à hautes doses, risque de syndrome sérotoninergique avec des médicaments courants, brouillard cognitif',
      },
      duration: '4-6h (immediate release) / 12-24h (extended release)',
    },
    dependence: { physical: 'moderate', psychological: 'moderate' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'SSRIs/SNRIs', risk: 'extreme', description: { en: 'SEROTONIN SYNDROME — tramadol is itself an SNRI. Very common dangerous combo in France.', fr: 'SYNDROME SÉROTONINERGIQUE — le tramadol est lui-même un IRSN. Combo dangereuse très courante en France.' } },
      { substance: 'MAOIs', risk: 'extreme', description: { en: 'Serotonin syndrome + hypertensive crisis — absolute contraindication', fr: 'Syndrome sérotoninergique + crise hypertensive — contre-indication absolue' } },
      { substance: 'Benzodiazepines', risk: 'high', description: { en: 'Respiratory depression + seizure risk compounded', fr: 'Dépression respiratoire + risque de convulsions augmenté' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '10-25%' },
      heartRate: { direction: 'variable', magnitude: 'Slight increase or decrease depending on dose' },
      sleep: 'Disrupted architecture, REM suppression at higher doses',
      stress: 'Mild reduction during use, rebound elevation in withdrawal',
      bodyBattery: 'Modest impact at therapeutic doses, significant at misuse doses',
      recoveryTime: 'Withdrawal onset: 12-24h. Acute: 5-7 days. Protracted: weeks to months.',
    },
    keyFact: {
      en: 'Tramadol + SSRIs is one of the most common dangerous drug interactions in France because both are widely prescribed. Tramadol is itself an SNRI — combining it with antidepressants like paroxetine, sertraline, or venlafaxine risks serotonin syndrome and seizures. Always tell your doctor ALL medications you take.',
      fr: 'Tramadol + ISRS est l\u2019une des interactions médicamenteuses dangereuses les plus courantes en France car les deux sont largement prescrits. Le tramadol est lui-même un IRSN — le combiner avec des antidépresseurs comme la paroxétine, la sertraline ou la venlafaxine risque un syndrome sérotoninergique et des convulsions. Dites TOUJOURS à votre médecin TOUS les médicaments que vous prenez.',
    },
    sources: ['PubMed: Grond & Sablotzki 2004, Hassamal 2018', 'ANSM', 'OFDT', 'Prescrire', 'Vidal'],
  },

  pregabalin: {
    id: 'pregabalin',
    name: { en: 'Pregabalin (Lyrica)', fr: 'Prégabaline (Lyrica)' },
    class: 'depressant',
    aliases: {
      en: ['Lyrica', 'pregab', 'pregabs'],
      fr: ['lyrica', 'préga', 'prégabaline'],
    },
    legalStatusFR: {
      en: 'Prescription required — increasingly monitored. Scheduled in UK, Germany, and several EU countries.',
      fr: 'Ordonnance obligatoire — surveillance croissante. Classé au Royaume-Uni, Allemagne et plusieurs pays UE.',
    },
    color: '#7c3aed',
    summary: {
      en: 'GABAergic (calcium channel blocker) prescribed for neuropathic pain, epilepsy, and anxiety. Rising misuse in France for its euphoric effects at high doses. Potentiates opioids dangerously. Withdrawal can be more severe than benzodiazepines for some users. Now scheduled in several countries due to abuse potential.',
      fr: 'GABAergique (bloqueur des canaux calciques) prescrit pour la douleur neuropathique, l\u2019épilepsie et l\u2019anxiété. Usage détourné en hausse en France pour ses effets euphorisants à hautes doses. Potentialise dangereusement les opioïdes. Le sevrage peut être plus sévère que celui des benzodiazépines pour certains usagers. Désormais classé dans plusieurs pays en raison du potentiel d\u2019abus.',
    },
    effects: {
      shortTerm: {
        en: 'Euphoria (at supratherapeutic doses), relaxation, sociability, dizziness, drowsiness, blurred vision, ataxia, disinhibition',
        fr: 'Euphorie (à doses suprathérapeutiques), relaxation, sociabilité, vertiges, somnolence, vision floue, ataxie, désinhibition',
      },
      longTerm: {
        en: 'Physical dependence (can develop within weeks), severe withdrawal (anxiety, insomnia, seizures, psychosis), cognitive impairment, weight gain',
        fr: 'Dépendance physique (peut se développer en quelques semaines), sevrage sévère (anxiété, insomnie, convulsions, psychose), altération cognitive, prise de poids',
      },
      duration: '6-8h (therapeutic) / variable at misuse doses',
    },
    dependence: { physical: 'high', psychological: 'moderate' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'Opioids', risk: 'extreme', description: { en: 'Synergistic respiratory depression — pregabalin is found in increasing numbers of opioid OD deaths', fr: 'Dépression respiratoire synergique — la prégabaline est trouvée dans un nombre croissant de décès par OD aux opioïdes' } },
      { substance: 'Benzodiazepines', risk: 'extreme', description: { en: 'Triple CNS depression — respiratory failure risk', fr: 'Triple dépression SNC — risque d\u2019insuffisance respiratoire' } },
      { substance: 'Alcohol', risk: 'high', description: { en: 'Additive sedation, blackouts, respiratory depression', fr: 'Sédation additive, blackouts, dépression respiratoire' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '15-35%' },
      heartRate: { direction: 'down', magnitude: '-5-15 bpm (sedation effect)' },
      sleep: 'Increased total sleep time but altered architecture, reduced deep sleep quality',
      stress: 'Reduced during use (anxiolytic effect), severe rebound in withdrawal',
      bodyBattery: 'May appear normal during use, collapses during withdrawal',
      recoveryTime: 'Withdrawal onset: 24-48h. Taper required: weeks to months. Abrupt cessation can cause seizures.',
    },
    keyFact: {
      en: 'Pregabalin + opioids is an increasingly lethal combination. Pregabalin is now found in 10-20% of opioid overdose deaths in countries that track it. Withdrawal can be worse than benzodiazepines — NEVER stop abruptly after regular use. Requires a slow taper under medical supervision.',
      fr: 'Prégabaline + opioïdes est une combinaison de plus en plus létale. La prégabaline est désormais trouvée dans 10-20% des décès par overdose aux opioïdes dans les pays qui la surveillent. Le sevrage peut être pire que celui des benzodiazépines — NE JAMAIS arrêter brutalement après un usage régulier. Nécessite un sevrage progressif sous supervision médicale.',
    },
    sources: ['PubMed: Evoy 2017, Schjerning 2016', 'ANSM', 'EMCDDA', 'OFDT', 'PHE England'],
  },

  kratom: {
    id: 'kratom',
    name: { en: 'Kratom', fr: 'Kratom' },
    class: 'opioid',
    aliases: {
      en: ['kratom', 'mitragyna', 'mitragynine', 'biak'],
      fr: ['kratom', 'mitragyna'],
    },
    legalStatusFR: {
      en: 'Legal gray area in France — not explicitly scheduled but subject to import controls. Banned in several EU countries.',
      fr: 'Zone grise légale en France — pas explicitement classé mais soumis à des contrôles d\u2019importation. Interdit dans plusieurs pays UE.',
    },
    color: '#65a30d',
    summary: {
      en: 'Plant (Mitragyna speciosa) from SE Asia containing mitragynine, a partial mu-opioid agonist. Marketed as "natural" but produces real opioid effects and dependence. Dose-dependent: stimulant at low doses, opioid-like at higher doses. Unregulated products carry contamination risk (heavy metals, salmonella, adulterants).',
      fr: 'Plante (Mitragyna speciosa) d\u2019Asie du Sud-Est contenant de la mitragynine, un agoniste partiel mu-opioïde. Commercialisé comme "naturel" mais produit de vrais effets opioïdes et une dépendance. Dose-dépendant : stimulant à faibles doses, opioïde à doses élevées. Les produits non réglementés comportent un risque de contamination (métaux lourds, salmonelle, adultérants).',
    },
    effects: {
      shortTerm: {
        en: 'Low dose: stimulation, alertness, sociability. High dose: euphoria, pain relief, sedation, nausea, constipation, itching. Opioid-like withdrawal between doses with regular use.',
        fr: 'Faible dose : stimulation, vigilance, sociabilité. Haute dose : euphorie, soulagement de la douleur, sédation, nausée, constipation, démangeaisons. Sevrage de type opioïde entre les doses avec un usage régulier.',
      },
      longTerm: {
        en: 'Physical dependence and withdrawal syndrome (confirmed), liver toxicity (rare but documented), weight loss, skin darkening, constipation, cognitive effects. "Natural" marketing obscures real addiction potential.',
        fr: 'Dépendance physique et syndrome de sevrage (confirmés), toxicité hépatique (rare mais documentée), perte de poids, assombrissement de la peau, constipation, effets cognitifs. Le marketing "naturel" masque le vrai potentiel addictif.',
      },
      duration: '3-5h (dose-dependent)',
    },
    dependence: { physical: 'moderate', psychological: 'moderate' },
    overdoseRisk: 'low',
    topInteractions: [
      { substance: 'Opioids', risk: 'extreme', description: { en: 'Additive opioid effects — respiratory depression risk', fr: 'Effets opioïdes additifs — risque de dépression respiratoire' } },
      { substance: 'Benzodiazepines', risk: 'high', description: { en: 'CNS depression compounded', fr: 'Dépression SNC augmentée' } },
      { substance: 'Alcohol', risk: 'high', description: { en: 'Additive sedation and nausea, liver strain', fr: 'Sédation et nausée additives, surcharge hépatique' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '10-20%' },
      heartRate: { direction: 'variable', magnitude: 'Slight increase at low dose, decrease at high dose' },
      sleep: 'Mild disruption, REM effects similar to weak opioids',
      stress: 'Mild reduction during use, rebound with regular use',
      bodyBattery: 'Modest impact, worse with chronic use',
      recoveryTime: 'Withdrawal onset: 12-24h. Acute: 3-5 days. Similar to mild opioid withdrawal.',
    },
    keyFact: {
      en: '"Natural" does not mean safe or non-addictive. Kratom acts on the same opioid receptors as heroin and morphine. Regular users develop real physical dependence with a real withdrawal syndrome. Unregulated products may contain heavy metals, salmonella, or undisclosed opioids. If using to self-treat opioid withdrawal, seek medical supervision instead.',
      fr: '"Naturel" ne veut pas dire sans danger ni sans addiction. Le kratom agit sur les mêmes récepteurs opioïdes que l\u2019héroïne et la morphine. Les usagers réguliers développent une vraie dépendance physique avec un vrai syndrome de sevrage. Les produits non réglementés peuvent contenir des métaux lourds, de la salmonelle ou des opioïdes non déclarés. Si vous l\u2019utilisez pour auto-traiter un sevrage aux opioïdes, consultez plutôt un médecin.',
    },
    sources: ['PubMed: Prozialeck 2012, Singh 2016, Swogger 2015', 'EMCDDA', 'FDA', 'ANSES', 'PsychonautWiki'],
  },

  alcohol: {
    id: 'alcohol',
    name: { en: 'Alcohol', fr: 'Alcool' },
    class: 'depressant',
    aliases: {
      en: ['booze', 'liquor', 'spirits', 'beer', 'wine', 'ethanol'],
      fr: ['alcool', 'picole', 'bi\u00e8re', 'vin', 'pinard', 'gnole', 'tise'],
    },
    legalStatusFR: {
      en: 'Legal \u2014 age-restricted 18+, heavily taxed, advertising restricted (loi \u00c9vin)',
      fr: 'L\u00e9gal \u2014 interdit aux -18 ans, fortement tax\u00e9, publicit\u00e9 restreinte (loi \u00c9vin)',
    },
    color: '#6366f1',
    summary: {
      en: 'The most destructive legal drug in France: 49,000 deaths/year, 120 billion \u20ac annual social cost. A GABAergic depressant normalized by culture despite being pharmacologically one of the most dangerous substances. Withdrawal can be LETHAL (delirium tremens) \u2014 unlike most illegal drugs.',
      fr: 'La drogue l\u00e9gale la plus destructrice en France : 49 000 d\u00e9c\u00e8s/an, 120 milliards \u20ac de co\u00fbt social annuel. D\u00e9presseur GABAergique normalis\u00e9 par la culture malgr\u00e9 un profil pharmacologique parmi les plus dangereux. Le sevrage peut \u00eatre MORTEL (delirium tremens) \u2014 contrairement \u00e0 la plupart des drogues ill\u00e9gales.',
    },
    effects: {
      shortTerm: {
        en: 'Disinhibition, euphoria, impaired coordination, slurred speech, nausea, vomiting, blackouts at high doses, respiratory depression at extreme doses',
        fr: 'D\u00e9sinhibition, euphorie, coordination alt\u00e9r\u00e9e, \u00e9locution p\u00e2teuse, naus\u00e9e, vomissements, blackouts \u00e0 forte dose, d\u00e9pression respiratoire \u00e0 dose extr\u00eame',
      },
      longTerm: {
        en: 'Liver cirrhosis, cardiovascular disease, cancer (mouth, throat, liver, breast), brain atrophy, Korsakoff syndrome, fetal alcohol syndrome (FAS \u2014 #1 preventable cause of intellectual disability), pancreatitis',
        fr: 'Cirrhose h\u00e9patique, maladies cardiovasculaires, cancer (bouche, gorge, foie, sein), atrophie c\u00e9r\u00e9brale, syndrome de Korsakoff, syndrome d\u2019alcoolisation f\u0153tale (SAF \u2014 1\u00e8re cause \u00e9vitable de handicap mental), pancr\u00e9atite',
      },
      duration: '1-5h depending on amount, metabolism varies widely',
    },
    dependence: { physical: 'extreme', psychological: 'extreme' },
    overdoseRisk: 'high',
    topInteractions: [
      { substance: 'Cocaine', risk: 'extreme', description: { en: 'Forms cocaethylene in liver \u2014 18-25x increased cardiac death risk', fr: 'Forme de la coca\u00e9thyl\u00e8ne dans le foie \u2014 risque de mort cardiaque multipli\u00e9 par 18-25' } },
      { substance: 'Opioids', risk: 'extreme', description: { en: 'Synergistic respiratory depression \u2014 leading cause of accidental death', fr: 'D\u00e9pression respiratoire synergique \u2014 cause principale de d\u00e9c\u00e8s accidentel' } },
      { substance: 'Benzodiazepines', risk: 'extreme', description: { en: 'Double GABA depression \u2014 respiratory arrest risk', fr: 'Double d\u00e9pression GABAergique \u2014 risque d\u2019arr\u00eat respiratoire' } },
      { substance: 'GHB/GBL', risk: 'extreme', description: { en: 'Both GABAergic \u2014 coma and death at doses that would be survivable alone', fr: 'Les deux GABAergiques \u2014 coma et d\u00e9c\u00e8s \u00e0 des doses survivables seules' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '30-60% (crushed for 24-72h even after moderate drinking)' },
      heartRate: { direction: 'up', magnitude: '+10-30 bpm (elevated resting HR through the night)' },
      sleep: 'Architecture destroyed despite subjective "falling asleep faster" \u2014 REM suppressed, deep sleep fragmented, wake-after-sleep-onset dramatically increased',
      stress: 'Elevated (50-80) through the night and next day',
      bodyBattery: 'Fails to recharge overnight \u2014 Garmin shows flatline or minimal recovery',
      recoveryTime: '24-72h for moderate session, 3-7 days for heavy binge',
    },
    keyFact: {
      en: 'Alcohol withdrawal can KILL you. Unlike opioid withdrawal (miserable but rarely lethal), alcohol and benzodiazepine withdrawal can cause fatal seizures and delirium tremens. Heavy daily drinkers must NEVER quit cold turkey \u2014 medical supervision is essential. Fetal alcohol syndrome is the #1 preventable cause of intellectual disability in France.',
      fr: 'Le sevrage alcoolique peut TUER. Contrairement au sevrage opio\u00efde (mis\u00e9rable mais rarement mortel), le sevrage alcool et benzodiaz\u00e9pines peut causer des convulsions fatales et un delirium tremens. Les buveurs quotidiens lourds ne doivent JAMAIS arr\u00eater brutalement \u2014 supervision m\u00e9dicale indispensable. Le SAF est la 1\u00e8re cause \u00e9vitable de handicap mental en France.',
    },
    sources: ['Sant\u00e9 Publique France', 'OFDT', 'INSERM', 'PubMed: Rehm 2009, Nutt 2010', 'WHO Global Status Report on Alcohol and Health'],
  },

  ketamine: {
    id: 'ketamine',
    name: { en: 'Ketamine', fr: 'K\u00e9tamine' },
    class: 'dissociative',
    aliases: {
      en: ['ket', 'K', 'special K', 'vitamin K', 'horse tranquilizer'],
      fr: ['k\u00e9ta', 'k\u00e9', 'sp\u00e9cial K', 'vitamine K'],
    },
    legalStatusFR: {
      en: 'Controlled \u2014 prescription only (anesthetic). Listed as stup\u00e9fiant since 2017.',
      fr: 'Contr\u00f4l\u00e9 \u2014 sur ordonnance uniquement (anesth\u00e9sique). Class\u00e9 stup\u00e9fiant depuis 2017.',
    },
    color: '#06b6d4',
    summary: {
      en: 'Dissociative anesthetic with growing recreational use in the French club/festival scene. At low doses: floaty dissociation. At high doses: the "K-hole" (complete ego dissolution). Growing therapeutic interest for treatment-resistant depression (esketamine/Spravato approved). Chronic use causes severe bladder damage.',
      fr: 'Anesth\u00e9sique dissociatif avec usage r\u00e9cr\u00e9atif croissant en milieu festif fran\u00e7ais. \u00c0 faible dose : dissociation flottante. \u00c0 forte dose : le "K-hole" (dissolution compl\u00e8te de l\u2019ego). Int\u00e9r\u00eat th\u00e9rapeutique croissant pour la d\u00e9pression r\u00e9sistante (esk\u00e9tamine/Spravato approuv\u00e9). L\u2019usage chronique cause des dommages v\u00e9sicaux s\u00e9v\u00e8res.',
    },
    effects: {
      shortTerm: {
        en: 'Dissociation, altered perception, euphoria, analgesia, impaired coordination, nausea, at high doses: K-hole (complete detachment from body and environment)',
        fr: 'Dissociation, perception alt\u00e9r\u00e9e, euphorie, analg\u00e9sie, coordination alt\u00e9r\u00e9e, naus\u00e9e, \u00e0 forte dose : K-hole (d\u00e9tachement complet du corps et de l\u2019environnement)',
      },
      longTerm: {
        en: 'Ketamine bladder syndrome (ulcerative cystitis \u2014 irreversible in severe cases), urinary tract damage, cognitive impairment, psychological dependence, liver damage with heavy chronic use',
        fr: 'Syndrome v\u00e9sical \u00e0 la k\u00e9tamine (cystite ulc\u00e9rative \u2014 irr\u00e9versible dans les cas s\u00e9v\u00e8res), dommages urinaires, alt\u00e9ration cognitive, d\u00e9pendance psychologique, dommages h\u00e9patiques en usage chronique lourd',
      },
      duration: '45-90 min (snorted) / 15-30 min (IM)',
    },
    dependence: { physical: 'moderate', psychological: 'high' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'Alcohol / Depressants', risk: 'extreme', description: { en: 'Respiratory depression, vomiting while unconscious \u2014 aspiration risk', fr: 'D\u00e9pression respiratoire, vomissements en \u00e9tat d\u2019inconscience \u2014 risque d\u2019aspiration' } },
      { substance: 'GHB/GBL', risk: 'extreme', description: { en: 'Combined CNS depression \u2014 coma risk, common in chemsex settings', fr: 'D\u00e9pression SNC combin\u00e9e \u2014 risque de coma, fr\u00e9quent en contexte chemsex' } },
      { substance: 'Stimulants', risk: 'moderate', description: { en: 'Cardiovascular strain from opposing effects, unpredictable dissociation', fr: 'Surcharge cardiovasculaire par effets oppos\u00e9s, dissociation impr\u00e9visible' } },
    ],
    biometric: {
      hrv: { direction: 'down', magnitude: '20-40%' },
      heartRate: { direction: 'up', magnitude: '+10-25 bpm' },
      sleep: 'Moderate disruption, less severe than stimulants. REM quality affected.',
      stress: 'Elevated (40-70) during use, normalizes faster than stimulants',
      bodyBattery: 'Moderate drain, 12-24h recovery',
      recoveryTime: '12-36h for single use',
    },
    keyFact: {
      en: 'Chronic ketamine use destroys your bladder. "Ketamine bladder syndrome" causes ulcerative cystitis with agonizing pain, blood in urine, and frequency up to every 15 minutes. In severe cases, bladder removal is required. This is irreversible. The therapeutic use for depression uses controlled, low, infrequent doses \u2014 not recreational patterns.',
      fr: 'L\u2019usage chronique de k\u00e9tamine d\u00e9truit la vessie. Le "syndrome v\u00e9sical \u00e0 la k\u00e9tamine" cause une cystite ulc\u00e9rative avec douleurs atroces, sang dans les urines, et mictions toutes les 15 minutes. Dans les cas s\u00e9v\u00e8res, ablation de la vessie. C\u2019est irr\u00e9versible. L\u2019usage th\u00e9rapeutique contre la d\u00e9pression utilise des doses contr\u00f4l\u00e9es, faibles et espac\u00e9es \u2014 pas les patterns r\u00e9cr\u00e9atifs.',
    },
    sources: ['PubMed: Shahani 2007 (bladder), Krystal 2019 (depression)', 'EMCDDA', 'PsychonautWiki', 'OFDT', 'ANSM'],
  },

  ghb: {
    id: 'ghb',
    name: { en: 'GHB / GBL', fr: 'GHB / GBL' },
    class: 'depressant',
    aliases: {
      en: ['G', 'liquid ecstasy', 'liquid E', 'GBL', 'fantasy', 'grievous bodily harm'],
      fr: ['G', 'liquid', 'savon', 'ecstasy liquide', 'GBL'],
    },
    legalStatusFR: {
      en: 'Illegal \u2014 GHB classified as stup\u00e9fiant. GBL legal as industrial solvent but illegal for human consumption.',
      fr: 'Ill\u00e9gal \u2014 GHB class\u00e9 stup\u00e9fiant. GBL l\u00e9gal comme solvant industriel mais ill\u00e9gal \u00e0 la consommation humaine.',
    },
    color: '#818cf8',
    summary: {
      en: 'GABAergic depressant with an EXTREMELY narrow dose-response curve: the recreational dose is dangerously close to the lethal dose. Misleadingly called "liquid ecstasy" despite having nothing in common with MDMA. Heavily associated with chemsex and drug-facilitated sexual assault. Withdrawal is as dangerous as alcohol withdrawal \u2014 can be fatal.',
      fr: 'D\u00e9presseur GABAergique avec une courbe dose-r\u00e9ponse EXTR\u00caMEMENT \u00e9troite : la dose r\u00e9cr\u00e9ative est dangereusement proche de la dose l\u00e9tale. Appel\u00e9 trompeusement "ecstasy liquide" malgr\u00e9 z\u00e9ro point commun avec la MDMA. Fortement associ\u00e9 au chemsex et \u00e0 la soumission chimique. Le sevrage est aussi dangereux que celui de l\u2019alcool \u2014 peut \u00eatre fatal.',
    },
    effects: {
      shortTerm: {
        en: 'Euphoria, disinhibition, increased sociability and libido, drowsiness, dizziness, nausea, at slightly higher doses: unconsciousness, vomiting, respiratory depression, coma',
        fr: 'Euphorie, d\u00e9sinhibition, sociabilit\u00e9 et libido augment\u00e9es, somnolence, vertiges, naus\u00e9e, \u00e0 dose l\u00e9g\u00e8rement sup\u00e9rieure : inconscience, vomissements, d\u00e9pression respiratoire, coma',
      },
      longTerm: {
        en: 'Severe physical dependence (develops fast, within weeks of regular use), memory impairment, emotional instability, withdrawal syndrome (anxiety, tremors, psychosis, seizures \u2014 potentially fatal)',
        fr: 'D\u00e9pendance physique s\u00e9v\u00e8re (se d\u00e9veloppe vite, en quelques semaines d\u2019usage r\u00e9gulier), troubles de la m\u00e9moire, instabilit\u00e9 \u00e9motionnelle, syndrome de sevrage (anxi\u00e9t\u00e9, tremblements, psychose, convulsions \u2014 potentiellement fatal)',
      },
      duration: '1.5-3h (GHB) / 2-4h (GBL, prodrug converted to GHB by body)',
    },
    dependence: { physical: 'extreme', psychological: 'high' },
    overdoseRisk: 'extreme',
    topInteractions: [
      { substance: 'Alcohol', risk: 'extreme', description: { en: 'Both GABAergic \u2014 coma and death at doses survivable alone. THE most dangerous common combination with G.', fr: 'Les deux GABAergiques \u2014 coma et d\u00e9c\u00e8s \u00e0 des doses survivables seules. LA combinaison la plus dangereuse avec le G.' } },
      { substance: 'Ketamine', risk: 'extreme', description: { en: 'Combined CNS depression, vomiting while dissociated \u2014 aspiration death', fr: 'D\u00e9pression SNC combin\u00e9e, vomissements en \u00e9tat dissociatif \u2014 mort par aspiration' } },
      { substance: 'Opioids', risk: 'extreme', description: { en: 'Triple respiratory depression risk \u2014 fatal', fr: 'Triple risque de d\u00e9pression respiratoire \u2014 fatal' } },
      { substance: 'Stimulants (3-MMC, cocaine)', risk: 'high', description: { en: 'Stimulant masks G sedation \u2014 redosing trap when stimulant wears off', fr: 'Le stimulant masque la s\u00e9dation du G \u2014 pi\u00e8ge au redosage quand le stimulant s\u2019estompe' } },
    ],
    biometric: {
      hrv: { direction: 'variable', magnitude: 'Artificially elevated during use (GABA sedation), crashes in withdrawal' },
      heartRate: { direction: 'down', magnitude: '-10-30 bpm (bradycardia, dangerous below 40 bpm)' },
      sleep: 'Induces unconsciousness mistaken for sleep \u2014 no restorative architecture, REM absent',
      stress: 'Artificially low during use (10-30), extreme rebound (80-100) in withdrawal',
      bodyBattery: 'False "recharge" signal \u2014 Garmin misinterprets unconsciousness as rest',
      recoveryTime: '24-48h for single use, withdrawal crisis can last 7-14 days',
    },
    keyFact: {
      en: 'GHB has the narrowest recreational-to-lethal dose margin of any common substance. The difference between a "good dose" and a coma can be less than 0.5 ml. NEVER eyeball doses \u2014 use a syringe with ml markings. NEVER combine with alcohol (the #1 killer combo). GHB withdrawal, like alcohol withdrawal, can cause fatal seizures \u2014 medical detox is essential.',
      fr: 'Le GHB a la marge dose r\u00e9cr\u00e9ative/dose l\u00e9tale la plus \u00e9troite de toute substance courante. La diff\u00e9rence entre une "bonne dose" et le coma peut \u00eatre inf\u00e9rieure \u00e0 0,5 ml. NE JAMAIS doser \u00e0 l\u2019\u0153il \u2014 utiliser une seringue gradu\u00e9e en ml. NE JAMAIS combiner avec l\u2019alcool (combo #1 qui tue). Le sevrage GHB, comme le sevrage alcool, peut causer des convulsions fatales \u2014 d\u00e9sintoxication m\u00e9dicale indispensable.',
    },
    sources: ['PubMed: Schep 2012, Busard\u00f2 2015', 'EMCDDA', 'PsychonautWiki', 'OFDT', 'TripSit'],
  },

  benzodiazepines: {
    id: 'benzodiazepines',
    name: { en: 'Benzodiazepines', fr: 'Benzodiaz\u00e9pines' },
    class: 'depressant',
    aliases: {
      en: ['benzos', 'xanax', 'valium', 'klonopin', 'ativan', 'diazepam', 'alprazolam'],
      fr: ['benzo', 'xan', 'barres', 'lexo', 'valium', 'xanax', 'temesta'],
    },
    legalStatusFR: {
      en: 'Legal on prescription \u2014 List I or II controlled substances. Most prescribed anxiolytics in France (world #1 per capita).',
      fr: 'L\u00e9gal sur ordonnance \u2014 substances contr\u00f4l\u00e9es Liste I ou II. Anxiolytiques les plus prescrits en France (n\u00b01 mondial par habitant).',
    },
    color: '#a5b4fc',
    summary: {
      en: 'GABAergic depressants prescribed for anxiety, insomnia, seizures. France is the world\u2019s #1 consumer per capita. The #1 combination killer with opioids: found in 50-80% of fatal opioid overdoses. Withdrawal can be LETHAL (like alcohol) \u2014 seizures, psychosis, death. Rebound anxiety often worse than original symptoms.',
      fr: 'D\u00e9presseurs GABAergiques prescrits pour anxi\u00e9t\u00e9, insomnie, convulsions. La France est le 1er consommateur mondial par habitant. Le tueur #1 en combinaison avec les opio\u00efdes : pr\u00e9sents dans 50-80% des overdoses opio\u00efdes fatales. Le sevrage peut \u00eatre MORTEL (comme l\u2019alcool) \u2014 convulsions, psychose, d\u00e9c\u00e8s. L\u2019anxi\u00e9t\u00e9 rebond est souvent pire que les sympt\u00f4mes d\u2019origine.',
    },
    effects: {
      shortTerm: {
        en: 'Anxiolysis, sedation, muscle relaxation, disinhibition, amnesia (especially with alcohol), impaired coordination, slurred speech',
        fr: 'Anxiolyse, s\u00e9dation, relaxation musculaire, d\u00e9sinhibition, amn\u00e9sie (surtout avec l\u2019alcool), coordination alt\u00e9r\u00e9e, \u00e9locution p\u00e2teuse',
      },
      longTerm: {
        en: 'Physical dependence (develops within 2-4 weeks of daily use), cognitive impairment, emotional blunting, rebound anxiety worse than original, increased dementia risk (debated), paradoxical aggression',
        fr: 'D\u00e9pendance physique (se d\u00e9veloppe en 2-4 semaines d\u2019usage quotidien), alt\u00e9ration cognitive, \u00e9moussement \u00e9motionnel, anxi\u00e9t\u00e9 rebond pire que l\u2019originale, risque de d\u00e9mence augment\u00e9 (d\u00e9battu), agressivit\u00e9 paradoxale',
      },
      duration: '4-6h (alprazolam/Xanax) / 12-24h (diazepam/Valium) / up to 200h (some metabolites)',
    },
    dependence: { physical: 'extreme', psychological: 'extreme' },
    overdoseRisk: 'moderate',
    topInteractions: [
      { substance: 'Opioids', risk: 'extreme', description: { en: 'Found in 50-80% of fatal opioid ODs. Synergistic respiratory depression \u2014 THE deadliest common combination.', fr: 'Pr\u00e9sents dans 50-80% des OD opio\u00efdes fatales. D\u00e9pression respiratoire synergique \u2014 LA combinaison courante la plus mortelle.' } },
      { substance: 'Alcohol', risk: 'extreme', description: { en: 'Double GABA depression \u2014 blackouts, respiratory arrest, death', fr: 'Double d\u00e9pression GABAergique \u2014 blackouts, arr\u00eat respiratoire, d\u00e9c\u00e8s' } },
      { substance: 'GHB/GBL', risk: 'extreme', description: { en: 'Triple GABA agonism \u2014 extreme CNS depression', fr: 'Triple agonisme GABA \u2014 d\u00e9pression SNC extr\u00eame' } },
    ],
    biometric: {
      hrv: { direction: 'variable', magnitude: 'Artificially elevated during use (parasympathetic mimicry), crashes in withdrawal' },
      heartRate: { direction: 'down', magnitude: '-5-15 bpm during use, elevated in withdrawal' },
      sleep: 'Reduces sleep latency but destroys architecture \u2014 suppresses deep sleep and REM. Garmin shows "good" sleep that is not restorative.',
      stress: 'Artificially suppressed (10-30), severe rebound stress (70-100) in withdrawal',
      bodyBattery: 'False normalization \u2014 masks underlying physiological debt',
      recoveryTime: 'Taper-dependent: weeks to months for safe discontinuation',
    },
    keyFact: {
      en: 'Benzodiazepine withdrawal can KILL you \u2014 just like alcohol. Never quit cold turkey after daily use. The medical taper protocol takes weeks to months. Benzos are found in 50-80% of all fatal opioid overdoses \u2014 they are the silent accomplice in the opioid crisis. France prescribes more benzos per capita than any other country.',
      fr: 'Le sevrage des benzodiaz\u00e9pines peut TUER \u2014 comme l\u2019alcool. Ne jamais arr\u00eater brutalement apr\u00e8s un usage quotidien. Le protocole de sevrage m\u00e9dical prend des semaines \u00e0 des mois. Les benzos sont pr\u00e9sents dans 50-80% de toutes les OD opio\u00efdes fatales \u2014 le complice silencieux de la crise des opio\u00efdes. La France prescrit plus de benzos par habitant que tout autre pays.',
    },
    sources: ['PubMed: Lader 2011, Jones 2012 (opioid combo)', 'ANSM', 'OFDT', 'HAS', 'EMCDDA'],
  },

  codeine: {
    id: 'codeine',
    name: { en: 'Codeine / Lean', fr: 'Cod\u00e9ine / Lean' },
    class: 'opioid',
    aliases: {
      en: ['lean', 'purple drank', 'sizzurp', 'dirty sprite', 'codeine syrup'],
      fr: ['lean', 'purple drank', 'sirop', 'cod\u00e9', 'violet', 'sprite sale'],
    },
    legalStatusFR: {
      en: 'Prescription-only since 2017 (previously OTC). Classification triggered by youth deaths.',
      fr: 'Sur ordonnance depuis 2017 (auparavant en vente libre). Classification d\u00e9clench\u00e9e par des d\u00e9c\u00e8s chez les jeunes.',
    },
    color: '#7c3aed',
    summary: {
      en: 'Weak opioid prodrug converted to morphine by CYP2D6 enzyme. Massively popularized by French rap culture ("lean" = codeine syrup + soda + candy). CRITICAL DANGER: CYP2D6 ultra-rapid metabolizers (1-10% of population depending on ethnicity) convert codeine to morphine at lethal rates \u2014 "normal" doses can kill. Gateway to stronger opioids for many users.',
      fr: 'Opio\u00efde faible prodrogue converti en morphine par l\u2019enzyme CYP2D6. Massivement popularis\u00e9 par la culture rap fran\u00e7aise ("lean" = sirop cod\u00e9in\u00e9 + soda + bonbons). DANGER CRITIQUE : les m\u00e9taboliseurs ultra-rapides CYP2D6 (1-10% de la population selon l\u2019ethnie) convertissent la cod\u00e9ine en morphine \u00e0 des taux l\u00e9taux \u2014 des doses "normales" peuvent tuer. Passerelle vers des opio\u00efdes plus forts pour beaucoup d\u2019utilisateurs.',
    },
    effects: {
      shortTerm: {
        en: 'Euphoria (mild), relaxation, drowsiness, nausea, constipation, itching, respiratory depression at high doses',
        fr: 'Euphorie (l\u00e9g\u00e8re), relaxation, somnolence, naus\u00e9e, constipation, d\u00e9mangeaisons, d\u00e9pression respiratoire \u00e0 forte dose',
      },
      longTerm: {
        en: 'Opioid dependence, chronic constipation, liver damage (paracetamol in many formulations), escalation to stronger opioids (heroin, oxycodone, fentanyl)',
        fr: 'D\u00e9pendance opio\u00efde, constipation chronique, dommages h\u00e9patiques (parac\u00e9tamol dans beaucoup de formulations), escalade vers des opio\u00efdes plus forts (h\u00e9ro\u00efne, oxycodone, fentanyl)',
      },
      duration: '3-6h',
    },
    dependence: { physical: 'moderate', psychological: 'moderate' },
    overdoseRisk: 'high',
    topInteractions: [
      { substance: 'Alcohol', risk: 'extreme', description: { en: 'Respiratory depression \u2014 the lean + alcohol combo kills', fr: 'D\u00e9pression respiratoire \u2014 la combo lean + alcool tue' } },
      { substance: 'Benzodiazepines', risk: 'extreme', description: { en: 'Synergistic CNS/respiratory depression \u2014 #1 opioid combo killer', fr: 'D\u00e9pression SNC/respiratoire synergique \u2014 combo opio\u00efde #1 qui tue' } },
      { substance: 'CYP2D6 inhibitors (some antidepressants)', risk: 'high', description: { en: 'Block conversion to morphine \u2014 users compensate by taking more, then stop inhibitor = sudden lethal dose', fr: 'Bloquent la conversion en morphine \u2014 l\u2019utilisateur compense en prenant plus, puis arr\u00eate l\u2019inhibiteur = dose soudainement l\u00e9tale' } },
    ],
    biometric: {
      hrv: { direction: 'variable', magnitude: 'May paradoxically increase during use (opioid effect), drops in withdrawal' },
      heartRate: { direction: 'down', magnitude: '-5-15 bpm (mild bradycardia)' },
      sleep: 'REM suppression, shallow sleep architecture despite increased total sleep time',
      stress: 'Artificially low during use (10-30), elevated in withdrawal (60-80)',
      bodyBattery: 'Deceptively normal during use, collapses when stopped',
      recoveryTime: '24-72h for occasional use, 7-14 days for withdrawal from regular use',
    },
    keyFact: {
      en: 'Your genetics can make codeine lethal. CYP2D6 ultra-rapid metabolizers (1-10% of people) convert codeine to morphine at dangerously high rates. A dose that\u2019s "normal" for most people can cause fatal respiratory depression in ultra-rapid metabolizers. There is NO way to know your status without genetic testing. Several French teenagers have died from "normal" lean doses.',
      fr: 'Votre g\u00e9n\u00e9tique peut rendre la cod\u00e9ine mortelle. Les m\u00e9taboliseurs ultra-rapides CYP2D6 (1-10% des gens) convertissent la cod\u00e9ine en morphine \u00e0 des taux dangereusement \u00e9lev\u00e9s. Une dose "normale" pour la plupart peut causer une d\u00e9pression respiratoire fatale chez les ultra-rapides. Il n\u2019y a AUCUN moyen de conna\u00eetre votre statut sans test g\u00e9n\u00e9tique. Plusieurs adolescents fran\u00e7ais sont morts de doses "normales" de lean.',
    },
    sources: ['PubMed: Crews 2014 (CYP2D6), Gasche 2004', 'ANSM', 'OFDT', 'EMCDDA', 'PharmGKB'],
  },
};

/* ─── Helpers ─── */

export function getSubstance(id: string): Substance | undefined {
  return SUBSTANCES[id];
}

export function getAllSubstances(): Substance[] {
  return Object.values(SUBSTANCES);
}

export function getSubstancesByCategory(categoryId: string): Substance[] {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return [];
  return cat.substances.map((id) => SUBSTANCES[id]).filter(Boolean);
}
