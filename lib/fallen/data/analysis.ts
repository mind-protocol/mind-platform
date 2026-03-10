export interface TrackAnalysis {
  slug: string;
  theme: string;
  mentalState: string;
  mechanisms: { label: string; quote: string; explanation: string }[];
  amyLeeQuote?: string;
  origin?: string;
  emotionalStructure?: { section: string; description: string }[];
  connections?: { trackSlug: string; description: string }[];
}

export const TRACK_ANALYSES: Record<string, TrackAnalysis> = {
  'going-under': {
    slug: 'going-under',
    theme: 'Escaping an abusive relationship',
    mentalState: 'Exhaustion, identity confusion, rising anger',
    mechanisms: [
      {
        label: 'Reality/lie confusion',
        quote:
          'Blurring and stirring the truth and the lies / So I don\'t know what\'s real',
        explanation:
          'Gaslighting erodes the victim\'s ability to distinguish reality from the abuser\'s narrative, creating a constant state of cognitive dissonance.',
      },
      {
        label: 'Loss of self-trust',
        quote: 'I can\'t trust myself anymore',
        explanation:
          'The internalization of doubt — the victim begins to question their own perceptions and judgment, a hallmark of prolonged psychological abuse.',
      },
      {
        label: 'The breaking point',
        quote: 'Just when I thought I\'d reached the bottom',
        explanation:
          'The moment of realization that the cycle has no natural floor — each "bottom" gives way to something worse, catalyzing the decision to escape.',
      },
    ],
    amyLeeQuote:
      'The lyrics are about coming out of a bad relationship, and when you\'re at the end of your rope, when you\'re at the point where you realize something has to change.',
    emotionalStructure: [
      { section: 'Verse 1', description: 'Inventory of sacrifice ("what I\'ve done for you")' },
      { section: 'Verse 2', description: 'The gaslighting ("confusing the thoughts in my head")' },
      { section: 'Chorus', description: 'Drowning as metaphor for the relationship' },
      { section: 'Bridge', description: 'The cry of resistance ("I won\'t be broken again")' },
    ],
    connections: [
      {
        trackSlug: 'bring-me-to-life',
        description:
          'Going Under is the awareness ("something has to change"); Bring Me to Life is the awakening mechanism (external recognition).',
      },
      {
        trackSlug: 'taking-over-me',
        description:
          'Going Under shows the realization of drowning; Taking Over Me maps how the dependency formed.',
      },
    ],
  },

  'bring-me-to-life': {
    slug: 'bring-me-to-life',
    theme: 'Awakening through external recognition',
    mentalState: 'Dissociative numbness giving way to brutal awakening',
    mechanisms: [
      {
        label: 'Dissociation',
        quote: 'Where I\'ve become so numb / Without a soul',
        explanation:
          'Emotional shutdown as a protective response to sustained abuse — the psyche retreats into numbness to survive.',
      },
      {
        label: 'The other\'s gaze as mirror',
        quote: 'How can you see into my eyes like open doors?',
        explanation:
          'The experience of being truly seen by another person, which forces a confrontation with the dissociated self. The external gaze becomes a mirror that reflects reality the victim has been hiding from.',
      },
      {
        label: 'Awareness of the void',
        quote: 'Save me from the nothing I\'ve become',
        explanation:
          'Recognition of identity erasure — the paradoxical request is not just "help me" but "give me back my existence." She asks to be made REAL, not merely rescued.',
      },
    ],
    amyLeeQuote:
      'I felt like he could just see straight into my soul.',
    origin:
      'Amy Lee was in an abusive relationship when someone (her future husband) asked her "Are you happy?" — and she realized he could see through her facade. That moment of being SEEN through the performance inspired the entire song.',
    connections: [
      {
        trackSlug: 'going-under',
        description:
          'Going Under is the awareness; Bring Me to Life is the awakening mechanism through external recognition.',
      },
      {
        trackSlug: 'everybodys-fool',
        description:
          'Both deal with facades — Bring Me to Life is about someone seeing through the mask; Everybody\'s Fool is about the mask itself.',
      },
    ],
  },

  'everybodys-fool': {
    slug: 'everybodys-fool',
    theme: 'Critique of inauthenticity (external and internal)',
    mentalState: 'Anger, disillusionment, projection',
    mechanisms: [
      {
        label: 'Surface critique',
        quote: 'Icons of self-indulgence',
        explanation:
          'On its surface, a critique of the pop industry and manufactured beauty standards — but the anger carries the weight of personal betrayal.',
      },
      {
        label: 'The personal mask',
        quote: 'Without the mask where will you hide?',
        explanation:
          'The question is directed outward but echoes inward — Amy\'s own facade, the performance she maintained during her abusive relationship.',
      },
      {
        label: 'The crucial pivot',
        quote: 'I know the truth now / I know who you are / And I don\'t love you anymore',
        explanation:
          'The moment the victim stops idealizing the abuser. Disillusionment becomes liberation — seeing clearly for the first time.',
      },
    ],
    amyLeeQuote:
      'At this point, everybody knows that Britney is fake... It\'s so fake, the whole Hollywood thing. "Look at how perfect I am!" Nobody looks like that.',
    origin:
      'Amy\'s little sister (8 years old at the time) was obsessing over Britney Spears and Christina Aguilera, starting to dress like them. Amy wrote the song out of concern for her sister.',
    connections: [
      {
        trackSlug: 'bring-me-to-life',
        description:
          'Both songs explore the theme of masks — Bring Me to Life is someone seeing through the mask; Everybody\'s Fool is confronting the mask-wearer.',
      },
    ],
  },

  'my-immortal': {
    slug: 'my-immortal',
    theme: 'Impossible grief',
    mentalState: 'Pathological grief, presence-absence',
    mechanisms: [
      {
        label: 'Phantom presence',
        quote: 'Your presence still lingers here / And it won\'t leave me alone',
        explanation:
          'The psychological experience of a presence that persists after departure — the loved one is gone but their imprint on the psyche remains inescapable.',
      },
      {
        label: 'The paradoxical wish',
        quote: 'If you have to leave / I wish that you would just leave',
        explanation:
          'The agonizing limbo of incomplete loss — the person is gone but not fully gone, making grief impossible to complete or resolve.',
      },
      {
        label: 'Impossible resolution',
        quote:
          'I\'ve tried so hard to tell myself that you\'re gone / But though you\'re still with me / I\'ve been alone all along',
        explanation:
          'The devastating final realization: the presence was an illusion. The grief has been a solitary experience all along.',
      },
    ],
    origin:
      'Ben Moody wrote the lyrics (not Amy Lee). She contributed "a little" but does not emotionally connect with the song. The album version is a demo recorded when Amy was approximately 17, on a MIDI keyboard. The label insisted on this version against Amy\'s wishes ("I sound like a little kid").',
    connections: [
      {
        trackSlug: 'hello',
        description:
          'Both songs deal with pathological grief — My Immortal explores the impossible presence-absence; Hello is a direct dialogue with the dead.',
      },
    ],
  },

  haunted: {
    slug: 'haunted',
    theme: 'Obsession / the predator',
    mentalState: 'Hypervigilance, fear mixed with desire',
    mechanisms: [
      {
        label: 'The push-pull',
        quote: 'Fearing you, loving you / I won\'t let you pull me down',
        explanation:
          'The traumatic bond — simultaneous fear and desire for the abuser, the hallmark of attachment to a dangerous person.',
      },
      {
        label: 'Victim/predator inversion',
        quote: 'Haunting you, I can smell you, alive',
        explanation:
          'Amy writes from the predator\'s perspective, sensing their prey. This inversion is a psychological defense — by inhabiting the predator\'s viewpoint, the victim reclaims a sense of agency.',
      },
      {
        label: 'Impossible control',
        quote: 'Saving me, raping me, watching me',
        explanation:
          'The contradictory actions compressed into a single line — the abuser simultaneously presents as savior and destroyer, creating the confusion that sustains the cycle.',
      },
    ],
    origin:
      'Amy wrote the lyrics referencing a short story by Ben Moody — a girl trapped in a haunted mansion by an invisible man holding her captive. But Amy transformed it, writing "from the eyes of a killer."',
    connections: [
      {
        trackSlug: 'going-under',
        description:
          'Haunted depicts the predator\'s presence; Going Under shows the victim drowning under that presence.',
      },
      {
        trackSlug: 'taking-over-me',
        description:
          'Both songs map the dissolution of boundaries between self and other — Haunted through fear, Taking Over Me through obsessive longing.',
      },
    ],
  },

  tourniquet: {
    slug: 'tourniquet',
    theme: 'Direct confrontation with suicide',
    mentalState: 'Spiritual despair, existential questioning',
    mechanisms: [
      {
        label: 'The central question',
        quote: 'Am I too lost to be saved?',
        explanation:
          'The existential crisis at the heart of the song — not just "will I survive?" but "CAN I be saved?" The question of whether redemption is still possible.',
      },
      {
        label: 'The emotional tourniquet',
        quote: 'My tourniquet',
        explanation:
          'The metaphor is double-edged: a tourniquet stops the bleeding but also cuts off circulation. What saves you also numbs you. What keeps you alive may also be killing part of you.',
      },
      {
        label: 'The ultimate plea',
        quote: 'Will I be denied Christ? Tourniquet, my suicide',
        explanation:
          'The spiritual dimension of the crisis — the Christian controversy of whether suicide condemns the soul. The question is both theological and deeply personal.',
      },
    ],
    origin:
      'Reworked cover of Soul Embraced (Christian metal band). Rocky Gray explained to Amy: "It\'s from the perspective of someone who has just committed suicide — and it\'s about the Christian controversy: if you kill yourself, do you go to heaven or hell?" Amy connected viscerally with the question and wrote the melody and second verse. "I long to die" is a quote from Baz Luhrmann\'s Romeo + Juliet, a film she was "obsessed" with.',
    connections: [
      {
        trackSlug: 'whisper',
        description:
          'Tourniquet is the panicked questioning; Whisper is the seductive pull toward surrender.',
      },
      {
        trackSlug: 'my-last-breath',
        description:
          'Tourniquet is the desperate crisis; My Last Breath is serene acceptance — the two poles of confronting death.',
      },
    ],
  },

  imaginary: {
    slug: 'imaginary',
    theme: 'Inner refuge (creative dissociation)',
    mentalState: 'Escape, construction of an alternate world',
    mechanisms: [
      {
        label: 'The constructed world',
        quote:
          'In my field of paper flowers / And candy clouds of lullaby',
        explanation:
          'The imaginary world is deliberately artificial — paper flowers, candy clouds. The childlike quality reveals when this refuge was first built: in childhood, as a response to early trauma.',
      },
      {
        label: 'Suspended time',
        quote:
          'I lie inside myself for hours / And watch my purple sky fly over me',
        explanation:
          'Dissociative time distortion — hours pass inside while the external world continues. This is not daydreaming but a survival mechanism, a place the psyche retreats to when reality becomes unbearable.',
      },
      {
        label: 'Awareness of the escape',
        quote:
          'Don\'t say I\'m out of touch with this rampant chaos — your reality',
        explanation:
          'She KNOWS the imaginary world is an escape. This is not unconscious dissociation — it is a survival choice. The defiance in "your reality" marks a refusal to be pathologized.',
      },
    ],
    origin:
      'Written when Amy was in 7th/8th grade (middle school). Some lyrics come from poems of that era. "About feeling the need to retreat to my safe haven as a young teen."',
    emotionalStructure: [
      {
        section: 'Verses',
        description: 'The retreat into the inner world — gentle, protective, childlike',
      },
      {
        section: 'Dark pivot',
        description:
          '"I know well what lies beyond my sleeping refuge / The nightmare I built my own world to escape" — awareness breaks through',
      },
      {
        section: 'Bridge',
        description:
          'Contains "probably 70+ people performing" — doubled choir, doubled 22-musician orchestra. The MASSIVE sound represents the scope of the inner world she built.',
      },
    ],
    connections: [
      {
        trackSlug: 'bring-me-to-life',
        description:
          'Both depict dissociation — Imaginary as deliberate refuge, Bring Me to Life as the cost of that numbness.',
      },
      {
        trackSlug: 'hello',
        description:
          'Both songs were written in response to childhood experiences — Imaginary as retreat, Hello as direct confrontation with loss.',
      },
    ],
  },

  'taking-over-me': {
    slug: 'taking-over-me',
    theme: 'Loss of self in the other',
    mentalState: 'Obsession, identity dissolution',
    mechanisms: [
      {
        label: 'Progressive invasion',
        quote: 'You don\'t remember me but I remember you',
        explanation:
          'The asymmetry of obsessive attachment — one person is consumed while the other may be indifferent. The invasion begins with memory and expands to identity.',
      },
      {
        label: 'Loss of control',
        quote: 'I have to be with you to live, to breathe',
        explanation:
          'Dependency presented as biological necessity — the other person has become as essential as oxygen. This is not love but identity dissolution.',
      },
      {
        label: 'Projective identification',
        quote: 'I look in the mirror and see your face',
        explanation:
          'The final stage of identity loss — looking in the mirror and seeing the other person instead of yourself. The self has been fully absorbed.',
      },
    ],
    connections: [
      {
        trackSlug: 'going-under',
        description:
          'Going Under is the realization ("I\'m drowning in you"); Taking Over Me maps the cartography of how that dependency formed.',
      },
      {
        trackSlug: 'haunted',
        description:
          'Both songs depict boundary dissolution — Taking Over Me through obsessive longing, Haunted through the predator\'s gaze.',
      },
    ],
  },

  hello: {
    slug: 'hello',
    theme: 'The death of her little sister',
    mentalState: 'Childhood grief, dialogue with absence',
    mechanisms: [
      {
        label: 'The moment of realization',
        quote: 'Has no one told you she\'s not breathing?',
        explanation:
          'A six-year-old\'s incomprehension of death — the question is literal. A child asking why no one is doing anything about what seems like a solvable problem.',
      },
      {
        label: 'The survival mechanism',
        quote: 'Hello, I\'m your mind giving you someone to talk to',
        explanation:
          'The voice in the song IS the dead sister — speaking to Amy, telling her "I am the lie you live so you can hide." The mind creates a companion to fill the void, a form of grief-driven dissociation.',
      },
      {
        label: 'Pathological refusal',
        quote: 'Don\'t try to fix me, I\'m not broken',
        explanation:
          'The defiant insistence that maintaining a dialogue with the dead is not pathology but love. The refusal to "heal" is the refusal to let go.',
      },
      {
        label: 'Persistent presence',
        quote: 'Hello, I\'m still here / All that\'s left of yesterday',
        explanation:
          'The dead sister as a remnant of the past that refuses to dissolve — "all that\'s left" implies both preservation and loss.',
      },
    ],
    amyLeeQuote:
      'Lyrically, I think that\'s my favourite thing on Fallen because it relates specifically to one personal instance that is very, very special to me and very close to me, so I think Hello is probably the one song of ours that can actually make me cry.',
    origin:
      'Amy\'s sister died of an unidentified illness at the age of 3. Amy was 6. This song captures "a day from that time." Amy has never performed this song in concert — it is too personal. "Like You" on the following album (The Open Door) is also about this sister.',
    connections: [
      {
        trackSlug: 'my-immortal',
        description:
          'Both deal with pathological grief — Hello through dialogue with the dead, My Immortal through the phantom presence that won\'t leave.',
      },
      {
        trackSlug: 'imaginary',
        description:
          'Both rooted in childhood — Hello confronts the loss directly, Imaginary shows the refuge built to survive it.',
      },
    ],
  },

  'my-last-breath': {
    slug: 'my-last-breath',
    theme: 'Acceptance of the end',
    mentalState: 'Peace in death, farewell',
    mechanisms: [
      {
        label: 'The request',
        quote: 'Hold on to me love / You know I can\'t stay long',
        explanation:
          'The awareness that time is ending — but spoken with tenderness rather than panic. The shift from Tourniquet\'s desperate questioning to quiet acceptance.',
      },
      {
        label: 'The peace',
        quote: 'Can you hear me? Can you feel me in your arms?',
        explanation:
          'Seeking connection in the final moment — the need to know that one\'s departure is witnessed, that the ending is shared rather than solitary.',
      },
      {
        label: 'The legacy',
        quote:
          'Closing your eyes to disappear / You pray your dreams will leave you here',
        explanation:
          'The hope that something survives death — dreams, memories, the imprint left on those who remain.',
      },
    ],
    origin:
      'The lyrics imply a struggle for emotional and physical survival, inspired in part by the losses of September 11, 2001.',
    connections: [
      {
        trackSlug: 'tourniquet',
        description:
          'Tourniquet is the panicked questioning ("Am I too lost?"); My Last Breath is serene acceptance — the resolution of that crisis.',
      },
      {
        trackSlug: 'hello',
        description:
          'After Hello (the death of the other), My Last Breath explores her own death — but with acceptance rather than despair.',
      },
    ],
  },

  whisper: {
    slug: 'whisper',
    theme: 'The temptation of surrender',
    mentalState: 'Seduction of death, resistance',
    mechanisms: [
      {
        label: 'The call',
        quote: 'She beckons me, shall I give in?',
        explanation:
          'Death personified as feminine and seductive — the temptation is not violent but alluring, which makes it far more dangerous.',
      },
      {
        label: 'The resistance',
        quote: 'Don\'t turn away, don\'t try to hide',
        explanation:
          'The command to face the darkness directly rather than retreating — a thread of defiance woven through the surrender.',
      },
      {
        label: 'Awareness of the danger',
        quote: 'God knows what lies behind them',
        explanation:
          'The acknowledgment that the seductive whispers may lead to something unknowable and irreversible. The uncertainty is what keeps the resistance alive.',
      },
    ],
    origin:
      'From a 1999 EP (Sound Asleep). One of the band\'s oldest songs. The Latin choir (Millennium Choir) gives a ritual/ecclesiastical dimension — as if the choice between life and death were a sacred act.',
    emotionalStructure: [
      { section: 'Verses', description: 'The seductive pull of surrender — whispered, intimate' },
      { section: 'Chorus', description: 'Resistance and defiance surge against the pull' },
      {
        section: 'Latin choir',
        description:
          'The ecclesiastical dimension elevates the personal struggle to sacred ritual',
      },
      {
        section: 'Ending',
        description:
          'Closes on ambiguity — no clear resolution. The fight continues. The album ends without healing.',
      },
    ],
    connections: [
      {
        trackSlug: 'tourniquet',
        description:
          'Tourniquet is the direct crisis; Whisper is the lingering seduction that follows — the temptation that never fully goes away.',
      },
      {
        trackSlug: 'going-under',
        description:
          'The album begins with drowning (Going Under) and ends with whispered temptation (Whisper) — the cycle of struggle is unresolved.',
      },
    ],
  },
};
