/**
 * HeloDoc Multilingual Voice AI & Speech Synthesis Service
 * Comprehensive multi-language voice engine for Hindi, Tamil, Telugu, Malayalam, Spanish, Kannada, and English.
 */

const langVoiceMap = {
  en: 'en-US',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  kn: 'kn-IN',
  es: 'es-ES'
};

// Cached voices from browser speechSynthesis
let cachedVoices = [];

const loadBrowserVoices = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadBrowserVoices();
  window.speechSynthesis.onvoiceschanged = loadBrowserVoices;
}

/**
 * Web Audio API Hospital Guidance Chime (Soft 2-tone melodic notification before voice)
 */
export const playHospitalGuidanceChime = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Tone 1: 523.25 Hz (C5) - gentle hospital notification bell
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2: 659.25 Hz (E5) - soothing harmonic chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.12);
    gain2.gain.setValueAtTime(0.0001, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.14, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.48);
  } catch (e) {
    // AudioContext policy
  }
};

/**
 * Find the most natural, human-sounding native neural voice for the selected language
 */
export const getMatchingVoice = (lang = 'en') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetTag = (langVoiceMap[lang] || 'en-US').toLowerCase();
  const prefix = lang.toLowerCase();

  // Find all candidate voices matching language or locale
  const candidates = voices.filter(v => {
    const l = (v.lang || '').toLowerCase();
    const n = (v.name || '').toLowerCase();
    return l === targetTag || l.startsWith(prefix) || n.includes(prefix);
  });

  if (candidates.length === 0) return null;

  // Rank candidate voices for human-like realism
  const scored = candidates.map(v => {
    let score = 0;
    const name = (v.name || '').toLowerCase();
    
    // Neural / Natural voice priority
    if (name.includes('natural')) score += 100;
    if (name.includes('neural')) score += 95;
    if (name.includes('online')) score += 80;
    if (name.includes('google')) score += 70;

    // Renowned human talent voices
    const humanTalents = [
      'christopher', 'jenny', 'guy', 'aria', 'ava', // English
      'pallavi', 'valluvar', 'iniya', // Tamil
      'swara', 'kalpana', 'hemant', 'madhur', // Hindi
      'mohan', 'chitra', // Telugu
      'sobhana', 'midhun', // Malayalam
      'sapna', 'gagan', // Kannada
      'jorge', 'elvira', 'alvaro', 'monica' // Spanish
    ];
    if (humanTalents.some(t => name.includes(t))) score += 40;

    // Penalty for mechanical SAPI/desktop voices
    if (name.includes('desktop') || name.includes('sapi')) score -= 40;

    return { voice: v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].voice;
};

// Central Multilingual Voice Phrase Dictionary
export const voicePhrases = {
  // System & Modes
  senior_mode_on: {
    en: "Senior Care Mode is now active with extra large fonts and voice assistance.",
    hi: "वरिष्ठ नागरिक मोड सक्रिय हो गया है, बड़े अक्षरों और आवाज़ सहायता के साथ।",
    ta: "பெரிய எழுத்துக்கள் மற்றும் குரல் வழிகாட்டலுடன் முதியோர் பராமரிப்பு முறை இயக்கப்பட்டது.",
    te: "పెద్ద అక్షరాలు మరియు వాయిస్ సహాయంతో సీనియర్ కేర్ మోడ్ ఇప్పుడు ప్రారంభమైంది.",
    ml: "വലിയ അക്ഷരങ്ങളും വോയ്‌സ് സഹായവുമുള്ള സീനിയർ കെയർ മോഡ് സജീവമായി.",
    es: "Modo de atención para adultos mayores activado con fuentes grandes y asistencia por voz.",
    kn: "ದೊಡ್ಡ ಅಕ್ಷರಗಳು ಮತ್ತು ಧ್ವನಿ ಸಹಾಯದೊಂದಿಗೆ ಹಿರಿಯ ನಾಗರಿಕರ ಆರೈಕೆ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ."
  },
  standard_mode: {
    en: "Standard view restored.",
    hi: "सामान्य दृश्य बहाल कर दिया गया है।",
    ta: "வழக்கமான திரை மீட்டமைக்கப்பட்டது.",
    te: "సాధారణ వీక్షణ పునరుద్ధరించబడింది.",
    ml: "സാധാരണ കാഴ്‌ച പുനഃസ്ഥാപിച്ചു.",
    es: "Vista estándar restaurada.",
    kn: "ಸಾಮಾನ್ಯ ವೀಕ್ಷಣೆ ಪುನಃಸ್ಥಾಪಿಸಲಾಗಿದೆ."
  },
  voice_guide_on: {
    en: "Voice Guide is enabled.",
    hi: "आवाज़ गाइड चालू कर दी गई है।",
    ta: "குரல் வழிகாட்டி இயக்கப்பட்டது.",
    te: "వాయిస్ గైడ్ ప్రారంభించబడింది.",
    ml: "വോയ്‌സ് ഗൈഡ് പ്രവർത്തനക്ഷമമാക്കി.",
    es: "Guía de voz activada.",
    kn: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ."
  },
  lang_changed: {
    en: "Language changed successfully.",
    hi: "भाषा सफलतापूर्वक बदल दी गई है।",
    ta: "மொழி வெற்றிகரமாக மாற்றப்பட்டது.",
    te: "భాష విజయవంతంగా మార్చబడింది.",
    ml: "ഭാഷ വിജയകരമായി മാറ്റി.",
    es: "Idioma cambiado con éxito.",
    kn: "ಭಾಷೆ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಗಿದೆ."
  },

  // Role Switches
  role_patient: {
    en: "Switched to Patient Mode.",
    hi: "मरीज़ पोर्टल में बदला गया।",
    ta: "நோயாளி முறைக்கு மாற்றப்பட்டது.",
    te: "రోగి పోర్టల్‌కు మార్చబడింది.",
    ml: "പേഷ്യന്റ് മോഡിലേക്ക് മാറ്റി.",
    es: "Cambiado a Modo Paciente.",
    kn: "ರೋಗಿ ಪೋರ್ಟಲ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ."
  },
  role_doctor: {
    en: "Switched to Doctor Clinical Console. Room 104.",
    hi: "डॉक्टर क्लिनिकल कंसोल में बदला गया। कमरा 104।",
    ta: "மருத்துவர் பணியகத்திற்கு மாற்றப்பட்டது. அறை 104.",
    te: "డాక్టర్ క్లినికల్ కన్సోల్‌కు మార్చబడింది. రూమ్ 104.",
    ml: "ഡോക്ടർ കൺസോളിലേക്ക് മാറ്റി. റൂം 104.",
    es: "Cambiado a Consola Médica. Consultorio 104.",
    kn: "ವೈದ್ಯರ ಕನ್ಸೋಲ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ಕೋಣೆ 104."
  },
  role_pharmacy: {
    en: "Switched to Jan Aushadhi Hospital Pharmacy Console.",
    hi: "जन औषधि अस्पताल फार्मेसी कंसोल में बदला गया।",
    ta: "ஜன் ஔஷதி மருத்துவமனை மருந்தக பணியகத்திற்கு மாற்றப்பட்டது.",
    te: "జన్ ఔషధి హాస్పిటల్ ఫార్మసీ కన్సోల్‌కు మార్చబడింది.",
    ml: "ജൻ ഔഷധി ഫാർമസി കൺസോളിലേക്ക് മാറ്റി.",
    es: "Cambiado a Consola de Farmacia Jan Aushadhi.",
    kn: "ಜನ ಔಷಧಿ ಆಸ್ಪತ್ರೆ ಔಷಧಾಲಯ ಕನ್ಸೋಲ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ."
  },
  role_delivery: {
    en: "Switched to Medicine Delivery Partner Dashboard.",
    hi: "दवा डिलीवरी पार्टनर डैशबोर्ड में बदला गया।",
    ta: "மருந்து டெலிவரி பார்ட்னர் திரைக்கு மாற்றப்பட்டது.",
    te: "మెడిసిన్ డెలివరీ పార్టనర్ డాష్‌బోర్డ్‌కు మార్చబడింది.",
    ml: "മെഡിസിൻ ഡെലിവറി ഡാഷ്‌ബോർഡിലേക്ക് മാറ്റി.",
    es: "Cambiado al Panel de Reparto de Medicamentos.",
    kn: "ಔಷಧ ವಿತರಣಾ ಪಾಲುದಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ."
  },
  role_admin: {
    en: "Switched to Master Administration Dashboard.",
    hi: "मास्टर प्रशासन डैशबोर्ड में बदला गया।",
    ta: "தலைமை நிர்வாக திரைக்கு மாற்றப்பட்டது.",
    te: "మాస్టర్ అడ్మినిస్ట్రేషన్ డాష్‌బోర్డ్‌కు మార్చబడింది.",
    ml: "മാസ്റ്റർ അഡ്മിനിസ്ട്രേഷൻ ഡാഷ്‌ബോർഡിലേക്ക് മാറ്റി.",
    es: "Cambiado al Panel Principal de Administración.",
    kn: "ಮುಖ್ಯ ಆಡಳಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ."
  },

  // Navigation & Map
  map_3d_active: {
    en: "3D Hospital Room Navigator active. Drag to rotate model.",
    hi: "3D अस्पताल रूम नेविगेटर सक्रिय है। मॉडल घुमाने के लिए ड्रैग करें।",
    ta: "3D மருத்துவமனை அறை வழிகாட்டி இயக்கத்தில் உள்ளது. சுழற்ற இழுக்கவும்.",
    te: "3D హాస్పిటల్ రూమ్ నావిగేటర్ సక్రియంగా ఉంది. తిప్పడానికి డ్రాగ్ చేయండి.",
    ml: "3D ഹോസ്പിറ്റൽ നാവിഗേറ്റർ സജീവമാണ്. തിരിക്കാൻ ഡ്രാഗ് ചെയ്യുക.",
    es: "Navegador 3D de salas activado. Arrastre para rotar el modelo.",
    kn: "3D ಆಸ್ಪತ್ರೆ ಕೋಣೆ ನ್ಯಾವಿಗೇಟರ್ ಸಕ್ರಿಯವಾಗಿದೆ. ಮಾದರಿಯನ್ನು ತಿರುಗಿಸಲು ಡ್ರ್ಯಾಗ್ ಮಾಡಿ."
  },
  map_2d_active: {
    en: "2D Floor Blueprint active.",
    hi: "2D तल नक्शा सक्रिय है।",
    ta: "2D தள வரைபடம் இயக்கத்தில் உள்ளது.",
    te: "2D అంతస్తు ప్లాన్ సక్రియంగా ఉంది.",
    ml: "2D ഫ്ലോർ പ്ലാൻ സജീവമാണ്.",
    es: "Plano 2D activado.",
    kn: "2D ಮಹಡಿ ನಕ್ಷೆ ಸಕ್ರಿಯವಾಗಿದೆ."
  },
  nearby_hospitals_active: {
    en: "Nearby Emergency Hospitals radar map.",
    hi: "नज़दीकी आपातकालीन अस्पताल रडार मानचित्र।",
    ta: "அருகிலுள்ள அவசர மருத்துவமனைகளின் வரைபடம்.",
    te: "సమీపంలోని అత్యవసర ఆసుపత్రుల మ్యాప్.",
    ml: "അടുത്തുള്ള അത്യാഹിത ആശുപത്രികളുടെ മാപ്പ്.",
    es: "Mapa radar de hospitales de emergencia cercanos.",
    kn: "ಹತ್ತಿರದ ತುರ್ತು ಆಸ್ಪತ್ರೆಗಳ ನಕ್ಷೆ."
  },
  ground_floor_announcement: {
    en: "Ground Floor: Emergency Trauma, Main Reception, and Jan Aushadhi Generic Pharmacy Room 004.",
    hi: "भूतल: आपातकालीन ट्रॉमा, मुख्य स्वागत कक्ष और जन औषधि जेनेरिक फार्मेसी कमरा 004।",
    ta: "தரைத்தளம்: அவசர சிகிச்சை பிரிவு, வரவேற்பறை மற்றும் ஜன் ஔஷதி மருந்தகம் அறை 004.",
    te: "గ్రౌండ్ ఫ్లోర్: అత్యవసర విభాగం, రిసెప్షన్ మరియు జన్ ఔషధి ఫార్మసీ రూమ్ 004.",
    ml: "ഗ്രൗണ്ട് ഫ്ലോർ: എമർജൻസി ട്രോമ, റിസപ്ഷൻ, ജൻ ഔഷധി ഫാർമസി റൂം 004.",
    es: "Planta Baja: Urgencias, Recepción Principal y Farmacia Jan Aushadhi Habitación 004.",
    kn: "ನೆಲ ಮಹಡಿ: ತುರ್ತು ಚಿಕಿತ್ಸಾ ಘಟಕ, ಸ್ವಾಗತ ಕೌಂಟರ್ ಮತ್ತು ಜನ ಔಷಧಿ ಮಳಿಗೆ ಕೋಣೆ 004."
  },
  floor1_announcement: {
    en: "1st Floor: Dermatology Clinic Room 401, Cardiology Room 402, and Orthopedic Clinic Room 403.",
    hi: "प्रथम तल: त्वचा रोग क्लिनिक कमरा 401, कार्डियोलॉजी कमरा 402 और ऑर्थोपेडिक कमरा 403।",
    ta: "முதல் மாடி: தோல் மருத்துவ கிளினிக் அறை 401, இதய பிரிவு அறை 402 மற்றும் எலும்பு பிரிவு அறை 403.",
    te: "1వ అంతస్తు: డెర్మటాలజీ రూమ్ 401, కార్డియాలజీ రూమ్ 402 మరియు ఆర్థోపెడిక్ రూమ్ 403.",
    ml: "ഒന്നാം നില: ഡെർമറ്റോളജി റൂം 401, കാർഡിയോളജി റൂം 402, ഓർത്തോപെഡിക് റൂം 403.",
    es: "1.er Piso: Dermatología Habitación 401, Cardiología Habitación 402 y Ortopedia Habitación 403.",
    kn: "1ನೇ ಮಹಡಿ: ಚರ್ಮರೋಗ ಕ್ಲಿನಿಕ್ ಕೋಣೆ 401, ಹೃದ್ರೋಗ ಕೋಣೆ 402 ಮತ್ತು ಮೂಳೆರೋಗ ಕೋಣೆ 403."
  },
  floor2_announcement: {
    en: "2nd Floor: Intensive Care Unit ICU Room 404, and Normal Patient Ward Room 405.",
    hi: "दूसरा तल: गहन चिकित्सा इकाई आईसीयू कमरा 404 और सामान्य मरीज वार्ड कमरा 405।",
    ta: "2-வது மாடி: தீவிர சிகிச்சை பிரிவு ICU அறை 404 மற்றும் சாதாரண வார்டு அறை 405.",
    te: "2వ అంతస్తు: ఇంటెన్సివ్ కేర్ యూనిట్ ICU రూమ్ 404 మరియు సాధారణ వార్డు రూమ్ 405.",
    ml: "രണ്ടാം നില: ഇന്റൻസീവ് കെയർ യൂണിറ്റ് ICU റൂം 404, പേഷ്യന്റ് വാർഡ് റൂം 405.",
    es: "2.º Piso: Unidad de Cuidados Intensivos UCI Habitación 404 y Sala Normal Habitación 405.",
    kn: "2ನೇ ಮಹಡಿ: ತೀವ್ರ ನಿಗಾ ಘಟಕ ಐಸಿಯು ಕೋಣೆ 404 ಮತ್ತು ಸಾಮಾನ್ಯ ವಾರ್ಡ್ ಕೋಣೆ 405."
  },
  floor3_announcement: {
    en: "3rd Floor: Postnatal Maternity Wards from Room 406 to Room 410.",
    hi: "तीसरा तल: प्रसूति एवं नवजात वार्ड कमरा 406 से कमरा 410।",
    ta: "3-வது மாடி: பிரசவத்திற்கு பிந்தைய தாய்-சேய் வார்டுகள் அறை 406 முதல் 410 வரை.",
    te: "3వ అంతస్తు: పోస్ట్ నాటల్ ప్రసూతి వార్డులు రూమ్ 406 నుండి రూమ్ 410 వరకు.",
    ml: "മൂന്നാം നില: പോസ്റ്റ്നാറ്റൽ പ്രസവ വാർഡുകൾ റൂം 406 മുതൽ 410 വരെ.",
    es: "3.er Piso: Salas de Maternidad y Posparto desde la Habitación 406 hasta la 410.",
    kn: "3ನೇ ಮಹಡಿ: ಪ್ರಸವಾನಂತರ ತಾಯಿ-ಮಗು ಆರೈಕೆ ವಾರ್ಡ್‌ಗಳು ಕೋಣೆ 406 ರಿಂದ 410 ರವರೆಗೆ."
  },
  wheelchair_route_active: {
    en: "Wheelchair accessible route active. Navigating via Ramp Entrance B and Central Elevator A. No stairs.",
    hi: "व्हीलचेयर सुलभ मार्ग सक्रिय है। रैंप प्रवेश द्वार बी और लिफ्ट ए से मार्गदर्शन। सीढ़ियाँ नहीं।",
    ta: "சக்கர நாற்காலி பாதை இயக்கப்பட்டது. சரிவுப்பாதை B மற்றும் லிஃப்ட் A வழியாக செல்லவும்.",
    te: "వీల్‌చైర్ మార్గం సక్రియంగా ఉంది. ర్యాంప్ గేట్ B మరియు లిఫ్ట్ A ద్వారా వెళ్ళండి.",
    ml: "വീൽചെയർ സൗഹൃദ പാത സജീവമാക്കി. റാംപ് B, ലിഫ്റ്റ് A വഴി നയിക്കുന്നു.",
    es: "Ruta accesible en silla de ruedas activa. Navegando por Rampa B y Ascensor A. Sin escaleras.",
    kn: "ವೀಲ್‌ಚೇರ್ ಮಾರ್ಗ ಸಕ್ರಿಯವಾಗಿದೆ. ಇಳಿಜಾರು ದ್ವಾರ ಬಿ ಮತ್ತು ಲಿಫ್ಟ್ ಎ ಮೂಲಕ ಮಾರ್ಗದರ್ಶನ."
  },

  // Medicine & Delivery
  pill_taken: {
    en: "Medicine marked as taken.",
    hi: "दवाई ले ली गई के रूप में दर्ज की गई।",
    ta: "மருந்து உட்கொள்ளப்பட்டதாக பதிவு செய்யப்பட்டது.",
    te: "మందు తీసుకున్నట్లు నమోదు చేయబడింది.",
    ml: "മരുന്ന് കഴിച്ചതായി അടയാളപ്പെടുത്തി.",
    es: "Medicamento marcado como tomado.",
    kn: "ಔಷಧಿ ಸೇವಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ."
  },
  delivery_dispatched: {
    en: "Your prescription medicines from hospital pharmacy are being prepared for home delivery.",
    hi: "अस्पताल फार्मेसी से आपकी दवाइयां घर पर डिलीवरी के लिए तैयार की जा रही हैं।",
    ta: "மருத்துவமனை மருந்தகத்திலிருந்து உங்கள் மருந்துகள் வீட்டு டெலிவரிக்கு தயாராகின்றன.",
    te: "ఆసుపత్రి ఫార్మసీ నుండి మీ మందులు ఇంటి డెలివరీ కోసం సిద్ధం చేయబడుతున్నాయి.",
    ml: "ആശുപത്രി ഫാർമസിയിൽ നിന്ന് നിങ്ങളുടെ മരുന്നുകൾ ഹോം ഡെലിവറിക്കായി തയ്യാറാക്കുന്നു.",
    es: "Sus medicamentos de la farmacia hospitalaria se están preparando para entrega a domicilio.",
    kn: "ಆಸ್ಪತ್ರೆ ಔಷಧಾಲಯದಿಂದ ನಿಮ್ಮ ಔಷಧಿಗಳನ್ನು ಮನೆಗೆ ತಲುಪಿಸಲು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ."
  },
  delivery_completed: {
    en: "Medicines have been verified and delivered to your home. Please check the dosage schedule in My Medicines.",
    hi: "दवाइयां सत्यापित होकर आपके घर पहुँचा दी गई हैं। कृपया खुराक का समय जांच लें।",
    ta: "மருந்துகள் சரிபார்க்கப்பட்டு உங்கள் வீட்டிற்கு வழங்கப்பட்டன. மருந்து அட்டவணையை சரிபார்க்கவும்.",
    te: "మందులు ధృవీకరించబడి మీ ఇంటికి డెలివరీ చేయబడ్డాయి. దయచేసి సమయాలను తనిಖీ చేయండి.",
    ml: "മരുന്നുകൾ പരിശോധിച്ച് നിങ്ങളുടെ വീട്ടിൽ എത്തിച്ചു. സമയക്രമം പരിശോധിക്കുക.",
    es: "Los medicamentos han sido verificados y entregados en su domicilio.",
    kn: "ಔಷಧಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ನಿಮ್ಮ ಮನೆಗೆ ತಲುಪಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ವೇಳಾಪಟ್ಟಿಯನ್ನು ಪರಿಶೀಲಿಸಿ."
  },
  delivery_otp_incorrect: {
    en: "The delivery OTP entered is incorrect. Please check the 4-digit code.",
    hi: "दर्ज किया गया डिलीवरी ओटीपी गलत है। कृपया 4 अंकों का कोड जांचें।",
    ta: "உள்ளிடப்பட்ட டெலிவரி OTP தவறானது. 4 இலக்க குறியீட்டை சரிபார்க்கவும்.",
    te: "నమోదు చేసిన డెలివరీ OTP తప్పు. దయచేసి 4 అంకెల కోడ్‌ను తనిఖీ చేయండి.",
    ml: "നൽകിയ ഡെലിവറി OTP തെറ്റാണ്. 4 അക്ക കോഡ് പരിശോധിക്കുക.",
    es: "El código OTP de entrega ingresado es incorrecto. Verifique el código de 4 dígitos.",
    kn: "ನಮೂದಿಸಿದ ಡೆಲಿವರಿ ಒಟಿಪಿ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು 4 ಅಂಕಿಯ ಕೋಡ್ ಪರಿಶೀಲಿಸಿ."
  },

  // Payment & Token
  payment_verified: {
    en: "Payment verified. Your appointment token has been generated.",
    hi: "भुगतान सत्यापित हो गया है। आपका टोकन नंबर जारी कर दिया गया है।",
    ta: "கட்டணம் உறுதி செய்யப்பட்டது. உங்கள் முன்பதிவு டோக்கன் உருவாக்கப்பட்டது.",
    te: "చెల్లింపు ధృవీకరించబడింది. మీ అపాయింట్‌మెంట్ టోకెన్ జారీ చేయబడింది.",
    ml: "പേയ്‌മെന്റ് സ്ഥിരീകരിച്ചു. നിങ്ങളുടെ ടോക്കൺ തയ്യാറായി.",
    es: "Pago verificado. Su ficha de consulta ha sido generada.",
    kn: "ಪಾವತಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಟೋಕನ್ ರಚಿಸಲಾಗಿದೆ."
  },
  appt_cancelled: {
    en: "Appointment cancelled. 100 percent refund has been initiated to your account within 24 hours.",
    hi: "अपॉइंटमेंट रद्द कर दिया गया है। 24 घंटे में आपके खाते में पूरा रिफंड आ जाएगा।",
    ta: "முன்பதிவு ரத்து செய்யப்பட்டது. 24 மணி நேரத்திற்குள் முழு கட்டணமும் திருப்பித் தரப்படும்.",
    te: "అపాయింట్‌మెంట్ రద్దు చేయబడింది. 24 గంటల్లో పూర్తి వాపసు అందించబడుతుంది.",
    ml: "അപ്പോയിന്റ്മെന്റ് റദ്ദാക്കി. 24 മണിക്കൂറിനകം റീഫണ്ട് ലഭിക്കും.",
    es: "Cita cancelada. Se ha iniciado el reembolso del 100% a su cuenta dentro de 24 horas.",
    kn: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ರದ್ದುಗೊಂಡಿದೆ. 24 ಗಂಟೆಗಳಲ್ಲಿ ಪೂರ್ಣ ಮರುಪಾವತಿ ನೀಡಲಾಗುತ್ತದೆ."
  },
  emergency_sos_alert: {
    en: "Emergency SOS activated! Hospital trauma team and family caregiver have been alerted with your location.",
    hi: "आपातकालीन एसओएस सक्रिय! अस्पताल ट्रॉमा टीम और आपके परिवार को स्थान के साथ सूचित कर दिया गया है।",
    ta: "அவசர SOS இயக்கப்பட்டது! மருத்துவமனை குழு மற்றும் குடும்பத்தினருக்கு இடம் அனுப்பப்பட்டது.",
    te: "అత్యవసర SOS ప్రారంభమైంది! ఆసుపత్రి బృందం మరియు కుటుంబ సభ్యులకు సమాచారం అందించబడింది.",
    ml: "അടിയന്തര SOS സജീവമാക്കി! ആശുപത്രി സംഘത്തിനും കുടുംബത്തിനും വിവരങ്ങൾ കൈമാറി.",
    es: "¡SOS de emergencia activado! El equipo del hospital y su contacto han sido alertados con su ubicación.",
    kn: "ತುರ್ತು ಎಸ್‌ಒಎಸ್ ಸಕ್ರಿಯಗೊಂಡಿದೆ! ಆಸ್ಪತ್ರೆಯ ತುರ್ತು ತಂಡ ಮತ್ತು ಕುಟುಂಬಕ್ಕೆ ಮಾಹಿತಿ ಕಳುಹಿಸಲಾಗಿದೆ."
  }
};

/**
 * Universal Multilingual Speech Function
 * Takes either a phrase key, or direct text, or template and speaks it naturally in the target language.
 */
export const speak = (textOrKey, lang = 'en', isElderMode = false, params = {}) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  // Resolve localized text if textOrKey matches a known phrase key
  let textToSpeak = textOrKey;

  if (voicePhrases[textOrKey]) {
    const phraseObj = voicePhrases[textOrKey];
    textToSpeak = phraseObj[lang] || phraseObj.en || textOrKey;
  } else if (typeof textOrKey === 'string') {
    // Check if the string matches an English translation directly
    const foundEntry = Object.values(voicePhrases).find(p => p.en && p.en.toLowerCase() === textOrKey.trim().toLowerCase());
    if (foundEntry && foundEntry[lang]) {
      textToSpeak = foundEntry[lang];
    }
  }

  // Interpolate any params (e.g. {token}, {doctor}, {room})
  if (params && typeof textToSpeak === 'string') {
    Object.keys(params).forEach(pKey => {
      textToSpeak = textToSpeak.replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey]);
    });
  }

  // Clean markdown or emojis that TTS engines shouldn't stutter over
  let cleanedText = (textToSpeak || '')
    .replace(/[*#_~`]/g, '')
    .replace(/[👉📍🛵💊🎉⚠️🚨🔍📅🗺️🚚🏛️🩺🦴❤️🛏️👶🔬🩻🧴]/g, '')
    .trim();

  if (!cleanedText) return;

  // Add natural clause spacing for human cadence
  cleanedText = cleanedText
    .replace(/\s*([,;:])\s*/g, '$1 ')
    .replace(/\s*([.!?])\s*/g, '$1 ');

  // Soft hospital guidance chime before voice
  playHospitalGuidanceChime();

  setTimeout(() => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      // Human conversational rate: warm, articulate cadence (slower for seniors)
      utterance.rate = isElderMode ? 0.84 : 0.90;
      utterance.pitch = 1.02; // Warm, friendly human inflection
      utterance.lang = langVoiceMap[lang] || 'en-US';

      // Apply native matching neural voice
      const matchingVoice = getMatchingVoice(lang);
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis unavailable or interrupted:', err);
    }
  }, 180);
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const startListening = (lang = 'en', onResult, onError) => {
  if (typeof window === 'undefined') return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langVoiceMap[lang] || 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };

      recognition.onerror = (err) => {
        if (onError) onError(err);
      };

      recognition.start();
      return recognition;
    } catch (e) {
      if (onError) onError(e);
    }
  } else {
    // Fallback simulation in current language
    const fallbackPrompts = {
      en: [
        "Which room is Dr. Rajesh Kumar in?",
        "How can I get medicines delivered to my home from hospital pharmacy?",
        "How to get free Govt treatment under Ayushman Bharat?",
        "When should I take my knee pain medicines?",
        "Guide me to Room 401 Dermatology"
      ],
      hi: [
        "डॉ. राजेश कुमार किस कमरे में हैं?",
        "अस्पताल फार्मेसी से घर पर दवाई कैसे मंगाएं?",
        "आयुष्मान भारत के तहत मुफ्त इलाज कैसे मिलेगा?",
        "घुटने के दर्द की दवा कब लेनी है?",
        "कमरा 401 त्वचा रोग क्लिनिक का रास्ता बताएं"
      ],
      ta: [
        "டாக்டர் ராஜேஷ் குமார் எந்த அறையில் உள்ளார்?",
        "மருந்தகத்திலிருந்து வீட்டிற்கு மருந்துகளை எப்படி டெலிவரி பெறுவது?",
        "ஆயுஷ்மான் பாரத் மூலம் இலவச சிகிச்சை எப்படி?",
        "மூட்டு வலி மருந்துகளை எப்போது சாப்பிட வேண்டும்?",
        "அறை 401 தோல் மருத்துவ கிளினிக் வழி காட்டவும்"
      ],
      te: [
        "డాక్టర్ రాజేష్ కుమార్ ఏ రూమ్‌లో ఉన్నారు?",
        "ఆసుపత్రి ఫార్మసీ నుండి ఇంటికి మందులు ఎలా ఆర్డర్ చేయాలి?",
        "ఆయుష్మాన్ భారత్ ద్వారా ఉచిత చికిత్స ఎలా పొందాలి?",
        "మోకాలి నొప్పుల మందులు ఎప్పుడు వేసుకోవాలి?",
        "రూమ్ 401 డెర్మటాలజీ మార్గం చూపించండి"
      ],
      ml: [
        "ഡോ. രാജേഷ് കുമാർ ഏത് മുറിയിലാണ്?",
        "ഫാർമസിയിൽ നിന്ന് വീട്ടിലേക്ക് മരുന്ന് എങ്ങനെ ലഭിക്കും?",
        "ആയുഷ്മാൻ ഭാരത് സൗജന്യ ചികിത്സ എങ്ങനെ നേടാം?",
        "മുട്ടുവേദനയുടെ മരുന്ന് എപ്പോഴാണ് കഴിക്കേണ്ടത്?",
        "റൂം 401 ഡെർമറ്റോളജി വഴി കാണിക്കൂ"
      ],
      es: [
        "¿En qué habitación está el Dr. Rajesh Kumar?",
        "¿Cómo solicito la entrega de medicinas a domicilio?",
        "¿Cómo obtengo subsidios de salud para adultos mayores?",
        "¿A qué hora debo tomar las pastillas para el dolor de rodilla?",
        "Guíame a la Habitación 401 de Dermatología"
      ],
      kn: [
        "ಡಾ. ರಾಜೇಶ್ ಕುಮಾರ್ ಯಾವ ಕೋಣೆಯಲ್ಲಿದ್ದಾರೆ?",
        "ಮನೆಗೆ ಔಷಧ ವಿತರಣೆ ಪಡೆಯುವುದು ಹೇಗೆ?",
        "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಉಚಿತ ಚಿಕಿತ್ಸೆ ಹೇಗೆ ಪಡೆಯುವುದು?",
        "ಮಂಡಿ ನೋವಿನ ಔಷಧ ಯಾವಾಗ ತೆಗೆದುಕೊಳ್ಳಬೇಕು?",
        "ಕೋಣೆ 401 ಚರ್ಮರೋಗ ಕ್ಲಿನಿಕ್ ಮಾರ್ಗ ತೋರಿಸಿ"
      ]
    };

    const prompts = fallbackPrompts[lang] || fallbackPrompts.en;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setTimeout(() => {
      if (onResult) onResult(randomPrompt);
    }, 1200);
  }
};

