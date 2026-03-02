// ─── Internationalized Health Profile Suggestions ─────────────────────
// Used by tracker/profile form for datalist autocomplete and select options.
// Each locale has its own medical terminology, brand names, and cultural equivalents.

export interface HealthSuggestions {
  ALLERGY_SUGGESTIONS: string[];
  CONDITION_SUGGESTIONS: string[];
  MEDICATION_SUGGESTIONS: string[];
  FREQUENCY_OPTIONS: string[];
  DURATION_OPTIONS: string[];
  VACCINATION_SUGGESTIONS: string[];
  SURGERY_SUGGESTIONS: string[];
  FAMILY_HISTORY_SUGGESTIONS: string[];
  SKIN_TYPE_OPTIONS: string[];
  EYE_COLOR_OPTIONS: string[];
  HAIR_COLOR_OPTIONS: string[];
}

const fr: HealthSuggestions = {
  ALLERGY_SUGGESTIONS: [
    'Pénicilline', 'Amoxicilline', 'Aspirine', 'Ibuprofène', 'Sulfamides',
    'Arachides', 'Fruits à coque', 'Lait', 'Œufs', 'Gluten', 'Soja', 'Crustacés', 'Poisson',
    'Latex', 'Pollen', 'Acariens', 'Poils de chat', 'Poils de chien',
    'Nickel', 'Iode', 'Produits de contraste',
  ],
  CONDITION_SUGGESTIONS: [
    'Asthme', 'Hypertension', 'Diabète type 1', 'Diabète type 2', 'Hypothyroïdie', 'Hyperthyroïdie',
    'Dépression', 'Anxiété', 'TDAH', 'Trouble bipolaire', 'Insomnie',
    'Migraine', 'Épilepsie', 'Arthrose', 'Polyarthrite rhumatoïde',
    'Eczéma', 'Psoriasis', 'Acné', 'Rhinite allergique',
    'Reflux gastro-œsophagien', 'Syndrome du côlon irritable', 'Maladie de Crohn',
    'Anémie', 'Hypercholestérolémie', 'Obésité',
    'Apnée du sommeil', 'Endométriose', 'SOPK',
    'Narcolepsie', 'Maladie cœliaque', 'Sclérose en plaques', 'Lupus (LED)', 'Fibromyalgie',
  ],
  MEDICATION_SUGGESTIONS: [
    'Paracétamol', 'Ibuprofène', 'Aspirine', 'Doliprane', 'Efferalgan',
    'Amoxicilline', 'Augmentin', 'Azithromycine',
    'Oméprazole', 'Pantoprazole', 'Gaviscon',
    'Levothyrox', 'Metformine', 'Insuline',
    'Ventoline', 'Symbicort', 'Flixotide',
    'Sertraline', 'Escitalopram', 'Fluoxétine', 'Paroxétine', 'Venlafaxine',
    'Méthylphénidate', 'Atomoxétine',
    'Atorvastatine', 'Rosuvastatine',
    'Ramipril', 'Amlodipine', 'Bisoprolol', 'Losartan',
    'Lorazépam', 'Alprazolam', 'Diazépam', 'Zopiclone', 'Mélatonine',
    'Vitamine D', 'Vitamine B12', 'Fer', 'Magnésium', 'Zinc', 'Oméga-3',
    'Pilule contraceptive', 'Stérilet hormonal',
    'Modafinil (Modiodal)', 'Oxybate de sodium (Xyrem)', 'Pitolisant (Wakix)',
  ],
  FREQUENCY_OPTIONS: [
    '', '1x/jour', '2x/jour', '3x/jour', '4x/jour',
    '1x/semaine', '2x/semaine', '3x/semaine',
    '1x/mois', 'si besoin (PRN)', 'au coucher', 'au réveil', 'avant repas', 'après repas',
  ],
  DURATION_OPTIONS: [
    '', 'continu', '1 semaine', '2 semaines', '1 mois', '3 mois', '6 mois', '1 an',
    'cure ponctuelle', "jusqu'à amélioration", 'à vie',
  ],
  VACCINATION_SUGGESTIONS: [
    'BCG', 'DTP (Diphtérie-Tétanos-Polio)', 'Coqueluche', 'Haemophilus influenzae b',
    'Hépatite B', 'Hépatite A', 'Pneumocoque', 'Méningocoque C', 'Méningocoque B',
    'ROR (Rougeole-Oreillons-Rubéole)', 'Varicelle', 'Grippe', 'HPV (Papillomavirus)',
    'COVID-19 Pfizer', 'COVID-19 Moderna', 'COVID-19 AstraZeneca', 'COVID-19 Janssen',
    'Fièvre jaune', 'Typhoïde', 'Rage', 'Encéphalite japonaise', 'Zona',
  ],
  SURGERY_SUGGESTIONS: [
    'Appendicectomie', 'Amygdalectomie', 'Adénoïdectomie', 'Césarienne',
    'Cholécystectomie', 'Hernie inguinale', 'Hernie discale',
    'Arthroscopie genou', 'Ligaments croisés', 'Méniscectomie',
    'Chirurgie des dents de sagesse', 'Implant dentaire',
    'Rhinoplastie', 'Septoplastie', 'Chirurgie des yeux (LASIK)',
    'Pose de stent', 'Pontage coronarien', 'Prothèse de hanche', 'Prothèse de genou',
  ],
  FAMILY_HISTORY_SUGGESTIONS: [
    'Diabète (père)', 'Diabète (mère)', 'Hypertension (père)', 'Hypertension (mère)',
    'Cancer du sein (mère)', 'Cancer du côlon (père)', 'Cancer du poumon',
    'Maladie cardiovasculaire (père)', 'Maladie cardiovasculaire (mère)',
    'AVC', 'Alzheimer', 'Parkinson', 'Dépression', 'Trouble bipolaire',
    'Asthme', 'Allergie', 'Thyroïde', 'Obésité', 'Arthrose',
  ],
  SKIN_TYPE_OPTIONS: [
    '', 'Fitzpatrick I — Très claire', 'Fitzpatrick II — Claire',
    'Fitzpatrick III — Intermédiaire', 'Fitzpatrick IV — Mate',
    'Fitzpatrick V — Foncée', 'Fitzpatrick VI — Très foncée',
  ],
  EYE_COLOR_OPTIONS: [
    '', 'Marron', 'Noisette', 'Vert', 'Bleu', 'Gris', 'Ambre', 'Noir',
  ],
  HAIR_COLOR_OPTIONS: [
    '', 'Noir', 'Brun foncé', 'Brun', 'Châtain', 'Blond foncé', 'Blond', 'Blond vénitien', 'Roux', 'Gris', 'Blanc',
  ],
};

