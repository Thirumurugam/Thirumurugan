import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { hospitalRoomsData } from '../../data/hospitalData';
import { speak } from '../../services/speechService';
import { Hospital3DCanvas } from '../navigation/Hospital3DCanvas';
import { 
  MapPin, Navigation, Compass, Volume2, PhoneCall, 
  Hospital, ShieldAlert, CheckCircle2, ChevronRight, Layers, Box, ListOrdered, Eye, X 
} from 'lucide-react';

export const MapTab = () => {
  const { 
    currentFloor, 
    setCurrentFloor, 
    activeAppointment, 
    navSteps, 
    currentNavStepIndex, 
    setCurrentNavStepIndex,
    hospitals,
    selectedHospitalForMap,
    setSelectedHospitalForMap,
    currentLang,
    elderMode,
    t 
  } = useApp();

  const [mapMode, setMapMode] = useState('3d'); 
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [previewModalRoom, setPreviewModalRoom] = useState(null);
  const [wheelchairMode, setWheelchairMode] = useState(false);
  const [autoWalking, setAutoWalking] = useState(false);
  const [cameraMode, setCameraMode] = useState('isometric');

  React.useEffect(() => {
    let timer;
    if (autoWalking) {
      timer = setInterval(() => {
        setCurrentNavStepIndex(prev => {
          if (prev >= navSteps.length - 1) {
            setAutoWalking(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [autoWalking, navSteps.length]);

  const roomsOnCurrentFloor = hospitalRoomsData[currentFloor] || hospitalRoomsData.floor1;

  const handleStepAudio = (stepObj) => {
    const lang = currentLang;
    let audioText = stepObj.audio;
    if (stepObj.step === 1) {
      if (lang === 'hi') audioText = "मुख्य प्रवेश द्वार से, सेंट्रल एट्रियम में लिफ्ट ए की ओर 15 मीटर सीधा चलें।";
      else if (lang === 'ta') audioText = "முக்கிய நுழைவாயிலிலிருந்து, மத்திய ஏட்ரியத்தில் உள்ள லிஃப்ட் A நோக்கி 15 மீட்டர் நேராக நடக்கவும்.";
      else if (lang === 'te') audioText = "ప్రధాన ద్వారం నుండి, సెంట్రల్ అట్రియంలోని లిఫ్ట్ A వైపు 15 మీటర్లు నేరుగా నడవండి.";
      else if (lang === 'ml') audioText = "പ്രധാന കവാടത്തിൽ നിന്ന് ലിഫ്റ്റ് A ലക്ഷ്യമാക്കി 15 മീറ്റർ നേരെ നടക്കുക.";
      else if (lang === 'es') audioText = "Desde la entrada principal, camine 15 metros hacia el Ascensor A.";
      else if (lang === 'kn') audioText = "ಮುಖ್ಯ ದ್ವಾರದಿಂದ, ಲಿಫ್ಟ್ ಎ ಕಡೆಗೆ 15 ಮೀಟರ್ ನೇರವಾಗಿ ನಡೆಯಿರಿ.";
    } else if (stepObj.step === 2) {
      if (lang === 'hi') audioText = "लिफ्ट ए से पहली मंजिल ओपीडी विंग पर जाएं।";
      else if (lang === 'ta') audioText = "லிஃப்ட் A மூலம் முதல் மாடி OPD பிரிவு செல்லவும்.";
      else if (lang === 'te') audioText = "లిఫ్ట్ A ద్వారా 1వ అంతస్తుకు వెళ్ళండి.";
      else if (lang === 'ml') audioText = "ലിഫ്റ്റ് A വഴി ഒന്നാം നിലയിലേക്ക് പോകുക.";
      else if (lang === 'es') audioText = "Tome el Ascensor A hacia el primer piso.";
      else if (lang === 'kn') audioText = "ಲಿಫ್ಟ್ ಎ ಮೂಲಕ 1ನೇ ಮಹಡಿಗೆ ತೆರಳಿ.";
    } else if (stepObj.step === 3) {
      if (lang === 'hi') audioText = "लिफ्ट से बाहर निकलकर दाएं मुड़ें। 10 मीटर आगे आपके दाईं ओर कमरा 403 ऑर्थोपेडिक्स है।";
      else if (lang === 'ta') audioText = "லிஃப்டிலிருந்து வெளியேறி வலதுபுறம் திரும்பவும். 10 மீட்டர் தூரத்தில் உங்கள் வலதுபுறம் அறை 403 உள்ளது.";
      else if (lang === 'te') audioText = "లిఫ్ట్ నుండి దిగి కుడివైపు తిరగండి. 10 మీటర్ల దూరంలో కుడివైపు రూమ్ 403 ఉంది.";
      else if (lang === 'ml') audioText = "ലിഫ്റ്റിൽ നിന്നിറങ്ങി വലത്തോട്ട് തിരിയുക. 10 മീറ്റർ മുന്നിൽ വലതുവശത്ത് റൂം 403.";
      else if (lang === 'es') audioText = "Al salir del ascensor gire a la derecha. Camine 10 metros hasta la Habitación 403.";
      else if (lang === 'kn') audioText = "ಲಿಫ್ಟ್‌ನಿಂದ ಇಳಿದು ಬಲಕ್ಕೆ ತಿರುಗಿ. 10 ಮೀಟರ್ ದೂರದಲ್ಲಿ ಬಲಗಡೆ ಕೋಣೆ 403 ಇದೆ.";
    }
    speak(audioText, currentLang, elderMode);
  };

  const handleSelectRoom = (roomObj) => {
    setSelectedRoom(roomObj);
    const lang = currentLang;
    let text = `${roomObj.name} in ${roomObj.room}, ${roomObj.floor}.`;
    if (lang === 'hi') text = `${roomObj.floor} पर कमरा ${roomObj.room}: ${roomObj.name}।`;
    else if (lang === 'ta') text = `${roomObj.floor}-ல் உள்ள அறை ${roomObj.room}: ${roomObj.name}.`;
    else if (lang === 'te') text = `${roomObj.floor} లోని రూమ్ ${roomObj.room}: ${roomObj.name}.`;
    else if (lang === 'ml') text = `${roomObj.floor}-ലെ റൂം ${roomObj.room}: ${roomObj.name}.`;
    else if (lang === 'es') text = `${roomObj.name} en ${roomObj.room}, ${roomObj.floor}.`;
    else if (lang === 'kn') text = `${roomObj.floor} ರ ಕೋಣೆ ${roomObj.room}: ${roomObj.name}.`;
    speak(text, currentLang, elderMode);
  };

  const handleBannerListen = () => {
    const lang = currentLang;
    let routeText = `Route to ${activeAppointment.doctor} in ${activeAppointment.room}, ${activeAppointment.floor}. From entrance, take Elevator A to 1st Floor, turn right 10 meters.`;
    if (lang === 'hi') {
      routeText = `${activeAppointment.floor} में ${activeAppointment.doctor} के कमरा ${activeAppointment.room} का रास्ता। प्रवेश द्वार से लिफ्ट ए लें और 10 मीटर दाएं चलें।`;
    } else if (lang === 'ta') {
      routeText = `${activeAppointment.floor}-ல் உள்ள ${activeAppointment.doctor} அவர்களின் அறை ${activeAppointment.room}-க்கு செல்லும் வழி. லிஃப்ட் A வழியாக சென்று வலதுபுறம் 10 மீட்டர் நடக்கவும்.`;
    } else if (lang === 'te') {
      routeText = `${activeAppointment.floor} లోని ${activeAppointment.doctor} గారి రూమ్ ${activeAppointment.room} కు మార్గం. లిఫ్ట్ A ద్వారా వెళ్లి కుడివైపు 10 మీటర్లు నడవండి.`;
    } else if (lang === 'ml') {
      routeText = `${activeAppointment.floor}-ലെ ${activeAppointment.doctor} അടുത്തേക്കുള്ള വഴി. ലിഫ്റ്റ് A വഴി പോയി വലത്തോട്ട് 10 മീറ്റർ നടക്കുക.`;
    } else if (lang === 'es') {
      routeText = `Ruta hacia ${activeAppointment.doctor} en la ${activeAppointment.room}, ${activeAppointment.floor}. Tome el Ascensor A al 1.er piso y gire a la derecha 10 metros.`;
    } else if (lang === 'kn') {
      routeText = `${activeAppointment.floor} ರ ${activeAppointment.doctor} ಅವರ ಕೋಣೆ ${activeAppointment.room} ರತ್ತ ಮಾರ್ಗ. ಲಿಫ್ಟ್ ಎ ಮೂಲಕ ತೆರಳಿ ಬಲಕ್ಕೆ 10 ಮೀಟರ್ ನಡೆಯಿರಿ.`;
    }
    speak(routeText, currentLang, elderMode);
  };

  return (
    <div className="map-tab-container">
      {/* Target Appointment Guidance Banner */}
      <div className="active-destination-banner">
        <div className="dest-icon-col">
          <div className="dest-pulse-dot"></div>
          <Navigation size={22} className="text-blue-500" />
        </div>
        <div className="dest-info-col">
          <span className="dest-label">Active Route to Appointment:</span>
          <h4>{activeAppointment.doctor} • {activeAppointment.room}</h4>
          <p className="dest-sub">{activeAppointment.floor} • Follow Cyan Route Line</p>
        </div>
        <button 
          className="audio-guide-pill-btn"
          onClick={handleBannerListen}
          title="Listen Audio Walking Instructions"
        >
          <Volume2 size={18} />
          <span>Listen</span>
        </button>
      </div>

      {/* Map View Mode Switcher Header */}
      <div className="map-mode-switcher-bar">
        <button 
          className={`mode-btn ${mapMode === '3d' ? 'active' : ''}`}
          onClick={() => {
            setMapMode('3d');
            speak('map_3d_active', currentLang, elderMode);
          }}
        >
          <Box size={18} />
          <span>Interactive 3D View</span>
        </button>

        <button 
          className={`mode-btn ${mapMode === '2d' ? 'active' : ''}`}
          onClick={() => {
            setMapMode('2d');
            speak('map_2d_active', currentLang, elderMode);
          }}
        >
          <Layers size={18} />
          <span>2D Floor Plan</span>
        </button>

        <button 
          className={`mode-btn ${mapMode === 'hospitals' ? 'active' : ''}`}
          onClick={() => {
            setMapMode('hospitals');
            speak('nearby_hospitals_active', currentLang, elderMode);
          }}
        >
          <Hospital size={18} />
          <span>Nearby Hospitals</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: 3D THREE.JS HOSPITAL WAYFINDING */}
      {/* ======================================================== */}
      {mapMode === '3d' && (
        <div className="threejs-map-card">
          <div className="threejs-header-controls">
            <div className="flex items-center gap-2">
              <span className="badge-live-pulse"></span>
              <strong>Live 3D Hospital Model</strong>
            </div>
            <div className="three-actions-cluster">
              <button 
                className={`cam-mode-pill ${cameraMode === 'walk' ? 'active' : ''}`}
                onClick={() => setCameraMode(cameraMode === 'isometric' ? 'walk' : 'isometric')}
              >
                <Eye size={14} />
                <span>{cameraMode === 'isometric' ? 'Switch to Eye-Level' : 'Switch to Isometric'}</span>
              </button>
              <button 
                className={`cam-mode-pill ${autoWalking ? 'active' : ''}`}
                onClick={() => setAutoWalking(!autoWalking)}
              >
                <Compass size={14} />
                <span>{autoWalking ? 'Pause Tour' : 'Auto Walk Tour'}</span>
              </button>
            </div>
          </div>

          {/* 3D Floor & Accessibility Controls */}
          <div className="floor-selector-bar">
            <button 
              className={`floor-btn ${currentFloor === 'ground' ? 'active' : ''}`}
              onClick={() => {
                setCurrentFloor('ground');
                speak('ground_floor_announcement', currentLang, elderMode);
              }}
            >
              Ground (ER / Pharmacy)
            </button>
            <button 
              className={`floor-btn ${currentFloor === 'floor1' ? 'active' : ''}`}
              onClick={() => {
                setCurrentFloor('floor1');
                speak('floor1_announcement', currentLang, elderMode);
              }}
            >
              1st Floor (OPD 401-403)
            </button>
            <button 
              className={`floor-btn ${currentFloor === 'floor2' ? 'active' : ''}`}
              onClick={() => {
                setCurrentFloor('floor2');
                speak('floor2_announcement', currentLang, elderMode);
              }}
            >
              2nd Floor (ICU 404 / Ward 405)
            </button>
            <button 
              className={`floor-btn ${currentFloor === 'floor3' ? 'active' : ''}`}
              onClick={() => {
                setCurrentFloor('floor3');
                speak('floor3_announcement', currentLang, elderMode);
              }}
            >
              3rd Floor (Postnatal 406-410)
            </button>
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 rounded-lg mx-3 mb-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={wheelchairMode}
                onChange={e => {
                  setWheelchairMode(e.target.checked);
                  if (e.target.checked) {
                    speak('wheelchair_route_active', currentLang, elderMode);
                  }
                }}
              />
              <span>♿ Wheelchair Accessible Route (Ramps & Elevators)</span>
            </label>
            <span className="text-xs text-blue-600 font-medium">Elevator A Ready</span>
          </div>

          {/* Turn-by-Turn Audio Guide Strip */}
          <div className="walking-guide-strip">
            <div className="step-count-badge">
              Step {currentNavStepIndex + 1} of {navSteps.length}
            </div>
            <p className="step-instruction-text">
              {navSteps[currentNavStepIndex] ? navSteps[currentNavStepIndex].text : navSteps[0].text}
            </p>
            <button 
              className="step-audio-btn"
              onClick={() => handleStepAudio(navSteps[currentNavStepIndex] || navSteps[0])}
              title="Hear Walking Audio Directions"
            >
              <Volume2 size={20} />
            </button>
          </div>

          {/* Three.js Interactive 3D Canvas */}
          <Hospital3DCanvas 
            targetRoom={activeAppointment.room || 'Room 104'} 
            onRoomSelect={setSelectedRoom} 
          />

          {/* Walking Steps Progression Controls */}
          <div className="step-navigation-controls">
            <button 
              className="secondary-btn"
              disabled={currentNavStepIndex === 0}
              onClick={() => setCurrentNavStepIndex(prev => Math.max(0, prev - 1))}
            >
              ← Previous Step
            </button>

            <button
              className={`secondary-btn ${autoWalking ? 'bg-amber-100 text-amber-800' : ''}`}
              onClick={() => setAutoWalking(prev => !prev)}
            >
              {autoWalking ? '⏸ Pause Auto-Walk' : '▶ Auto-Walk Path'}
            </button>

            <button 
              className="primary-btn"
              disabled={currentNavStepIndex === navSteps.length - 1}
              onClick={() => setCurrentNavStepIndex(prev => Math.min(navSteps.length - 1, prev + 1))}
            >
              Next Step ➜
            </button>
          </div>

          {/* Quick Key Rooms in Hospital */}
          <div className="quick-rooms-selector">
            <h4>Quick Facility Destinations:</h4>
            <div className="quick-rooms-chips-scroll">
              <button 
                className="room-chip-btn active"
                onClick={() => {
                  setCurrentFloor('floor1');
                  speak("Dr. Rajesh Kumar Orthopedics in Room 104 on 1st Floor.", currentLang, elderMode);
                }}
              >
                🦴 Room 104 (Ortho - Dr. Rajesh)
              </button>
              <button 
                className="room-chip-btn"
                onClick={() => {
                  setCurrentFloor('ground');
                  speak("Jan Aushadhi Generic Pharmacy in Room 004 on Ground Floor. Up to 90% savings on medicines.", currentLang, elderMode);
                }}
              >
                💊 Room 004 (Jan Aushadhi Pharmacy)
              </button>
              <button 
                className="room-chip-btn"
                onClick={() => {
                  setCurrentFloor('ground');
                  speak("24/7 Emergency Trauma Room 001 on Ground Floor.", currentLang, elderMode);
                }}
              >
                🚨 Room 001 (Emergency ER)
              </button>
              <button 
                className="room-chip-btn"
                onClick={() => {
                  setCurrentFloor('floor2');
                  speak("Cardiology Clinic Room 201 on 2nd Floor.", currentLang, elderMode);
                }}
              >
                ❤️ Room 201 (Cardiology)
              </button>
              <button 
                className="room-chip-btn"
                onClick={() => {
                  setCurrentFloor('floor2');
                  speak("Intensive Care Unit ICU in Room 404 on 2nd Floor. Advanced life support, ventilators, and vital monitors.", currentLang, elderMode);
                }}
              >
                🚨 Room 404 (ICU Critical Care)
              </button>
              <button 
                className="room-chip-btn"
                onClick={() => {
                  setCurrentFloor('floor3');
                  speak("Postnatal Maternity Wards Room 406 to 410 on 3rd Floor.", currentLang, elderMode);
                }}
              >
                👶 Room 406-410 (Postnatal Wards)
              </button>
              <button 
                className="room-chip-btn"
                onClick={() => {
                  setCurrentFloor('ground');
                  speak("Pathology Blood & Urine Lab in Room 007 on Ground Floor.", currentLang, elderMode);
                }}
              >
                🔬 Room 007 (Pathology Lab)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: 2D FLOOR BLUEPRINT FALLBACK */}
      {/* ======================================================== */}
      {mapMode === '2d' && (
        <div className="indoor-navigation-view">
          {/* Floor Selector Buttons */}
          <div className="floor-selector-bar">
            <button 
              className={`floor-btn ${currentFloor === 'ground' ? 'active' : ''}`}
              onClick={() => setCurrentFloor('ground')}
            >
              Ground Floor (ER & Pharmacy)
            </button>
            <button 
              className={`floor-btn ${currentFloor === 'floor1' ? 'active' : ''}`}
              onClick={() => setCurrentFloor('floor1')}
            >
              1st Floor (OPD & Ortho)
            </button>
            <button 
              className={`floor-btn ${currentFloor === 'floor2' ? 'active' : ''}`}
              onClick={() => setCurrentFloor('floor2')}
            >
              2nd Floor (ICU 404 & Cardio)
            </button>
            <button 
              className={`floor-btn ${currentFloor === 'floor3' ? 'active' : ''}`}
              onClick={() => setCurrentFloor('floor3')}
            >
              3rd Floor (Postnatal 406-410)
            </button>
          </div>

          {/* Turn-by-Turn Guide Strip */}
          <div className="walking-guide-strip">
            <div className="step-count-badge">
              Step {currentNavStepIndex + 1} of {navSteps.length}
            </div>
            <p className="step-instruction-text">
              {navSteps[currentNavStepIndex] ? navSteps[currentNavStepIndex].text : navSteps[0].text}
            </p>
            <button 
              className="step-audio-btn"
              onClick={() => handleStepAudio(navSteps[currentNavStepIndex] || navSteps[0])}
              title="Hear Walking Audio Directions"
            >
              <Volume2 size={20} />
            </button>
          </div>

          {/* Floor Map Graphic Simulation with Photographic Room Backgrounds */}
          <div className="hospital-blueprint-card">
            <div className="blueprint-header-line">
              <span>🗺️ Hospital Photographic Layout • {currentFloor.toUpperCase()}</span>
              <span className="elevator-marker">🛗 Central Elevator A</span>
            </div>

            <div className="rooms-interactive-grid">
              {roomsOnCurrentFloor.map((roomItem, rIdx) => (
                <div 
                  key={rIdx}
                  className={`room-block-card ${roomItem.activeTarget ? 'active-target-room' : ''} ${selectedRoom && selectedRoom.room === roomItem.room ? 'selected-room' : ''}`}
                  onClick={() => {
                    handleSelectRoom(roomItem);
                    setPreviewModalRoom(roomItem);
                  }}
                  style={{ 
                    backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.72) 0%, rgba(15,23,42,0.38) 45%, rgba(15,23,42,0.94) 100%), url(${roomItem.image})`,
                    borderColor: roomItem.activeTarget ? '#38bdf8' : (roomItem.color || '#3b82f6')
                  }}
                >
                  {roomItem.activeTarget && <div className="target-pulse-ring"></div>}
                  
                  {/* Senior Room Badge Pill */}
                  <div className="room-senior-pill" style={{ backgroundColor: roomItem.color }}>
                    {roomItem.icon || '📍'} {roomItem.room} • {roomItem.shortName || roomItem.room}
                  </div>

                  {/* Room Name */}
                  <h4 className="room-title-senior">{roomItem.name}</h4>

                  {/* Specialty / Equipment Subtitle */}
                  <p className="room-dept-text-senior">{roomItem.equipment || roomItem.type}</p>

                  {/* Bottom touch prompt */}
                  <div className="room-card-bottom-row">
                    <span className="room-photo-indicator">📷 Real Room Photo 🔍</span>
                    {roomItem.activeTarget && (
                      <span className="target-badge-pill">⭐ Destination</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Walking Steps Progression Buttons */}
          <div className="step-navigation-controls">
            <button 
              className="secondary-btn"
              disabled={currentNavStepIndex === 0}
              onClick={() => setCurrentNavStepIndex(prev => Math.max(0, prev - 1))}
            >
              ← Previous Step
            </button>
            <button 
              className="primary-btn"
              disabled={currentNavStepIndex === navSteps.length - 1}
              onClick={() => setCurrentNavStepIndex(prev => Math.min(navSteps.length - 1, prev + 1))}
            >
              Next Step ➜
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: NEARBY HOSPITALS & EMERGENCY FACILITIES */}
      {/* ======================================================== */}
      {mapMode === 'hospitals' && (
        <div className="nearby-hospitals-view">
          {/* Radar Map Simulator Card */}
          <div className="google-maps-simulator-card">
            <div className="radar-map-visual">
              <div className="radar-grid-bg">
                <div className="user-location-pulse" title="Your Current Location">
                  <div className="user-dot"></div>
                  <span className="user-label">You Are Here</span>
                </div>

                {/* Hospital Pins */}
                {hospitals.map((hosp, idx) => (
                  <div 
                    key={hosp.id}
                    className={`hospital-map-pin pin-${idx + 1} ${selectedHospitalForMap.id === hosp.id ? 'active-pin' : ''}`}
                    onClick={() => setSelectedHospitalForMap(hosp)}
                    title={`${hosp.name} (${hosp.distanceKm} km)`}
                  >
                    <div className="pin-marker">
                      <Hospital size={16} />
                    </div>
                    <span className="pin-bubble">{hosp.name.split(' ')[0]} ({hosp.distanceKm}km)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Hospital Overview */}
            {selectedHospitalForMap && (
              <div className="selected-hospital-card">
                <div className="sel-hosp-header">
                  <div>
                    <h3>{selectedHospitalForMap.name}</h3>
                    <p className="sel-hosp-addr">📍 {selectedHospitalForMap.address}</p>
                  </div>
                  <span className="distance-badge">📍 {selectedHospitalForMap.distanceKm} km away</span>
                </div>

                <div className="sel-hosp-stats-row">
                  {selectedHospitalForMap.hasEmergencyER && (
                    <span className="stat-pill er-pill">
                      <ShieldAlert size={14} /> 24/7 ER Trauma Active ({selectedHospitalForMap.erBedsAvailable} Beds)
                    </span>
                  )}
                  {selectedHospitalForMap.ambulanceAvailable && (
                    <span className="stat-pill">🚑 Ambulance on Standby</span>
                  )}
                  <span className="stat-pill">⭐ {selectedHospitalForMap.rating} Rating</span>
                </div>

                <div className="sel-hosp-actions">
                  <a href={`tel:${selectedHospitalForMap.phone}`} className="primary-btn text-sm">
                    <PhoneCall size={16} /> Direct Call ({selectedHospitalForMap.phone})
                  </a>
                  <button 
                    className="secondary-btn text-sm"
                    onClick={() => setMapMode('3d')}
                  >
                    👉 Launch 3D Wayfinding
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hospitals List */}
          <div className="hospitals-nearby-list">
            <h4 className="list-title">All Affiliated Facilities Near You:</h4>
            {hospitals.map(hosp => (
              <div 
                key={hosp.id}
                className={`nearby-hosp-item ${selectedHospitalForMap.id === hosp.id ? 'selected' : ''}`}
                onClick={() => setSelectedHospitalForMap(hosp)}
              >
                <div className="item-icon-col">
                  <Hospital size={22} className="text-blue-600" />
                </div>
                <div className="item-details-col">
                  <h4>{hosp.name}</h4>
                  <p className="item-sub">{hosp.type} • {hosp.distanceKm} km away</p>
                  <p className="item-schemes">{hosp.supportedSchemes.join(', ')}</p>
                </div>
                <ChevronRight size={20} className="item-arrow" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Room Photographic Lightbox Modal (Elderly Friendly) */}
      {previewModalRoom && (
        <div className="room-photo-modal-overlay" onClick={() => setPreviewModalRoom(null)}>
          <div className="room-photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-title-col">
                <span className="modal-badge-pill" style={{ backgroundColor: previewModalRoom.color }}>
                  {previewModalRoom.icon || '📍'} {previewModalRoom.room} • {previewModalRoom.shortName || previewModalRoom.room}
                </span>
                <h3>{previewModalRoom.name}</h3>
                <span className="modal-floor-tag">{previewModalRoom.floor}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setPreviewModalRoom(null)} title="Close Photo">
                <X size={20} />
              </button>
            </div>

            <div className="modal-photo-wrapper">
              <img src={previewModalRoom.image} alt={previewModalRoom.name} className="modal-room-img" />
              <div className="modal-photo-scrim">
                <span className="photo-authentic-badge">✓ Verified Hospital Room View</span>
              </div>
            </div>

            <div className="modal-details-grid">
              <div className="modal-detail-item">
                <span className="detail-label">Department / Purpose:</span>
                <strong className="detail-value">{previewModalRoom.type}</strong>
              </div>
              <div className="modal-detail-item">
                <span className="detail-label">Consulting Specialist:</span>
                <strong className="detail-value">{previewModalRoom.doctor || 'Senior Hospital Staff'}</strong>
              </div>
              <div className="modal-detail-item full-width">
                <span className="detail-label">Room Equipment & Facilities:</span>
                <strong className="detail-value text-blue-600">{previewModalRoom.equipment || 'Hospital Standard Setup'}</strong>
              </div>
            </div>

            <div className="modal-actions-row">
              <button 
                className="primary-btn flex-1"
                onClick={() => {
                  speak(`${previewModalRoom.name} located in ${previewModalRoom.room} on ${previewModalRoom.floor}. Equipped with ${previewModalRoom.equipment || previewModalRoom.type}.`, currentLang, elderMode);
                }}
              >
                <Volume2 size={18} /> Listen Voice Guidance
              </button>
              <button 
                className="secondary-btn"
                onClick={() => setPreviewModalRoom(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