/**
 * Multilingual AI Bot Response Engine
 * Returns accurate, localized responses in Hindi, Tamil, Telugu, Malayalam, Spanish, Kannada, and English.
 */
export const getAiBotResponse = (query, lang = 'en') => {
  const q = (query || '').toLowerCase().trim();

  // 1. Delivery & Pharmacy Orders
  if (q.includes('delivery') || q.includes('home') || q.includes('courier') || q.includes('doorstep') || q.includes('order') ||
      q.includes('डिलीवरी') || q.includes('घर') || q.includes('டெலிவரி') || q.includes('வீடு') || q.includes('డెలివరీ') || q.includes('ഡെലിവറി') || q.includes('entrega') || q.includes('ಡೆಲಿವರಿ')) {
    if (lang === 'hi') {
      return "जन औषधि अस्पताल फार्मेसी (कमरा 004) से आपकी दवाइयां डिलीवरी पार्टनर कार्तिक सेल्वाम द्वारा भेजी जा चुकी हैं। अनुमानित समय 12 मिनट है। आपका डिलीवरी ओटीपी 4829 है।";
    }
    if (lang === 'ta') {
      return "ஜன் ஔஷதி மருத்துவமனை மருந்தகத்திலிருந்து (அறை 004) உங்கள் மருந்துகள் டெலிவரி பார்ட்னர் கார்த்திக் செல்வம் மூலம் அனுப்பப்பட்டுள்ளது. வருகை நேரம் 12 நிமிடங்கள். உங்கள் டெலிவரி OTP 4829.";
    }
    if (lang === 'te') {
      return "జన్ ఔషధి హాస్పిటల్ ఫార్మసీ (రూమ్ 004) నుండి మీ మందులు డెలివరీ భాగస్వామి కార్తీక్ సెల్వం ద్వారా రవాణాలో ఉన్నాయి. రాక సమయం 12 నిమిషాలు. మీ డెలివరీ OTP 4829.";
    }
    if (lang === 'ml') {
      return "ജൻ ഔഷധി ഫാർമസിയിൽ (റൂം 004) നിന്ന് നിങ്ങളുടെ മരുന്നുകൾ കാർത്തിക് സെൽവം ഡെലിവറി ചെയ്യുന്നു. 12 മിനിറ്റിനകം എത്തും. നിങ്ങളുടെ സുരക്ഷിത OTP 4829 ആണ്.";
    }
    if (lang === 'es') {
      return "Sus medicamentos de la Farmacia Jan Aushadhi (Habitación 004) están en camino con el repartidor Karthik Selvam. Tiempo estimado: 12 minutos. Su código OTP es 4829.";
    }
    if (lang === 'kn') {
      return "ಆಸ್ಪತ್ರೆಯ ಜನ ಔಷಧಿ ಕೇಂದ್ರದಿಂದ (ಕೋಣೆ 004) ನಿಮ್ಮ ಔಷಧಿಗಳು ಡೆಲಿವರಿ ಪಾಲುದಾರ ಕಾರ್ತಿಕ್ ಸೆಲ್ವಂ ಮೂಲಕ ರವಾನೆಯಾಗಿವೆ. ಆಗಮನ ಸಮಯ 12 ನಿಮಿಷಗಳು. ನಿಮ್ಮ ಒಟಿಪಿ 4829.";
    }
    return "Your prescribed medicines from Jan Aushadhi Pharmacy (Room 004) are Out for Delivery by partner Karthik Selvam (TVS iQube). Estimated arrival is in 12 minutes. Your secure delivery OTP is 4829.";
  }

  // 2. Room 401: Dermatology
  if (q.includes('401') || q.includes('skin') || q.includes('derm') || q.includes('priya') || q.includes('त्वचा') || q.includes('தோல்') || q.includes('చర్మం') || q.includes('ചർമ്മം') || q.includes('piel') || q.includes('ಚರ್ಮ')) {
    if (lang === 'hi') return "डॉ. प्रिया रमेश का त्वचा रोग क्लिनिक पहली मंजिल पर कमरा 401 में है। लिफ्ट ए से पहली मंजिल पर जाएं और सीधा चलें।";
    if (lang === 'ta') return "டாக்டர் பிரியா ரமேஷ் அவர்களின் தோல் மருத்துவ கிளினிக் 1-வது மாடியில் அறை 401-ல் உள்ளது. லிஃப்ட் A வழியாக செல்லவும்.";
    if (lang === 'te') return "డాక్టర్ ప్రియా రమేష్ గారి డెర్మటాలజీ క్లినిక్ 1వ అంతస్తులో రూమ్ 401లో ఉంది. లిఫ్ట్ A ద్వారా వెళ్ళండి.";
    if (lang === 'ml') return "ഡോ. പ്രിയ രമേഷിന്റെ ഡെർമറ്റോളജി ക്ലിനിക്ക് ഒന്നാം നിലയിൽ റൂം 401-ലാണ്. ലിഫ്റ്റ് A വഴി പോകുക.";
    if (lang === 'es') return "La clínica dermatológica de la Dra. Priya Ramesh está en la Habitación 401 del 1.er piso. Tome el Ascensor A.";
    if (lang === 'kn') return "ಡಾ. ಪ್ರಿಯಾ ರಮೇಶ್ ಅವರ ಚರ್ಮರೋಗ ಕ್ಲಿನಿಕ್ 1ನೇ ಮಹಡಿಯಲ್ಲಿ ಕೋಣೆ 401 ರಲ್ಲಿದೆ. ಲಿಫ್ಟ್ ಎ ಮೂಲಕ ತೆರಳಿ.";
    return "Dr. Priya Ramesh's Dermatology Clinic is in Room 401 on the 1st Floor. Take Elevator A to the 1st Floor and walk straight.";
  }

  // 3. Room 402: Cardiology
  if (q.includes('402') || q.includes('cardio') || q.includes('heart') || q.includes('srinivas') || q.includes('दिल') || q.includes('இதயம்') || q.includes('గుండె') || q.includes('ഹൃദയം') || q.includes('corazón') || q.includes('ಹೃದಯ')) {
    if (lang === 'hi') return "कार्डियोलॉजी (हृदय रोग) क्लिनिक पहली मंजिल पर कमरा 402 में है। डॉ. के. श्रीनिवास परामर्श के लिए उपलब्ध हैं।";
    if (lang === 'ta') return "கார்டியாலஜி (இதய நோய்) கிளினிக் 1-வது மாடியில் அறை 402-ல் உள்ளது. டாக்டர் கே. சீனிவாஸ் தயாராக உள்ளார்.";
    if (lang === 'te') return "కార్డియాలజీ క్లినిక్ 1వ అంతస్తులో రూమ్ 402లో ఉంది. డాక్టర్ కె. శ్రీనివాస్ గారు అందుబాటులో ఉన్నారు.";
    if (lang === 'ml') return "കാർഡിയോളജി ക്ലിനിക്ക് ഒന്നാം നിലയിൽ റൂം 402-ലാണ്. ഡോ. കെ. ശ്രീനിവാസ് ലഭ്യമാണ്.";
    if (lang === 'es') return "La clínica de cardiología del Dr. K. Srinivas se encuentra en la Habitación 402 del 1.er piso.";
    if (lang === 'kn') return "ಕಾರ್ಡಿಯಾಲಜಿ (ಹೃದ್ರೋಗ) ಕ್ಲಿನಿಕ್ 1ನೇ ಮಹಡಿಯಲ್ಲಿ ಕೋಣೆ 402 ರಲ್ಲಿದೆ. ಡಾ. ಕೆ. ಶ್ರೀನಿವಾಸ್ ಲಭ್ಯವಿದ್ದಾರೆ.";
    return "Cardiology Clinic is in Room 402 on the 1st Floor, headed by Senior Cardiologist Dr. K. Srinivas.";
  }

  // 4. Room 403 / 104: Orthopedics (Dr. Rajesh Kumar)
  if (q.includes('403') || q.includes('104') || q.includes('ortho') || q.includes('knee') || q.includes('joint') || q.includes('rajesh') || q.includes('हड्डी') || q.includes('घुटने') || q.includes('எலும்பு') || q.includes('மூட்டு') || q.includes('ఎముక') || q.includes('ಅಸ್ಥಿ')) {
    if (lang === 'hi') return "डॉ. राजेश कुमार का ऑर्थोपेडिक (हड्डी व जोड़) क्लिनिक पहली मंजिल पर कमरा 403 में है। लिफ्ट ए लें और 10 मीटर दाएं मुड़ें।";
    if (lang === 'ta') return "டாக்டர் ராஜேஷ் குமார் அவர்களின் எலும்பு மற்றும் மூட்டு கிளினிக் 1-வது மாடியில் அறை 403-ல் உள்ளது. லிஃப்ட் A வழியாக சென்று வலதுபுறம் செல்லவும்.";
    if (lang === 'te') return "డాక్టర్ రాజేష్ కుమార్ గారి ఆర్థోపెడిక్ క్లినిక్ 1వ అంతస్తులో రూమ్ 403లో ఉంది. లిఫ్ట్ A నుంచి కుడివైపు వెళ్ళండి.";
    if (lang === 'ml') return "ഡോ. രാജേഷ് കുമാറിന്റെ ഓർത്തോപെഡിക് ക്ലിനിക്ക് ഒന്നാം നിലയിൽ റൂം 403-ലാണ്. ലിഫ്റ്റ് A വഴി വലത്തോട്ട് തിരിയുക.";
    if (lang === 'es') return "La clínica ortopédica del Dr. Rajesh Kumar está en la Habitación 403 del 1.er piso. Gire a la derecha al salir del ascensor.";
    if (lang === 'kn') return "ಡಾ. ರಾಜೇಶ್ ಕುಮಾರ್ ಅವರ ಮೂಳೆ ಮತ್ತು ಕೀಲು ರೋಗ ಕ್ಲಿನಿಕ್ 1ನೇ ಮಹಡಿಯಲ್ಲಿ ಕೋಣೆ 403 ರಲ್ಲಿದೆ. ಲಿಫ್ಟ್ ಎ ಮೂಲಕ ಬಲಕ್ಕೆ ತಿರುಗಿ.";
    return "Dr. Rajesh Kumar's Orthopedic Clinic is in Room 403 (OPD Wing) on the 1st Floor. From Elevator A, turn right 10 meters.";
  }

  // 5. Room 404: ICU
  if (q.includes('404') || q.includes('icu') || q.includes('critical') || q.includes('गंभीर') || q.includes('தீவிர') || q.includes('ఐసియు') || q.includes('ഐസിയു') || q.includes('uci')) {
    if (lang === 'hi') return "गहन चिकित्सा इकाई (ICU) दूसरी मंजिल पर कमरा 404 में स्थित है। यह 24 घंटे विशेष निगरानी के लिए है।";
    if (lang === 'ta') return "தீவிர சிகிச்சை பிரிவு (ICU) 2-வது மாடியில் அறை 404-ல் அமைந்துள்ளது. 24 மணி நேர சிறப்பு கண்காணிப்பு.";
    if (lang === 'te') return "ఇంటెన్సివ్ కేర్ యూనిట్ (ICU) 2వ అంతస్తులో రూమ్ 404లో ఉంది.";
    if (lang === 'ml') return "തീവ്രപരിചരണ വിഭാഗം (ICU) രണ്ടാം നിലയിൽ റൂം 404-ലാണ്.";
    if (lang === 'es') return "La Unidad de Cuidados Intensivos (UCI) está en la Habitación 404 del 2.º piso.";
    if (lang === 'kn') return "ತೀವ್ರ ನಿಗಾ ಘಟಕ (ICU) 2ನೇ ಮಹಡಿಯಲ್ಲಿ ಕೋಣೆ 404 ರಲ್ಲಿದೆ.";
    return "Intensive Care Unit (ICU) is located in Room 404 on the 2nd Floor.";
  }

  // 6. Room 405: Normal Patient Ward
  if (q.includes('405') || q.includes('ward') || q.includes('patient ward') || q.includes('वार्ड') || q.includes('வார்டு') || q.includes('వార్డు') || q.includes('വാർഡ്') || q.includes('sala')) {
    if (lang === 'hi') return "सामान्य मरीज वार्ड दूसरी मंजिल पर कमरा 405 में है।";
    if (lang === 'ta') return "சாதாரண நோயாளி வார்டு 2-வது மாடியில் அறை 405-ல் உள்ளது.";
    if (lang === 'te') return "సాధారణ పేషెంట్ వార్డు 2వ అంతస్తులో రూమ్ 405లో ఉంది.";
    if (lang === 'ml') return "ജനറൽ പേഷ്യന്റ് വാർഡ് രണ്ടാം നിലയിൽ റൂം 405-ലാണ്.";
    if (lang === 'es') return "La Sala Normal de Pacientes se encuentra en la Habitación 405 del 2.º piso.";
    if (lang === 'kn') return "ಸಾಮಾನ್ಯ ರೋಗಿ ವಾರ್ಡ್ 2ನೇ ಮಹಡಿಯಲ್ಲಿ ಕೋಣೆ 405 ರಲ್ಲಿದೆ.";
    return "Normal Patient Ward is located in Room 405 on the 2nd Floor.";
  }

  // 7. Rooms 406 - 410: Postnatal Maternity Wards
  if (q.includes('406') || q.includes('407') || q.includes('408') || q.includes('409') || q.includes('410') || q.includes('postnatal') || q.includes('maternity') || q.includes('baby') || q.includes('प्रसूति') || q.includes('மகப்பேறு') || q.includes('తల్లి') || q.includes('പ്രസവ') || q.includes('maternidad') || q.includes('ತಾಯಿ')) {
    if (lang === 'hi') return "प्रसूति एवं नवजात शिशु वार्ड तीसरी मंजिल पर कमरा 406 से 410 तक स्थित हैं। लिफ्ट ए से तीसरी मंजिल पर जाएं।";
    if (lang === 'ta') return "பிரசவத்திற்கு பிந்தைய தாய்-சேய் வார்டுகள் 3-வது மாடியில் அறை 406 முதல் 410 வரை உள்ளன. லிஃப்ட் A வழியாக செல்லவும்.";
    if (lang === 'te') return "పోస్ట్ నాటల్ ప్రసూతి వార్డులు 3వ అంతస్తులో రూమ్ 406 నుండి 410 వరకు ఉన్నాయి.";
    if (lang === 'ml') return "പോസ്റ്റ്നാറ്റൽ പ്രസവ വാർഡുകൾ മൂന്നാം നിലയിൽ റൂം 406 മുതൽ 410 വരെയാണ്.";
    if (lang === 'es') return "Las Salas de Maternidad y Posparto están en el 3.er piso, Habitaciones 406 a 410.";
    if (lang === 'kn') return "ಪ್ರಸವಾನಂತರ ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ವಾರ್ಡ್‌ಗಳು 3ನೇ ಮಹಡಿಯಲ್ಲಿ ಕೋಣೆ 406 ರಿಂದ 410 ರವರೆಗೆ ಇವೆ.";
    return "Postnatal Maternity Wards are located on the 3rd Floor in Rooms 406 to 410.";
  }

  // 8. Government Health Schemes & Subsidies
  if (q.includes('scheme') || q.includes('ayushman') || q.includes('free') || q.includes('cost') || q.includes('discount') || q.includes('subsidy') ||
      q.includes('योजना') || q.includes('आयुष्मान') || q.includes('திட்டம்') || q.includes('రాయితీ') || q.includes('പദ്ധതി') || q.includes('descuento') || q.includes('ಯೋಜನೆ')) {
    if (lang === 'hi') return "आयुष्मान भारत योजना और वरिष्ठ नागरिक कल्याण के अंतर्गत आपको ओपीडी परामर्श पर 50% छूट और जन औषधि फार्मेसी से दवाओं पर 90% तक की छूट मिलती है।";
    if (lang === 'ta') return "ஆயுஷ்மான் பாரத் மற்றும் முதியோர் நலத்திட்டத்தின் கீழ் OPD ஆலோசனைக்கு 50% கட்டண சலுகையும், ஜன் ஔஷதி மருந்துகளுக்கு 90% வரை தள்ளுபடியும் கிடைக்கும்.";
    if (lang === 'te') return "ఆయుష్మాన్ భారత్ మరియు సీనియర్ సిటిజన్ పథకాల ద్వారా మీకు OPD ఫీజులో 50% తగ్గింపు మరియు జెనరిక్ మందులపై 90% వరకు రాయితీ లభిస్తుంది.";
    if (lang === 'ml') return "ആയുഷ്മാൻ ഭാരത് പദ്ധതി വഴി ഒപിഡി കൺസൾട്ടേഷനിൽ 50% ഇളവും ജൻ ഔഷധി മരുന്നുകൾക്ക് 90% വരെ വിലക്കുറവും ലഭിക്കും.";
    if (lang === 'es') return "Bajo los convenios de salud y descuentos para adultos mayores, usted recibe 50% de descuento en consultas y hasta 90% en farmacia genérica.";
    if (lang === 'kn') return "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಮತ್ತು ಹಿರಿಯ ನಾಗರಿಕ ಯೋಜನೆಯಡಿ ಒಪಿಡಿ ಶುಲ್ಕದಲ್ಲಿ 50% ರಿಯಾಯಿತಿ ಮತ್ತು ಜನ ಔಷಧಿ ಮಳಿಗೆಯಲ್ಲಿ 90% ವರೆಗೆ ಉಳಿತಾಯ ಸಿಗುತ್ತದೆ.";
    return "Under Ayushman Bharat PM-JAY and Senior Citizen Welfare Concessions, you receive 50% discount on OPD consultations and up to 90% savings on generic medications.";
  }

  // 9. Medicine Reminders & Dosage
  if (q.includes('medicine') || q.includes('pill') || q.includes('dosage') || q.includes('दवा') || q.includes('மருந்து') || q.includes('మందు') || q.includes('മരുന്ന്') || q.includes('medicamento') || q.includes('ಮಾತ್ರೆ')) {
    if (lang === 'hi') return "आपकी आज की दवाएं: सुबह नाश्ते के बाद ग्लूकोसामाइन, नाश्ते से पहले पेंटोप्राजोल, दोपहर में कैल्सीमैक्स और रात को डिनर के बाद डायसेरिन। आप होम डिलीवरी भी मंगवा सकते हैं।";
    if (lang === 'ta') return "உங்கள் இன்றைய மருந்துகள்: காலை உணவுக்குப் பின் குளுக்கோசமைன், உணவுக்கு முன் பான்டோபிரசோல், மதியம் கால்சியம், இரவில் டயாசெரின். வீட்டு டெலிவரியும் பெறலாம்.";
    if (lang === 'te') return "మీ నేటి మందులు: ఉదయం గ్లూకోసమైన్, ఆహారానికి ముందు పాంటోప్రజోల్, మధ్యాహ్నం కాల్షియం, రాత్రి డయాసిరిన్. మీరు హోమ్ డెలివరీ ఆర్డర్ చేయవచ్చు.";
    if (lang === 'ml') return "ഇന്നത്തെ മരുന്നുകൾ: രാവിലെ ഗ്ലൂക്കോസാമൈൻ, ഭക്ഷണത്തിന് മുമ്പ് പാന്റോപ്രാസോൾ, ഉച്ചയ്ക്ക് കാൽസ്യം, രാത്രി ഡയസെറിൻ. ഹോം ഡെലിവറി ഓർഡർ ചെയ്യാം.";
    if (lang === 'es') return "Sus medicamentos de hoy: Glucosamina por la mañana con desayuno, Pantoprazol antes de comer, Calcio al almuerzo y Diacereína por la noche.";
    if (lang === 'kn') return "ಇಂದಿನ ಔಷಧಿಗಳು: ಬೆಳಿಗ್ಗೆ ಗ್ಲುಕೋಸಮೈನ್, ಉಪಾಹಾರದ ಮೊದಲು ಪ್ಯಾಂಟೊಪ್ರಜೋಲ್, ಮಧ್ಯಾಹ್ನ ಕ್ಯಾಲ್ಸಿಯಂ, ರಾತ್ರಿ ಡಯಾಸೆರಿನ್. ನೀವು ಮನೆಗೆ ಡೆಲಿವರಿ ಪಡೆಯಬಹುದು.";
    return "Your daily medicines: Glucosamine (Morning after breakfast), Pantoprazole (Morning before food), Calcimax (Afternoon after lunch), and Diacerein (Night after dinner).";
  }

  // 10. Emergency SOS
  if (q.includes('emergency') || q.includes('sos') || q.includes('ambulance') || q.includes('आपातकालीन') || q.includes('அவசரம்') || q.includes('అత్యవసరం') || q.includes('അടിയന്തരം') || q.includes('urgencia')) {
    if (lang === 'hi') return "गंभीर आपात स्थिति में तुरंत लाल एसओएस (SOS) बटन दबाएं या राष्ट्रीय एम्बुलेंस 108 पर कॉल करें। ट्रॉमा सेंटर भूतल पर कमरा 001 में है।";
    if (lang === 'ta') return "அவசர சிகிச்சைக்கு உடனே சிவப்பு SOS பட்டனை அழுத்தவும் அல்லது ஆம்புலன்ஸ் 108 ஐ அழைக்கவும். அவசர பிரிவு தரைத்தளத்தில் அறை 001-ல் உள்ளது.";
    if (lang === 'te') return "తీవ్ర అత్యవసర పరిస్థితుల్లో వెంటనే ఎరుపు SOS బటన్ నొక్కండి లేదా అంబులెన్స్ 108 కి కాల్ చేయండి. అత్యవసర గది గ్రౌండ్ ఫ్లోర్‌లో రూమ్ 001.";
    if (lang === 'ml') return "അടിയന്തര സാഹചര്യങ്ങളിൽ ചുവപ്പ് SOS ബട്ടൺ അമർത്തുക അല്ലെങ്കിൽ ആംബുലൻസ് 108 വിളിക്കുക. ട്രോമ കെയർ ഗ്രൗണ്ട് ഫ്ലോർ റൂം 001-ലാണ്.";
    if (lang === 'es') return "Para emergencias médicas, presione el botón rojo de SOS o llame al 112 / 108. La sala de Urgencias está en la Planta Baja, Habitación 001.";
    if (lang === 'kn') return "ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ ಕೆಂಪು ಎಸ್‌ಒಎಸ್ ಬಟನ್ ಒತ್ತಿ ಅಥವಾ ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ 108 ಕರೆ ಮಾಡಿ. ತುರ್ತು ಘಟಕ ನೆಲ ಮಹಡಿಯಲ್ಲಿ ಕೋಣೆ 001 ರಲ್ಲಿದೆ.";
    return "For medical emergencies, tap the red SOS button immediately or call Ambulance at 108. Trauma Ward is in Room 001 on the Ground Floor.";
  }

  // Default Fallback
  if (lang === 'hi') {
    return "मैं आपका हेलोडॉक अस्पताल एवं स्वास्थ्य गाइड हूँ। आप मुझसे कमरा नंबर (जैसे 401, 402, 403), डॉक्टर अपॉइंटमेंट, घर पर दवा डिलीवरी या सरकारी योजनाओं के बारे में पूछ सकते हैं।";
  }
  if (lang === 'ta') {
    return "நான் உங்கள் HeloDoc மருத்துவமனை வழிகாட்டி. அறை எண்கள் (401, 402, 403), மருத்துவர் சந்திப்பு, வீட்டு மருந்து டெலிவரி அல்லது அரசு திட்டங்கள் குறித்து என்னிடம் கேட்கலாம்.";
  }
  if (lang === 'te') {
    return "నేను మీ HeloDoc ఆసుపత్రి గైడ్‌ని. రూమ్ నంబర్లు (401, 402, 403), డాక్టర్ అపాయింట్‌మెంట్‌లు, ఇంటికి మందుల డెలివరీ లేదా ప్రభుత్వ పథకాల గురించి నన్ను అడగవచ్చు.";
  }
  if (lang === 'ml') {
    return "ഞാൻ നിങ്ങളുടെ HeloDoc ഹോസ്പിറ്റൽ ഗൈഡ് ആണ്. മുറി നമ്പറുകൾ (401, 402), അപ്പോയിന്റ്മെന്റുകൾ, മരുന്ന് ഡെലിവറി, സർക്കാർ പദ്ധതികൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.";
  }
  if (lang === 'es') {
    return "Soy su asistente médico HeloDoc. Puede preguntarme sobre habitaciones (ej. 401, 402, 403), citas con especialistas, entrega de medicinas a domicilio o descuentos.";
  }
  if (lang === 'kn') {
    return "ನಾನು ನಿಮ್ಮ HeloDoc ಆಸ್ಪತ್ರೆ ಮಾರ್ಗದರ್ಶಿ. ಕೊಠಡಿ ಸಂಖ್ಯೆಗಳು (401, 402, 403), ವೈದ್ಯರ ಭೇಟಿ, ಮನೆಗೆ ಔಷಧ ವಿತರಣೆ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು.";
  }
  return "I am your HeloDoc Hospital & Medicine Guide. You can ask me for 3D room directions (e.g. Room 401, 402, 403, 404, 405, 406-410), home medicine delivery status, doctor appointments, or government health schemes.";
};
