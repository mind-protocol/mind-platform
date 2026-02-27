'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useChatStore } from '@/lib/chat/store';

interface SensationCategory {
  key: string;
  label: string;
  icon: string;
  items: SensationItem[];
}

interface SensationItem {
  key: string;
  label: string;
  icon: string;
}

const SYMPTOM_TOOLTIPS: Record<string, string> = {
  // Serotonin
  agitation: "Nervosité excessive, incapacité à rester immobile, besoin de bouger constamment",
  tremors: "Tremblements involontaires des mains, doigts ou membres — fins et rapides",
  sweating: "Transpiration excessive sans effort physique, sueurs froides ou chaudes",
  diarrhea: "Selles fréquentes et liquides, urgence intestinale",
  tachycardia: "Coeur qui bat vite (>100 bpm au repos) — vérifiable au poignet ou sur la Garmin",
  hyperthermia: "Température corporelle élevée (>38°C), sensation de chaleur interne intense",
  confusion: "Difficulté à penser clairement, désorientation, pensées désorganisées",
  myoclonus: "Contractions musculaires brusques et involontaires — sursauts, spasmes",
  // GABA/sedation
  excessive_sedation: "Somnolence anormale, difficulté à garder les yeux ouverts, envie irrésistible de dormir",
  respiratory_slow: "Respiration anormalement lente (<12/min), pauses entre les respirations",
  ataxia: "Perte d'équilibre, démarche instable, impression d'ébriété sans alcool",
  hypotension: "Vertige en se levant rapidement, vision qui noircit brièvement, tête qui tourne",
  // Gastrointestinal
  nausea: "Envie de vomir sans vomir, malaise gastrique, estomac retourné",
  retching: "Haut-le-coeur — contractions abdominales réflexes sans vomissement effectif",
  vomiting: "Vomissement effectif — expulsion du contenu gastrique",
  vomiting_blood: "Vomissement de sang (hématémèse) — rouge vif ou marc de café. URGENCE si abondant",
  vomiting_bile: "Vomissement de bile — liquide jaune-vert amer, estomac vide",
  vomiting_food: "Vomissement de nourriture — aliments partiellement digérés",
  vomiting_dry: "Vomissement à vide — contractions sans contenu, spasmes gastriques",
  stomach_pain: "Douleur ou crampe dans le ventre, sensation de brûlure ou pression abdominale",
  flatulence: "Gaz intestinaux — ballonnements, flatulences, distension abdominale",
  bloating: "Gaz piégés dans les viscères — sensation de gonflement, pression interne, borborygmes",
  acid_reflux: "Remontées acides — brûlure remontant de l'estomac vers la gorge (pyrosis)",
  liver_pain: "Douleur sous-costale droite (hypocondre droit) — zone du foie, pesanteur ou pointe",
  subcostal_pain_left: "Douleur sous-costale gauche — zone rate/estomac, pointe ou pesanteur",
  epigastric_pain: "Douleur épigastrique — creux de l'estomac, brûlure ou crampe centrale haute",
  // ORL (Oto-rhino-laryngé)
  cough_wet: "Toux grasse / productive — avec expectorations (mucus, glaires)",
  cough_dry: "Toux sèche — irritative, sans expectoration, parfois en quintes",
  throat_irritation: "Irritation de la gorge — picotement, grattement, sensation de brûlure",
  nasal_irritation: "Irritation nasale — picotement, brûlure, sécheresse des muqueuses",
  nasal_congestion_both: "Nez bouché bilatéral — les deux narines obstruées, respiration buccale",
  nasal_congestion_one: "Nez bouché unilatéral — une seule narine obstruée",
  nasal_congestion_fluid: "Nez qui coule (rhinorrhée) — écoulement clair, aqueux ou épais",
  nosebleed: "Saignement de nez (épistaxis) — écoulement de sang d'une ou deux narines",
  // Respiratory
  breathing_shallow: "Respiration haute et superficielle — seul le haut du thorax bouge, souffle court",
  breathing_blocked: "Sensation de ne pas pouvoir inspirer à fond, blocage respiratoire, oppression",
  breathing_panting: "Respiration rapide et courte comme après un sprint, essoufflement au repos",
  hyperventilation: "Respiration excessive et rapide, fourmillements aux extrémités, tête légère",
  chest_tightness: "Pression ou serrement dans la poitrine, sensation de poids sur le sternum",
  // Neurological
  headache: "Douleur dans la tête — pression, pulsation ou serrement, localisée ou diffuse",
  migraine: "Migraine — douleur pulsatile unilatérale, parfois avec aura, nausée, photophobie",
  dizziness: "Sensation de vertige, pièce qui tourne, instabilité même assis",
  tremors_general: "Tremblements des mains ou du corps, fins ou grossiers, au repos ou en mouvement",
  numbness: "Engourdissement, fourmillements, perte de sensibilité dans les extrémités (doigts, orteils, lèvres)",
  brain_fog: "Brouillard mental — difficulté à se concentrer, pensées ralenties, impression de coton",
  visual_disturbance: "Troubles visuels — vision floue, halos, points lumineux, difficultés de mise au point",
  tinnitus: "Acouphènes — bourdonnement, sifflement ou son continu dans les oreilles",
  // Cardiovascular
  palpitations: "Conscience anormale des battements du coeur — sensation de coeur qui saute ou bat fort",
  chest_pain: "Douleur thoracique — pression, brûlure ou pointe dans la poitrine. URGENCE si intense + irradiation",
  // Thermoregulation
  hot_flash: "Bouffée de chaleur soudaine, rougeur du visage, sensation de brûlure interne",
  cold_flash: "Frisson soudain, chair de poule, sensation de froid intense sans raison externe",
  night_sweats: "Sueurs nocturnes — transpiration excessive pendant le sommeil, draps mouillés",
  // Psychological
  anxiety_spike: "Montée d'anxiété brutale — oppression, pensées catastrophiques, besoin de fuir",
  panic_attack: "Attaque de panique — peur intense soudaine, palpitations, souffle coupé, sentiment de mort imminente",
  mood_crash: "Chute d'humeur soudaine — tristesse, irritabilité ou vide émotionnel inattendu",
  depersonalization: "Dépersonnalisation — sentiment d'être détaché de soi-même, d'observer de l'extérieur",
  irritability: "Irritabilité — seuil de tolérance très bas, agacement disproportionné, impatience",
  insomnia: "Insomnie — impossibilité de s'endormir ou réveils multiples malgré la fatigue",
  fatigue_sudden: "Fatigue brutale, comme si l'énergie était coupée d'un coup",
  // Musculoskeletal
  muscle_tension: "Tensions musculaires — raideur dans la nuque, épaules, mâchoire ou dos",
  jaw_clenching: "Bruxisme / serrement de mâchoire — mâchoire serrée, grincement de dents",
  back_pain: "Douleur dorsale — lombaire, thoracique ou cervicale, raideur ou pointe",
  joint_pain: "Douleur articulaire — genou, poignet, cheville, épaule — inflammation ou raideur",
  // Cutané
  rash: "Éruption cutanée — rougeurs, plaques, boutons, démangeaisons",
  itching: "Démangeaisons (prurit) — envie de se gratter, localisées ou généralisées",
  // Oculaire
  dry_eyes: "Yeux secs — sensation de sable, brûlure oculaire, besoin de cligner souvent",
  pupil_dilation: "Pupilles dilatées (mydriase) — sensibilité accrue à la lumière",
  // Urinaire
  frequent_urination: "Envie fréquente d'uriner (pollakiurie) — petites quantités à intervalles rapprochés",
  urinary_retention: "Difficulté à uriner — jet faible, sensation de ne pas vider complètement",
  // Sexuel
  libido_change: "Changement de libido — augmentation ou diminution notable du désir",
  anorgasmia: "Anorgasmie — difficulté ou impossibilité à atteindre l'orgasme",
};

