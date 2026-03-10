/* ─── Substance Database — Layer 1: Public Harm Reduction ─── */

export type SubstanceClass =
  | 'stimulant'
  | 'psychedelic'
  | 'empathogen'
  | 'depressant'
  | 'opioid'
  | 'cannabinoid';

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
    substances: ['cocaine', 'crack', 'amphetamines', '3mmc', 'captagon', 'tobacco'],
  },
  {
    id: 'psychedelics',
    label: { en: 'Psychedelics', fr: 'Psych\u00e9d\u00e9liques' },
    icon: '\uD83C\uDF00',
    color: '#8b5cf6',
    substances: ['lsd', 'psilocybin'],
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
    substances: ['cannabis'],
  },
  {
    id: 'opioids',
    label: { en: 'Opioids', fr: 'Opio\u00efdes' },
    icon: '\uD83D\uDEA8',
    color: '#ef4444',
    substances: ['heroin'],
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
