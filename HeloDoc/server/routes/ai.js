import { Router } from 'express';

const router = Router();

// Red-flag emergency keywords across all 7 supported languages
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'shortness of breath', 'cannot breathe', 'difficulty breathing',
  'stroke', 'face drooping', 'arm weakness', 'slurred speech', 'sudden blindness',
  'heavy bleeding', 'unconscious', 'passed out', 'seizure', 'severe trauma',
  // Hindi
  'सीने में दर्द', 'सांस लेने में तकलीफ', 'सांस फूलना', 'लकवा', 'बेहोश', 'दौरा', 'ज्यादा खून',
  // Tamil
  'நெஞ்சு வலி', 'மாரடைப்பு', 'மூச்சுத் திணறல்', 'மயக்கம்', 'பக்கவாதம்', 'அதிக ரத்தப்போக்கு',
  // Telugu
  'ఛాతీ నొప్పి', 'గుండెపోటు', 'శ్వాస ఆడకపోవడం', 'స్పృహ తప్పడం', 'పక్షవాతం',
  // Malayalam
  'നെഞ്ചുവേദന', 'ശ്വാസതടസ്സം', 'ഹൃദയാഘാതം', 'ബോധക്ഷയം', 'പക്ഷാഘാതം',
  // Spanish
  'dolor de pecho', 'infarto', 'dificultad para respirar', 'desmayo', 'derrame cerebral', 'sangrado grave',
  // Kannada
  'ಎದೆ ನೋವು', 'ಉಸಿರಾಟದ ತೊಂದರೆ', 'ಹೃದಯಾಘಾತ', 'ಪ್ರಜ್ಞೆ ತಪ್ಪುವುದು'
];

const checkEmergency = (query) => {
  const lower = (query || '').toLowerCase();
  for (const kw of EMERGENCY_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) {
      return { isEmergency: true, keyword: kw };
    }
  }
  return { isEmergency: false };
};