const SYMPTOM_RECOMMENDATIONS: Record<string, string> = {
  agitation: "Si ce symptome persiste plus de 2h ou s'aggrave, contactez votre prescripteur. Hydratez-vous et restez dans un environnement calme.",
  tremors: "Observez si les tremblements augmentent avec l'effort. S'ils deviennent invalidants ou s'accompagnent de fievre, consultez rapidement.",
  sweating: "Les sueurs sans effort physique peuvent signaler un syndrome serotoninergique. Restez hydrate et surveillez votre temperature.",
  diarrhea: "Hydratez-vous abondamment (eau + sels mineraux). Si les symptomes persistent >24h ou si vous voyez du sang, consultez.",
  tachycardia: "Verifiez votre frequence cardiaque sur la Garmin. Si >120 bpm au repos pendant plus de 15 minutes, appelez le 15.",
  hyperthermia: "Temperature >38.5C persistante = urgence si sous ISRS/IRSN. Arretez tout effort et rafraichissez-vous immediatement.",
  confusion: "La confusion peut signaler un syndrome serotoninergique grave. Si associee a de la fievre et des tremblements, appelez le 15.",
  myoclonus: "Les sursauts musculaires isoles sont benins. S'ils deviennent continus ou s'associent a d'autres symptomes, contactez votre medecin.",
  excessive_sedation: "Ne conduisez pas et evitez les activites dangereuses. Si la somnolence est brutale apres une nouvelle prise, contactez votre prescripteur.",
  respiratory_slow: "Comptez vos respirations sur 1 minute. Si <10/min ou si vous avez du mal a rester eveille, appelez le 15 immediatement.",
  ataxia: "Asseyez-vous immediatement pour eviter une chute. Si ce trouble apparait apres une nouvelle combinaison de medicaments, contactez votre medecin.",
  hypotension: "Levez-vous lentement en 2 temps (assis puis debout). Hydratez-vous. Si les vertiges persistent, consultez.",
  nausea: "Mangez leger (crackers, riz). Evitez les aliments gras. La nausee medicamenteuse s'ameliore souvent en 1-2 semaines.",
  retching: "Restez calme et respirez lentement par le nez. Si les haut-le-coeur deviennent des vomissements repetitifs, consultez.",
  vomiting: "Hydratez-vous par petites gorgees. Attendez 30 min avant de manger. Si les vomissements persistent >6h, consultez.",
  vomiting_blood: "URGENCE: Vomissement de sang = consultation immediate aux urgences ou appelez le 15. Ne prenez rien par voie orale.",
  vomiting_bile: "Signe que l'estomac est vide. Reposez-vous et reintroduisez les liquides progressivement. Si recurrent, consultez.",
  vomiting_food: "Notez ce que vous avez mange recemment. Si les vomissements sont associes a de la fievre, consultez rapidement.",
  vomiting_dry: "Respirez calmement, focus sur l'expiration lente. Sucez un glacon. Si les spasmes persistent >1h, consultez.",
  stomach_pain: "Adoptez une position confortable. Appliquez de la chaleur sur le ventre. Si douleur intense ou brutale, consultez.",
  flatulence: "Evitez les aliments fermentescibles (choux, legumineuses). Marchez doucement. Generalement benin et transitoire.",
  bloating: "Marchez 10-15 minutes pour faciliter le transit. Evitez les boissons gazeuses. Si douleur associee, consultez.",
  acid_reflux: "Ne vous allongez pas apres manger. Evitez cafe, alcool, aliments acides. Surélevez la tete du lit si nocturne.",
  liver_pain: "Douleur sous-costale droite persistante merite une consultation. Evitez l'alcool et le paracetamol en attendant.",
  subcostal_pain_left: "Peut etre d'origine gastrique ou splenique. Si douleur aigue et intense, consultez rapidement.",
  epigastric_pain: "Essayez un antiacide si disponible. Mangez leger. Si la douleur irradie dans le dos ou le bras gauche, appelez le 15.",
  cough_wet: "Hydratez-vous abondamment pour fluidifier les secretions. Si les expectorations sont colorees (vert/sang), consultez.",
  cough_dry: "Humidifiez l'air et buvez des boissons chaudes. Si la toux dure >3 semaines ou empeche le sommeil, consultez.",
  throat_irritation: "Gargarisez-vous avec de l'eau salee tiede. Sucez des pastilles. Si associee a de la fievre, consultez.",
  nasal_irritation: "Utilisez du serum physiologique. Evitez les environnements secs et poussiereux.",
  nasal_congestion_both: "Inhalation de vapeur chaude, serum physiologique, tete surelevee la nuit. Si persistant >10 jours, consultez.",
  nasal_congestion_one: "Un seul cote bouche de maniere chronique peut justifier un avis ORL. En aigu, serum physiologique suffit.",
  nasal_congestion_fluid: "Mouchez-vous doucement (une narine a la fois). Si ecoulement jaunatre >10 jours, consultez pour sinusite.",
  nosebleed: "Penchez la tete en avant, pincez les narines 10 min sans relacher. Si le saignement ne s'arrete pas en 20 min, urgences.",
  tinnitus: "Evitez les environnements bruyants. Si apparition soudaine ou unilaterale, consultez rapidement un ORL.",
  breathing_shallow: "Pratiquez la respiration abdominale : inspirez 4s par le nez, gonflez le ventre, expirez 6s par la bouche.",
  breathing_blocked: "Desserrez vos vetements, asseyez-vous droit. Respirez lentement. Si oppression persistante, consultez.",
  breathing_panting: "Asseyez-vous et ralentissez volontairement la respiration. Si essoufflement au repos sans effort prealable, consultez.",
  hyperventilation: "Respirez dans vos mains en coupe. Comptez 4s inspir, 7s pause, 8s expir. Les fourmillements vont passer.",
  chest_tightness: "Distinguez anxiete vs cardiaque : si douleur irradie au bras/machoire ou si sueurs froides, appelez le 15.",
  headache: "Hydratez-vous, reposez-vous dans l'obscurite. Si le mal de tete est le pire de votre vie ou soudain, urgences.",
  migraine: "Isolez-vous dans le noir et le silence. Appliquez du froid sur les tempes. Si aura nouvelle ou inhabituelle, consultez.",
  dizziness: "Asseyez-vous ou allongez-vous. Evitez les mouvements brusques de la tete. Si vertige rotatoire continu, consultez.",
  tremors_general: "Au repos, les tremblements sont souvent benins et lies au stress ou aux medicaments. Signalez-les a votre medecin.",
  numbness: "Les fourmillements dans les extremites sont frequents avec certains medicaments. Si perte de force associee, consultez.",
  brain_fog: "Reposez-vous, hydratez-vous. Evitez les ecrans. Le brouillard mental medicamenteux s'ameliore souvent avec le temps.",
  visual_disturbance: "Reposez vos yeux. Si vision floue soudaine, eclairs lumineux ou perte de champ visuel, consultez en urgence.",
  palpitations: "Inspirez profondement et soufflez lentement. Evitez cafe et stimulants. Si syncope ou douleur, consultez.",
  chest_pain: "PRUDENCE : Si douleur thoracique + sueurs + irradiation bras/machoire, appelez le 15. Sinon, surveillez et consultez.",
  hot_flash: "Normal avec certains medicaments. Decouvrez-vous, buvez frais. Si associe a fievre reelle, surveillez la temperature.",
  cold_flash: "Couvrez-vous et buvez chaud. Si frissons intenses avec fievre, consultez pour ecarter une infection.",
  night_sweats: "Aérez la chambre, utilisez des draps en coton. Si sueurs nocturnes nouvelles et persistantes, consultez.",
  anxiety_spike: "Technique 5-4-3-2-1 : 5 choses a voir, 4 a toucher, 3 a entendre, 2 a sentir, 1 a gouter. Ca va passer.",
  panic_attack: "Vous n'etes pas en danger. Respirez lentement (4-7-8). L'attaque dure max 20 min. Ancrez-vous dans le present.",
  mood_crash: "Sortez marcher 10 min a la lumiere. Contactez quelqu'un. Si idees noires, appelez le 3114 (numero national prevention suicide).",
  depersonalization: "Touchez des textures differentes, sentez une odeur forte. Ca va passer. Frequent avec certains medicaments et le cannabis.",
  irritability: "Eloignez-vous de la situation irritante si possible. Marchez, respirez. Si persistant, signalez a votre prescripteur.",
  insomnia: "Evitez les ecrans 1h avant le coucher. Chambre fraiche et sombre. Si insomnie >3 nuits consecutives, consultez.",
  fatigue_sudden: "Allongez-vous 15-20 min (micro-sieste). Verifiez votre body battery. Si fatigue extreme recurrente, consultez.",
  muscle_tension: "Etirez-vous doucement, appliquez de la chaleur. Le magnesium peut aider. Si raideur de la nuque + fievre, urgences.",
  jaw_clenching: "Desserrez volontairement la machoire, massez les masseters. Frequent avec les ISRS. Un protege-dents nocturne peut aider.",
  back_pain: "Changez de position regulierement. Chaleur locale. Si douleur irradie dans la jambe ou perte de force, consultez.",
  joint_pain: "Mobilisez doucement l'articulation. Glace 15 min si inflammee. Si gonflement + chaleur + rougeur, consultez.",
  rash: "Ne grattez pas. Prenez une photo pour le suivi. Si eruption + fievre + muqueuses atteintes, consultez en urgence.",
  itching: "Appliquez du froid. Evitez les douches chaudes. Si generalisee et soudaine apres un medicament, risque allergique = consultez.",
  dry_eyes: "Utilisez des larmes artificielles. Clignez regulierement. Reposez-vous des ecrans toutes les 20 min.",
  pupil_dilation: "Portez des lunettes de soleil. Evitez la conduite si la vision est genee. Frequent avec certaines substances.",
  frequent_urination: "Normal avec le lithium et certains diuretiques. Hydratez-vous quand meme. Si brulures urinaires, consultez.",
  urinary_retention: "Essayez l'eau courante pour declencher la miction. Si impossibilite complete d'uriner >8h, urgences.",
  libido_change: "Effet frequent des ISRS/IRSN. Parlez-en a votre prescripteur qui peut ajuster le traitement.",
  anorgasmia: "Effet secondaire connu des antidepresseurs serotoninergiques. Discutez d'un ajustement avec votre prescripteur.",
};

