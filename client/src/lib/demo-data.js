// Demo data used when no backend is available (static deployment).
// Keep in sync with server/src/services/mock-data.js

export const demoOrg = {
  id: 'org-1',
  name: 'Byzantine Choral Society',
  slug: 'byzantine-choral',
  description: 'Dedicated to the preservation and performance of Byzantine and sacred choral music'
};

export const demoConcert = {
  id: 'concert-1',
  orgId: 'org-1',
  title: 'Spring Sacred Music Concert',
  subtitle: 'A Journey Through Sacred Traditions',
  venue: 'Cathedral of the Holy Trinity',
  dateTime: '2026-05-15T19:30:00',
  status: 'published',
  controllerPin: '1234',
  currentPieceId: null,
  organization: demoOrg,
  pieces: [
    {
      id: 'piece-1', concertId: 'concert-1', orderNumber: 1,
      workName: 'Agni Parthene', composer: 'St. Nectarios of Aegina', arranger: null,
      description: 'A beloved hymn to the Theotokos (Mother of God), composed by St. Nectarios in the late 19th century.',
      lyricsOriginal: 'Αγνή Παρθένε Δέσποινα,\nΆχραντε Θεοτόκε,\nΧαίρε Νύμφη Ανύμφευτε.\n\nΠαρθένε Μήτηρ Άνασσα,\nΠανένδροσε τε πόκε,\nΧαίρε Νύμφη Ανύμφευτε.\n\nΥψηλοτέρα Ουρανών,\nΑκτίνων λαμπροτέρα,\nΧαίρε Νύμφη Ανύμφευτε.',
      lyricsLanguageCode: 'el', soloists: null, sponsor: null
    },
    {
      id: 'piece-2', concertId: 'concert-1', orderNumber: 2,
      workName: 'Ave Maria', composer: 'Franz Schubert', arranger: 'John Rutter',
      description: 'Schubert\'s iconic setting of the Ave Maria prayer.',
      lyricsOriginal: 'Ave Maria, gratia plena,\nDominus tecum.\nBenedicta tu in mulieribus,\net benedictus fructus ventris tui, Iesus.\n\nSancta Maria, Mater Dei,\nora pro nobis peccatoribus,\nnunc et in hora mortis nostrae.\nAmen.',
      lyricsLanguageCode: 'la', soloists: 'Maria Konstantinou, soprano', sponsor: null
    },
    {
      id: 'piece-3', concertId: 'concert-1', orderNumber: 3,
      workName: 'Pie Jesu', composer: 'Gabriel Fauré', arranger: null,
      description: 'From Fauré\'s Requiem in D minor, Op. 48. A gentle prayer for eternal rest.',
      lyricsOriginal: 'Pie Jesu Domine,\ndona eis requiem,\ndona eis requiem\nsempiternam requiem.\n\nPie Jesu Domine,\ndona eis requiem,\ndona eis requiem\nsempiternam requiem.',
      lyricsLanguageCode: 'la', soloists: 'Elena Papadopoulou, soprano', sponsor: 'The Papadopoulos Family Foundation'
    },
    {
      id: 'piece-4', concertId: 'concert-1', orderNumber: 4,
      workName: 'Totus Tuus', composer: 'Henryk Górecki', arranger: null,
      description: 'Written for the third visit of Pope John Paul II to Poland in 1987.',
      lyricsOriginal: 'Totus tuus sum, Maria!\nMater nostri Redemptoris,\nVirgo Dei, Virgo pia,\nMater mundi Salvatoris.\n\nTotus tuus sum, Maria!',
      lyricsLanguageCode: 'la', soloists: null, sponsor: null
    },
    {
      id: 'piece-5', concertId: 'concert-1', orderNumber: 5,
      workName: 'Bogoróditse Djévo', composer: 'Sergei Rachmaninoff', arranger: null,
      description: 'Movement 6 from the All-Night Vigil (Vespers), Op. 37.',
      lyricsOriginal: 'Bogoróditse Djévo, rádujsja,\nBlagodátnaja Maríje,\nGospód s Tobóju.\n\nBlagoslovéna Ty v zhenákh,\ni blagoslovén plod chréva Tvojegó,\njáko Spása rodilá jesí dush náshikh.',
      lyricsLanguageCode: 'cu', soloists: null, sponsor: null
    }
  ]
};

// In-memory live state (per-tab; synced via BroadcastChannel in demo-bus.js)
export const demoState = {
  status: 'published',
  currentPieceId: null
};
