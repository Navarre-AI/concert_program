// Mock data modeled after the existing FileMaker ConcertProgram database
// Field names match FM table fields, mapped to camelCase for the API

export const organizations = [
  {
    id: 'org-1',
    name: 'Byzantine Choral Society',
    slug: 'byzantine-choral',
    description: 'Dedicated to the preservation and performance of Byzantine and sacred choral music'
  }
];

export const concerts = [
  {
    id: 'concert-1',
    orgId: 'org-1',
    title: 'Spring Sacred Music Concert',
    subtitle: 'A Journey Through Sacred Traditions',
    venue: 'Cathedral of the Holy Trinity',
    dateTime: '2026-05-15T19:30:00',
    status: 'published', // draft | published | live | intermission | ended
    controllerPin: '1234',
    currentPieceId: null,
    pieces: [
      {
        id: 'piece-1',
        concertId: 'concert-1',
        orderNumber: 1,
        workName: 'Agni Parthene',
        composer: 'St. Nectarios of Aegina',
        arranger: null,
        description: 'A beloved hymn to the Theotokos (Mother of God), composed by St. Nectarios in the late 19th century. The text is a series of poetic praises drawing from various Byzantine and scriptural sources.',
        lyricsOriginal: 'Αγνή Παρθένε Δέσποινα,\nΆχραντε Θεοτόκε,\nΧαίρε Νύμφη Ανύμφευτε.\n\nΠαρθένε Μήτηρ Άνασσα,\nΠανένδροσε τε πόκε,\nΧαίρε Νύμφη Ανύμφευτε.\n\nΥψηλοτέρα Ουρανών,\nΑκτίνων λαμπροτέρα,\nΧαίρε Νύμφη Ανύμφευτε.',
        lyricsLanguageCode: 'el',
        soloists: null,
        sponsor: null,
        isPublish: 1
      },
      {
        id: 'piece-2',
        concertId: 'concert-1',
        orderNumber: 2,
        workName: 'Ave Maria',
        composer: 'Franz Schubert',
        arranger: 'John Rutter',
        description: 'Schubert\'s iconic setting of the Ave Maria prayer, originally composed as "Ellens dritter Gesang" from Sir Walter Scott\'s "The Lady of the Lake." This arrangement by John Rutter expands the work for full choir.',
        lyricsOriginal: 'Ave Maria, gratia plena,\nDominus tecum.\nBenedicta tu in mulieribus,\net benedictus fructus ventris tui, Iesus.\n\nSancta Maria, Mater Dei,\nora pro nobis peccatoribus,\nnunc et in hora mortis nostrae.\nAmen.',
        lyricsLanguageCode: 'la',
        soloists: 'Maria Konstantinou, soprano',
        sponsor: null,
        isPublish: 1
      },
      {
        id: 'piece-3',
        concertId: 'concert-1',
        orderNumber: 3,
        workName: 'Pie Jesu',
        composer: 'Gabriel Fauré',
        arranger: null,
        description: 'From Fauré\'s Requiem in D minor, Op. 48. This gentle movement is a prayer for eternal rest, featuring a soaring soprano solo over hushed choral accompaniment.',
        lyricsOriginal: 'Pie Jesu Domine,\ndona eis requiem,\ndona eis requiem\nsempiternam requiem.\n\nPie Jesu Domine,\ndona eis requiem,\ndona eis requiem\nsempiternam requiem.',
        lyricsLanguageCode: 'la',
        soloists: 'Elena Papadopoulou, soprano',
        sponsor: 'The Papadopoulos Family Foundation',
        isPublish: 1
      },
      {
        id: 'piece-4',
        concertId: 'concert-1',
        orderNumber: 4,
        workName: 'Totus Tuus',
        composer: 'Henryk Górecki',
        arranger: null,
        description: 'Written for the third visit of Pope John Paul II to Poland in 1987. The text is a Marian devotion — "Totus Tuus" (Totally Yours) was the Pope\'s personal motto.',
        lyricsOriginal: 'Totus tuus sum, Maria!\nMater nostri Redemptoris,\nVirgo Dei, Virgo pia,\nMater mundi Salvatoris.\n\nTotus tuus sum, Maria!',
        lyricsLanguageCode: 'la',
        soloists: null,
        sponsor: null,
        isPublish: 1
      },
      {
        id: 'piece-5',
        concertId: 'concert-1',
        orderNumber: 5,
        workName: 'Bogoróditse Djévo',
        composer: 'Sergei Rachmaninoff',
        arranger: null,
        description: 'Movement 6 from the All-Night Vigil (Vespers), Op. 37. Rachmaninoff\'s luminous setting of the Slavonic text of the Ave Maria, one of the most beloved choral works of the 20th century.',
        lyricsOriginal: 'Bogoróditse Djévo, rádujsja,\nBlagodátnaja Maríje,\nGospód s Tobóju.\n\nBlagoslovéna Ty v zhenákh,\ni blagoslovén plod chréva Tvojegó,\njáko Spása rodilá jesí dush náshikh.',
        lyricsLanguageCode: 'cu',
        soloists: null,
        sponsor: null,
        isPublish: 1
      }
    ]
  }
];

// Admin users (mock)
export const adminUsers = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    password: 'admin123', // In production, this would be hashed
    orgId: 'org-1',
    role: 'admin'
  }
];

// Helper to find concert with org data
export function getConcertWithOrg(concertId) {
  const concert = concerts.find(c => c.id === concertId);
  if (!concert) return null;
  const org = organizations.find(o => o.id === concert.orgId);
  return {
    ...concert,
    organization: org
  };
}
