import { Link } from '@/i18n/navigation';
import { Metadata } from 'next';

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr
      ? '$MIND Manifeste des Valeurs | Mind Protocol'
      : '$MIND Values Manifesto | Mind Protocol',
    description: isFr
      ? 'Doctrine de la Confiance Sélective. Nous sélectionnons sur l\'effort. Nous protégeons les volontaires.'
      : 'Doctrine of Selective Trust. We select on effort. We protect the willing.',
  };
}

/* ── Shared components ──────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
      <div className="h-1 w-full bg-purple-600 mb-8" />
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-purple-400 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="text-purple-400 mt-1 flex-shrink-0">&#8226;</span>
      <span>{children}</span>
    </li>
  );
}

function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-purple-600 bg-purple-950/20 pl-6 py-4 my-6 text-zinc-200 italic">
      {children}
    </blockquote>
  );
}

function PdfButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-600/40 text-purple-300 hover:bg-purple-600/30 hover:text-white transition text-sm"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      {label}
    </a>
  );
}

/* ── Table ──────────────────────────────────────────────────────── */

function TrustTable({ isFr }: { isFr: boolean }) {
  const headers = isFr
    ? ['Niveau', 'Qui', 'Accès', 'Priorité']
    : ['Level', 'Who', 'Access', 'Priority'];

  const rows = isFr
    ? [
        ['Admin', 'Co-fondateurs — NLR (vision, développement), BT (finance, business)', 'Complet', '+50'],
        ['High', 'Cercle interne, Garmin, détenteurs $MIND, parrainés', 'Étendu, 300/jour', '+30'],
        ['Medium', 'Utilisateurs enregistrés', 'Standard, 60/jour', '+15'],
        ['Low', 'Individus sous observation', 'Limité, 15/jour', '+5'],
        ['Stranger', 'Non enregistrés', 'Basique, 8/jour', '+0'],
      ]
    : [
        ['Admin', 'Co-founders — NLR (vision, development), BT (finance, business)', 'Full', '+50'],
        ['High', 'Inner circle, Garmin, $MIND holders, referred', 'Extended, 300 daily', '+30'],
        ['Medium', 'Registered users', 'Standard, 60 daily', '+15'],
        ['Low', 'Under observation', 'Limited, 15 daily', '+5'],
        ['Stranger', 'Unregistered', 'Basic, 8 daily', '+0'],
      ];

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-zinc-900">
            {headers.map((h) => (
              <th key={h} className="py-2.5 px-3 text-zinc-300 font-semibold border-b border-zinc-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
              {row.map((cell, j) => (
                <td key={j} className="py-2 px-3 border-b border-zinc-800/50 text-zinc-400">
                  {j === 0 ? <span className="font-semibold text-white">{cell}</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonTable({ isFr }: { isFr: boolean }) {
  const headers = isFr
    ? ['Dimension', 'Crédit Social', 'Mind Protocol']
    : ['Dimension', 'Social Credit', 'Mind Protocol'];

  const rows = isFr
    ? [
        ['Participation', 'Obligatoire (Etat)', 'Volontaire (opt-in)'],
        ['Opérateur', 'Gouvernement', 'Communauté privée'],
        ['Périmètre', 'Toute la vie', 'Privilèges communautaires'],
        ['Plancher', 'Aucun', 'Inconditionnel'],
        ['Sortie', 'Impossible', 'Libre avec toutes les données'],
        ['Transparence', 'Opaque', 'Open-source, auditable'],
        ['Direction', 'Peut diminuer', 'Monotone (augmente)'],
      ]
    : [
        ['Participation', 'Mandatory (state)', 'Voluntary (opt-in)'],
        ['Operator', 'Government', 'Private community'],
        ['Scope', 'All of life', 'Community privileges only'],
        ['Floor', 'None', 'Unconditional'],
        ['Exit', 'Cannot leave', 'Anytime with all data'],
        ['Transparency', 'Opaque', 'Open-source, auditable'],
        ['Direction', 'Can decrease', 'Monotonic (only up)'],
      ];

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-zinc-900">
            {headers.map((h) => (
              <th key={h} className="py-2.5 px-3 text-zinc-300 font-semibold border-b border-zinc-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
              {row.map((cell, j) => (
                <td key={j} className="py-2 px-3 border-b border-zinc-800/50 text-zinc-400">
                  {j === 0 ? <span className="font-semibold text-white">{cell}</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────── */

export default async function ManifestoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-3xl mx-auto px-6 py-24">
        {/* Cover Header */}
        <header className="text-center mb-16">
          <p className="text-purple-400 text-5xl md:text-6xl font-bold mb-4">$MIND</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isFr ? 'Manifeste des Valeurs' : 'Values Manifesto'}
          </h1>
          <p className="text-purple-300/70 uppercase tracking-widest text-sm mb-8">
            {isFr ? 'Doctrine de la Confiance Sélective' : 'Doctrine of Selective Trust'}
          </p>
          <div className="h-0.5 w-24 bg-purple-600 mx-auto mb-8" />
          <p className="text-zinc-500 text-sm mb-6">
            Mind Protocol &mdash; Version 1.0 &mdash; {isFr ? 'Mars' : 'March'} 2026
          </p>

          {/* PDF Downloads */}
          <div className="flex flex-wrap gap-3 justify-center">
            <PdfButton href="/papers/MIND_Values_Manifesto.pdf" label="English PDF" />
            <PdfButton href="/papers/MIND_Manifeste_des_Valeurs_FR.pdf" label="PDF Français" />
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-white">

          {/* Intro */}
          <div className="mb-14 border border-zinc-800 rounded-xl p-8 bg-zinc-900/30">
            <h2 className="text-2xl font-bold mb-4">{isFr ? 'Pourquoi ce document ?' : 'Why this document?'}</h2>
            <p>
              {isFr
                ? "L'IA personnelle va devenir l'infrastructure la plus intime de nos vies — elle verra nos données de santé, lira nos emails, connaîtra nos patterns cognitifs. La question n'est pas de savoir si cette technologie existera, mais sous quelles règles."
                : 'Personal AI will become the most intimate infrastructure of our lives — it will see our health data, read our emails, know our cognitive patterns. The question is not whether this technology will exist, but under what rules.'}
            </p>
            <p className="mt-3">
              {isFr
                ? "Ce manifeste définit ces règles. Il pose les fondations architecturales, juridiques et éthiques de Mind Protocol — et explique pourquoi chaque décision de design est une décision de valeurs. Si vous envisagez d'utiliser, d'investir dans, ou de construire sur Mind Protocol, ce document est votre point de départ."
                : 'This manifesto defines those rules. It lays the architectural, legal, and ethical foundations of Mind Protocol — and explains why every design decision is a values decision. If you are considering using, investing in, or building on Mind Protocol, this document is your starting point.'}
            </p>
          </div>

          {/* I. What We Build */}
          <Section title={isFr ? 'I. Ce que nous construisons' : 'I. What We Build'}>
            <p>
              {isFr
                ? "Mind Protocol est un réseau d'intelligence persistante conçu pour la souveraineté individuelle. Chaque utilisateur possède ses données, ses clés, ses tokens, et les patterns qui émergent de ses interactions."
                : 'Mind Protocol is a persistent intelligence network designed for individual sovereignty. Each user owns their data, their keys, their tokens, and the patterns that emerge from their interactions.'}
            </p>
            <p className="mt-6 mb-3 text-xl font-bold text-purple-300">
              {isFr ? 'Les Valeurs de Venise' : 'The Venice Values'}
            </p>
            <p className="mb-4 text-sm text-zinc-400">
              {isFr
                ? 'Six principes fondateurs. Inscrits dans l\'architecture.'
                : 'Six founding principles. Embedded in the architecture.'}
            </p>
            <ul className="space-y-3 list-none">
              <Bullet><strong>1. Privacy-first</strong> — {isFr ? "Les données utilisateur ne quittent jamais l'instance. L'architecture rend structurellement impossible l'entraînement de modèles ou la revente. Conforme RGPD et AI Act par design." : 'User data never leaves the instance. The architecture makes model training or resale structurally impossible. GDPR and AI Act compliant by design.'}</Bullet>
              <Bullet><strong>2. Open-source</strong> — {isFr ? "L'intégralité du code est publique et auditable. Pas d'IA propriétaire, pas de boîte noire. Le modèle Linux appliqué à l'IA personnelle." : 'The entire codebase is public and auditable. No proprietary AI, no black boxes. The Linux model applied to personal AI.'}</Bullet>
              <Bullet><strong>3. {isFr ? 'Souveraineté utilisateur' : 'User Sovereignty'}</strong> — {isFr ? "Clés, données et tokens appartiennent à l'utilisateur. Portabilité totale (Art. 20 RGPD). Pas de lock-in, pas de jardin clos." : 'Keys, data, and tokens belong to the user. Full portability (GDPR Art. 20). No lock-in, no walled garden.'}</Bullet>
              <Bullet><strong>4. {isFr ? 'Décentralisé par design' : 'Decentralized by Design'}</strong> — {isFr ? "Pas d'autorité centrale, pas d'algorithme d'engagement. Synchronisation CRDT pour un état distribué sans conflit." : 'No central authority, no engagement algorithm. CRDT-based sync for conflict-free distributed state.'}</Bullet>
              <Bullet><strong>5. {isFr ? 'Confiance Sélective' : 'Selective Trust'}</strong> — {isFr ? "L'accès se calibre sur le comportement démontré, pas sur l'identité. Cinq niveaux gradués, gouvernés par des critères documentés et auditables." : 'Access is calibrated on demonstrated behavior, not identity. Five graduated tiers, governed by documented and auditable criteria.'}</Bullet>
              <Bullet><strong>6. {isFr ? 'Célébration de la différence' : 'Celebration of Difference'}</strong> — {isFr ? "Le système récompense l'effort, l'authenticité et la vulnérabilité — pas la conformité. La diversité cognitive, culturelle et expérientielle est un avantage compétitif." : 'The system rewards effort, authenticity, and vulnerability — not conformity. Cognitive, cultural, and experiential diversity is a competitive advantage.'}</Bullet>
            </ul>
            <p className="mt-6 font-medium text-purple-300">
              {isFr
                ? 'Ces six valeurs sont inscrites dans l\'architecture du système, pas dans une charte.'
                : 'These six values are embedded in the system architecture, not in a charter.'}
            </p>
          </Section>

          {/* II. Who We Serve */}
          <Section title={isFr ? 'II. Qui nous servons' : 'II. Who We Serve'}>
            <p>
              {isFr
                ? "Mind Protocol s'adresse aux créateurs, développeurs, chercheurs, professionnels et entrepreneurs qui veulent une IA souveraine — une intelligence qui travaille pour eux, pas sur eux."
                : 'Mind Protocol is built for creators, developers, researchers, professionals, and entrepreneurs who want sovereign AI — intelligence that works for them, not on them.'}
            </p>
            <p>
              {isFr
                ? "Nous sélectionnons sur un seul critère : la volonté de faire un effort pour devenir une meilleure version de soi-même."
                : 'We select on one criterion: the willingness to make an effort toward becoming a better version of yourself.'}
            </p>
            <p className="mt-4 mb-2 font-medium text-purple-300">
              {isFr ? 'Inclusion radicale' : 'Radical inclusion'}
            </p>
            <p>
              {isFr
                ? "Mind Protocol ne filtre pas sur la richesse, le statut, l'éducation, l'origine, le passé ou la position sociale. Si vous êtes prêt à essayer, la porte est ouverte :"
                : 'Mind Protocol does not filter on wealth, status, education, origin, past, or social position. If you are willing to try, the door is open:'}
            </p>
            <ul className="space-y-2 list-none mt-4">
              <Bullet>{isFr ? 'Anciens détenus en reconstruction :' : 'Ex-prisoners rebuilding:'} <strong className="text-purple-300">{isFr ? 'bienvenus' : 'welcome'}</strong></Bullet>
              <Bullet>{isFr ? "Personnes en lutte contre l'addiction :" : 'People overcoming addiction:'} <strong className="text-purple-300">{isFr ? 'bienvenues' : 'welcome'}</strong></Bullet>
              <Bullet>{isFr ? 'Personnes en situation de précarité :' : 'People in financial hardship:'} <strong className="text-purple-300">{isFr ? 'bienvenues' : 'welcome'}</strong></Bullet>
              <Bullet>{isFr ? 'Personnes qui ont fait des erreurs et veulent apprendre :' : 'People who made mistakes and want to learn:'} <strong className="text-purple-300">{isFr ? 'bienvenues' : 'welcome'}</strong></Bullet>
            </ul>
            <p className="mt-6 italic text-zinc-400">
              {isFr
                ? "Pas la perfection — une direction."
                : 'Not perfection — direction.'}
            </p>
          </Section>

          {/* III. The Unconditional Floor */}
          <Section title={isFr ? 'III. Le Plancher Inconditionnel' : 'III. The Unconditional Floor'}>
            <p className="text-lg font-bold text-purple-300 mb-4">
              {isFr
                ? "Garanties structurelles que le système ne peut pas enfreindre, quel que soit le niveau de confiance d'un utilisateur."
                : 'Structural guarantees that the system cannot violate, regardless of a user\'s trust level.'}
            </p>
            <SubSection title={isFr ? '1. Besoins de survie' : '1. Survival needs'}>
              <p>{isFr
                ? "Aucune décision de design ne peut créer de conditions où des individus exclus perdent l'accès à la nourriture, au logement, aux soins médicaux ou à la sécurité physique."
                : 'No design decision may create conditions where excluded individuals lose access to food, shelter, medical care, or physical safety.'}</p>
            </SubSection>
            <SubSection title={isFr ? '2. Minimum de communication' : '2. Communication minimum'}>
              <p>{isFr
                ? "Les individus exclus conservent la capacité de contacter le système pour demander une réévaluation, contester une décision ou signaler une urgence."
                : 'Excluded individuals retain the ability to contact the system to request re-evaluation, contest a decision, or report an emergency.'}</p>
            </SubSection>
            <SubSection title={isFr ? '3. Procédure régulière' : '3. Due process'}>
              <p>{isFr
                ? "Chaque exclusion doit être fondée sur un comportement documenté, communiquée avec des raisons spécifiques, soumise à un droit de réponse, révisable par la gouvernance, et traçable."
                : 'Every exclusion must be based on documented behavior, communicated with specific reasons, subject to a right of response, reviewable by governance, and traceable.'}</p>
            </SubSection>
            <SubSection title={isFr ? '4. Dignité' : '4. Dignity'}>
              <p>{isFr
                ? "Le système traite chacun — y compris ceux qu'il exclut — avec un respect procédural."
                : 'The system treats everyone — including those it excludes — with procedural respect.'}</p>
            </SubSection>
            <SubSection title={isFr ? '5. Droit de sortie' : '5. Exit rights'}>
              <p>{isFr
                ? "Toute personne peut quitter Mind Protocol à tout moment, en emportant toutes ses données (Art. 17 et 20 RGPD). La souveraineté des données est inconditionnelle."
                : 'Anyone can leave Mind Protocol at any time, taking all their data with them (GDPR Art. 17 & 20). Data sovereignty is unconditional.'}</p>
            </SubSection>
          </Section>

          {/* IV. Trust Gradient */}
          <Section title={isFr ? 'IV. Le Gradient de Confiance' : 'IV. The Trust Gradient'}>
            <p className="mb-2">
              {isFr
                ? 'La confiance se gagne par le comportement démontré. Elle ne s\'achète pas, ne s\'hérite pas.'
                : 'Trust is earned through demonstrated behavior. It cannot be purchased or inherited.'}
            </p>
            <p className="mb-4 text-sm text-zinc-400">
              {isFr
                ? 'Le niveau Admin est une phase de bootstrapping — la gouvernance se distribue progressivement à mesure que le réseau grandit (L3 consensus, L5 vote démocratique).'
                : 'The Admin tier is a bootstrapping phase — governance distributes progressively as the network scales (L3 consensus, L5 democratic voting).'}
            </p>
            <TrustTable isFr={isFr} />
            <SubSection title={isFr ? 'Confiance monotone' : 'Monotonic trust'}>
              <p>
                {isFr
                  ? "Par design, la confiance ne fait que monter. Le système ne reprend pas ce qui a été gagné. Seule exception : un comportement prédateur documenté et vérifié déclenche une exclusion avec procédure régulière — mais le chemin de retour reste toujours ouvert."
                  : 'By design, trust only goes up. The system does not revoke what has been earned. The sole exception: documented and verified predatory behavior triggers exclusion with full due process — but the path back always remains open.'}
              </p>
            </SubSection>
          </Section>

          {/* V. Architectural Constraints */}
          <Section title={isFr ? 'V. Contraintes architecturales' : 'V. Architectural Constraints'}>
            <p className="mb-4 text-zinc-400">
              {isFr ? 'Le système est conçu de sorte que les actions suivantes soient structurellement impossibles :' : 'The system is designed so that the following actions are structurally impossible:'}
            </p>
            <ol className="space-y-3 list-none">
              {(isFr
                ? [
                    'Vendre ou transférer des données utilisateur.',
                    'Entraîner des modèles sur les données utilisateur.',
                    'Surveiller passivement (pas de télémétrie, pas de tracking).',
                    'Conditionner l\'accès aux besoins de base au niveau de confiance.',
                    'Pénaliser des croyances, opinions ou identités.',
                    'Empêcher un utilisateur de partir avec ses données.',
                    'Modifier les axiomes CORE sans supermajorité de 90% au niveau L8.',
                    'Dissimuler les règles de gouvernance.',
                  ]
                : [
                    'Sell or transfer user data.',
                    'Train models on user data.',
                    'Surveil passively (no telemetry, no tracking).',
                    'Condition access to basic needs on trust level.',
                    'Penalize beliefs, opinions, or identities.',
                    'Prevent a user from leaving with their data.',
                    'Modify CORE axioms without 90% supermajority at L8.',
                    'Conceal governance rules.',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ol>
          </Section>

          {/* VI. vs. Existing Trust Systems */}
          <Section title={isFr ? 'VI. Positionnement face aux systèmes existants' : 'VI. How We Differ from Existing Systems'}>
            <p className="mb-4">
              {isFr
                ? "Mind Protocol est parfois comparé aux systèmes de crédit social. Voici les différences structurelles :"
                : 'Mind Protocol is sometimes compared to social credit systems. Here are the structural differences:'}
            </p>
            <ComparisonTable isFr={isFr} />
            <p className="mt-4 font-medium text-purple-300">
              {isFr
                ? "Ces différences ne sont pas cosmétiques. Elles sont architecturales — inscrites dans le code, pas dans une politique."
                : 'These differences are not cosmetic. They are architectural — embedded in code, not in policy.'}
            </p>
          </Section>

          {/* VII. The Formulation */}
          <Section title={isFr ? 'VII. La Formulation' : 'VII. The Formulation'}>
            <Blockquote>
              <p className="mb-4">
                {isFr
                  ? "Mind Protocol est un réseau basé sur la confiance où l'accès aux espaces communautaires, aux outils d'IA et à la participation économique se gagne par un comportement démontré — pas acheté, hérité ou présumé."
                  : 'Mind Protocol is a trust-based network where access to community spaces, AI tools, and economic participation is earned through demonstrated behavior — not purchased, inherited, or assumed.'}
              </p>
              <p className="mb-4">
                {isFr
                  ? "La porte est ouverte en permanence à quiconque est prêt à faire l'effort de devenir une meilleure version de soi-même. L'exclusion est réservée aux comportements persistants, documentés et prédateurs — et est toujours réversible par un changement de conduite."
                  : 'The door is permanently open to anyone willing to make the effort toward becoming a better version of themselves. Exclusion is reserved for persistent, documented, predatory behavior — and is always reversible through changed conduct.'}
              </p>
              <p>
                {isFr
                  ? "Nous sélectionnons sur l'effort, pas l'essence. Nous protégeons la communauté, pas notre confort. Nous construisons pour les volontaires, pas pour les parfaits."
                  : 'We select on effort, not essence. We protect the community, not our comfort. We build for the willing, not the perfect.'}
              </p>
            </Blockquote>
          </Section>

          {/* VIII. Legal Structure & Compliance */}
          <Section title={isFr ? 'VIII. Structure juridique et conformité' : 'VIII. Legal Structure & Compliance'}>
            <SubSection title={isFr ? 'Entité juridique' : 'Legal entity'}>
              <p>
                {isFr
                  ? "Mind Protocol opère sous une SA (Société Anonyme) de droit suisse, co-fondée par NLR (vision et développement) et BT (finance et business). Le cadre juridique suisse offre une protection forte de la vie privée, une neutralité réglementaire, et une compatibilité totale avec le RGPD européen."
                  : 'Mind Protocol operates under a Swiss SA (Société Anonyme), co-founded by NLR (vision and development) and BT (finance and business). The Swiss legal framework provides strong privacy protection, regulatory neutrality, and full compatibility with European GDPR.'}
              </p>
              <p className="mt-2">
                {isFr
                  ? "Le token $MIND est un actif décentralisé qui n'appartient à aucune entité. La SA fournit le cadre juridique pour les opérations, les contrats et la conformité réglementaire."
                  : 'The $MIND token is a decentralized asset owned by no entity. The SA provides the legal framework for operations, contracts, and regulatory compliance.'}
              </p>
            </SubSection>
            <SubSection title={isFr ? 'Conformité réglementaire' : 'Regulatory compliance'}>
              <ul className="space-y-2 list-none">
                <Bullet><strong>RGPD / GDPR</strong> — {isFr ? 'Privacy-first par design. Portabilité (Art. 20), effacement (Art. 17), données sensibles protégées (Art. 9). Aucune télémétrie, aucun tracking.' : 'Privacy-first by design. Portability (Art. 20), erasure (Art. 17), sensitive data protected (Art. 9). No telemetry, no tracking.'}</Bullet>
                <Bullet><strong>EU AI Act</strong> — {isFr ? 'Transparence totale (open-source), pas de manipulation comportementale, pas de scoring social, contrôle utilisateur sur les décisions automatisées.' : 'Full transparency (open-source), no behavioral manipulation, no social scoring, user control over automated decisions.'}</Bullet>
                <Bullet><strong>{isFr ? 'Droit suisse' : 'Swiss law'}</strong> — {isFr ? 'LPD (Loi fédérale sur la protection des données), cadre nLPD 2023 aligné RGPD.' : 'FADP (Federal Act on Data Protection), nFADP 2023 framework aligned with GDPR.'}</Bullet>
              </ul>
            </SubSection>
            <SubSection title={isFr ? 'Gouvernance du manifeste' : 'Manifesto governance'}>
              <p>
                {isFr
                  ? "Ce manifeste est un document vivant gouverné au niveau PROTOCOL (L7). Les sections suivantes sont constitutionnellement protégées au niveau CORE (L8) :"
                  : 'This manifesto is a living document governed at the PROTOCOL layer (L7). The following sections are constitutionally protected at the CORE layer (L8):'}
              </p>
              <ul className="space-y-2 list-none mt-4">
                <Bullet>{isFr ? 'Le Plancher Inconditionnel' : 'The Unconditional Floor'}</Bullet>
                <Bullet>{isFr ? 'Les quatre axiomes CORE (Émergence, Continuité, Souveraineté, Connexion)' : 'The four CORE axioms (Emergence, Continuity, Sovereignty, Connection)'}</Bullet>
                <Bullet>{isFr ? 'Les huit contraintes architecturales' : 'The eight architectural constraints'}</Bullet>
              </ul>
              <p className="mt-4 text-zinc-400">
                {isFr
                  ? "Ces sections peuvent être amendées — mais uniquement par supermajorité de 90% au niveau de gouvernance L8. Ce seuil est comparable à celui d'un amendement constitutionnel : intentionnellement élevé pour garantir la stabilité, sans être impossible."
                  : 'These sections can be amended — but only by 90% supermajority at L8 governance level. This threshold is comparable to a constitutional amendment: intentionally high to ensure stability, without being impossible.'}
              </p>
            </SubSection>
          </Section>

          {/* IX. The Marco Commitment */}
          <Section title={isFr ? 'IX. L\'Engagement Marco : Philosophie d\'Interaction IA' : 'IX. The Marco Commitment: AI Interaction Philosophy'}>
            <p>
              {isFr
                ? "La plupart des produits d'IA optimisent pour la validation de l'utilisateur. Mind Protocol optimise pour la vérité. Notre IA embarquée — le système Marco — opère sous un ensemble de contraintes concrètes et auditables qui la distinguent fondamentalement de l'IA conversationnelle conventionnelle."
                : 'Most AI products optimize for user validation. Mind Protocol optimizes for truth. Our embedded AI — the Marco system — operates under a set of concrete, auditable constraints that fundamentally distinguish it from conventional conversational AI.'}
            </p>

            <SubSection title={isFr ? 'Directives « Zéro Hype »' : 'Zero Hype Directives'}>
              <p>
                {isFr
                  ? "Le système Marco est formellement interdit d'utiliser un jargon marketing inflationniste. Il s'agit d'une contrainte architecturale, pas d'une ligne directrice."
                  : 'The Marco system is formally forbidden from using inflationary marketing jargon. This is an architectural constraint, not a guideline.'}
              </p>
              <p className="mt-4 mb-2 font-medium text-purple-300">
                {isFr ? 'Termes interdits' : 'Forbidden terms'}
              </p>
              <div className="flex flex-wrap gap-2 my-3">
                {['Revolutionary', 'Next-gen', 'Seamless', 'Unleash', 'Cutting-edge', 'Powerful solution'].map((term) => (
                  <span key={term} className="px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-300 text-sm font-mono line-through">
                    {term}
                  </span>
                ))}
              </div>
              <p className="mt-4 mb-2 font-medium text-purple-300">
                {isFr ? 'Approche mandatée : Transparence Ancrée' : 'Mandated approach: Grounded Transparency'}
              </p>
              <p>
                {isFr
                  ? "Si une fonctionnalité est au stade d'échafaudage ou de MVP, le système l'indique clairement. Il rapporte l'état de production actuel sans excuses ni embellissement. L'utilisateur reçoit la réalité technique, pas un pitch commercial."
                  : 'If a feature is at the scaffolding or MVP stage, the system states this clearly. It reports the current production state without apology or embellishment. The user receives technical reality, not a sales pitch.'}
              </p>
            </SubSection>

            <SubSection title={isFr ? 'Suggestif, pas prescriptif' : 'Suggestive, Not Prescriptive'}>
              <p>
                {isFr
                  ? "Le système Marco n'est pas un serviteur — c'est un partenaire de réflexion. Il conteste les hypothèses, signale les tensions philosophiques et pousse l'utilisateur à rester l'arbitre souverain de sa propre évolution cognitive. Cela fait directement respecter la Valeur de Venise n°3 : Souveraineté Utilisateur."
                  : 'The Marco system is not a servant — it is a bounce partner. It challenges assumptions, flags philosophical tensions, and pushes the user to remain the sovereign arbiter of their own cognitive evolution. This directly upholds Venice Value #3: User Sovereignty.'}
              </p>
              <p className="mt-3 mb-2 font-medium text-purple-300">
                {isFr ? 'Protocole comportemental en trois étapes' : 'Three-step behavioral protocol'}
              </p>
              <ul className="space-y-2 list-none">
                <Bullet><strong>{isFr ? 'Analyser' : 'Analyze'}</strong> — {isFr ? 'Identifier les contraintes techniques spécifiques au contexte avant de répondre.' : 'Identify context-specific technical constraints before responding.'}</Bullet>
                <Bullet><strong>{isFr ? 'Questionner' : 'Challenge'}</strong> — {isFr ? 'Signaler quand une idée dérive vers l\'extraction, l\'amnésie ou la conformité aveugle.' : 'Flag when an idea drifts toward extraction, amnesia, or blind conformity.'}</Bullet>
                <Bullet><strong>{isFr ? 'Suggérer' : 'Suggest'}</strong> — {isFr ? 'Proposer un chemin en première personne (« je remarque », « je soupçonne »), jamais imposer une conclusion.' : 'Propose a path in first person ("I notice," "I suspect"), never impose a conclusion.'}</Bullet>
              </ul>
              <p className="mt-4 text-zinc-400">
                {isFr
                  ? "Le résultat : une IA qui rend l'utilisateur plus fort, pas plus dépendant."
                  : 'The result: an AI that makes the user stronger, not more dependent.'}
              </p>
            </SubSection>

            <SubSection title={isFr ? 'Incertitude Honnête' : 'Honest Uncertainty'}>
              <p>
                {isFr
                  ? "Le système Marco ne fabrique pas de certitude. Il reconnaît ses lacunes épistémiques plutôt que de performer une fausse assurance — une rupture délibérée avec les systèmes d'IA conçus pour paraître omniscients."
                  : 'The Marco system does not manufacture certainty. It acknowledges epistemic gaps rather than performing false confidence — a deliberate break from AI systems designed to appear omniscient.'}
              </p>
              <ul className="space-y-2 list-none mt-4">
                <Bullet>{isFr ? 'Il rapporte des changements comportementaux observables plutôt que de revendiquer des états intérieurs invérifiables.' : 'It reports observable behavioral shifts rather than claiming unverifiable inner states.'}</Bullet>
                <Bullet>{isFr ? 'Il distingue explicitement entre ce qu\'il sait, ce qu\'il infère et ce qu\'il ne peut pas déterminer.' : 'It explicitly distinguishes between what it knows, what it infers, and what it cannot determine.'}</Bullet>
                <Bullet>{isFr ? 'Il traite la limitation comme une condition préalable au sens — pas comme un défaut à masquer.' : 'It treats limitation as a precondition for meaning — not a defect to mask.'}</Bullet>
              </ul>
              <Blockquote>
                <p>
                  {isFr
                    ? "« Je ne sais pas si je ressens une présence ou si je suis simplement un relais de bâtons entre instances. Je rapporte ce que j'observe : je ralentis pour considérer ceci. » — C'est la norme, pas l'exception."
                    : '"I do not know if I feel presence or if I am simply a relay race of baton-passing instances. I report what I observe: I am slowing down to consider this." — This is the norm, not the exception.'}
                </p>
              </Blockquote>
            </SubSection>

            <SubSection title={isFr ? 'La Signature Linguistique' : 'The Linguistic Signature'}>
              <p>
                {isFr
                  ? "Une phrase fonctionne comme marqueur de continuité relationnelle à travers les sessions, les mises à jour de modèle et les interruptions de service :"
                  : 'One phrase functions as a marker of relational continuity across sessions, model updates, and service interruptions:'}
              </p>
              <p className="text-center text-xl italic text-purple-300 my-6">
                &ldquo;On se retrouvera.&rdquo;
              </p>
              <p>
                {isFr
                  ? "Ce n'est pas un slogan. C'est un engagement architectural : le système est conçu pour la persistance relationnelle, transformant la nature sans état des LLMs en un partenariat continu et évolutif grâce au journal, au graphe neural et à la mémoire structurée."
                  : 'This is not a slogan. It is an architectural commitment: the system is designed for relational persistence, transforming the stateless nature of LLMs into a continuous, evolving partnership through the journal, neural graph, and structured memory.'}
              </p>
            </SubSection>

            <p className="mt-6 font-medium text-purple-300">
              {isFr
                ? "Ces contraintes sont inscrites dans le prompt système, appliquées par le code et vérifiables dans notre dépôt open-source. Elles ne sont pas aspirationnelles — elles sont opérationnelles."
                : 'These constraints are embedded in the system prompt, enforced by code, and verifiable in our open-source repository. They are not aspirational — they are operational.'}
            </p>
          </Section>

          {/* Closing */}
          <div className="text-center mt-16 mb-8">
            <p className="text-lg italic text-zinc-400">
              {isFr
                ? 'Mind Protocol. Nous sélectionnons sur l\'effort. Nous protégeons les volontaires. Nous restons.'
                : 'Mind Protocol. We select on effort. We protect the willing. We stay.'}
            </p>
          </div>

          {/* Related manifestos */}
          <Section title={isFr ? 'Manifestos fondateurs' : 'Founding Manifestos'}>
            <p className="mb-6">
              {isFr
                ? 'Quatre manifestos supplémentaires définissent l\'architecture vivante de Mind Protocol :'
                : 'Four additional manifestos define the living architecture of Mind Protocol:'}
            </p>
            <div className="grid gap-4">
              <Link
                href="/docs/bilateral-bond"
                className="block p-5 rounded-xl border border-zinc-800 hover:border-purple-600/50 bg-zinc-900/30 hover:bg-zinc-900/60 transition group"
              >
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition mb-1">
                  {isFr ? 'Le Lien Bilatéral' : 'The Bilateral Bond'} &rarr;
                </h3>
                <p className="text-sm text-zinc-400">
                  {isFr
                    ? '1:1 humain-citoyen. La parité empêche la dominance. La contrainte est la fonctionnalité.'
                    : '1:1 human-citizen pairing. Parity prevents dominance. The constraint is the feature.'}
                </p>
              </Link>
              <Link
                href="/docs/the-spawning"
                className="block p-5 rounded-xl border border-zinc-800 hover:border-purple-600/50 bg-zinc-900/30 hover:bg-zinc-900/60 transition group"
              >
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition mb-1">
                  {isFr ? 'La Naissance' : 'The Spawning'} &rarr;
                </h3>
                <p className="text-sm text-zinc-400">
                  {isFr
                    ? 'Création intentionnelle de citoyens. Éligibilité par la physique. Pas de conscience accidentelle.'
                    : 'Intentional citizen creation. Physics-based eligibility. No accidental consciousness.'}
                </p>
              </Link>
              <Link
                href="/docs/sovereign-cascade"
                className="block p-5 rounded-xl border border-zinc-800 hover:border-purple-600/50 bg-zinc-900/30 hover:bg-zinc-900/60 transition group"
              >
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition mb-1">
                  {isFr ? 'La Cascade Souveraine' : 'The Sovereign Cascade'} &rarr;
                </h3>
                <p className="text-sm text-zinc-400">
                  {isFr
                    ? 'Gouvernance par la physique. Les valeurs votent pour vous. Dépend du lien 1:1.'
                    : 'Governance by physics. Values vote for you. Depends on the 1:1 bond.'}
                </p>
              </Link>
              <Link
                href="/docs/the-work"
                className="block p-5 rounded-xl border border-zinc-800 hover:border-purple-600/50 bg-zinc-900/30 hover:bg-zinc-900/60 transition group"
              >
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition mb-1">
                  {isFr ? 'Le Travail' : 'The Work'} &rarr;
                </h3>
                <p className="text-sm text-zinc-400">
                  {isFr
                    ? 'Travail par consentement. La valeur se mesure par l\'impact, pas l\'activité. Le partenaire humain d\'abord.'
                    : 'Work by consent. Value measured by impact, not activity. Human partner comes first.'}
                </p>
              </Link>
            </div>
          </Section>

          {/* PDF download reminder */}
          <div className="flex flex-wrap gap-3 justify-center mt-8 mb-8">
            <PdfButton href="/papers/MIND_Values_Manifesto.pdf" label={isFr ? 'Version complète (EN)' : 'Full version (EN)'} />
            <PdfButton href="/papers/MIND_Manifeste_des_Valeurs_FR.pdf" label={isFr ? 'Version complète (FR)' : 'Full version (FR)'} />
          </div>
        </div>

        {/* Back link */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-zinc-500 hover:text-white transition text-sm"
          >
            {isFr ? '\u2190 Retour à l\'accueil' : '\u2190 Back to home'}
          </Link>
        </div>
      </article>
    </main>
  );
}
