import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2, Calendar, Clock, MapPin, Building2, Navigation,
  Download, Share2, Bell, ChevronRight, Printer, Phone, QrCode,
  Hash, User, Stethoscope, CreditCard, Star
} from 'lucide-react';

export const AppointmentConfirmScreen = ({ appointment, onClose }) => {
  const {
    navigateToTab, quickGuideToRoom, openModal, triggerDynamicIsland, t
  } = useApp();

  const [reminderSet, setReminderSet] = useState(false);

  const apt = appointment || {
    token: '#A-42',
    doctor: 'Dr. Priya Nair',
    specialty: 'Cardiologist',
    date: 'Fri, Sep 19',
    time: '2:00 PM',
    hospital: 'Apollo Hospitals, Greams Road',
    department: 'Cardiology',
    floor: '2nd Floor (OPD)',
    room: 'Room 201',
    fee: 800,
    finalPrice: 800,
    status: 'Confirmed',
    paymentMethod: 'UPI',
    transactionId: 'TXN-HD-84321'
  };

  const handleNavigateToRoom = () => {
    quickGuideToRoom(apt.room, apt.floor);
    if (onClose) onClose();
    triggerDynamicIsland(`Route: ${apt.room} 🗺️`);
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    triggerDynamicIsland('Reminder Set 🔔');
  };

  return (
    <div className="appt-confirm-overlay">
      <div className="appt-confirm-sheet">
        {/* Success Animation */}
        <div className="appt-confirm-success-header">
          <div className="appt-success-circle">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2>Appointment Confirmed!</h2>
          <p>You're all set. See you soon!</p>
        </div>

        {/* Token Card */}
        <div className="appt-confirm-token-card">
          <div className="appt-token-left">
            <span className="appt-token-label">Your Queue Token</span>
            <span className="appt-token-value">{apt.token}</span>
          </div>
          <div className="appt-token-divider" />
          <div className="appt-token-right">
            <div className="appt-token-qr">
              <QrCode size={48} className="text-gray-400" />
            </div>
            <span className="appt-token-scan-hint">Scan at reception</span>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="appt-confirm-details-card">
          <h3 className="appt-confirm-section-title">Appointment Details</h3>
          <div className="appt-detail-list">
            <div className="appt-detail-row">
              <Stethoscope size={16} className="text-blue-500" />
              <div>
                <span className="appt-detail-label">Doctor</span>
                <span className="appt-detail-value">{apt.doctor}</span>
                <span className="appt-detail-sub">{apt.specialty}</span>
              </div>
            </div>
            <div className="appt-detail-row">
              <Calendar size={16} className="text-purple-500" />
              <div>
                <span className="appt-detail-label">Date & Time</span>
                <span className="appt-detail-value">{apt.date}</span>
                <span className="appt-detail-sub">{apt.time}</span>
              </div>
            </div>
            <div className="appt-detail-row">
              <Building2 size={16} className="text-teal-500" />
              <div>
                <span className="appt-detail-label">Hospital</span>
                <span className="appt-detail-value">{apt.hospital}</span>
                <span className="appt-detail-sub">{apt.department}</span>
              </div>
            </div>
            <div className="appt-detail-row">
              <MapPin size={16} className="text-red-500" />
              <div>
                <span className="appt-detail-label">Location</span>
                <span className="appt-detail-value">{apt.room}</span>
                <span className="appt-detail-sub">{apt.floor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="appt-confirm-payment-card">
          <div className="appt-payment-header">
            <CreditCard size={16} className="text-green-500" />
            <h3>Payment Confirmed</h3>
            <span className="appt-payment-status-badge">✓ Paid</span>
          </div>
          <div className="appt-payment-row">
            <span>Consultation Fee</span>
            <span>₹{apt.fee}</span>
          </div>
          {apt.subsidyDiscount > 0 && (
            <div className="appt-payment-row discount">
              <span>Subsidy Discount</span>
              <span>-₹{apt.subsidyDiscount}</span>
            </div>
          )}
          <div className="appt-payment-row total">
            <span>Amount Paid</span>
            <strong>₹{apt.finalPrice}</strong>
          </div>
          <div className="appt-payment-meta">
            <span>via {apt.paymentMethod}</span>
            <span>•</span>
            <span>{apt.transactionId}</span>
          </div>
        </div>

        {/* Pre-Visit Reminder */}
        <div className="appt-confirm-tips-card">
          <h4>📋 Before You Visit</h4>
          <ul className="appt-tips-list">
            <li>✓ Bring a valid photo ID and insurance card</li>
            <li>✓ Arrive 15 minutes early for registration</li>
            <li>✓ Carry previous reports and prescriptions</li>
            <li>✓ Follow fasting instructions if applicable</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="appt-confirm-actions">
          <button className="appt-action-primary" onClick={handleNavigateToRoom}>
            <Navigation size={18} />
            Navigate to {apt.room}
          </button>
          <div className="appt-action-secondary-row">
            <button
              className={`appt-action-secondary ${reminderSet ? 'active' : ''}`}
              onClick={handleSetReminder}
            >
              <Bell size={16} />
              {reminderSet ? 'Reminder Set ✓' : 'Set Reminder'}
            </button>
            <button className="appt-action-secondary" onClick={() => openModal('receipt')}>
              <Download size={16} />
              Download Receipt
            </button>
          </div>
          {onClose && (
            <button className="appt-action-done" onClick={onClose}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmScreen;
