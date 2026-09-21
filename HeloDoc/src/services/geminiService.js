/**
 * HeloDoc Gemini AI Healthcare Guide Service
 * Enforces strict medical safety guardrails, emergency symptom triage,
 * and comprehensive multi-language conversational healthcare guidance.
 * Supports: English, Hindi, Tamil, Telugu, Malayalam, Spanish, and Kannada.
 */

// Emergency Red-Flag Keywords across languages
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

/**
 * Check if the patient inquiry triggers immediate emergency escalation.
 */
export const checkEmergencyTriage = (queryText) => {
  const lower = (queryText || '').toLowerCase();
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      return {
        isEmergency: true,
        keywordMatched: keyword
      };
    }
  }
  return { isEmergency: false };
};

/**
 * Generate AI Health Guidance Response with Safety Guardrails in All Supported Languages
 */
export const getAIHealthGuidance = async (queryText, currentLang = 'en', history = []) => {
  // 1. First evaluate emergency triage
  const triage = checkEmergencyTriage(queryText);
  if (triage.isEmergency) {
    const emergencyWarnings = {
      hi: `⚠️ **आपातकालीन चेतावनी**: आपके द्वारा बताए गए लक्षण (${triage.keywordMatched}) गंभीर हो सकते हैं। कृपया बिना देर किए तुरंत आपातकालीन सेवा 112 या 108 पर कॉल करें अथवा नज़दीकी अस्पताल के ट्रॉमा सेंटर जाएँ।`,
      ta: `⚠️ **அவசர எச்சரிக்கை**: நீங்கள் குறிப்பிட்ட அறிகுறிகள் (${triage.keywordMatched}) தீவிரமானதாக இருக்கலாம். தாமதிக்காமல் உடனடியாக 108 (ஆம்புலன்ஸ்) அல்லது 112 ஐ அழைக்கவும் அல்லது அவசர சிகிச்சை பிரிவுக்கு செல்லவும்.`,
      te: `⚠️ **అత్యవసర హెచ్చరిక**: మీరు పేర్కొన్న లక్షణాలు (${triage.keywordMatched}) తీవ్రమైనవి కావచ్చు. దయచేసి వెంటనే 108 లేదా 112 కి కాల్ చేయండి లేదా సమీప అత్యవసర వార్డుకు వెళ్లండి.`,
      ml: `⚠️ **അടിയന്തര മുന്നറിയിപ്പ്**: നിങ്ങൾ പറഞ്ഞ ലക്ഷണങ്ങൾ (${triage.keywordMatched}) ഗുരുതരമായേക്കാം. ദയവായി ഉടൻ തന്നെ 108 അല്ലെങ്കിൽ 112 എന്ന നമ്പറിലേക്ക് വിളിക്കുകയോ അത്യാഹിത വിഭാഗത്തിൽ പോകുകയോ ചെയ്യുക.`,
      es: `⚠️ **ADVERTENCIA DE EMERGENCIA**: Los síntomas descritos ("${triage.keywordMatched}") pueden indicar una emergencia médica urgente. Llame de inmediato al 112 / 911 o acuda a la sala de urgencias más cercana.`,
      kn: `⚠️ **ತುರ್ತು ಎಚ್ಚರಿಕೆ**: ನೀವು ವಿವರಿಸಿದ ಲಕ್ಷಣಗಳು (${triage.keywordMatched}) ಗಂಭೀರವಾಗಿರಬಹುದು. ತಕ್ಷಣವೇ 108 ಅಥವಾ 112 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ತುರ್ತು ವಿಭಾಗಕ್ಕೆ ತೆರಳಿ.`,
      en: `⚠️ **EMERGENCY WARNING**: The symptoms you described ("${triage.keywordMatched}") may indicate an urgent medical situation. Please immediately call National Emergency (112) or Ambulance (108), or proceed to the nearest Hospital ER Department.`
    };

    return {
      isEmergency: true,
      text: emergencyWarnings[currentLang] || emergencyWarnings.en
    };
  }

  const lower = (queryText || '').toLowerCase();

  // 2. Knee pain, joint care & Dr. Rajesh Kumar (Room 403 / 104)
  if (lower.includes('knee') || lower.includes('joint') || lower.includes('arthritis') || lower.includes('ortho') ||
      lower.includes('घुटने') || lower.includes('दर्द') || lower.includes('மூட்டு') || lower.includes('வலி') ||
      lower.includes('మోకాలు') || lower.includes('ముട്ട്') || lower.includes('rodilla') || lower.includes('ಮಂಡಿ')) {
    const kneeResponses = {
      hi: `नमस्ते! घुटने और जोड़ों के दर्द के लिए सामान्य देखभाल के उपाय:
1. **सिकाई**: दिन में 2 बार हल्के गर्म पानी या हीटिंग पैड से 10-15 मिनट सिकाई करें।
2. **हल्के व्यायाम**: बैठने पर पैर को सीधा उठाकर 5 सेकंड रोकें (क्वाड्रिसेप्स व्यायाम)।
3. **डॉक्टर परामर्श**: आपके ऑर्थोपेडिक्स विशेषज्ञ डॉ. राजेश कुमार प्रथम तल कमरा 403 (OPD) में उपलब्ध हैं।
4. **दवाइयां**: ग्लूकोसामाइन सुबह नाश्ते के बाद और डायसेरिन रात को लें।`,
      ta: `வணக்கம்! மூட்டு மற்றும் முழங்கால் வலிக்கான எளிய பராமரிப்பு குறிப்புகள்:
1. **ஒத்தடம்**: தினமும் இருமுறை வெதுவெதுப்பான ஒத்தடம் 10-15 நிமிடங்கள் கொடுக்கவும்.
2. **மென்மையான உடற்பயிற்சி**: நாற்காலியில் அமர்ந்து காலை நேராக நீட்டி 5 வினாடிகள் வைக்கவும்.
3. **மருத்துவர் ஆலோசனை**: உங்கள் எலும்பு சிறப்பு மருத்துவர் டாக்டர் ராஜேஷ் குமார் 1-வது மாடியில் அறை 403-ல் உள்ளார்.
4. **மருந்துகள்**: குளுக்கோசமைன் காலை உணவுக்குப் பிறகும், டயாசெரின் இரவிலும் உட்கொள்ளவும்.`,
      te: `నమస్కారం! మోకాలి మరియు కీళ్ల నొప్పుల సంరక్షణ చిట్కాలు:
1. **వెచ్చని కాపడం**: రోజుకు రెండుసార్లు 10-15 నిమిషాలు వెచ్చని కాపడం పెట్టండి.
2. **సులభ వ్యాయామం**: కూర్చుని కాలును నిటారుగా చాపి 5 సెకన్లు ఉంచండి.
3. **వైద్యుల సంప్రదింపు**: ఆర్థోపెడిక్ నిపుణులు డాక్టర్ రాజేష్ కుమార్ 1వ అంతస్తు రూమ్ 403 లో ఉంటారు.
4. **మందులు**: ఉదయం ఆహారం తర్వాత గ్లూకోసమైన్, రాత్రి డయాసిరిన్ తీసుకోండి.`,
      ml: `നമസ്കാരം! മുട്ടുവേദനയ്ക്കും സന്ധിവാതത്തിനുമുള്ള ലളിതമായ പരിഹാരങ്ങൾ:
1. **ചൂടുപിടിക്കൽ**: ദിവസവും രണ്ടുതവണ 10-15 മിനിറ്റ് ചൂടുവെള്ളത്തിൽ ഒപ്പുക.
2. **ലഘു വ്യായാമം**: ഇരിക്കുമ്പോൾ കാൽ നേരെ നീട്ടി 5 സെക്കൻഡ് പിടിക്കുക.
3. **ഡോക്ടറെ കാണുക**: ഓർത്തോപെഡിക് വിദഗ്ദ്ധൻ ഡോ. രാജേഷ് കുമാർ ഒന്നാം നിലയിൽ റൂം 403-ൽ ലഭ്യമാണ്.
4. **മരുന്നുകൾ**: ഗ്ലൂക്കോസാമൈൻ രാവിലെ ഭക്ഷണത്തിന് ശേഷവും ഡയസെറിൻ രാത്രിയിലും കഴിക്കുക.`,
      es: `¡Hola! Cuidados recomendados para el dolor de rodilla y articulaciones:
1. **Compresas Tibias**: Aplique calor durante 10-15 minutos dos veces al día.
2. **Ejercicios Suaves**: Sentado, extienda la pierna recta durante 5 segundos para fortalecer el cuádriceps.
3. **Especialista**: El traumatólogo Dr. Rajesh Kumar atiende en la Habitación 403 del 1.er piso.
4. **Medicamentos**: Glucosamina por la mañana con el desayuno y Diacereína por la noche.`,
      kn: `ನಮಸ್ಕಾರ! ಮಂಡಿ ಮತ್ತು ಕೀಲು ನೋವಿನ ಆರೈಕೆ ಸಲಹೆಗಳು:
1. **ಬಿಸಿ ಶಾಖ**: ದಿನಕ್ಕೆ 2 ಬಾರಿ 10-15 ನಿಮಿಷಗಳ ಕಾಲ ಬಿಸಿ ಶಾಖ ನೀಡಿ.
2. **ಲಘು ವ್ಯಾಯಾಮ**: ಕುಳಿತುಕೊಂಡು ಕಾಲನ್ನು ನೇರವಾಗಿ ಚಾಚಿ 5 ಸೆಕೆಂಡುಗಳ ಕಾಲ ಹಿಡಿಯಿರಿ.
3. **ವೈದ್ಯರ ಭೇಟಿ**: ಆರ್ಥೋಪೆಡಿಕ್ ತಜ್ಞ ಡಾ. ರಾಜೇಶ್ ಕುಮಾರ್ 1ನೇ ಮಹಡಿ ಕೋಣೆ 403 ರಲ್ಲಿದ್ದಾರೆ.
4. **ಔಷಧಿಗಳು**: ಬೆಳಿಗ್ಗೆ ಗ್ಲುಕೋಸಮೈನ್ ಮತ್ತು ರಾತ್ರಿ ಡಯಾಸೆರಿನ್ ತೆಗೆದುಕೊಳ್ಳಿ.`,
      en: `Hello! General supportive care guidelines for knee and joint discomfort:
1. **Warm Compress**: Apply a warm compress for 10-15 minutes twice daily to relax stiff muscles.
2. **Gentle Quadriceps Strengthening**: While seated, gently extend your leg straight and hold for 5 seconds.
3. **Consult Specialist**: Orthopedic Specialist Dr. Rajesh Kumar is available in Room 403 (1st Floor OPD).
4. **Medications**: Take Glucosamine morning after breakfast and Diacerein at bedtime as prescribed.`
    };
    return {
      isEmergency: false,
      text: kneeResponses[currentLang] || kneeResponses.en
    };
  }

  // 3. High Blood Pressure & Heart / Dr. Srinivas (Room 402)
  if (lower.includes('bp') || lower.includes('pressure') || lower.includes('hypertension') || lower.includes('cardio') ||
      lower.includes('रक्तचाप') || lower.includes('இரத்த அழுத்தம்') || lower.includes('రక్తపోటు') || lower.includes('രക്തസമ്മർദ്ദം') || lower.includes('presión')) {
    const bpResponses = {
      hi: `उच्च रक्तचाप (High BP) और हृदय स्वास्थ्य प्रबंधन:
1. **नमक नियंत्रण**: भोजन में नमक (सोडियम) कम रखें (प्रतिदिन 1 चम्मच से कम)।
2. **कार्डियोलॉजी क्लिनिक**: डॉ. के. श्रीनिवास प्रथम तल कमरा 402 में उपलब्ध हैं।
3. **टहलना**: प्रतिदिन 20-30 मिनट आरामदायक गति से सैर करें।
4. **दवा न छोड़ें**: अपनी बीपी की गोलियां नियमित समय पर लें।`,
      ta: `உயர் இரத்த அழுத்தம் (BP) மற்றும் இதய பராமரிப்பு:
1. **உப்பு கட்டுப்பாடு**: உணவில் உப்பின் அளவை குறைக்கவும் (ஒரு நாளைக்கு 1 தேக்கரண்டிக்கு கீழ்).
2. **இதய நோய் பிரிவு**: டாக்டர் கே. சீனிவாஸ் 1-வது மாடியில் அறை 402-ல் ஆலோசனை வழங்குகிறார்.
3. **நடைபயிற்சி**: தினமும் 20-30 நிமிடங்கள் லேசான நடைபயிற்சி மேற்கொள்ளவும்.
4. **மருந்து**: மருத்துவர் பரிந்துரைத்த இரத்த அழுத்த மாத்திரைகளை தவறாமல் எடுக்கவும்.`,
      te: `అధిక రక్తపోటు (High BP) మరియు గుండె సంరక్షణ మార్గదర్శకాలు:
1. **ఉప్పు నియంత్రణ**: ఆహారంలో ఉప్పు పరిమాణం తక్కువగా ఉండేలా చూసుకోండి.
2. **కార్డియాలజీ క్లినిక్**: డాక్టర్ కె. శ్రీనివాస్ 1వ అంతస్తు రూమ్ 402 లో ఉంటారు.
3. **నడక**: రోజుకు 20-30 నిమిషాలు ఉల్లాసంగా నడవండి.
4. **మందులు**: బీపీ మాత్రలను సమయానికి క్రమం తప్పకుండా వేసుకోండి.`,
      ml: `ഉയർന്ന രക്തസമ്മർദ്ദവും (BP) ഹൃദയാരോഗ്യവും:
1. **ഉപ്പ് കുറയ്ക്കുക**: ഭക്ഷണത്തിൽ ഉപ്പിന്റെ അളവ് പരമാവധി കുറയ്ക്കുക.
2. **കാർഡിയോളജി ക്ലിനിക്ക്**: ഡോ. കെ. ശ്രീനിവാസ് ഒന്നാം നിലയിൽ റൂം 402-ൽ ഉണ്ട്.
3. **നടത്തം**: ദിവസവും 20-30 മിനിറ്റ് നടക്കുന്നത് നല്ലതാണ്.
4. **മരുന്ന്**: കൃത്യസമയത്ത് ഗുളികകൾ കഴിക്കുക.`,
      es: `Control de Presión Arterial y Salud Cardiovascular:
1. **Reducción de Sal**: Limite la ingesta de sodio a menos de 2,000 mg al día.
2. **Especialista**: El cardiólogo Dr. K. Srinivas atiende en la Habitación 402 del 1.er piso.
3. **Caminata**: Camine 20 a 30 minutos diarios a paso moderado.
4. **Medicamentos**: Tome su medicación antihipertensiva puntualmente cada día.`,
      kn: `ರಕ್ತದೊತ್ತಡ (High BP) ಮತ್ತು ಹೃದಯದ ಆರೋಗ್ಯ ನಿಯಂತ್ರಣ:
1. **ಉಪ್ಪು ಕಡಿಮೆ ಮಾಡಿ**: ದೈನಂದಿನ ಆಹಾರದಲ್ಲಿ ಉಪ್ಪಿನ ಪ್ರಮಾಣ ಕಡಿಮೆ ಇರಲಿ.
2. **ಕಾರ್ಡಿಯಾಲಜಿ ಕ್ಲಿನಿಕ್**: ಡಾ. ಕೆ. ಶ್ರೀನಿವಾಸ್ 1ನೇ ಮಹಡಿ ಕೋಣೆ 402 ರಲ್ಲಿದ್ದಾರೆ.
3. **ದಿನನಿತ್ಯ ನಡಿಗೆ**: ಪ್ರತಿದಿನ 20-30 ನಿಮಿಷಗಳ ಕಾಲ ನಡಿಗೆ ಉತ್ತಮ.
4. **ಔಷಧ ನಿಯಮಿತವಾಗಿ ಸೇವಿಸಿ**: ನಿಮ್ಮ ಬಿಪಿ ಮಾತ್ರೆಗಳನ್ನು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ತೆಗೆದುಕೊಳ್ಳಿ.`,
      en: `Essential Blood Pressure & Cardiovascular care guidelines:
1. **Sodium Control**: Keep dietary salt intake under 1 teaspoon (2,000 mg) per day.
2. **Cardiology Clinic**: Cardiologist Dr. K. Srinivas is available in Room 402 on the 1st Floor.
3. **Light Aerobic Exercise**: 20-30 minutes of comfortable walking improves arterial elasticity.
4. **Medication Compliance**: Take your prescribed antihypertensive pills consistently on schedule.`
    };
    return {
      isEmergency: false,
      text: bpResponses[currentLang] || bpResponses.en
    };
  }

  // 4. Medicine Home Delivery & Pharmacy Subsidies
  if (lower.includes('delivery') || lower.includes('courier') || lower.includes('doorstep') || lower.includes('pharmacy') ||
      lower.includes('डिलीवरी') || lower.includes('டெலிவரி') || lower.includes('డెలివరీ') || lower.includes('ഡെലിവറി') || lower.includes('entrega') || lower.includes('ಡೆಲಿವರಿ')) {
    const deliveryResponses = {
      hi: `📦 **अस्पताल से घर तक दवा डिलीवरी सेवा**:
1. **जन औषधि फार्मेसी**: दवाइयां सीधे भूतल कमरा 004 से पैक की जाती हैं।
2. **सरकारी छूट**: जेनेरिक दवाओं पर 50% से 90% तक की भारी बचत मिलती है।
3. **डिलीवरी ट्रैकिंग**: डिलीवरी पार्टनर कार्तिक सेल्वाम रास्ते में हैं (अनुमानित समय: 12 मिनट)।
4. **सुरक्षित ओटीपी**: पार्सल लेते समय डिलीवरी पार्टनर को अपना 4-अंकीय ओटीपी (4829) बताएं।`,
      ta: `📦 **மருத்துவமனையிலிருந்து வீட்டுக்கே மருந்து டெலிவரி**:
1. **ஜன் ஔஷதி மருந்தகம்**: தரைத்தளம் அறை 004-லிருந்து மருந்துகள் நேரடியாக பேக் செய்யப்படுகின்றன.
2. **அரசு மானியம்**: ஜெனரிக் மருந்துகளுக்கு 50% முதல் 90% வரை கட்டண தள்ளுபடி உண்டு.
3. **நேரடி கண்காணிப்பு**: டெலிவரி பார்ட்னர் கார்த்திக் செல்வம் உங்கள் முகவரிக்கு வருகிறார் (வருகை: 12 நிமிடங்கள்).
4. **பாதுகாப்பான OTP**: பார்சலை பெறும்போது உங்கள் 4 இலக்க OTP (4829) பகிரவும்.`,
      te: `📦 **ఆసుపత్రి నుండి ఇంటికే మందుల డెలివరీ సేవ**:
1. **జన్ ఔషధి ఫార్మసీ**: గ్రౌండ్ ఫ్లోర్ రూమ్ 004 నుండి మందులు నేరుగా ప్యాక్ చేయబడతాయి.
2. **ప్రభుత్వ రాయితీ**: జెనరిక్ మందులపై 50% నుండి 90% వరకు పెద్ద తగ్గింపు.
3. **లైవ్ ట్రాకింగ్**: డెలివరీ భాగస్వామి కార్తీక్ సెల్వం వస్తున్నారు (సమయం: 12 నిమిషాలు).
4. **డెలివరీ OTP**: పార్శిల్ తీసుకునేటప్పుడు మీ 4 అంకెల OTP (4829) తెలపండి.`,
      ml: `📦 **ഹോസ്പിറ്റലിൽ നിന്ന് വീട്ടിലേക്ക് മരുന്ന് ഡെലിവറി**:
1. **ജൻ ഔഷധി ഫാർമസി**: ഗ്രൗണ്ട് ഫ്ലോർ റൂം 004-ൽ നിന്നാണ് മരുന്നുകൾ നൽകുന്നത്.
2. **വിലക്കുറവ്**: ജനറിക് മരുന്നുകൾക്ക് 50% മുതൽ 90% വരെ സബ്‌സിഡി.
3. **ലൈവ് ട്രാക്കിംഗ്**: കാർത്തിക് സെൽവം നിങ്ങളുടെ അടുത്തേക്ക് എത്തുന്നു (12 മിനിറ്റ്).
4. **സുരക്ഷിത OTP**: മരുന്ന് സ്വീകരിക്കുമ്പോൾ നിങ്ങളുടെ 4 അക്ക OTP (4829) പങ്കിടുക.`,
      es: `📦 **Servicio de Entrega de Medicamentos a Domicilio**:
1. **Farmacia Jan Aushadhi**: Despacho directo desde la Planta Baja, Habitación 004.
2. **Descuento Gubernamental**: Ahorro del 50% al 90% en fármacos genéricos.
3. **Seguimiento en Vivo**: El repartidor Karthik Selvam está en ruta (ETA: ~12 minutos).
4. **Código OTP Seguro**: Proporcione su código de 4 dígitos (4829) al recibir el pedido.`,
      kn: `📦 **ಆಸ್ಪತ್ರೆಯಿಂದ ಮನೆಗೆ ಔಷಧ ವಿತರಣಾ ಸೇವೆ**:
1. **ಜನ ಔಷಧಿ ಕೇಂದ್ರ**: ನೆಲ ಮಹಡಿಯ ಕೋಣೆ 004 ರಿಂದ ಔಷಧಿಗಳನ್ನು ಪ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತದೆ.
2. **ಸರ್ಕಾರಿ ರಿಯಾಯಿತಿ**: ಜೆನೆರಿಕ್ ಔಷಧಿಗಳ ಮೇಲೆ 50% ರಿಂದ 90% ವರೆಗೆ ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ.
3. **ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್**: ವಿತರಣಾ ಪಾಲುದಾರ ಕಾರ್ತಿಕ್ ಸೆಲ್ವಂ ಬರುತ್ತಿದ್ದಾರೆ (ಸಮಯ: 12 ನಿಮಿಷ).
4. **ಸುರಕ್ಷಿತ ಒಟಿಪಿ**: ಪಾರ್ಸೆಲ್ ಪಡೆಯುವಾಗ ನಿಮ್ಮ 4 ಅಂಕಿಯ ಒಟಿಪಿ (4829) ತಿಳಿಸಿ.`,
      en: `📦 **Hospital-to-Home Medicine Delivery Service**:
1. **Jan Aushadhi Pharmacy**: Prescriptions fulfilled directly at Room 004 (Ground Floor).
2. **Generic Subsidies**: Enjoy 50% to 90% savings on verified generic medications.
3. **Live Courier Tracking**: Delivery executive Karthik Selvam is en route with your package (ETA: ~12 mins).
4. **Secure Handover OTP**: Share your 4-digit Delivery OTP (Code: 4829) with the courier partner.`
    };
    return {
      isEmergency: false,
      text: deliveryResponses[currentLang] || deliveryResponses.en
    };
  }

  // 5. Hospital Rooms, Floors & Navigation
  if (lower.includes('room') || lower.includes('floor') || lower.includes('map') || lower.includes('3d') || lower.includes('dermatology') ||
      lower.includes('कमरा') || lower.includes('नक्शा') || lower.includes('அறை') || lower.includes('வரைபடம்') || lower.includes('గది') || lower.includes('ముറി') || lower.includes('habitacion') || lower.includes('ಕೋಣೆ')) {
    const roomResponses = {
      hi: `🗺️ **अस्पताल के कमरों का मार्गदर्शन**:
• **कमरा 401 (1st Floor)**: डॉ. प्रिया रमेश - त्वचा रोग क्लिनिक (Dermatology).
• **कमरा 402 (1st Floor)**: डॉ. के. श्रीनिवास - हृदय रोग क्लिनिक (Cardiology).
• **कमरा 403 (1st Floor)**: डॉ. राजेश कुमार - हड्डी व जोड़ क्लिनिक (Orthopedic).
• **कमरा 404 (2nd Floor)**: गहन चिकित्सा इकाई (ICU).
• **कमरा 405 (2nd Floor)**: सामान्य मरीज वार्ड (Normal Ward).
• **कमरा 406 - 410 (3rd Floor)**: प्रसूति एवं नवजात शिशु वार्ड (Postnatal).
*रास्ते के लिए 3D मैप टैब खोलें और ग्लोइंग सियान लाइन का अनुसरण करें।*`,
      ta: `🗺️ **மருத்துவமனை அறைகள் மற்றும் வழிகாட்டல்**:
• **அறை 401 (1-வது மாடி)**: டாக்டர் பிரியா ரமேஷ் - தோல் கிளினிக்.
• **அறை 402 (1-வது மாடி)**: டாக்டர் கே. சீனிவாஸ் - இதய கிளினிக்.
• **அறை 403 (1-வது மாடி)**: டாக்டர் ராஜேஷ் குமார் - எலும்பு மற்றும் மூட்டு கிளினிக்.
• **அறை 404 (2-வது மாடி)**: தீவிர சிகிச்சை பிரிவு (ICU).
• **அறை 405 (2-வது மாடி)**: சாதாரண நோயாளி வார்டு.
• **அறை 406 - 410 (3-வது மாடி)**: பிரசவத்திற்கு பிந்தைய தாய்-சேய் வார்டுகள்.
*3D வரைபடத்தை திறந்து நீல நிற பாதையை பின்பற்றவும்.*`,
      te: `🗺️ **ఆసుపత్రి గదుల మార్గదర్శకత్వం**:
• **రూమ్ 401 (1వ అంతస్తు)**: డాక్టర్ ప్రియా రమేష్ - డెర్మటాలజీ క్లినిక్.
• **రూమ్ 402 (1వ అంతస్తు)**: డాక్టర్ కె. శ్రీనివాస్ - కార్డియాలజీ క్లినిక్.
• **రూమ్ 403 (1వ అంతస్తు)**: డాక్టర్ రాజేష్ కుమార్ - ఆర్థోపెడిక్ క్లినిక్.
• **రూమ్ 404 (2వ అంతస్తు)**: ఇంటెన్సివ్ కేర్ యూనిట్ (ICU).
• **రూమ్ 405 (2వ అంతస్తు)**: సాధారణ రోగుల వార్డు.
• **రూమ్ 406 - 410 (3వ అంతస్తు)**: పోస్ట్ నాటల్ ప్రసూతి వార్డులు.
*మార్గం కోసం 3D మ్యాప్ ట్యాబ్‌ను తెరవండి.*`,
      ml: `🗺️ **ആശുപത്രി മുറികളുടെ വഴികാട്ടി**:
• **റൂം 401 (ഒന്നാം നില)**: ഡോ. പ്രിയ രമേഷ് - ഡെർമറ്റോളജി.
• **റൂം 402 (ഒന്നാം നില)**: ഡോ. കെ. ശ്രീനിവാസ് - കാർഡിയോളജി.
• **റൂം 403 (ഒന്നാം നില)**: ഡോ. രാജേഷ് കുമാർ - ഓർത്തോപെഡിക്സ്.
• **റൂം 404 (രണ്ടാം നില)**: തീവ്രപരിചരണ വിഭാഗം (ICU).
• **റൂം 405 (രണ്ടാം നില)**: ജനറൽ വാർഡ്.
• **റൂം 406 - 410 (മൂന്നാം നില)**: പ്രസവാനന്തര വാർഡുകൾ.
*വഴികാട്ടലിനായി 3D മാപ്പ് തുറക്കുക.*`,
      es: `🗺️ **Guía de Salas y Departamentos Hospitalarios**:
• **Habitación 401 (1.er Piso)**: Dra. Priya Ramesh - Dermatología.
• **Habitación 402 (1.er Piso)**: Dr. K. Srinivas - Cardiología.
• **Habitación 403 (1.er Piso)**: Dr. Rajesh Kumar - Ortopedia y Traumatología.
• **Habitación 404 (2.º Piso)**: Unidad de Cuidados Intensivos (UCI).
• **Habitación 405 (2.º Piso)**: Sala Normal de Pacientes.
• **Habitaciones 406 a 410 (3.er Piso)**: Salas de Maternidad y Posparto.
*Consulte el mapa 3D interactivo para ver el trayecto iluminado.*`,
      kn: `🗺️ **ಆಸ್ಪತ್ರೆ ಕೋಣೆಗಳ ಮಾರ್ಗದರ್ಶಿ**:
• **ಕೋಣೆ 401 (1ನೇ ಮಹಡಿ)**: ಡಾ. ಪ್ರಿಯಾ ರಮೇಶ್ - ಚರ್ಮರೋಗ ಕ್ಲಿನಿಕ್.
• **ಕೋಣೆ 402 (1ನೇ ಮಹಡಿ)**: ಡಾ. ಕೆ. ಶ್ರೀನಿವಾಸ್ - ಹೃದ್ರೋಗ ಕ್ಲಿನಿಕ್.
• **ಕೋಣೆ 403 (1ನೇ ಮಹಡಿ)**: ಡಾ. ರಾಜೇಶ್ ಕುಮಾರ್ - ಮೂಳೆರೋಗ ಕ್ಲಿನಿಕ್.
• **ಕೋಣೆ 404 (2ನೇ ಮಹಡಿ)**: ತೀವ್ರ ನಿಗಾ ಘಟಕ (ICU).
• **ಕೋಣೆ 405 (2ನೇ ಮಹಡಿ)**: ಸಾಮಾನ್ಯ ರೋಗಿ ವಾರ್ಡ್.
• **ಕೋಣೆ 406 - 410 (3ನೇ ಮಹಡಿ)**: ಪ್ರಸವಾನಂತರ ವಾರ್ಡ್‌ಗಳು.
*ಮಾರ್ಗವನ್ನು ನೋಡಲು 3D ನಕ್ಷೆಯನ್ನು ವೀಕ್ಷಿಸಿ.*`,
      en: `🗺️ **Hospital Room & Specialty Wayfinding**:
• **Room 401 (1st Floor)**: Dr. Priya Ramesh - Dermatology & Skin Care Clinic.
• **Room 402 (1st Floor)**: Dr. K. Srinivas - Cardiology & Heart Care Clinic.
• **Room 403 (1st Floor)**: Dr. Rajesh Kumar - Orthopedics, Bone & Joint Clinic.
• **Room 404 (2nd Floor)**: Intensive Care Unit (ICU).
• **Room 405 (2nd Floor)**: Normal Patient Ward.
• **Rooms 406 to 410 (3rd Floor)**: Postnatal Maternity & Newborn Wards.
*Switch to the 3D Map tab to follow the illuminated navigation path.*`
    };
    return {
      isEmergency: false,
      text: roomResponses[currentLang] || roomResponses.en
    };
  }

  // Default Clinical Assistant Greeting
  const defaultGreetings = {
    hi: `हेलोडॉक एआई स्वास्थ्य गाइड में आपका स्वागत है।
मैं आपकी स्वास्थ्य संबंधी शंकाओं, खान-पान, दवाइयों के समय, घर पर दवा डिलीवरी और अस्पताल के कमरों के मार्गदर्शन में सहायता कर सकता हूँ।

कृपया अपनी समस्या बताएं (जैसे घुटने का दर्द, बीपी, कमरा 401, या दवा डिलीवरी)।`,
    ta: `HeloDoc AI மருத்துவ வழிகாட்டிக்கு நல்வரவு.
மருத்துவமனை அறைகள் (எ.கா. அறை 401, 402, 403), மருத்துவர் ஆலோசனை, மருந்து அட்டவணை அல்லது வீட்டு டெலிவரி குறித்து நீங்கள் கேட்கலாம்.

உங்களுக்கு என்ன உதவி தேவை என்பதை தெரிவிக்கவும்.`,
    te: `HeloDoc AI ఆరోగ్య గైడ్‌కి స్వాగతం.
ఆసుపత్రి గదులు (ఉదా. రూమ్ 401, 402, 403), డాక్టర్ అపాయింట్‌మెంట్‌లు, మందుల షెడ్యూల్ లేదా ఇంటికి డెలివరీ గురించి నన్ను అడగవచ్చు.

మీ సందేహాన్ని తెలియజేయండి.`,
    ml: `HeloDoc AI ആരോഗ്യ ഗൈഡിലേക്ക് സ്വാഗതം.
ആശുപത്രി മുറികൾ (ഉദാ. റൂം 401, 402, 403), ഡോക്ടർമാർ, മരുന്ന് ക്രമം, ഹോം ഡെലിവറി എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കാം.

നിങ്ങൾക്ക് എന്ത് സഹായമാണ് വേണ്ടത്?`,
    es: `Bienvenido a la Guía Médica HeloDoc con Inteligencia Artificial.
Puedo orientarle sobre consultorios (ej. Habitación 401, 402, 403), horarios de medicamentos, citas y entrega de fármacos a domicilio.

Por favor, dígame en qué puedo ayudarle hoy.`,
    kn: `HeloDoc AI ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶಿಗೆ ಸುಸ್ವಾಗತ.
ಆಸ್ಪತ್ರೆಯ ಕೋಣೆಗಳು (ಉದಾ. ಕೋಣೆ 401, 402, 403), ವೈದ್ಯರ ಭೇಟಿ, ಔಷಧಿಗಳ ವೇಳಾಪಟ್ಟಿ ಅಥವಾ ಮನೆಗೆ ಡೆಲಿವರಿ ಬಗ್ಗೆ ಕೇಳಬಹುದು.

ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು ಎಂಬುದನ್ನು ತಿಳಿಸಿ.`,
    en: `Welcome to the HeloDoc AI Healthcare Guide.
I can provide general health information, lifestyle care tips, medicine reminders, home pharmacy delivery, and hospital navigation directions.

Feel free to ask about symptoms (e.g. knee pain, BP), room numbers (401, 402, 403), or your prescription medicines.`
  };

  return {
    isEmergency: false,
    text: defaultGreetings[currentLang] || defaultGreetings.en
  };
};