const en: HealthSuggestions = {
  ALLERGY_SUGGESTIONS: [
    'Penicillin', 'Amoxicillin', 'Aspirin', 'Ibuprofen', 'Sulfonamides',
    'Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Gluten', 'Soy', 'Shellfish', 'Fish',
    'Latex', 'Pollen', 'Dust mites', 'Cat dander', 'Dog dander',
    'Nickel', 'Iodine', 'Contrast agents',
  ],
  CONDITION_SUGGESTIONS: [
    'Asthma', 'Hypertension', 'Type 1 diabetes', 'Type 2 diabetes', 'Hypothyroidism', 'Hyperthyroidism',
    'Depression', 'Anxiety', 'ADHD', 'Bipolar disorder', 'Insomnia',
    'Migraine', 'Epilepsy', 'Osteoarthritis', 'Rheumatoid arthritis',
    'Eczema', 'Psoriasis', 'Acne', 'Allergic rhinitis',
    'Gastroesophageal reflux disease', 'Irritable bowel syndrome', "Crohn's disease",
    'Anemia', 'Hypercholesterolemia', 'Obesity',
    'Sleep apnea', 'Endometriosis', 'PCOS',
    'Narcolepsy', 'Celiac disease', 'Multiple sclerosis', 'Lupus (SLE)', 'Fibromyalgia',
  ],
  MEDICATION_SUGGESTIONS: [
    'Acetaminophen', 'Ibuprofen', 'Aspirin', 'Tylenol', 'Acetaminophen (effervescent)',
    'Amoxicillin', 'Augmentin', 'Azithromycin',
    'Omeprazole', 'Pantoprazole', 'Gaviscon',
    'Levothyroxine', 'Metformin', 'Insulin',
    'Albuterol (Ventolin)', 'Symbicort', 'Fluticasone (Flovent)',
    'Sertraline', 'Escitalopram', 'Fluoxetine', 'Paroxetine', 'Venlafaxine',
    'Methylphenidate', 'Atomoxetine',
    'Atorvastatin', 'Rosuvastatin',
    'Ramipril', 'Amlodipine', 'Bisoprolol', 'Losartan',
    'Lorazepam', 'Alprazolam', 'Diazepam', 'Zopiclone', 'Melatonin',
    'Vitamin D', 'Vitamin B12', 'Iron', 'Magnesium', 'Zinc', 'Omega-3',
    'Birth control pill', 'Hormonal IUD',
    'Modafinil (Provigil)', 'Sodium oxybate (Xyrem)', 'Pitolisant (Wakix)',
  ],
  FREQUENCY_OPTIONS: [
    '', '1x/day', '2x/day', '3x/day', '4x/day',
    '1x/week', '2x/week', '3x/week',
    '1x/month', 'as needed (PRN)', 'at bedtime', 'upon waking', 'before meals', 'after meals',
  ],
  DURATION_OPTIONS: [
    '', 'continuous', '1 week', '2 weeks', '1 month', '3 months', '6 months', '1 year',
    'short course', 'until improvement', 'lifelong',
  ],
  VACCINATION_SUGGESTIONS: [
    'BCG', 'DTaP (Diphtheria-Tetanus-Pertussis)', 'Pertussis', 'Haemophilus influenzae b',
    'Hepatitis B', 'Hepatitis A', 'Pneumococcal', 'Meningococcal C', 'Meningococcal B',
    'MMR (Measles-Mumps-Rubella)', 'Varicella', 'Influenza', 'HPV (Human Papillomavirus)',
    'COVID-19 Pfizer', 'COVID-19 Moderna', 'COVID-19 AstraZeneca', 'COVID-19 Janssen',
    'Yellow fever', 'Typhoid', 'Rabies', 'Japanese encephalitis', 'Shingles',
  ],
  SURGERY_SUGGESTIONS: [
    'Appendectomy', 'Tonsillectomy', 'Adenoidectomy', 'Cesarean section',
    'Cholecystectomy', 'Inguinal hernia repair', 'Herniated disc surgery',
    'Knee arthroscopy', 'ACL reconstruction', 'Meniscectomy',
    'Wisdom teeth removal', 'Dental implant',
    'Rhinoplasty', 'Septoplasty', 'LASIK eye surgery',
    'Stent placement', 'Coronary bypass', 'Hip replacement', 'Knee replacement',
  ],
  FAMILY_HISTORY_SUGGESTIONS: [
    'Diabetes (father)', 'Diabetes (mother)', 'Hypertension (father)', 'Hypertension (mother)',
    'Breast cancer (mother)', 'Colon cancer (father)', 'Lung cancer',
    'Cardiovascular disease (father)', 'Cardiovascular disease (mother)',
    'Stroke', "Alzheimer's", "Parkinson's", 'Depression', 'Bipolar disorder',
    'Asthma', 'Allergy', 'Thyroid disorder', 'Obesity', 'Osteoarthritis',
  ],
  SKIN_TYPE_OPTIONS: [
    '', 'Fitzpatrick I — Very fair', 'Fitzpatrick II — Fair',
    'Fitzpatrick III — Medium', 'Fitzpatrick IV — Olive',
    'Fitzpatrick V — Brown', 'Fitzpatrick VI — Very dark',
  ],
  EYE_COLOR_OPTIONS: [
    '', 'Brown', 'Hazel', 'Green', 'Blue', 'Gray', 'Amber', 'Black',
  ],
  HAIR_COLOR_OPTIONS: [
    '', 'Black', 'Dark brown', 'Brown', 'Light brown', 'Dark blonde', 'Blonde', 'Strawberry blonde', 'Red', 'Gray', 'White',
  ],
};