function SymptomPopover({ itemKey, label, icon, onClose, onSendToChat }: {
  itemKey: string;
  label: string;
  icon: string;
  onClose: () => void;
  onSendToChat: (text: string) => void;
}) {
  const [question, setQuestion] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const tooltip = SYMPTOM_TOOLTIPS[itemKey] || label;
  const reco = SYMPTOM_RECOMMENDATIONS[itemKey] || "Signalez cet effet a votre medecin traitant lors de votre prochain rendez-vous.";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleSend = () => {
    if (!question.trim()) return;
    onSendToChat(`[Symptome: ${icon} ${label}] ${question.trim()}`);
    setQuestion('');
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 bottom-full left-0 mb-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl overflow-hidden"
      style={{
        background: 'rgba(12,12,16,0.97)',
        border: '1px solid rgba(120,120,140,0.2)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 12px 40px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,0.03) inset',
      }}
    >
      {/* Header */}
      <div className="px-3.5 pt-3 pb-2 border-b border-zinc-800/60">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-200">
            {icon} {label}
          </span>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-400 transition p-0.5"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-3.5 py-2.5">
        <p className="text-xs text-zinc-400 leading-relaxed">
          {tooltip}
        </p>
      </div>

      {/* Recommendation */}
      <div className="px-3.5 pb-2.5">
        <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Recommandation</div>
        <p className="text-xs text-teal-400/80 leading-relaxed">
          {reco}
        </p>
      </div>

      {/* Ask MIND */}
      <div className="px-3.5 pb-3 border-t border-zinc-800/60 pt-2.5">
        <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">Demander a MIND</div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder={`Question sur ${label.toLowerCase()}...`}
            className="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition"
          />
          <button
            onClick={handleSend}
            disabled={!question.trim()}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-30 disabled:hover:bg-amber-500/20 shrink-0"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

const SENSATION_CATEGORIES: SensationCategory[] = [
  {
    key: 'gastrointestinal',
    label: 'Gastro-intestinal',
    icon: '🤢',
    items: [
      { key: 'nausea', label: 'Nausée', icon: '🤢' },
      { key: 'retching', label: 'Haut-le-coeur', icon: '😫' },
      { key: 'vomiting', label: 'Vomissement', icon: '🤮' },
      { key: 'vomiting_blood', label: 'Vomissement sang', icon: '🩸' },
      { key: 'vomiting_bile', label: 'Vomissement bile', icon: '🟡' },
      { key: 'vomiting_food', label: 'Vomissement nourriture', icon: '🍽️' },
      { key: 'vomiting_dry', label: 'Vomissement à vide', icon: '😖' },
      { key: 'diarrhea', label: 'Diarrhée', icon: '🚽' },
      { key: 'stomach_pain', label: 'Douleur abdominale', icon: '🫄' },
      { key: 'flatulence', label: 'Flatulences', icon: '💨' },
      { key: 'bloating', label: 'Gaz / ballonnements', icon: '🫧' },
      { key: 'acid_reflux', label: 'Remontées acides', icon: '🔥' },
      { key: 'epigastric_pain', label: 'Douleur épigastrique', icon: '🎯' },
      { key: 'liver_pain', label: 'Douleur foie', icon: '🫁' },
      { key: 'subcostal_pain_left', label: 'Sous-costal gauche', icon: '◀️' },
    ],
  },
  {
    key: 'orl',
    label: 'ORL',
    icon: '👃',
    items: [
      { key: 'cough_wet', label: 'Toux grasse', icon: '💦' },
      { key: 'cough_dry', label: 'Toux sèche', icon: '😤' },
      { key: 'throat_irritation', label: 'Gorge irritée', icon: '🔴' },
      { key: 'nasal_irritation', label: 'Nez irrité', icon: '👃' },
      { key: 'nasal_congestion_both', label: 'Nez bouché (2 narines)', icon: '🤧' },
      { key: 'nasal_congestion_one', label: 'Nez bouché (1 narine)', icon: '😤' },
      { key: 'nasal_congestion_fluid', label: 'Nez qui coule', icon: '💧' },
      { key: 'nosebleed', label: 'Saignement de nez', icon: '🩸' },
      { key: 'tinnitus', label: 'Acouphènes', icon: '🔔' },
    ],
  },
  {
    key: 'respiratory',
    label: 'Respiratoire',
    icon: '🫁',
    items: [
      { key: 'breathing_shallow', label: 'Haute / superficielle', icon: '🫁' },
      { key: 'breathing_blocked', label: 'Bloquée', icon: '🚫' },
      { key: 'breathing_panting', label: 'Haletante', icon: '💨' },
      { key: 'respiratory_slow', label: 'Lente', icon: '🐢' },
      { key: 'hyperventilation', label: 'Hyperventilation', icon: '🌬️' },
      { key: 'chest_tightness', label: 'Oppression thoracique', icon: '🫀' },
    ],
  },
  {
    key: 'neurological',
    label: 'Neurologique',
    icon: '🧠',
    items: [
      { key: 'headache', label: 'Céphalée', icon: '🤕' },
      { key: 'migraine', label: 'Migraine', icon: '⚡' },
      { key: 'dizziness', label: 'Vertiges', icon: '💫' },
      { key: 'tremors_general', label: 'Tremblements', icon: '🫨' },
      { key: 'numbness', label: 'Engourdissement', icon: '🧊' },
      { key: 'brain_fog', label: 'Brouillard mental', icon: '🌫️' },
      { key: 'visual_disturbance', label: 'Troubles visuels', icon: '👁️' },
      { key: 'tinnitus', label: 'Acouphènes', icon: '🔔' },
    ],
  },
  {
    key: 'cardiovascular',
    label: 'Cardiovasculaire',
    icon: '💗',
    items: [
      { key: 'tachycardia', label: 'Tachycardie', icon: '💓' },
      { key: 'palpitations', label: 'Palpitations', icon: '💗' },
      { key: 'hypotension', label: 'Vertige orthostatique', icon: '⬇️' },
      { key: 'chest_pain', label: 'Douleur thoracique', icon: '❤️‍🩹' },
    ],
  },
  {
    key: 'thermoregulation',
    label: 'Thermorégulation',
    icon: '🌡️',
    items: [
      { key: 'hot_flash', label: 'Bouffée de chaleur', icon: '🥵' },
      { key: 'cold_flash', label: 'Frisson / froid', icon: '🥶' },
      { key: 'sweating', label: 'Sueurs', icon: '💦' },
      { key: 'hyperthermia', label: 'Fièvre', icon: '🌡️' },
      { key: 'night_sweats', label: 'Sueurs nocturnes', icon: '🌙' },
    ],
  },
  {
    key: 'psychological',
    label: 'Psychologique',
    icon: '🧠',
    items: [
      { key: 'anxiety_spike', label: "Pic d'anxiété", icon: '😰' },
      { key: 'panic_attack', label: 'Attaque de panique', icon: '🚨' },
      { key: 'mood_crash', label: "Chute d'humeur", icon: '📉' },
      { key: 'agitation', label: 'Agitation', icon: '⚡' },
      { key: 'confusion', label: 'Confusion', icon: '🌀' },
      { key: 'depersonalization', label: 'Dépersonnalisation', icon: '👤' },
      { key: 'irritability', label: 'Irritabilité', icon: '😤' },
      { key: 'insomnia', label: 'Insomnie', icon: '🌃' },
      { key: 'fatigue_sudden', label: 'Fatigue soudaine', icon: '🔋' },
    ],
  },
  {
    key: 'musculoskeletal',
    label: 'Musculaire',
    icon: '💪',
    items: [
      { key: 'myoclonus', label: 'Contractions', icon: '💪' },
      { key: 'ataxia', label: "Perte d'équilibre", icon: '🥴' },
      { key: 'muscle_tension', label: 'Tensions', icon: '🔗' },
      { key: 'jaw_clenching', label: 'Serrement mâchoire', icon: '😬' },
      { key: 'back_pain', label: 'Douleur dorsale', icon: '🔙' },
      { key: 'joint_pain', label: 'Douleur articulaire', icon: '🦴' },
    ],
  },
  {
    key: 'cutaneous',
    label: 'Cutané',
    icon: '🩹',
    items: [
      { key: 'rash', label: 'Éruption cutanée', icon: '🔴' },
      { key: 'itching', label: 'Démangeaisons', icon: '🩹' },
      { key: 'dry_eyes', label: 'Yeux secs', icon: '👁️' },
      { key: 'pupil_dilation', label: 'Mydriase', icon: '⭕' },
    ],
  },
  {
    key: 'urogenital',
    label: 'Uro-génital',
    icon: '🚿',
    items: [
      { key: 'frequent_urination', label: 'Pollakiurie', icon: '🚿' },
      { key: 'urinary_retention', label: 'Rétention urinaire', icon: '⏸️' },
      { key: 'libido_change', label: 'Changement libido', icon: '💜' },
      { key: 'anorgasmia', label: 'Anorgasmie', icon: '⬜' },
    ],
  },
];

const SEVERITY_OPTIONS = [
  { key: 'mild', label: 'Léger', color: '#facc15' },
  { key: 'moderate', label: 'Modéré', color: '#f97316' },
  { key: 'severe', label: 'Sévère', color: '#ef4444' },
];

export default function SensationLogger({ onLogged }: { onLogged: () => void }) {
  const t = useTranslations('Tracker');
  const [expanded, setExpanded] = useState(false);
  const [selectedEffects, setSelectedEffects] = useState<
    Map<string, { severity: string; notes: string }>
  >(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [popoverKey, setPopoverKey] = useState<string | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const { sendMessage, setOpen } = useChatStore();

  const sendToChat = useCallback((text: string) => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    setOpen(true);
    sendMessage(text, pageUrl);
  }, [sendMessage, setOpen]);

  const toggleEffect = (key: string) => {
    setSelectedEffects((prev) => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.set(key, { severity: 'mild', notes: '' });
      }
      return next;
    });
  };

  const setSeverity = (key: string, severity: string) => {
    setSelectedEffects((prev) => {
      const next = new Map(prev);
      const existing = next.get(key);
      if (existing) next.set(key, { ...existing, severity });
      return next;
    });
  };

  const submit = async () => {
    if (selectedEffects.size === 0) return;
    setSubmitting(true);
    setFeedback('');

    let ok = 0;
    for (const [key, { severity, notes }] of selectedEffects) {
      try {
        const res = await fetch('/api/tracker/adverse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ effect: key, severity, notes }),
        });
        if (res.ok) ok++;
      } catch {
        // continue
      }
    }

    if (ok > 0) {
      setFeedback(`${ok} effet${ok > 1 ? 's' : ''} enregistré${ok > 1 ? 's' : ''}`);
      setSelectedEffects(new Map());
      onLogged();
      setTimeout(() => setFeedback(''), 3000);
    } else {
      setFeedback(t('errorGeneric'));
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/40 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🩺</span>
          <span className="text-sm font-medium text-zinc-300">
            Sensations & Effets secondaires
          </span>
          {selectedEffects.size > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              {selectedEffects.size}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {feedback && (
            <span className="text-xs text-green-400">{feedback}</span>
          )}
          <span className={`text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {SENSATION_CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">
                {cat.icon} {cat.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => {
                  const isSelected = selectedEffects.has(item.key);
                  const severity = selectedEffects.get(item.key)?.severity;
                  const severityColor =
                    severity === 'severe'
                      ? 'border-red-500/50 bg-red-500/15 text-red-300'
                      : severity === 'moderate'
                      ? 'border-orange-500/50 bg-orange-500/15 text-orange-300'
                      : isSelected
                      ? 'border-yellow-500/50 bg-yellow-500/15 text-yellow-300'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600';

                  return (
                    <div key={item.key} className="relative flex flex-col items-start gap-0.5">
                      <button
                        onClick={() => toggleEffect(item.key)}
                        onContextMenu={(e) => { e.preventDefault(); setPopoverKey(popoverKey === item.key ? null : item.key); }}
                        onMouseEnter={() => {
                          hoverTimerRef.current = Number(setTimeout(() => setPopoverKey(item.key), 600));
                        }}
                        onMouseLeave={() => {
                          if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                        }}
                        className={`text-xs px-2 py-1 rounded border transition ${severityColor}`}
                      >
                        {item.icon} {item.label}
                      </button>
                      {popoverKey === item.key && (
                        <SymptomPopover
                          itemKey={item.key}
                          label={item.label}
                          icon={item.icon}
                          onClose={() => setPopoverKey(null)}
                          onSendToChat={sendToChat}
                        />
                      )}
                      {isSelected && (
                        <div className="flex gap-0.5 ml-0.5">
                          {SEVERITY_OPTIONS.map((sev) => (
                            <button
                              key={sev.key}
                              onClick={() => setSeverity(item.key, sev.key)}
                              className={`text-[9px] px-1 py-0.5 rounded transition ${
                                severity === sev.key
                                  ? 'text-black font-medium'
                                  : 'text-zinc-600 hover:text-zinc-400'
                              }`}
                              style={
                                severity === sev.key
                                  ? { backgroundColor: sev.color }
                                  : undefined
                              }
                            >
                              {sev.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {selectedEffects.size > 0 && (
            <div className="pt-2 border-t border-zinc-800">
              <button
                onClick={submit}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg text-sm font-medium transition bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50"
              >
                {submitting
                  ? 'Enregistrement...'
                  : `Enregistrer ${selectedEffects.size} effet${selectedEffects.size > 1 ? 's' : ''}`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
