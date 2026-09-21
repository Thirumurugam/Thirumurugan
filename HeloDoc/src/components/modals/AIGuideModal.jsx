import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getAIHealthGuidance } from '../../services/geminiService';
import { speak, stopSpeaking } from '../../services/speechService';
import {
  Bot, Send, Volume2, VolumeX, AlertTriangle, Sparkles, X,
  ShieldAlert, Mic, MicOff, Globe, Navigation, Calendar,
  Pill, MapPin, Phone, PhoneCall, Stethoscope, Package
} from 'lucide-react';

const MULTILINGUAL_GREETINGS = {
  en: {
    greeting: "Hello! I'm your HeloDoc AI Healthcare Guide. I can help you find doctors, book appointments, navigate hospital rooms, or track medicine delivery.",
    placeholder: "Ask me anything about your health or hospital services...",
    chips: [
      { emoji: '🔍', text: 'Find a Doctor', query: 'Help me find a specialist doctor' },
      { emoji: '📅', text: 'Book Appointment', query: 'How do I book an appointment?' },
      { emoji: '🗺️', text: 'Hospital Map', query: 'How do I find my room in the hospital?' },
      { emoji: '💊', text: 'My Medicines', query: 'Tell me about my medicine schedule' },
      { emoji: '🚚', text: 'Delivery', query: 'How can I order medicine home delivery?' },
      { emoji: '🏛️', text: 'Govt Schemes', query: 'What government health schemes am I eligible for?' }
    ]
  },
  ta: {
    greeting: "வணக்கம்! நான் உங்கள் HeloDoc AI மருத்துவ வழிகாட்டி. மருத்துவர்களை கண்டுபிடிக்க, சந்திப்பு பதிவு செய்ய, மருத்துவமனை அறையை கண்டுபிடிக்க அல்லது மருந்து டெலிவரி கண்காணிக்க உதவ முடியும்.",
    placeholder: "உங்கள் ஆரோக்கியம் பற்றி கேளுங்கள்...",
    chips: [
      { emoji: '🔍', text: 'மருத்துவர் தேடல்', query: 'ஒரு சிறப்பு மருத்துவரை கண்டுபிடிக்க உதவுங்கள்' },
      { emoji: '📅', text: 'சந்திப்பு பதிவு', query: 'சந்திப்பை எப்படி பதிவு செய்வது?' },
      { emoji: '🗺️', text: 'மருத்துவமனை வரைபடம்', query: 'என் அறையை எப்படி கண்டுபிடிப்பது?' },
      { emoji: '💊', text: 'மருந்துகள்', query: 'என் மருந்து அட்டவணை பற்றி சொல்லுங்கள்' },
      { emoji: '🚚', text: 'டெலிவரி', query: 'வீட்டு மருந்து டெலிவரி எப்படி?' },
      { emoji: '🏛️', text: 'அரசு திட்டங்கள்', query: 'நான் எந்த அரசு திட்டங்களுக்கு தகுதி பெற்றவன்?' }
    ]
  },
  hi: {
    greeting: "नमस्ते! मैं HeloDoc AI स्वास्थ्य सहायक हूँ। मैं डॉक्टर खोजने, अपॉइंटमेंट बुक करने, अस्पताल का कमरा खोजने या दवाई डिलीवरी ट्रैक करने में मदद कर सकता हूँ।",
    placeholder: "अपना स्वास्थ्य प्रश्न पूछें...",
    chips: [
      { emoji: '🔍', text: 'डॉक्टर खोजें', query: 'मुझे विशेषज्ञ डॉक्टर खोजने में मदद करें' },
      { emoji: '📅', text: 'अपॉइंटमेंट', query: 'अपॉइंटमेंट कैसे बुक करें?' },
      { emoji: '🗺️', text: 'अस्पताल मानचित्र', query: 'अपना कमरा कैसे खोजें?' },
      { emoji: '💊', text: 'दवाइयाँ', query: 'मेरी दवाई अनुसूची बताएँ' },
      { emoji: '🚚', text: 'डिलीवरी', query: 'घर पर दवाई डिलीवरी कैसे करें?' },
      { emoji: '🏛️', text: 'सरकारी योजनाएँ', query: 'मैं किन सरकारी स्वास्थ्य योजनाओं के लिए पात्र हूँ?' }
    ]
  },
  te: {
    greeting: "నమస్కారం! నేను మీ HeloDoc AI ఆరోగ్య సహాయకుడిని. వైద్యులను కనుగొనడానికి, అపాయింట్‌మెంట్ బుక్ చేయడానికి, ఆసుపత్రి గది కనుగొనడానికి సహాయం చేయగలను.",
    placeholder: "మీ ఆరోగ్య ప్రశ్న అడగండి...",
    chips: [
      { emoji: '🔍', text: 'డాక్టర్ వెతుకు', query: 'నాకు నిపుణ డాక్టర్ కనుగొనడానికి సహాయపడండి' },
      { emoji: '📅', text: 'అపాయింట్‌మెంట్', query: 'అపాయింట్‌మెంట్ ఎలా బుక్ చేయాలి?' },
      { emoji: '🗺️', text: 'ఆసుపత్రి మ్యాప్', query: 'నా గది ఎలా కనుగొనాలి?' },
      { emoji: '💊', text: 'మందులు', query: 'నా మందుల షెడ్యూల్ చెప్పండి' },
      { emoji: '🚚', text: 'డెలివరీ', query: 'ఇంటికి మందుల డెలివరీ ఎలా?' },
      { emoji: '🏛️', text: 'ప్రభుత్వ పథకాలు', query: 'నేను ఏ ప్రభుత్వ ఆరోగ్య పథకాలకు అర్హుడిని?' }
    ]
  },
  ml: {
    greeting: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ HeloDoc AI ആരോഗ്യ സഹായി ആണ്. ഡോക്ടർമാരെ കണ്ടെത്താനും, അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യാനും, ആശുപത്രി മുറി കണ്ടെത്താനും സഹായിക്കാം.",
    placeholder: "ആരോഗ്യ ചോദ്യം ചോദിക്കൂ...",
    chips: [
      { emoji: '🔍', text: 'ഡോക്ടർ കണ്ടെത്തൽ', query: 'ഒരു സ്പെഷ്യലിസ്റ്റ് ഡോക്ടറെ കണ്ടെത്താൻ സഹായിക്കൂ' },
      { emoji: '📅', text: 'അപ്പോയിന്റ്മെന്റ്', query: 'അപ്പോയിന്റ്മെന്റ് എങ്ങനെ ബുക്ക് ചെയ്യാം?' },
      { emoji: '🗺️', text: 'ആശുപത്രി മാപ്പ്', query: 'എൻ്റെ മുറി എങ്ങനെ കണ്ടെത്താം?' },
      { emoji: '💊', text: 'മരുന്നുകൾ', query: 'എൻ്റെ മരുന്ന് ഷെഡ്യൂൾ പറയൂ' },
      { emoji: '🚚', text: 'ഡെലിവറി', query: 'വീട്ടിലേക്ക് മരുന്ന് ഡെലിവറി?' },
      { emoji: '🏛️', text: 'ഗവ. പദ്ധതികൾ', query: 'ഏതൊക്കെ ആരോഗ്യ പദ്ധതികൾക്ക് അർഹതയുണ്ട്?' }
    ]
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ HeloDoc AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ವೈದ್ಯರನ್ನು ಹುಡುಕಲು, ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಲು, ಆಸ್ಪತ್ರೆ ಕೊಠಡಿ ಹುಡುಕಲು ಸಹಾಯ ಮಾಡಬಹುದು.",
    placeholder: "ನಿಮ್ಮ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
    chips: [
      { emoji: '🔍', text: 'ವೈದ್ಯರನ್ನು ಹುಡುಕಿ', query: 'ತಜ್ಞ ವೈದ್ಯರನ್ನು ಹುಡುಕಲು ಸಹಾಯ ಮಾಡಿ' },
      { emoji: '📅', text: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್', query: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಹೇಗೆ ಬುಕ್ ಮಾಡಬೇಕು?' },
      { emoji: '🗺️', text: 'ಆಸ್ಪತ್ರೆ ನಕ್ಷೆ', query: 'ನನ್ನ ಕೊಠಡಿ ಹೇಗೆ ಹುಡುಕಬೇಕು?' },
      { emoji: '💊', text: 'ಔಷಧಗಳು', query: 'ನನ್ನ ಔಷಧ ವೇಳಾಪಟ್ಟಿ ಹೇಳಿ' },
      { emoji: '🚚', text: 'ಡೆಲಿವರಿ', query: 'ಮನೆಗೆ ಔಷಧ ಡೆಲಿವರಿ ಹೇಗೆ?' },
      { emoji: '🏛️', text: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', query: 'ಯಾವ ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹ?' }
    ]
  },
  es: {
    greeting: "¡Hola! Soy su Guía de Salud con Inteligencia Artificial de HeloDoc. Puedo ayudarle a encontrar consultorios, citas médicas, medicinas o entrega a domicilio.",
    placeholder: "Pregunte sobre su salud, consultorios o servicios...",
    chips: [
      { emoji: '🔍', text: 'Buscar Médico', query: 'Ayúdame a buscar un especialista' },
      { emoji: '📅', text: 'Reservar Cita', query: '¿Cómo reservo una cita médica?' },
      { emoji: '🗺️', text: 'Mapa Hospitalario', query: '¿Cómo encuentro mi sala en el hospital?' },
      { emoji: '💊', text: 'Mis Medicinas', query: 'Explícame mi horario de medicamentos' },
      { emoji: '🚚', text: 'Entrega a Domicilio', query: '¿Cómo pido entrega de medicinas a casa?' },
      { emoji: '🏛️', text: 'Subsidios de Salud', query: '¿A qué descuentos de salud tengo derecho?' }
    ]
  }
};

const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'stroke', 'emergency', 'ambulance', 'unconscious',
  'breathing difficulty', 'severe bleeding', 'seizure', 'fainted', 'not breathing',
  'மாரடைப்பு', 'ஆம்புலன்ஸ்', 'दिल का दौरा', 'एम्बुलेंस', 'గుండె పోటు', 'అత్యవసర'
];