const es: HealthSuggestions = {
  ALLERGY_SUGGESTIONS: [
    'Penicilina', 'Amoxicilina', 'Aspirina', 'Ibuprofeno', 'Sulfonamidas',
    'Cacahuetes', 'Frutos secos', 'Leche', 'Huevos', 'Gluten', 'Soja', 'Mariscos', 'Pescado',
    'Látex', 'Polen', 'Ácaros', 'Pelo de gato', 'Pelo de perro',
    'Níquel', 'Yodo', 'Medios de contraste',
  ],
  CONDITION_SUGGESTIONS: [
    'Asma', 'Hipertensión', 'Diabetes tipo 1', 'Diabetes tipo 2', 'Hipotiroidismo', 'Hipertiroidismo',
    'Depresión', 'Ansiedad', 'TDAH', 'Trastorno bipolar', 'Insomnio',
    'Migraña', 'Epilepsia', 'Artrosis', 'Artritis reumatoide',
    'Eccema', 'Psoriasis', 'Acné', 'Rinitis alérgica',
    'Reflujo gastroesofágico', 'Síndrome del intestino irritable', 'Enfermedad de Crohn',
    'Anemia', 'Hipercolesterolemia', 'Obesidad',
    'Apnea del sueño', 'Endometriosis', 'SOP',
    'Narcolepsia', 'Enfermedad celíaca', 'Esclerosis múltiple', 'Lupus (LES)', 'Fibromialgia',
  ],
  MEDICATION_SUGGESTIONS: [
    'Paracetamol', 'Ibuprofeno', 'Aspirina', 'Paracetamol (comprimidos)', 'Paracetamol (efervescente)',
    'Amoxicilina', 'Augmentine', 'Azitromicina',
    'Omeprazol', 'Pantoprazol', 'Gaviscon',
    'Levotiroxina', 'Metformina', 'Insulina',
    'Salbutamol (Ventolín)', 'Symbicort', 'Fluticasona (Flixotide)',
    'Sertralina', 'Escitalopram', 'Fluoxetina', 'Paroxetina', 'Venlafaxina',
    'Metilfenidato', 'Atomoxetina',
    'Atorvastatina', 'Rosuvastatina',
    'Ramipril', 'Amlodipino', 'Bisoprolol', 'Losartán',
    'Lorazepam', 'Alprazolam', 'Diazepam', 'Zopiclona', 'Melatonina',
    'Vitamina D', 'Vitamina B12', 'Hierro', 'Magnesio', 'Zinc', 'Omega-3',
    'Píldora anticonceptiva', 'DIU hormonal',
    'Modafinilo (Provigil)', 'Oxibato de sodio (Xyrem)', 'Pitolisant (Wakix)',
  ],
  FREQUENCY_OPTIONS: [
    '', '1x/día', '2x/día', '3x/día', '4x/día',
    '1x/semana', '2x/semana', '3x/semana',
    '1x/mes', 'si es necesario (PRN)', 'al acostarse', 'al despertar', 'antes de comer', 'después de comer',
  ],
  DURATION_OPTIONS: [
    '', 'continuo', '1 semana', '2 semanas', '1 mes', '3 meses', '6 meses', '1 año',
    'tratamiento puntual', 'hasta mejoría', 'de por vida',
  ],
  VACCINATION_SUGGESTIONS: [
    'BCG', 'DTPa (Difteria-Tétanos-Tosferina)', 'Tosferina', 'Haemophilus influenzae b',
    'Hepatitis B', 'Hepatitis A', 'Neumococo', 'Meningococo C', 'Meningococo B',
    'SRP (Sarampión-Rubéola-Paperas)', 'Varicela', 'Gripe', 'VPH (Virus del Papiloma Humano)',
    'COVID-19 Pfizer', 'COVID-19 Moderna', 'COVID-19 AstraZeneca', 'COVID-19 Janssen',
    'Fiebre amarilla', 'Tifoidea', 'Rabia', 'Encefalitis japonesa', 'Herpes zóster',
  ],
  SURGERY_SUGGESTIONS: [
    'Apendicectomía', 'Amigdalectomía', 'Adenoidectomía', 'Cesárea',
    'Colecistectomía', 'Hernia inguinal', 'Hernia discal',
    'Artroscopia de rodilla', 'Ligamentos cruzados', 'Meniscectomía',
    'Extracción de muelas del juicio', 'Implante dental',
    'Rinoplastia', 'Septoplastia', 'Cirugía ocular (LASIK)',
    'Colocación de stent', 'Bypass coronario', 'Prótesis de cadera', 'Prótesis de rodilla',
  ],
  FAMILY_HISTORY_SUGGESTIONS: [
    'Diabetes (padre)', 'Diabetes (madre)', 'Hipertensión (padre)', 'Hipertensión (madre)',
    'Cáncer de mama (madre)', 'Cáncer de colon (padre)', 'Cáncer de pulmón',
    'Enfermedad cardiovascular (padre)', 'Enfermedad cardiovascular (madre)',
    'Ictus', 'Alzheimer', 'Parkinson', 'Depresión', 'Trastorno bipolar',
    'Asma', 'Alergia', 'Tiroides', 'Obesidad', 'Artrosis',
  ],
  SKIN_TYPE_OPTIONS: [
    '', 'Fitzpatrick I — Muy clara', 'Fitzpatrick II — Clara',
    'Fitzpatrick III — Intermedia', 'Fitzpatrick IV — Morena',
    'Fitzpatrick V — Oscura', 'Fitzpatrick VI — Muy oscura',
  ],
  EYE_COLOR_OPTIONS: [
    '', 'Marrón', 'Avellana', 'Verde', 'Azul', 'Gris', 'Ámbar', 'Negro',
  ],
  HAIR_COLOR_OPTIONS: [
    '', 'Negro', 'Castaño oscuro', 'Castaño', 'Castaño claro', 'Rubio oscuro', 'Rubio', 'Rubio veneciano', 'Pelirrojo', 'Gris', 'Blanco',
  ],
};

