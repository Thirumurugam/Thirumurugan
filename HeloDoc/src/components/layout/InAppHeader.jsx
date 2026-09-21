import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Sparkles, AlertCircle, Volume2, ShieldAlert } from 'lucide-react';

export const InAppHeader = () => {
  const {
    hospitalName,
    navigateToTab,
    patient,
    currentRole,
    openModal,
    speakCurrentScreenText,
    unreadNotificationsCount,
    t
  } = useApp();

  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile In-App Status Bar */}
      <div className="mobile-status-bar">
        <span className="status-time" id="status-clock">{currentTime}</span>
        <div
          className="status-hospital-tag"
          onClick={() => navigateToTab('auth')}
          title="Tap to change hospital location"
        >
          <span className="h-dot"></span>
          <span id="current-hospital-name">{hospitalName}</span>
        </div>
        <div className="status-icons">
          <span>5G</span>
          <span>📶</span>
          <span>🔋 98%</span>
        </div>
      </div>

      {/* In-App Header & Quick Action Buttons */}
      <div className="in-app-header" id="in-app-header">
        <div className="user-greeting-row">
          <div className="avatar-info" onClick={() => navigateToTab(currentRole === 'admin' ? 'admin' : currentRole === 'doctor' ? 'doctor' : 'profile')}>
            <div className="avatar-circle" id="user-avatar-badge">
              {currentRole === 'doctor' ? '👨‍⚕️' : currentRole === 'admin' ? '🛡️' : '👴'}
            </div>
            <div className="user-meta">
              <span className="greeting-prefix">{t('welcomeBack')}</span>
              <strong className="user-name" id="display-user-name">
                {currentRole === 'doctor' ? 'Dr. Rajesh Kumar' : currentRole === 'admin' ? 'Chief Medical Administrator' : `${patient.name} (${patient.age}y)`}
              </strong>
              <span className="user-role-badge" id="display-role-badge">
                {currentRole === 'doctor' ? 'Orthopedic Specialist' : currentRole === 'admin' ? 'Platform Admin' : 'Senior Citizen Patient'}
              </span>
            </div>
          </div>

          <div className="header-action-buttons">
            {/* AI Voice Assistant Button */}
            <button
              className="icon-action-btn ai-voice-trigger"
              onClick={() => openModal('aiGuide')}
              title="Ask AI Guide in Any Language"
              aria-label="Open AI Healthcare Guide"
            >
              <Sparkles size={16} className="ai-sparkle-svg text-purple-600" />
              <span className="btn-text">{t('askAi')}</span>
            </button>

            {/* Notifications Bell */}
            <button
              className="icon-action-btn notif-header-btn"
              onClick={() => openModal('notifications')}
              title="Notifications"
              aria-label="Open Notifications"
            >
              <Bell size={18} />
              {unreadNotificationsCount > 0 && (
                <span className="notif-badge-pill-header">{unreadNotificationsCount}</span>
              )}
            </button>

            {/* SOS Emergency Button */}
            <button
              className="sos-btn"
              onClick={() => openModal('sos')}
              title="Emergency Help & Ambulance"
              aria-label="Emergency SOS"
            >
              <ShieldAlert size={18} />
              <span className="sos-text">SOS</span>
            </button>
          </div>
        </div>

        {/* Quick Elder Audio Banner */}
        <div className="audio-banner-strip" id="audio-banner">
          <button
            className="audio-strip-play"
            onClick={speakCurrentScreenText}
            title="Listen to this page"
            aria-label="Hear instructions in your language"
          >
            <Volume2 size={16} className="text-blue-600 inline mr-1" />
            <span id="audio-strip-text">{t('listenPage')}</span>
          </button>
          <button
            className="audio-strip-mic"
            onClick={() => openModal('aiGuide')}
            title="Speak your question to AI"
            aria-label="Speak query to AI Guide"
          >
            <span>🎙️</span>
          </button>
        </div>
      </div>
    </>
  );
};
