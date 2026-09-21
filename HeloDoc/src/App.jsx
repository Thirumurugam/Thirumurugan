import React from 'react';
import { useApp } from './context/AppContext';
import { TopHeader } from './components/layout/TopHeader';
import { MobileFrame } from './components/layout/MobileFrame';
import { InAppHeader } from './components/layout/InAppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { EmergencyFloatingButton } from './components/layout/EmergencyFloatingButton';

// Tab Pages
import { AuthTab } from './components/tabs/AuthTab';
import { HomeTab } from './components/tabs/HomeTab';
import { MapTab } from './components/tabs/MapTab';
import { AppointmentsTab } from './components/tabs/AppointmentsTab';
import { MedicinesTab } from './components/tabs/MedicinesTab';
import { DeliveryTab } from './components/tabs/DeliveryTab';
import { SchemesTab } from './components/tabs/SchemesTab';
import { DoctorTab } from './components/tabs/DoctorTab';
import { AdminTab } from './components/tabs/AdminTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { PharmacyTab } from './components/tabs/PharmacyTab';
import { DoctorSearchScreen } from './components/tabs/DoctorSearchScreen';
import { AppointmentConfirmScreen } from './components/tabs/AppointmentConfirmScreen';

// Modals
import { AIGuideModal } from './components/modals/AIGuideModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { SOSModal } from './components/modals/SOSModal';
import { ShareModal } from './components/modals/ShareModal';
import { GoogleAuthModal } from './components/modals/GoogleAuthModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { DoctorVerificationModal } from './components/modals/DoctorVerificationModal';
import { AddHospitalModal } from './components/modals/AddHospitalModal';
import { AddMedicineModal } from './components/modals/AddMedicineModal';

import './styles/App.css';

export const App = () => {
  const { activeTab, elderMode, currentRole, isLoggedIn, modals, closeModal, confirmedAppointment, activeAppointment } = useApp();

  // Determine if this is a special role's primary screen
  const isPharmacyRole = currentRole === 'pharmacy';
  const isDeliveryRole = currentRole === 'delivery';

  return (
    <div className={`theme-light ${elderMode ? 'senior-mode' : ''}`}>
      {/* Top Header Controls */}
      <TopHeader />

      {/* Main Viewport */}
      <MobileFrame>
        {/* In-App Status & Header */}
        <InAppHeader />

        {/* Tab Content */}
        <div className="tab-content-container" id="tab-container">
          {activeTab === 'auth' && <AuthTab />}
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'map' && <MapTab />}
          {activeTab === 'appointments' && <AppointmentsTab />}
          {activeTab === 'doctor-search' && <DoctorSearchScreen />}
          {activeTab === 'appt-confirm' && <AppointmentConfirmScreen appointment={confirmedAppointment || activeAppointment} />}
          {activeTab === 'medicines' && <MedicinesTab />}
          {activeTab === 'delivery' && <DeliveryTab />}
          {activeTab === 'schemes' && <SchemesTab />}
          {activeTab === 'doctor' && <DoctorTab />}
          {activeTab === 'admin' && <AdminTab />}
          {activeTab === 'pharmacy' && <PharmacyTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Emergency SOS Floating Button — visible for patients */}
        {isLoggedIn && currentRole !== 'admin' && <EmergencyFloatingButton />}
      </MobileFrame>

      {/* Modals & Overlays */}
      <AIGuideModal />
      <PaymentModal />
      <ReceiptModal />
      {modals.apptConfirm && (
        <AppointmentConfirmScreen
          appointment={confirmedAppointment || activeAppointment}
          onClose={() => closeModal('apptConfirm')}
        />
      )}
      <SOSModal />
      <ShareModal />
      <GoogleAuthModal />
      <NotificationModal />
      <DoctorVerificationModal />
      <AddHospitalModal />
      <AddMedicineModal />
    </div>
  );
};

export default App;