const pt: HealthSuggestions = {
  ALLERGY_SUGGESTIONS: [
    'Penicilina', 'Amoxicilina', 'Aspirina', 'Ibuprofeno', 'Sulfonamidas',
    'Amendoim', 'Nozes', 'Leite', 'Ovos', 'Glúten', 'Soja', 'Crustáceos', 'Peixe',
    'Látex', 'Pólen', 'Ácaros', 'Pelos de gato', 'Pelos de cachorro',
    'Níquel', 'Iodo', 'Contraste radiológico',
  ],
  CONDITION_SUGGESTIONS: [
    'Asma', 'Hipertensão', 'Diabetes tipo 1', 'Diabetes tipo 2', 'Hipotireoidismo', 'Hipertireoidismo',
    'Depressão', 'Ansiedade', 'TDAH', 'Transtorno bipolar', 'Insônia',
    'Enxaqueca', 'Epilepsia', 'Artrose', 'Artrite reumatoide',
    'Eczema', 'Psoríase', 'Acne', 'Rinite alérgica',
    'Refluxo gastroesofágico', 'Síndrome do intestino irritável', 'Doença de Crohn',
    'Anemia', 'Hipercolesterolemia', 'Obesidade',
    'Apneia do sono', 'Endometriose', 'SOP',
    'Narcolepsia', 'Doença celíaca', 'Esclerose múltipla', 'Lúpus (LES)', 'Fibromialgia',
  ],
  MEDICATION_SUGGESTIONS: [
    'Paracetamol', 'Ibuprofeno', 'Aspirina', 'Tylenol', 'Novalgina',
    'Amoxicilina', 'Clavulin', 'Azitromicina',
    'Omeprazol', 'Pantoprazol', 'Gaviscone',
    'Puran T4', 'Metformina', 'Insulina',
    'Aerolin', 'Symbicort', 'Flixotide',
    'Sertralina', 'Escitalopram', 'Fluoxetina', 'Paroxetina', 'Venlafaxina',
    'Metilfenidato', 'Atomoxetina',
    'Atorvastatina', 'Rosuvastatina',
    'Ramipril', 'Anlodipino', 'Bisoprolol', 'Losartana',
    'Lorazepam', 'Alprazolam', 'Diazepam', 'Zopiclona', 'Melatonina',
    'Vitamina D', 'Vitamina B12', 'Ferro', 'Magnésio', 'Zinco', 'Ômega-3',
    'Pílula anticoncepcional', 'DIU hormonal',
    'Modafinila (Provigil)', 'Oxibato de sódio (Xyrem)', 'Pitolisant (Wakix)',
  ],
  FREQUENCY_OPTIONS: [
    '', '1x/dia', '2x/dia', '3x/dia', '4x/dia',
    '1x/semana', '2x/semana', '3x/semana',
    '1x/mês', 'se necessário (SOS)', 'ao deitar', 'ao acordar', 'antes das refeições', 'após as refeições',
  ],
  DURATION_OPTIONS: [
    '', 'contínuo', '1 semana', '2 semanas', '1 mês', '3 meses', '6 meses', '1 ano',
    'tratamento pontual', 'até melhora', 'uso contínuo (vitalício)',
  ],
  VACCINATION_SUGGESTIONS: [
    'BCG', 'DTP (Difteria-Tétano-Poliomielite)', 'Coqueluche', 'Haemophilus influenzae b',
    'Hepatite B', 'Hepatite A', 'Pneumocócica', 'Meningocócica C', 'Meningocócica B',
    'Tríplice viral (Sarampo-Caxumba-Rubéola)', 'Varicela', 'Gripe', 'HPV (Papilomavírus)',
    'COVID-19 Pfizer', 'COVID-19 Moderna', 'COVID-19 AstraZeneca', 'COVID-19 Janssen',
    'Febre amarela', 'Febre tifoide', 'Raiva', 'Encefalite japonesa', 'Herpes-zóster',
  ],
  SURGERY_SUGGESTIONS: [
    'Apendicectomia', 'Amigdalectomia', 'Adenoidectomia', 'Cesariana',
    'Colecistectomia', 'Hérnia inguinal', 'Hérnia de disco',
    'Artroscopia de joelho', 'Ligamento cruzado', 'Meniscectomia',
    'Extração de sisos', 'Implante dentário',
    'Rinoplastia', 'Septoplastia', 'Cirurgia ocular (LASIK)',
    'Implante de stent', 'Ponte de safena', 'Prótese de quadril', 'Prótese de joelho',
  ],
  FAMILY_HISTORY_SUGGESTIONS: [
    'Diabetes (pai)', 'Diabetes (mãe)', 'Hipertensão (pai)', 'Hipertensão (mãe)',
    'Câncer de mama (mãe)', 'Câncer de cólon (pai)', 'Câncer de pulmão',
    'Doença cardiovascular (pai)', 'Doença cardiovascular (mãe)',
    'AVC', 'Alzheimer', 'Parkinson', 'Depressão', 'Transtorno bipolar',
    'Asma', 'Alergia', 'Tireoide', 'Obesidade', 'Artrose',
  ],
  SKIN_TYPE_OPTIONS: [
    '', 'Fitzpatrick I — Muito clara', 'Fitzpatrick II — Clara',
    'Fitzpatrick III — Intermediária', 'Fitzpatrick IV — Morena',
    'Fitzpatrick V — Escura', 'Fitzpatrick VI — Muito escura',
  ],
  EYE_COLOR_OPTIONS: [
    '', 'Castanho', 'Avelã', 'Verde', 'Azul', 'Cinza', 'Âmbar', 'Preto',
  ],
  HAIR_COLOR_OPTIONS: [
    '', 'Preto', 'Castanho escuro', 'Castanho', 'Castanho claro', 'Loiro escuro', 'Loiro', 'Loiro avermelhado', 'Ruivo', 'Grisalho', 'Branco',
  ],
};

