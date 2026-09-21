import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Volume2, VolumeX, Moon, Sun, Smartphone, Monitor, Globe, ShieldCheck } from 'lucide-react';

export const TopHeader = () => {
  const {
    currentLang,
    changeLanguage,
    elderMode,
    toggleElderMode,
    audioGuideActive,
    toggleAudioGuide,
    currentRole,
    switchRole,
    deviceView,
    setDeviceView,
    openModal,
    unreadNotificationsCount,
    t
  } = useApp();

  return (
    <header className="app-top-header" role="banner">
      <div className="header-branding">
        <div className="logo-badge" title="HeloDoc - Smart Multilingual Healthcare Platform">
          <img src="/assets/logo.svg" alt="HeloDoc Logo" />
        </div>
        <div className="brand-text">
          <h1>Helo<span>Doc</span></h1>
          <p className="tagline">{t('tagline')}</p>
        </div>
      </div>

      <div className="top-controls">
        {/* Role Portal Switcher */}
        <div className="role-switcher-pills" title="Switch Portal Role">
          <button
            className={`role-pill-btn ${currentRole === 'patient' ? 'active' : ''}`}
            onClick={() => switchRole('patient')}
            aria-label="Patient Portal"
          >
            👤 Patient
          </button>
          <button
            className={`role-pill-btn ${currentRole === 'doctor' ? 'active' : ''}`}
            onClick={() => switchRole('doctor')}
            aria-label="Doctor Console"
          >
            👨‍⚕️ Doctor
          </button>
          <button
            className={`role-pill-btn ${currentRole === 'pharmacy' ? 'active' : ''}`}
            onClick={() => switchRole('pharmacy')}
            aria-label="Pharmacy Staff Console"
          >
            💊 Pharmacy
          </button>
          <button
            className={`role-pill-btn ${currentRole === 'delivery' ? 'active' : ''}`}
            onClick={() => switchRole('delivery')}
            aria-label="Delivery Partner Console"
          >
            🛵 Delivery
          </button>
          <button
            className={`role-pill-btn ${currentRole === 'admin' ? 'active' : ''}`}
            onClick={() => switchRole('admin')}
            aria-label="Admin Dashboard"
          >
            🛡️ Admin
          </button>
        </div>

        {/* Device Frame Switcher */}
        <div className="device-switcher" title="Switch Device Viewport">
          <button
            className={`device-btn ${deviceView === 'iphone' ? 'active' : ''}`}
            onClick={() => setDeviceView('iphone')}
            aria-label="iPhone 15 View"
          >
            <Smartphone size={15} />
            <span>Mobile</span>
          </button>
          <button
            className={`device-btn ${deviceView === 'fullscreen' ? 'active' : ''}`}
            onClick={() => setDeviceView('fullscreen')}
            aria-label="Fullscreen Responsive View"
          >
            <Monitor size={15} />
            <span>Full Responsive</span>
          </button>
        </div>

        {/* Quick Accessibility & Senior Care Controls */}
        <div className="quick-access-tools">
          {/* Language Selector */}
          <div className="lang-dropdown-wrapper">
            <Globe size={16} className="lang-icon-svg" />
            <select
              id="language-select"
              value={currentLang}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label="Select Language"
            >
              <option value="en">English (EN)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="es">Español (ES)</option>
            </select>
          </div>

          {/* Senior Care Mode Toggle */}
          <button
            id="btn-elder-mode"
            className={`tool-btn elder-btn ${elderMode ? 'active' : ''}`}
            onClick={toggleElderMode}
            title="Senior Care Mode (Large Text, High Contrast, Audio Guidance)"
            aria-label="Toggle Senior Care Mode"
          >
            <span className="btn-icon">👵</span>
            <span className="btn-text">{t('elderMode')}</span>
          </button>

          {/* Voice Guide Audio Assistant */}
          <button
            id="btn-voice-guide"
            className={`tool-btn voice-btn ${audioGuideActive ? 'active' : ''}`}
            onClick={toggleAudioGuide}
            title="Voice Guide (Spoken Instructions)"
            aria-label="Toggle Voice Guide"
          >
            {audioGuideActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="btn-text">{t('voiceGuide')}</span>
          </button>

          {/* In-App Notifications Bell */}
          <button
            id="btn-notifications"
            className="tool-btn notif-btn"
            onClick={() => openModal('notifications')}
            title="Notifications & Reminders"
            aria-label="Open Notifications"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="notif-badge-pill">{unreadNotificationsCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
