import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { speak } from '../../services/speechService';
import { 
  Truck, CheckCircle2, Clock, MapPin, Phone, 
  ShieldCheck, Package, AlertCircle, ArrowRight, 
  Volume2, KeyRound, ExternalLink, RefreshCw 
} from 'lucide-react';

export const DeliveryTab = () => {
  const { 
    deliveries, 
    patient, 
    hospitalName, 
    advanceDeliveryStatus, 
    verifyDeliveryOTP, 
    createDeliveryOrder,
    currentLang, 
    elderMode 
  } = useApp();

  const [enteredOtp, setEnteredOtp] = useState('');
  const [showOtpInputModal, setShowOtpInputModal] = useState(false);
  const [activeDeliveryIndex, setActiveDeliveryIndex] = useState(0);

  const activeDelivery = deliveries[activeDeliveryIndex] || deliveries[0];

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    if (!activeDelivery) return;
    const success = verifyDeliveryOTP(activeDelivery.id, enteredOtp.trim());
    if (success) {
      setShowOtpInputModal(false);
      setEnteredOtp('');
    }
  };

  const handleSpeakOtp = (otpCode) => {
    const spoken = otpCode.split('').join(' ');
    speak(`Your 4-digit medicine delivery OTP is: ${spoken}. Share this with the delivery partner only when you receive your package.`, currentLang, elderMode);
  };

  const handleSpeakStatus = () => {
    if (!activeDelivery) return;
    speak(`Medicine delivery status: ${activeDelivery.status.replace('_', ' ')}. Estimated arrival in ${activeDelivery.deliveryPartner.etaMinutes} minutes. Delivery partner is ${activeDelivery.deliveryPartner.name}.`, currentLang, elderMode);
  };

  return (
    <div className="delivery-tab-container">
      {/* Header Banner */}
      <div className="delivery-header-banner">
        <div className="banner-icon-badge">
          <Truck size={28} className="text-blue-600" />
        </div>
        <div className="banner-title-col">
          <h3>Hospital-to-Home Medicine Delivery</h3>
          <p>Prescribed generic medicines dispatched directly from {hospitalName} Jan Aushadhi Pharmacy</p>
        </div>
        <button 
          className="audio-guide-pill-btn"
          onClick={handleSpeakStatus}
          title="Listen Delivery Status"
        >
          <Volume2 size={18} />
          <span>Status</span>
        </button>
      </div>

      {activeDelivery ? (
        <div className="active-delivery-card">
          {/* Top Order Details Bar */}
          <div className="delivery-order-meta">
            <div>
              <span className="order-id-badge">{activeDelivery.orderId}</span>
              <p className="order-pharmacy-sub">🏥 {activeDelivery.pharmacy}</p>
            </div>
            <div className="text-right">
              <span className="order-date-text">{activeDelivery.date}</span>
              <span className="paid-badge">✓ {activeDelivery.paymentStatus}</span>
            </div>
          </div>

          {/* 4-Stage Progress Timeline */}
          <div className="delivery-timeline-tracker">
            <div className="tracker-steps-row">
              {activeDelivery.timeline.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`tracker-step-item ${item.completed ? 'completed' : ''} ${activeDelivery.statusStep === item.step ? 'active-step' : ''}`}
                >
                  <div className="step-circle-marker">
                    {item.completed ? <CheckCircle2 size={16} /> : item.step}
                  </div>
                  <span className="step-title-label">{item.title}</span>
                  <span className="step-time-label">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="tracker-progress-line">
              <div 
                className="progress-fill" 
                style={{ width: `${(Math.max(1, activeDelivery.statusStep) - 1) * 33.33}%` }}
              ></div>
            </div>
          </div>

          {/* Simulated Animated Road Map with Scooter Delivery */}
          <div className="delivery-live-map-card">
            <div className="map-simulation-canvas">
              <div className="road-path-svg-wrapper">
                <svg viewBox="0 0 400 160" className="route-svg">
                  {/* Dashed Road Line */}
                  <path 
                    d="M 40,110 C 120,110 140,40 220,40 C 300,40 320,100 360,100" 
                    fill="none" 
                    stroke="#cbd5e1" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M 40,110 C 120,110 140,40 220,40 C 300,40 320,100 360,100" 
                    fill="none" 
                    stroke="#0284c7" 
                    strokeWidth="4" 
                    strokeDasharray="6,6"
                    className="animated-flow-dash"
                  />

                  {/* Hospital Origin Marker */}
                  <circle cx="40" cy="110" r="14" fill="#1e40af" />
                  <text x="40" y="115" textAnchor="middle" fill="#fff" fontSize="14">🏥</text>

                  {/* Patient Home Destination Marker */}
                  <circle cx="360" cy="100" r="14" fill="#10b981" />
                  <text x="360" y="105" textAnchor="middle" fill="#fff" fontSize="14">🏠</text>

                  {/* Animated Scooter Rider Marker */}
                  <g className="scooter-rider-group">
                    <circle cx={activeDelivery.statusStep >= 3 ? "240" : "100"} cy={activeDelivery.statusStep >= 3 ? "45" : "105"} r="18" fill="#f59e0b" className="scooter-glow-ring" />
                    <text x={activeDelivery.statusStep >= 3 ? "240" : "100"} y={activeDelivery.statusStep >= 3 ? "51" : "111"} textAnchor="middle" fill="#fff" fontSize="16">🛵</text>
                  </g>
                </svg>
              </div>

              {/* Map Floating Status Card */}
              <div className="map-hud-overlay">
                <div className="hud-eta-badge">
                  <Clock size={16} className="text-amber-500" />
                  <span>
                    {activeDelivery.status === 'delivered' 
                      ? 'Package Delivered Successfully' 
                      : `ETA: ${activeDelivery.deliveryPartner.etaMinutes} Mins (${activeDelivery.deliveryPartner.currentLocation})`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure 4-Digit Delivery Verification OTP Card */}
          <div className="delivery-otp-security-box">
            <div className="otp-left-col">
              <div className="otp-icon-wrap">
                <KeyRound size={24} className="text-blue-600" />
              </div>
              <div>
                <span className="otp-headline">Delivery Verification OTP</span>
                <p className="otp-instruction">Share this code with the delivery partner upon arrival at your doorstep</p>
              </div>
            </div>

            <div className="otp-display-group">
              <div className="otp-digits-box" title="Your 4-Digit Delivery OTP">
                {activeDelivery.otp.split('').map((char, cIdx) => (
                  <span key={cIdx} className="otp-digit">{char}</span>
                ))}
              </div>
              <button 
                className="otp-listen-btn" 
                onClick={() => handleSpeakOtp(activeDelivery.otp)}
                title="Speak OTP Out Loud"
              >
                <Volume2 size={18} />
              </button>
            </div>
          </div>

          {/* Delivery Partner Details */}
          <div className="delivery-partner-profile-card">
            <div className="partner-avatar-col">
              <div className="partner-avatar">🛵</div>
            </div>
            <div className="partner-info-col">
              <div className="partner-name-row">
                <h4>{activeDelivery.deliveryPartner.name}</h4>
                <span className="partner-rating">⭐ {activeDelivery.deliveryPartner.rating}</span>
              </div>
              <p className="partner-vehicle">{activeDelivery.deliveryPartner.vehicle}</p>
              <p className="partner-contact">Verified HeloDoc Hospital Courier Partner</p>
            </div>
            <div className="partner-call-col">
              <a href={`tel:${activeDelivery.deliveryPartner.phone}`} className="call-rider-btn">
                <Phone size={18} />
                <span>Call Partner</span>
              </a>
            </div>
          </div>

          {/* Destination Address Card */}
          <div className="delivery-address-card">
            <div className="addr-icon-col">
              <MapPin size={20} className="text-red-500" />
            </div>
            <div className="addr-details-col">
              <h4>Delivery Destination Address:</h4>
              <p className="addr-full-text">{activeDelivery.deliveryAddress}</p>
              <p className="addr-recipient">Recipient: {activeDelivery.patient} ({activeDelivery.phone})</p>
            </div>
          </div>

          {/* Prescribed Medicines in Package */}
          <div className="package-medicines-list">
            <div className="package-header-row">
              <h4>📦 Medicines in this Delivery Package:</h4>
              <span className="savings-tag">50% Jan Aushadhi Savings Applied</span>
            </div>

            <div className="package-meds-grid">
              {activeDelivery.medicines.map((med, mIdx) => (
                <div key={mIdx} className="package-med-item">
                  <div className="med-name-col">
                    <strong>{med.name}</strong>
                    <span className="med-timing-tag">{med.timing} • {med.dosage}</span>
                  </div>
                  <span className="med-qty-badge">Qty: {med.qty}</span>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="delivery-pricing-row">
              <div className="price-item">
                <span>Standard Pharmacy MRP:</span>
                <del>₹{activeDelivery.mrpTotal}</del>
              </div>
              <div className="price-item discount">
                <span>Jan Aushadhi Subsidy (50% Off):</span>
                <span>-₹{activeDelivery.subsidyDiscount}</span>
              </div>
              <div className="price-item total">
                <span>Total Amount Paid:</span>
                <strong>₹{activeDelivery.finalAmount}</strong>
              </div>
            </div>
          </div>

          {/* Simulation & Testing Controls */}
          <div className="delivery-dev-controls">
            <div className="dev-notice">
              <RefreshCw size={14} />
              <span>Interactive Workflow Controls (Simulation):</span>
            </div>
            <div className="dev-buttons-row">
              <button 
                className="dev-status-btn"
                onClick={() => advanceDeliveryStatus(activeDelivery.id)}
              >
                ⏩ Next Delivery Stage ({activeDelivery.status})
              </button>
              <button 
                className="primary-btn text-sm"
                onClick={() => setShowOtpInputModal(true)}
              >
                ✓ Enter OTP & Complete Delivery
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-delivery-state">
          <Package size={48} className="text-gray-400" />
          <h4>No Active Medicine Deliveries</h4>
          <p>You can request prescription medicines to be packed and delivered directly from the hospital pharmacy.</p>
          <button 
            className="primary-btn"
            onClick={() => createDeliveryOrder()}
          >
            🚚 Order Home Delivery of Prescribed Medicines
          </button>
        </div>
      )}

      {/* OTP Confirmation Modal */}
      {showOtpInputModal && (
        <div className="modal-backdrop">
          <div className="modal-sheet-card">
            <div className="modal-header">
              <h3>Verify Delivery OTP</h3>
              <button className="close-btn" onClick={() => setShowOtpInputModal(false)}>✕</button>
            </div>
            <form onSubmit={handleVerifyOtpSubmit} className="otp-verify-form">
              <p className="modal-body-sub">
                Enter the 4-digit code provided on your delivery pass (Code: <strong>{activeDelivery?.otp}</strong>) to confirm packet handover:
              </p>
              <div className="otp-input-field-wrap">
                <input 
                  type="text" 
                  maxLength={4} 
                  value={enteredOtp} 
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="e.g. 4829"
                  className="otp-code-input"
                  autoFocus
                />
              </div>
              <div className="modal-actions-row">
                <button 
                  type="button" 
                  className="secondary-btn" 
                  onClick={() => setShowOtpInputModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="primary-btn"
                  disabled={enteredOtp.length < 4}
                >
                  Confirm & Mark Delivered
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