const ru: HealthSuggestions = {
  ALLERGY_SUGGESTIONS: [
    'Пенициллин', 'Амоксициллин', 'Аспирин', 'Ибупрофен', 'Сульфаниламиды',
    'Арахис', 'Орехи', 'Молоко', 'Яйца', 'Глютен', 'Соя', 'Ракообразные', 'Рыба',
    'Латекс', 'Пыльца', 'Пылевые клещи', 'Шерсть кошки', 'Шерсть собаки',
    'Никель', 'Йод', 'Рентгеноконтрастные средства',
  ],
  CONDITION_SUGGESTIONS: [
    'Астма', 'Гипертония', 'Сахарный диабет 1 типа', 'Сахарный диабет 2 типа', 'Гипотиреоз', 'Гипертиреоз',
    'Депрессия', 'Тревожное расстройство', 'СДВГ', 'Биполярное расстройство', 'Бессонница',
    'Мигрень', 'Эпилепсия', 'Остеоартроз', 'Ревматоидный артрит',
    'Экзема', 'Псориаз', 'Акне', 'Аллергический ринит',
    'Гастроэзофагеальная рефлюксная болезнь', 'Синдром раздражённого кишечника', 'Болезнь Крона',
    'Анемия', 'Гиперхолестеринемия', 'Ожирение',
    'Апноэ сна', 'Эндометриоз', 'СПКЯ',
    'Нарколепсия', 'Целиакия', 'Рассеянный склероз', 'Системная красная волчанка', 'Фибромиалгия',
  ],
  MEDICATION_SUGGESTIONS: [
    'Парацетамол', 'Ибупрофен', 'Аспирин', 'Панадол', 'Эффералган',
    'Амоксициллин', 'Амоксиклав', 'Азитромицин',
    'Омепразол', 'Пантопразол', 'Гевискон',
    'Л-тироксин', 'Метформин', 'Инсулин',
    'Сальбутамол', 'Симбикорт', 'Фликсотид',
    'Сертралин', 'Эсциталопрам', 'Флуоксетин', 'Пароксетин', 'Венлафаксин',
    'Метилфенидат', 'Атомоксетин',
    'Аторвастатин', 'Розувастатин',
    'Рамиприл', 'Амлодипин', 'Бисопролол', 'Лозартан',
    'Лоразепам', 'Алпразолам', 'Диазепам', 'Зопиклон', 'Мелатонин',
    'Витамин D', 'Витамин B12', 'Железо', 'Магний', 'Цинк', 'Омега-3',
    'Оральные контрацептивы', 'Гормональная ВМС',
    'Модафинил', 'Оксибат натрия (Xyrem)', 'Питолизант (Wakix)',
  ],
  FREQUENCY_OPTIONS: [
    '', '1 раз/день', '2 раза/день', '3 раза/день', '4 раза/день',
    '1 раз/неделю', '2 раза/неделю', '3 раза/неделю',
    '1 раз/месяц', 'по необходимости', 'перед сном', 'при пробуждении', 'до еды', 'после еды',
  ],
  DURATION_OPTIONS: [
    '', 'постоянно', '1 неделя', '2 недели', '1 месяц', '3 месяца', '6 месяцев', '1 год',
    'курсовой приём', 'до улучшения', 'пожизненно',
  ],
  VACCINATION_SUGGESTIONS: [
    'БЦЖ', 'АКДС (Дифтерия-Столбняк-Полиомиелит)', 'Коклюш', 'Гемофильная палочка типа b',
    'Гепатит B', 'Гепатит A', 'Пневмококковая', 'Менингококковая C', 'Менингококковая B',
    'КПК (Корь-Паротит-Краснуха)', 'Ветряная оспа', 'Грипп', 'ВПЧ (Вирус папилломы человека)',
    'COVID-19 Pfizer', 'COVID-19 Moderna', 'COVID-19 AstraZeneca', 'COVID-19 Janssen',
    'Жёлтая лихорадка', 'Брюшной тиф', 'Бешенство', 'Японский энцефалит', 'Опоясывающий лишай',
  ],
  SURGERY_SUGGESTIONS: [
    'Аппендэктомия', 'Тонзиллэктомия', 'Аденоидэктомия', 'Кесарево сечение',
    'Холецистэктомия', 'Паховая грыжа', 'Грыжа диска',
    'Артроскопия колена', 'Крестообразные связки', 'Менискэктомия',
    'Удаление зубов мудрости', 'Зубной имплант',
    'Ринопластика', 'Септопластика', 'Лазерная коррекция зрения (LASIK)',
    'Установка стента', 'Аортокоронарное шунтирование', 'Эндопротез тазобедренного сустава', 'Эндопротез коленного сустава',
  ],
  FAMILY_HISTORY_SUGGESTIONS: [
    'Диабет (отец)', 'Диабет (мать)', 'Гипертония (отец)', 'Гипертония (мать)',
    'Рак молочной железы (мать)', 'Рак толстой кишки (отец)', 'Рак лёгких',
    'Сердечно-сосудистые заболевания (отец)', 'Сердечно-сосудистые заболевания (мать)',
    'Инсульт', 'Болезнь Альцгеймера', 'Болезнь Паркинсона', 'Депрессия', 'Биполярное расстройство',
    'Астма', 'Аллергия', 'Щитовидная железа', 'Ожирение', 'Остеоартроз',
  ],
  SKIN_TYPE_OPTIONS: [
    '', 'Фицпатрик I — Очень светлая', 'Фицпатрик II — Светлая',
    'Фицпатрик III — Средняя', 'Фицпатрик IV — Смуглая',
    'Фицпатрик V — Тёмная', 'Фицпатрик VI — Очень тёмная',
  ],
  EYE_COLOR_OPTIONS: [
    '', 'Карий', 'Ореховый', 'Зелёный', 'Голубой', 'Серый', 'Янтарный', 'Чёрный',
  ],
  HAIR_COLOR_OPTIONS: [
    '', 'Чёрный', 'Тёмно-каштановый', 'Каштановый', 'Русый', 'Тёмно-русый', 'Светлый', 'Венецианский блонд', 'Рыжий', 'Седой', 'Белый',
  ],
};

