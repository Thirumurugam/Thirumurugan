import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, Smartphone, Building, ShieldCheck, CheckCircle, 
  AlertCircle, X, Sparkles, Wallet, FileText, BadgeCheck 
} from 'lucide-react';

export const PaymentModal = () => {
  const { modals, closeModal, checkoutPayload, completeAppointmentPayment, isSandboxMode, setIsSandboxMode, t } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'wallet', 'insurance'
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('elderly.patient@oksbi');
  const [cardDetails, setCardDetails] = useState({
    number: '4111 2222 3333 4444',
    expiry: '08/28',
    cvv: '123',
    name: 'RAMACHANDRAN V'
  });
  const [walletPhone, setWalletPhone] = useState('9876543210');
  const [walletProvider, setWalletProvider] = useState('paytm');
  const [abhaId, setAbhaId] = useState('14-1234-5678-9012');
  const [insurancePolicy, setInsurancePolicy] = useState('STAR-HLTH-883921');

  if (!modals.payment || !checkoutPayload) return null;

  const handlePay = async () => {
    setProcessing(true);
    // Simulate server side payment gateway roundtrip
    setTimeout(async () => {
      await completeAppointmentPayment(selectedMethod.toUpperCase());
      setProcessing(false);
    }, 1200);
  };

  const finalAmount = selectedMethod === 'insurance' ? 0 : (checkoutPayload.finalPrice || checkoutPayload.fee || 250);
  const originalFee = checkoutPayload.fee || 500;
  const discount = checkoutPayload.subsidyDiscount || (originalFee - (checkoutPayload.finalPrice || checkoutPayload.fee || 250));

  return (
    <div className="modal-overlay" onClick={() => closeModal('payment')}>
      <div className="modal-content payment-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="payment-title">
        <div className="modal-header">
          <div className="title-with-icon">
            <div className="icon-badge blue">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 id="payment-title">{t('paymentHeader')}</h2>
              <span className="subtitle-badge">256-Bit Encrypted Healthcare Checkout</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => closeModal('payment')} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Sandbox Test Mode Banner */}
        <div className="sandbox-mode-banner">
          <div className="sandbox-toggle-col">
            <span className="sandbox-indicator"></span>
            <strong>{t('testModeBanner')}</strong>
          </div>
          <label className="sandbox-toggle-label">
            <input
              type="checkbox"
              checked={isSandboxMode}
              onChange={e => setIsSandboxMode(e.target.checked)}
            />
            <span>Test Mode</span>
          </label>
        </div>

        <div className="modal-body">
          {/* Order Breakdown Card */}
          <div className="order-summary-box">
            <div className="summary-row">
              <span>Doctor / Specialist:</span>
              <strong>{checkoutPayload.doctorName || 'Dr. Rajesh Kumar'}</strong>
            </div>
            <div className="summary-row">
              <span>Hospital & Room:</span>
              <span>{checkoutPayload.hospitalName || 'City Care Hospital'} ({checkoutPayload.room || 'Room 104'})</span>
            </div>
            <div className="summary-row">
              <span>{t('consultationFee')}</span>
              <span>₹{originalFee}</span>
            </div>
            {discount > 0 && selectedMethod !== 'insurance' && (
              <div className="summary-row discount-row text-emerald-600 font-semibold">
                <span>{t('schemeDiscount')}</span>
                <span>- ₹{discount} (Ayushman / Senior 50%)</span>
              </div>
            )}
            {selectedMethod === 'insurance' && (
              <div className="summary-row discount-row text-emerald-600 font-semibold">
                <span>Cashless TPA Pre-Approval:</span>
                <span>100% Covered (₹0 Payable)</span>
              </div>
            )}
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>{t('netPayable')}</span>
              <span className="payable-price">₹{finalAmount}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="payment-methods-section">
            <h4>{t('selectPaymentMethod')}</h4>

            <div className="method-tabs-grid five-cols">
              <button
                type="button"
                className={`method-tab-btn ${selectedMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('upi')}
              >
                <Smartphone size={18} />
                <span>UPI</span>
              </button>

              <button
                type="button"
                className={`method-tab-btn ${selectedMethod === 'card' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('card')}
              >
                <CreditCard size={18} />
                <span>Cards</span>
              </button>

              <button
                type="button"
                className={`method-tab-btn ${selectedMethod === 'netbanking' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('netbanking')}
              >
                <Building size={18} />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                className={`method-tab-btn ${selectedMethod === 'wallet' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('wallet')}
              >
                <Wallet size={18} />
                <span>Wallets</span>
              </button>

              <button
                type="button"
                className={`method-tab-btn ${selectedMethod === 'insurance' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('insurance')}
              >
                <BadgeCheck size={18} />
                <span>Insurance</span>
              </button>
            </div>

            {/* Method Inputs */}
            {selectedMethod === 'upi' && (
              <div className="method-fields-wrap">
                <label>Enter UPI Virtual Payment Address (VPA):</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi"
                />
                <p className="field-hint">✓ Instant verification via Google Pay, PhonePe, or Paytm UPI.</p>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="method-fields-wrap">
                <div className="form-group">
                  <label>Card Number (Sandbox Test Card)</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardDetails.cvv}
                      onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="method-fields-wrap">
                <label>Select Your Bank:</label>
                <select defaultValue="SBI">
                  <option value="SBI">State Bank of India (SBI)</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="Canara">Canara Bank</option>
                  <option value="PNB">Punjab National Bank</option>
                </select>
              </div>
            )}

            {selectedMethod === 'wallet' && (
              <div className="method-fields-wrap">
                <label>Choose Wallet Provider:</label>
                <div className="flex gap-2 mb-2">
                  {['Paytm', 'PhonePe Wallet', 'Amazon Pay'].map((w, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`text-xs px-3 py-1.5 rounded border ${walletProvider === w.toLowerCase() ? 'bg-blue-50 border-blue-500 font-semibold text-blue-600' : 'border-gray-200'}`}
                      onClick={() => setWalletProvider(w.toLowerCase())}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <label>Linked Mobile Number:</label>
                <input
                  type="tel"
                  value={walletPhone}
                  onChange={e => setWalletPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </div>
            )}

            {selectedMethod === 'insurance' && (
              <div className="method-fields-wrap">
                <div className="cashless-approval-badge mb-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-medium">Ayushman Bharat & Major Health Insurance TPAs Supported</span>
                </div>
                <div className="form-group mb-2">
                  <label>ABHA ID (Ayushman Bharat Health Account):</label>
                  <input
                    type="text"
                    value={abhaId}
                    onChange={e => setAbhaId(e.target.value)}
                    placeholder="14-digit ABHA ID"
                  />
                </div>
                <div className="form-group">
                  <label>Insurance Policy / TPA Card No:</label>
                  <input
                    type="text"
                    value={insurancePolicy}
                    onChange={e => setInsurancePolicy(e.target.value)}
                    placeholder="Policy number"
                  />
                </div>
                <p className="field-hint">✓ Zero out-of-pocket payment upon instant digital pre-authorization.</p>
              </div>
            )}
          </div>

          {/* Refund & Cancellation Policy Guarantee */}
          <div className="refund-notice-box mt-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <FileText size={14} className="text-blue-500" />
              <span>100% Free Cancellation & Instant Refund Policy</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cancel or reschedule anytime up to 1 hour before consultation for a full instant refund.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={() => closeModal('payment')} disabled={processing}>
            Cancel
          </button>
          <button type="button" className="primary-btn pay-submit-btn" onClick={handlePay} disabled={processing}>
            {processing ? (
              <span>Verifying Payment...</span>
            ) : selectedMethod === 'insurance' ? (
              <span>Confirm Cashless Pre-Auth (₹0) ➜</span>
            ) : (
              <span>{t('completePaymentBtn')} ₹{finalAmount} ➜</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