// POST /api/ai/chat - AI Medical Triage & Guidance
router.post('/chat', (req, res) => {
  const { query, language = 'en' } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, error: 'Query text is required' });
  }

  const triage = checkEmergency(query);

  if (triage.isEmergency) {
    const emergencyResponses = {
      en: "🚨 CRITICAL EMERGENCY ALERT: Your symptoms indicate a potential medical emergency. Please press the red SOS button or proceed immediately to Emergency Room 001 on the Ground Floor.",
      hi: "🚨 गंभीर आपातकालीन चेतावनी: आपके लक्षण संभावित आपातकाल का संकेत देते हैं। कृपया तुरंत लाल एसओएस बटन दबाएं या भूतल पर आपातकालीन कमरा 001 पर जाएं।",
      ta: "🚨 அவசர சிகிச்சை எச்சரிக்கை: உங்கள் அறிகுறிகள் தீவிர நிலையை குறிக்கின்றன. தயவுசெய்து சிவப்பு SOS பொத்தானை அழுத்தவும் அல்லது தரைத்தளத்தில் உள்ள அவசர சிகிச்சை அறை 001-க்கு செல்லவும்.",
      te: "🚨 అత్యవసర హెచ్చరిక: మీ లక్షణాలు అత్యవసర పరిస్థితిని సూచిస్తున్నాయి. దయచేసి ఎరుపు SOS బటన్ నొక్కండి లేదా గ్రౌండ్ ఫ్లోర్‌లోని రూమ్ 001 కి వెళ్ళండి.",
      ml: "🚨 അടിയന്തര മുന്നറിയിപ്പ്: നിങ്ങളുടെ ലക്ഷണങ്ങൾ അടിയന്തര ചികിത്സ ആവശ്യപ്പെടുന്നതാണ്. ദയവായി SOS ബട്ടൺ അമർത്തുക അല്ലെങ്കിൽ റൂം 001-ലേക്ക് പോകുക.",
      es: "🚨 ALERTA DE EMERGENCIA: Sus síntomas pueden indicar una urgencia médica. Presione el botón rojo SOS o acuda de inmediato a Urgencias (Sala 001) en la Planta Baja.",
      kn: "🚨 ತುರ್ತು ಎಚ್ಚರಿಕೆ: ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳು ತುರ್ತು ಚಿಕಿತ್ಸೆಯನ್ನು ಸೂಚಿಸುತ್ತವೆ. ದಯವಿಟ್ಟು ಕೆಂಪು SOS ಬಟನ್ ಒತ್ತಿ ಅಥವಾ ನೆಲಮಹಡಿಯ ತುರ್ತು ಕೊಠಡಿ 001 ಕ್ಕೆ ತೆರಳಿ."
    };

    const alertMsg = emergencyResponses[language] || emergencyResponses.en;
    return res.json({
      success: true,
      isEmergency: true,
      matchedKeyword: triage.keyword,
      recommendedRoom: 'Room 001 (Emergency ER)',
      recommendedFloor: 'Ground Floor',
      reply: alertMsg,
      guidance: alertMsg
    });
  }

  // Clinical Guidance Router
  let guidance = "";
  let recommendedRoom = "Room 105 (General Medicine)";
  let recommendedFloor = "1st Floor (OPD)";

  const q = query.toLowerCase();

  // ICU / Critical Care / Room 404
  if (q.includes('404') || q.includes('icu') || q.includes('critical care') || q.includes('வென்டிலேட்டர்') || q.includes('आईसीयू')) {
    recommendedRoom = "Room 404 (Intensive Care Unit - ICU)";
    recommendedFloor = "2nd Floor (Specialty)";
    guidance = language === 'ta'
      ? "தீவிர சிகிச்சை பிரிவு (ICU Room 404) 2-வது மாடியில் உள்ளது. இது உயர்தர வென்டிலேட்டர் மற்றும் கண்காணிப்பு உபகரணங்களுடன் செயல்படுகிறது."
      : language === 'hi'
      ? "सघन चिकित्सा इकाई (ICU कमरा 404) दूसरी मंजिल पर स्थित है। वेंटिलेटर और चौबीसों घंटे आपातकालीन क्रिटिकल केयर उपलब्ध है।"
      : "The Intensive Care Unit (ICU Room 404) is located on the 2nd Floor (Specialty Care Wing). It is fully equipped with multipara monitors, ventilators, and 24x7 critical care specialists.";
  } else if (q.includes('401') || q.includes('skin') || q.includes('derm') || q.includes('தோல்') || q.includes('त्वचा')) {
    recommendedRoom = "Room 401 (Dermatology Clinic)";
    recommendedFloor = "1st Floor (OPD)";
    guidance = language === 'ta'
      ? "டாக்டர் பிரியா ரமேஷ் அவர்களின் தோல் மருத்துவ கிளினிக் (Dermatology) அறை 401-ல் உள்ளது. லிஃப்ட் A வழியாக சென்று வலதுபுறம் செல்லவும்."
      : language === 'hi'
      ? "त्वचा रोग क्लिनिक (Dermatology Clinic) पहली मंजिल पर कमरा 401 में उपलब्ध है।"
      : "Dr. Priya Ramesh's Dermatology Clinic is located in Room 401 on the 1st Floor.";
  } else if (q.includes('knee') || q.includes('joint') || q.includes('bone') || q.includes('ortho') || q.includes('முழங்கால்') || q.includes('घुटने') || q.includes('हड्डी')) {
    recommendedRoom = "Room 104 (Dr. Rajesh Kumar - Orthopedics)";
    recommendedFloor = "1st Floor (OPD)";
    guidance = language === 'ta'
      ? "முழங்கால் மற்றும் மூட்டு வலிக்கு, 1-வது மாடியில் உள்ள அறை 104-ல் டாக்டர் ராஜேஷ் குமார் அவர்களை அணுகலாம்."
      : language === 'hi'
      ? "घुटने और जोड़ों के दर्द के लिए पहली मंजिल पर कमरा 104 में डॉ. राजेश कुमार से परामर्श करें।"
      : "For knee joint pain, we recommend consulting Dr. Rajesh Kumar in Room 104 on the 1st Floor.";
  } else if (q.includes('heart') || q.includes('bp') || q.includes('pressure') || q.includes('cardio') || q.includes('ரத்த அழுத்தம்') || q.includes('இதயம்') || q.includes('दिल')) {
    recommendedRoom = "Room 201 (Cardiology Clinic)";
    recommendedFloor = "2nd Floor (Specialty)";
    guidance = language === 'ta'
      ? "இதய பரிசோதனை மற்றும் ரத்த அழுத்தத்திற்கு, 2-வது மாடியில் உள்ள அறை 201 அல்லது 402-க்கு செல்லவும்."
      : language === 'hi'
      ? "हृदय जांच और बीपी के लिए दूसरी मंजिल पर कमरा 201 या कमरा 402 कार्डियोलॉजी क्लिनिक में जाएं।"
      : "For heart checkups or blood pressure monitoring, visit Cardiology Clinic in Room 201 / Room 402 on the 2nd Floor.";
  } else if (q.includes('medicine') || q.includes('pharmacy') || q.includes('மருந்து') || q.includes('दवा')) {
    recommendedRoom = "Room 004 (Jan Aushadhi Generic Pharmacy)";
    recommendedFloor = "Ground Floor";
    guidance = language === 'ta'
      ? "ஜன் ஔஷதி மலிவு விலை மருந்தகம் தரைத்தளத்தில் அறை 004-ல் உள்ளது (90% வரை தள்ளுபடி)."
      : language === 'hi'
      ? "जन औषधि जेनेरिक फार्मेसी भूतल पर कमरा 004 में उपलब्ध है (90% तक की बचत)।"
      : "You can collect affordable generic medicines at Jan Aushadhi Kendra in Room 004 on the Ground Floor with up to 90% savings.";
  } else {
    guidance = language === 'ta'
      ? "உங்கள் பொது உடல்நல பரிசோதனைக்கு 1-வது மாடியில் உள்ள அறை 105-ல் பொது மருத்துவரை அணுகலாம்."
      : language === 'hi'
      ? "सामान्य स्वास्थ्य जांच के लिए पहली मंजिल पर कमरा 105 में संपर्क करें।"
      : "For general health checkups, please visit General Medicine in Room 105 on the 1st Floor.";
  }

  res.json({
    success: true,
    isEmergency: false,
    recommendedRoom,
    recommendedFloor,
    reply: guidance,
    guidance
  });
});

export default router;