const zh: HealthSuggestions = {
  ALLERGY_SUGGESTIONS: [
    '青霉素', '阿莫西林', '阿司匹林', '布洛芬', '磺胺类药物',
    '花生', '坚果', '牛奶', '鸡蛋', '麸质', '大豆', '甲壳类海鲜', '鱼类',
    '乳胶', '花粉', '尘螨', '猫毛', '狗毛',
    '镍', '碘', '造影剂',
  ],
  CONDITION_SUGGESTIONS: [
    '哮喘', '高血压', '1型糖尿病', '2型糖尿病', '甲状腺功能减退', '甲状腺功能亢进',
    '抑郁症', '焦虑症', '多动症', '双相情感障碍', '失眠',
    '偏头痛', '癫痫', '骨关节炎', '类风湿关节炎',
    '湿疹', '银屑病', '痤疮', '过敏性鼻炎',
    '胃食管反流病', '肠易激综合征', '克罗恩病',
    '贫血', '高胆固醇血症', '肥胖症',
    '睡眠呼吸暂停', '子宫内膜异位症', '多囊卵巢综合征',
    '嗜睡症', '乳糜泻', '多发性硬化症', '系统性红斑狼疮', '纤维肌痛',
  ],
  MEDICATION_SUGGESTIONS: [
    '对乙酰氨基酚', '布洛芬', '阿司匹林', '对乙酰氨基酚（泰诺林）', '对乙酰氨基酚（泡腾片）',
    '阿莫西林', '阿莫西林克拉维酸钾', '阿奇霉素',
    '奥美拉唑', '泮托拉唑', '铝碳酸镁（胃药）',
    '左甲状腺素', '二甲双胍', '胰岛素',
    '沙丁胺醇（万托林）', '布地奈德福莫特罗', '氟替卡松',
    '舍曲林', '艾司西酞普兰', '氟西汀', '帕罗西汀', '文拉法辛',
    '哌甲酯', '托莫西汀',
    '阿托伐他汀', '瑞舒伐他汀',
    '雷米普利', '氨氯地平', '比索洛尔', '氯沙坦',
    '劳拉西泮', '阿普唑仑', '地西泮', '佐匹克隆', '褪黑素',
    '维生素D', '维生素B12', '铁剂', '镁剂', '锌剂', 'Omega-3鱼油',
    '口服避孕药', '左炔诺孕酮宫内节育系统',
    '莫达非尼', '羟丁酸钠 (Xyrem)', '替洛利生 (Wakix)',
  ],
  FREQUENCY_OPTIONS: [
    '', '每日1次', '每日2次', '每日3次', '每日4次',
    '每周1次', '每周2次', '每周3次',
    '每月1次', '必要时服用（PRN）', '睡前服用', '晨起服用', '饭前服用', '饭后服用',
  ],
  DURATION_OPTIONS: [
    '', '持续用药', '1周', '2周', '1个月', '3个月', '6个月', '1年',
    '短期疗程', '直至症状改善', '终身用药',
  ],
  VACCINATION_SUGGESTIONS: [
    '卡介苗（BCG）', '百白破疫苗（DTP）', '百日咳疫苗', '流感嗜血杆菌b型疫苗',
    '乙肝疫苗', '甲肝疫苗', '肺炎球菌疫苗', '脑膜炎球菌C群疫苗', '脑膜炎球菌B群疫苗',
    '麻腮风疫苗（MMR）', '水痘疫苗', '流感疫苗', 'HPV疫苗（人乳头瘤病毒）',
    '新冠疫苗 辉瑞', '新冠疫苗 莫德纳', '新冠疫苗 阿斯利康', '新冠疫苗 强生',
    '黄热病疫苗', '伤寒疫苗', '狂犬病疫苗', '乙型脑炎疫苗', '带状疱疹疫苗',
  ],
  SURGERY_SUGGESTIONS: [
    '阑尾切除术', '扁桃体切除术', '腺样体切除术', '剖宫产',
    '胆囊切除术', '腹股沟疝修补术', '椎间盘突出手术',
    '膝关节镜手术', '交叉韧带重建术', '半月板切除术',
    '智齿拔除术', '牙种植体手术',
    '鼻整形术', '鼻中隔矫正术', '激光近视手术（LASIK）',
    '支架植入术', '冠状动脉搭桥术', '髋关节置换术', '膝关节置换术',
  ],
  FAMILY_HISTORY_SUGGESTIONS: [
    '糖尿病（父亲）', '糖尿病（母亲）', '高血压（父亲）', '高血压（母亲）',
    '乳腺癌（母亲）', '结肠癌（父亲）', '肺癌',
    '心血管疾病（父亲）', '心血管疾病（母亲）',
    '中风', '阿尔茨海默病', '帕金森病', '抑郁症', '双相情感障碍',
    '哮喘', '过敏', '甲状腺疾病', '肥胖症', '骨关节炎',
  ],
  SKIN_TYPE_OPTIONS: [
    '', 'Fitzpatrick I — 极白皮肤', 'Fitzpatrick II — 白皙皮肤',
    'Fitzpatrick III — 中等肤色', 'Fitzpatrick IV — 橄榄肤色',
    'Fitzpatrick V — 深色皮肤', 'Fitzpatrick VI — 极深色皮肤',
  ],
  EYE_COLOR_OPTIONS: [
    '', '棕色', '淡褐色', '绿色', '蓝色', '灰色', '琥珀色', '黑色',
  ],
  HAIR_COLOR_OPTIONS: [
    '', '黑色', '深棕色', '棕色', '栗色', '深金色', '金色', '草莓金', '红色', '灰色', '白色',
  ],
};

const allSuggestions: Record<string, HealthSuggestions> = { en, fr, es, pt, ru, zh };

export function getHealthSuggestions(locale: string): HealthSuggestions {
  return allSuggestions[locale] || allSuggestions.en;
}