export const AIGuideModal = () => {
  const { modals, closeModal, currentLang, elderMode, openModal, navigateToTab, t } = useApp();

  const langData = MULTILINGUAL_GREETINGS[currentLang] || MULTILINGUAL_GREETINGS.en;

  const [messages, setMessages] = useState([
    { role: 'assistant', text: langData.greeting, isEmergency: false }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update greeting when language changes
  useEffect(() => {
    const newLangData = MULTILINGUAL_GREETINGS[currentLang] || MULTILINGUAL_GREETINGS.en;
    setMessages([{ role: 'assistant', text: newLangData.greeting, isEmergency: false }]);
  }, [currentLang]);

  // Check voice support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLang === 'ta' ? 'ta-IN'
        : currentLang === 'hi' ? 'hi-IN'
        : currentLang === 'te' ? 'te-IN'
        : currentLang === 'ml' ? 'ml-IN'
        : currentLang === 'kn' ? 'kn-IN'
        : currentLang === 'es' ? 'es-ES'
        : 'en-IN';
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInputVal(text);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  if (!modals.aiGuide) return null;

  const isEmergencyQuery = (text) => {
    const lower = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim() || loading) return;

    const isEmergency = isEmergencyQuery(query);
    const userMsg = { role: 'user', text: query, isEmergency: false };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    // Immediate emergency intercept
    if (isEmergency) {
      const emergencyNotices = {
        hi: '🚨 आपातकालीन चेतावनी!\n\nगंभीर स्थिति में तुरंत:\n• 108 (एम्बुलेंस) पर कॉल करें\n• 112 (आपातकालीन सेवा) पर कॉल करें\n• नज़दीकी अस्पताल के इमरजेंसी विभाग जाएँ',
        ta: '🚨 அவசர எச்சரிக்கை!\n\nஉயிருக்கு ஆபத்தான அவசர நிலைகளுக்கு:\n• 108 (ஆம்புலன்ஸ்) ஐ அழைக்கவும்\n• 112 (அவசர உதவி) ஐ அழைக்கவும்\n• உடனடியாக அருகிலுள்ள அவசர சிகிச்சை பிரிவுக்கு செல்லவும்',
        te: '🚨 అత్యవసర హెచ్చరిక!\n\nప్రాణాంతక అత్యవసర పరిస్థితుల కోసం:\n• 108 (అంబులెన్స్) కి కాల్ చేయండి\n• 112 (అత్యవసర సేవలు) కి కాల్ చేయండి\n• వెంటనే సమీప అత్యవసర విభాగానికి వెళ్ళండి',
        ml: '🚨 അടിയന്തര മുന്നറിയിപ്പ്!\n\nഅടിയന്തര സാഹചര്യങ്ങളിൽ ദയവായി:\n• 108 (ആംബുലൻസ്) വിളിക്കുക\n• 112 (അടിയന്തര സേവനം) വിളിക്കുക\n• ഉടൻ തന്നെ ആശുപത്രി അത്യാഹിത വിഭാഗത്തിൽ പോകുക',
        es: '🚨 ¡EMERGENCIA DETECTADA!\n\nPara emergencias médicas graves, por favor:\n• Llame al 108 / 112 / 911 (Ambulancia)\n• Acuda inmediatamente a la sala de emergencias más cercana',
        kn: '🚨 ತುರ್ತು ಎಚ್ಚರಿಕೆ!\n\nತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ದಯವಿಟ್ಟು:\n• 108 (ಆಂಬ್ಯುಲೆನ್ಸ್) ಕರೆ ಮಾಡಿ\n• 112 (ತುರ್ತು ಸೇವೆ) ಕರೆ ಮಾಡಿ\n• ತಕ್ಷಣ ಹತ್ತಿರದ ತುರ್ತು ವಿಭಾಗಕ್ಕೆ ತೆರಳಿ',
        en: '🚨 EMERGENCY DETECTED\n\nFor life-threatening emergencies, please:\n• Call 108 (National Ambulance)\n• Call 112 (Emergency Services)\n• Go to the nearest Emergency Department immediately\n\nDo NOT rely on this AI assistant for medical emergencies. Contact emergency services right now.'
      };
      const emergencyText = emergencyNotices[currentLang] || emergencyNotices.en;
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: emergencyText,
        isEmergency: true
      }]);
      speak(emergencyText, currentLang, elderMode);
      setLoading(false);
      return;
    }

    try {
      const response = await getAIHealthGuidance(query, currentLang, messages);
      const aiMsg = {
        role: 'assistant',
        text: response.text,
        isEmergency: response.isEmergency || isEmergencyQuery(response.text)
      };
      setMessages(prev => [...prev, aiMsg]);
      if (elderMode) {
        speak(response.text.replace(/[*#🚨]/g, ''), currentLang, true);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Unable to connect to AI server. Please check your network connection and try again.',
        isEmergency: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSpeechPlay = (text, index) => {
    if (speakingIndex === index) {
      stopSpeaking();
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(index);
      speak(text.replace(/[*#🚨]/g, ''), currentLang, elderMode);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => closeModal('aiGuide')}>
      <div
        className="modal-content ai-guide-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-guide-title"
      >
        {/* Header */}
        <div className="modal-header ai-header">
          <div className="title-with-icon">
            <div className="icon-badge purple ai-pulse-badge">
              <Bot size={24} />
            </div>
            <div>
              <h2 id="ai-guide-title">{t('aiGuideHeader') || 'HeloDoc AI Guide'}</h2>
              <span className="subtitle-badge">
                <Sparkles size={12} className="inline mr-1" /> Gemini AI • Multilingual
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={() => closeModal('aiGuide')} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Emergency Disclaimer */}
        <div className="ai-disclaimer-banner">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
          <span>
            {t('aiGuideDisclaimer') || 'For emergencies, call 108. This AI does not diagnose or prescribe.'}
          </span>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-wrap ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="bot-avatar">🤖</div>
              )}
              <div className={`chat-bubble ${msg.role} ${msg.isEmergency ? 'emergency-alert-bubble' : ''}`}>
                {msg.isEmergency && (
                  <div className="emergency-callout">
                    <ShieldAlert size={20} className="text-red-600" />
                    <strong>⚠️ URGENT EMERGENCY GUIDANCE</strong>
                  </div>
                )}
                <div className="bubble-text-content">
                  {msg.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>
                {msg.isEmergency && (
                  <div className="emergency-action-btns">
                    <button
                      className="primary-btn red-btn mt-3 full-width"
                      onClick={() => { closeModal('aiGuide'); openModal('sos'); }}
                    >
                      🚨 Open SOS Emergency Panel
                    </button>
                    <a href="tel:108" className="emergency-call-link">
                      <PhoneCall size={16} /> Call 108 (Ambulance)
                    </a>
                  </div>
                )}
                {msg.role === 'assistant' && !msg.isEmergency && (
                  <button
                    className="speak-msg-btn"
                    onClick={() => handleSpeechPlay(msg.text, idx)}
                    aria-label="Listen response"
                  >
                    {speakingIndex === idx ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    <span>{speakingIndex === idx ? 'Stop' : 'Listen'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble-wrap assistant">
              <div className="bot-avatar">🤖</div>
              <div className="chat-bubble assistant typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips */}
        <div className="quick-chips-bar">
          {langData.chips.map((chip, i) => (
            <button
              key={i}
              className="chip-btn"
              onClick={() => handleSend(chip.query)}
            >
              {chip.emoji} {chip.text}
            </button>
          ))}
        </div>

        {/* Input Bar with Voice */}
        <div className="chat-input-bar">
          <input
            type="text"
            placeholder={langData.placeholder}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            aria-label="Ask health question"
          />
          {voiceSupported && (
            <button
              className={`voice-input-btn ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceInput}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              title={isListening ? 'Listening...' : 'Speak your question'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || loading}
            aria-label="Send query"
          >
            <Send size={18} />
          </button>
        </div>

        {isListening && (
          <div className="voice-listening-indicator">
            <div className="voice-wave">
              <span /><span /><span /><span /><span />
            </div>
            <span className="voice-listening-text">Listening... Speak now</span>
          </div>
        )}
      </div>
    </div>
  );
};
