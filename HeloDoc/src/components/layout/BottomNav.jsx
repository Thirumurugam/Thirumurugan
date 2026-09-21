import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, MapPin, Calendar, Pill, Award, User, Stethoscope, ShieldCheck } from 'lucide-react';

export const BottomNav = () => {
  const { activeTab, navigateToTab, t, currentRole, deliveries } = useApp();

  return (
    <nav className="mobile-bottom-nav" role="navigation" aria-label="Main App Navigation">
      {/* Tab 1: Home */}
      <button
        className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
        id="tab-btn-home"
        onClick={() => navigateToTab('home')}
        aria-label="Home Tab"
      >
        <span className="tab-icon">🏠</span>
        <span className="tab-label">{t('navHome')}</span>
      </button>

      {/* Tab 2: 3D Map & Room Navigator */}
      <button
        className={`nav-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
        id="tab-btn-map"
        onClick={() => navigateToTab('map')}
        aria-label="3D Map and Hospitals Tab"
      >
        <span className="tab-icon">🗺️</span>
        <span className="tab-label">{t('navMap')}</span>
      </button>

      {/* Tab 3: Appointments / Booking */}
      <button
        className={`nav-tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
        id="tab-btn-appointments"
        onClick={() => navigateToTab('appointments')}
        aria-label="Book and View Appointments Tab"
      >
        <span className="tab-icon">📅</span>
        <span className="tab-label">{t('navAppt')}</span>
      </button>

      {/* Tab 4: Medicines & Reminders */}
      <button
        className={`nav-tab-btn ${activeTab === 'medicines' ? 'active' : ''}`}
        id="tab-btn-medicines"
        onClick={() => navigateToTab('medicines')}
        aria-label="Medicines and Reminders Tab"
      >
        <span className="tab-icon">💊</span>
        <span className="tab-label">{t('navMeds')}</span>
      </button>

      {/* Tab 5: Hospital-to-Home Delivery */}
      <button
        className={`nav-tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
        id="tab-btn-delivery"
        onClick={() => navigateToTab('delivery')}
        aria-label="Hospital to Home Delivery Tab"
      >
        <span className="tab-icon">🚚</span>
        <span className="tab-label">{t('navDelivery') || 'Delivery'}</span>
        {deliveries && deliveries.some(d => d.status === 'out_for_delivery') && (
          <span className="tab-live-badge">1</span>
        )}
      </button>

      {/* Tab 6: Schemes & Subsidies */}
      <button
        className={`nav-tab-btn ${activeTab === 'schemes' ? 'active' : ''}`}
        id="tab-btn-schemes"
        onClick={() => navigateToTab('schemes')}
        aria-label="Government Health Schemes Tab"
      >
        <span className="tab-icon">🏛️</span>
        <span className="tab-label">{t('navSchemes')}</span>
      </button>

      {/* Role-Based Primary Tabs */}
      {currentRole === 'doctor' ? (
        <button
          className={`nav-tab-btn ${activeTab === 'doctor' ? 'active' : ''}`}
          id="tab-btn-doctor"
          onClick={() => navigateToTab('doctor')}
          aria-label="Doctor Console Tab"
        >
          <span className="tab-icon">👨‍⚕️</span>
          <span className="tab-label">{t('navDoctor') || 'Doctor'}</span>
        </button>
      ) : currentRole === 'pharmacy' ? (
        <button
          className={`nav-tab-btn ${activeTab === 'pharmacy' ? 'active' : ''}`}
          id="tab-btn-pharmacy"
          onClick={() => navigateToTab('pharmacy')}
          aria-label="Pharmacy Console Tab"
        >
          <span className="tab-icon">💊</span>
          <span className="tab-label">Pharmacy</span>
        </button>
      ) : currentRole === 'delivery' ? (
        <button
          className={`nav-tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
          id="tab-btn-delivery-role"
          onClick={() => navigateToTab('delivery')}
          aria-label="Delivery Partner Tab"
        >
          <span className="tab-icon">🛵</span>
          <span className="tab-label">Partner</span>
        </button>
      ) : currentRole === 'admin' ? (
        <button
          className={`nav-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
          id="tab-btn-admin"
          onClick={() => navigateToTab('admin')}
          aria-label="Admin Portal Tab"
        >
          <span className="tab-icon">🛡️</span>
          <span className="tab-label">{t('navAdmin') || 'Admin'}</span>
        </button>
      ) : (
        <button
          className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          id="tab-btn-profile"
          onClick={() => navigateToTab('profile')}
          aria-label="Patient Profile Tab"
        >
          <span className="tab-icon">👤</span>
          <span className="tab-label">{t('navProfile')}</span>
        </button>
      )}
    </nav>
  );
};
