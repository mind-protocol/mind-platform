export interface BiographicalContext {
  id: string;
  title: string;
  content: string;
  relevantTracks: string[];
}

export const BIOGRAPHICAL_CONTEXTS: BiographicalContext[] = [
  {
    id: 'sister-death',
    title: "The Death of Amy's Sister",
    content:
      "Amy Lee's younger sister died of an unidentified illness at the age of 3. Amy was 6 years old. This early encounter with death — incomprehensible to a child — became the foundational trauma of her creative life. \"Hello\" captures \"a day from that time,\" and Amy has described it as her favorite lyric on Fallen because it relates to \"one personal instance that is very, very special to me.\" She has never performed \"Hello\" in concert. The grief resurfaced on the following album with \"Like You\" (The Open Door), confirming that this loss was never fully resolved — it was carried forward, album after album, as the wound that would not close.",
    relevantTracks: ['hello', 'my-immortal', 'imaginary'],
  },
  {
    id: 'abusive-relationship',
    title: 'The Abusive Relationship',
    content:
      'Amy Lee revealed in 2022 that she was in an abusive relationship during the writing of Fallen. The songs document the full spectrum of that experience: the drowning sensation of being controlled (Going Under), the numbness of dissociation (Bring Me to Life), the obsessive entanglement (Taking Over Me), and the predatory dynamic (Haunted). The revelation reframes the entire album — what seemed like gothic metaphor was in fact autobiography. The relationship involved gaslighting ("blurring and stirring the truth and the lies"), identity erosion ("I can\'t trust myself anymore"), and the traumatic bond of fearing and loving simultaneously.',
    relevantTracks: [
      'going-under',
      'bring-me-to-life',
      'taking-over-me',
      'haunted',
      'everybodys-fool',
    ],
  },
  {
    id: 'dissociation-survival',
    title: 'Dissociation as Survival Mechanism',
    content:
      'Across Fallen, dissociation appears not as pathology but as a deliberate survival strategy. In "Imaginary" — written when Amy was in middle school — she constructs an entire inner world of "paper flowers and candy clouds of lullaby." In "Bring Me to Life," she describes having become "so numb, without a soul." The critical insight is that Amy was aware of the dissociation: "I know well what lies beyond my sleeping refuge / The nightmare I built my own world to escape." This is conscious dissociation — the psyche choosing numbness over unbearable pain. The album documents both the refuge and the cost: the inner world protects, but it also isolates.',
    relevantTracks: ['imaginary', 'bring-me-to-life', 'going-under'],
  },
  {
    id: 'survival-document',
    title: 'The Album as Survival Document',
    content:
      'Fallen was written between the ages of 15 and 21. It is not a work of art about depression — it is a survival document created by someone in the process of surviving. The act of writing externalized pain that might otherwise have been unbearable. Amy Lee said that "Hello" can make her cry, but she recorded it anyway. The album contains no song of accomplished healing — even the final track ("Whisper") closes on ambiguity. This is honest: at 21, coming out of an abusive relationship, carrying 15 years of unresolved grief for her sister, healing had not yet arrived. The album\'s function was not to resolve trauma but to witness it — to name the pain as the first step toward metabolizing it.',
    relevantTracks: [
      'going-under',
      'hello',
      'tourniquet',
      'whisper',
      'my-last-breath',
    ],
  },
  {
    id: 'unresolved-cycle',
    title: 'The Unresolved Trauma Cycle',
    content:
      "The track order of Fallen is not random — it maps a psychological cycle: original trauma (sister's death at age 6), dissociation as survival (building an imaginary world), vulnerability to abusive relationships (seeking recognition from others), loss of self in the other (identity dissolution), confrontation with self-destruction (suicidal ideation), and awakening through external recognition. But the cycle does not resolve. The album oscillates between externalization (blaming the other) and internalization (the wound within). This is not incoherence — it is the natural movement of a psyche trying to survive. The album ends with Whisper's ambiguous resistance, not with healing. 17 million copies sold because these questions are universal: Can you be too lost to be saved? What remains when someone leaves? How do you resist the call of the void?",
    relevantTracks: [
      'going-under',
      'bring-me-to-life',
      'tourniquet',
      'whisper',
      'hello',
      'taking-over-me',
    ],
  },
  {
    id: 'awakening-moment',
    title: 'The Moment of Being Seen',
    content:
      'The turning point of the album — and arguably of Amy Lee\'s life during this period — was the moment someone asked her "Are you happy?" and she realized he could see through her facade. "I felt like he could just see straight into my soul." This person (her future husband) broke through the dissociative mask she had been maintaining. "Bring Me to Life" captures that moment: the request is not merely "help me" but "make me REAL." The experience of being truly seen by another person forced a confrontation with everything she had been hiding from — including herself. This moment connects to "Everybody\'s Fool" (the mask she wore) and "Going Under" (the reality she was drowning in).',
    relevantTracks: ['bring-me-to-life', 'everybodys-fool', 'going-under'],
  },
  {
    id: 'spiritual-crisis',
    title: 'The Spiritual Dimension',
    content:
      "Several tracks on Fallen engage with spiritual and theological questions, particularly around death and salvation. \"Tourniquet\" — reworked from a Christian metal song — asks the devastating question: \"Am I too lost to be saved?\" and confronts the Christian controversy of whether suicide condemns the soul. \"Whisper\" uses a Latin choir (the Millennium Choir) to give the struggle between life and death a ritual, ecclesiastical dimension — as if the choice were a sacred act. Even the album's title — Fallen — carries theological weight, evoking both the fall from grace and fallen angels. Amy Lee's engagement with these questions is not doctrinal but existential: the spiritual language gives form to a crisis that exceeds purely psychological vocabulary.",
    relevantTracks: ['tourniquet', 'whisper', 'my-last-breath'],
  },
];
