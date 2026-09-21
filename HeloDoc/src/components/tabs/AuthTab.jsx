import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck, Smartphone, Mail, Lock, User, Stethoscope,
  ShieldAlert, Sparkles, Globe, Eye, EyeOff, ChevronRight,
  CheckCircle2, AlertCircle, Clock, ArrowLeft, Building2,
  Calendar, Phone, MapPin, Languages, UserPlus, LogIn,
  Truck, Package
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
];

const ROLES = [
  { id: 'patient', label: 'Patient', native: 'நோயாளி / मरीज', icon: '👤', color: '#3b82f6' },
  { id: 'doctor', label: 'Doctor', native: 'மருத்துவர் / डॉक्टर', icon: '👨‍⚕️', color: '#10b981' },
  { id: 'pharmacy', label: 'Pharmacy Staff', native: 'மருந்தகம்', icon: '💊', color: '#8b5cf6' },
  { id: 'delivery', label: 'Delivery Partner', native: 'டெலிவரி', icon: '🛵', color: '#f59e0b' },
  { id: 'admin', label: 'Administrator', native: 'நிர்வாகம்', icon: '🛡️', color: '#ef4444' }
];

const SPECIALTIES = [
  'Cardiology', 'Orthopedics', 'Neurology', 'General Medicine',
  'Pediatrics', 'Dermatology', 'Ophthalmology', 'ENT',
  'Psychiatry', 'Gynecology', 'Oncology', 'Endocrinology'
];

function OTPInput({ value, onChange }) {
  return (
    <div className="otp-boxes">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="otp-box"
          value={value[i] || ''}
          onChange={e => {
            const chars = value.split('');
            chars[i] = e.target.value.replace(/\D/, '');
            onChange(chars.join(''));
            if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !value[i] && e.target.previousSibling) {
              e.target.previousSibling.focus();
            }
          }}
        />
      ))}
    </div>
  );
}

function WelcomeScreen({ role, name, onContinue }) {
  const roleConfig = ROLES.find(r => r.id === role) || ROLES[0];
  return (
    <div className="welcome-screen">
      <div className="welcome-confetti">🎉</div>
      <div className="welcome-avatar">{roleConfig.icon}</div>
      <h2 className="welcome-title">Welcome to HeloDoc!</h2>
      <p className="welcome-name">{name || 'Valued User'}</p>
      <p className="welcome-role-label">{roleConfig.label}</p>
      <div className="welcome-features">
        {role === 'patient' && [
          '📅 Book Appointments Online',
          '🗺️ Navigate Hospital Rooms',
          '💊 Medicine Home Delivery',
          '🤖 AI Health Assistant'
        ].map(f => <div key={f} className="welcome-feature">{f}</div>)}
        {role === 'doctor' && [
          '📋 Manage Patient Queue',
          '📝 Issue Digital Prescriptions',
          '📊 View Appointment Schedule',
          '🎥 Teleconsultation'
        ].map(f => <div key={f} className="welcome-feature">{f}</div>)}
        {role === 'pharmacy' && [
          '📦 Manage Medicine Orders',
          '🔍 Verify Prescriptions',
          '🚚 Dispatch Home Deliveries',
          '⚗️ Inventory Control'
        ].map(f => <div key={f} className="welcome-feature">{f}</div>)}
        {role === 'delivery' && [
          '🗺️ Delivery Route Map',
          '📦 Pickup Notifications',
          '🔐 OTP Confirmation',
          '📊 Earnings Dashboard'
        ].map(f => <div key={f} className="welcome-feature">{f}</div>)}
        {role === 'admin' && [
          '🏥 Manage Hospitals & Rooms',
          '👨‍⚕️ Doctor Verification',
          '📊 Reports & Analytics',
          '🔒 System Administration'
        ].map(f => <div key={f} className="welcome-feature">{f}</div>)}
      </div>
      <button className="welcome-continue-btn" onClick={onContinue}>
        Enter HeloDoc <ChevronRight size={18} />
      </button>
    </div>
  );
}

export const AuthTab = () => {
  const {
    switchRole, openModal, setIsLoggedIn, navigateToTab,
    triggerDynamicIsland, changeLanguage, currentLang, t
  } = useApp();

  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'welcome'
  const [loginType, setLoginType] = useState('otp');  // 'otp' | 'email'
  const [selectedRole, setSelectedRole] = useState('patient');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1: Role | 2: Details | 3: OTP verify

  // OTP State
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState('');

  // Email signin State
  const [email, setEmail] = useState('ramachandran.v@gmail.com');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  // Signup form State
  const [signupForm, setSignupForm] = useState({
    fullName: '', phone: '', email: '', dob: '', gender: '',
    address: '', emergencyContact: '', preferredLang: 'en',
    // Doctor fields
    hospital: '', department: '', specialty: '', medRegNo: '',
    experience: '', consultFee: '', availableDays: []
  });
  const [signupOtp, setSignupOtp] = useState('');
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  // OTP Countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  const handleSendOtp = (e) => {
    e?.preventDefault();
    if (phone.length !== 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpError('');
    setOtpSent(true);
    setOtpTimer(60);
    triggerDynamicIsland('OTP Dispatched: 123456 📲');
  };

  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    if (otp.length < 4) {
      setOtpError('Enter the 6-digit OTP');
      return;
    }
    setIsLoggedIn(true);
    switchRole(selectedRole);
    triggerDynamicIsland('Authenticated Successfully ✓');
  };

  const handleEmailSignIn = (e) => {
    e?.preventDefault();
    if (!email.includes('@')) {
      setEmailError('Enter a valid email address');
      return;
    }
    if (password.length < 4) {
      setEmailError('Incorrect password');
      return;
    }
    setIsLoggedIn(true);
    switchRole(selectedRole);
    triggerDynamicIsland('Authenticated Successfully ✓');
  };

  const handleGuestAccess = () => {
    setIsLoggedIn(true);
    switchRole('patient');
    triggerDynamicIsland('Guest Access Granted 👁️');
  };

  const handleSeniorInstantLogin = () => {
    setIsLoggedIn(true);
    switchRole('patient');
    triggerDynamicIsland('Senior Instant Access Granted 👵');
  };

  const handleSignupNext = () => {
    if (signupStep === 1) {
      setSignupStep(2);
    } else if (signupStep === 2) {
      if (!signupForm.fullName || !signupForm.phone) {
        triggerDynamicIsland('Fill all required fields');
        return;
      }
      setSignupOtpSent(true);
      setSignupStep(3);
      triggerDynamicIsland('Verification OTP Sent 📲');
    }
  };

  const handleSignupComplete = () => {
    if (!agreedToTerms) {
      triggerDynamicIsland('Please accept Terms & Conditions');
      return;
    }
    setWelcomeName(signupForm.fullName);
    setAuthMode('welcome');
    triggerDynamicIsland(`Welcome, ${signupForm.fullName}! 🎉`);
  };

  const handleWelcomeContinue = () => {
    setIsLoggedIn(true);
    switchRole(selectedRole);
  };

  const updateSignupForm = (field, value) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day) => {
    setSignupForm(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  // WELCOME SCREEN
  if (authMode === 'welcome') {
    return <WelcomeScreen role={selectedRole} name={welcomeName} onContinue={handleWelcomeContinue} />;
  }

  const currentLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="auth-tab-container">
      {/* Language Selector */}
      <div className="auth-lang-bar">
        <Globe size={14} className="auth-lang-globe" />
        <button className="auth-lang-btn" onClick={() => setShowLangPicker(!showLangPicker)}>
          {currentLangObj.native}
          <ChevronRight size={13} className={`auth-lang-chevron ${showLangPicker ? 'open' : ''}`} />
        </button>
        {showLangPicker && (
          <div className="auth-lang-dropdown">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                className={`auth-lang-option ${currentLang === lang.code ? 'active' : ''}`}
                onClick={() => { changeLanguage(lang.code); setShowLangPicker(false); }}
              >
                <span>{lang.native}</span>
                <span className="auth-lang-english">{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3D Medical Brand Hero */}
      <div className="auth-hero-card card-3d-enhanced">
        <div className="auth-hero-bg-overlay" style={{ backgroundImage: `url('/assets/medical-3d-hero.jpg')` }}></div>
        <div className="auth-hero-glass-content">
          <div className="auth-brand-logo">
            <img src="/assets/logo.svg" alt="HeloDoc Logo" />
          </div>
          <h2 className="auth-brand-name">Helo<span>Doc</span></h2>
          <p className="auth-hero-tagline">{t('authHeroSub') || 'Your Care, Connected'}</p>

          {/* Interactive 3D Hospital Hologram Visual */}
          <div className="auth-hospital-visual-3d">
            <div className="hologram-stage-3d">
              <div className="hologram-ring outer-ring"></div>
              <div className="hologram-ring middle-ring"></div>
              <div className="hologram-core-beacon">
                <div className="beacon-cross">✚</div>
                <div className="beacon-pulse-wave"></div>
              </div>
              <div className="hologram-floating-nodes">
                <span className="h-node blue" style={{ top: '15%', left: '20%' }}>OPD 3D</span>
                <span className="h-node green" style={{ top: '65%', left: '70%' }}>Bed Live</span>
                <span className="h-node cyan" style={{ top: '25%', left: '75%' }}>GPS Map</span>
              </div>
            </div>
            <div className="hologram-base-glow"></div>
          </div>
        </div>
      </div>

      {/* Sign In / Sign Up Tab Toggle */}
      <div className="auth-mode-tabs">
        <button
          className={`auth-mode-tab ${authMode === 'signin' ? 'active' : ''}`}
          onClick={() => { setAuthMode('signin'); setOtpSent(false); setOtp(''); }}
        >
          <LogIn size={16} />
          Sign In
        </button>
        <button
          className={`auth-mode-tab ${authMode === 'signup' ? 'active' : ''}`}
          onClick={() => { setAuthMode('signup'); setSignupStep(1); }}
        >
          <UserPlus size={16} />
          Create Account
        </button>
      </div>

      {/* ================== SIGN IN ================== */}
      {authMode === 'signin' && (
        <div className="auth-form-card">
          {/* Role Selector */}
          <div className="auth-role-tabs">
            {ROLES.slice(0, 4).map(role => (
              <button
                key={role.id}
                className={`role-tab-btn ${selectedRole === role.id ? 'active' : ''}`}
                onClick={() => setSelectedRole(role.id)}
                style={selectedRole === role.id ? { borderColor: role.color, color: role.color } : {}}
              >
                {role.icon} {role.id === 'pharmacy' ? 'Pharmacy' : role.id === 'delivery' ? 'Courier' : role.label}
              </button>
            ))}
            <button
              className={`role-tab-btn ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedRole('admin')}
              style={selectedRole === 'admin' ? { borderColor: '#ef4444', color: '#ef4444' } : {}}
            >
              🛡️ Admin
            </button>
          </div>

          {/* Senior Instant Access */}
          {selectedRole === 'patient' && (
            <div className="senior-instant-login-box">
              <button className="senior-instant-btn" onClick={handleSeniorInstantLogin}>
                👵 {t('quickSeniorLogin') || 'Quick Senior Access (1-Tap)'}
              </button>
            </div>
          )}

          {/* Login Type Toggle */}
          <div className="login-type-switcher">
            <button
              className={`type-btn ${loginType === 'otp' ? 'active' : ''}`}
              onClick={() => setLoginType('otp')}
            >
              <Smartphone size={15} /> {t('phoneLogin') || 'Mobile OTP'}
            </button>
            <button
              className={`type-btn ${loginType === 'email' ? 'active' : ''}`}
              onClick={() => setLoginType('email')}
            >
              <Mail size={15} /> {t('emailLogin') || 'Email'}
            </button>
          </div>

          {/* OTP Form */}
          {loginType === 'otp' && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
              <div className="form-group">
                <label>{t('enterMobileNo') || 'Mobile Number'}</label>
                <div className="phone-input-wrap">
                  <span className="country-prefix">🇮🇳 +91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/, '')); setOtpError(''); }}
                    placeholder="9876543210"
                  />
                </div>
              </div>
              {otpError && <p className="auth-error-msg"><AlertCircle size={13} /> {otpError}</p>}

              {otpSent && (
                <div className="form-group mt-3">
                  <label>{t('enterOtpPrompt') || 'Enter 6-Digit OTP'}</label>
                  <OTPInput value={otp} onChange={setOtp} />
                  <div className="otp-resend-row">
                    <p className="field-hint text-emerald-600">
                      ✓ Demo OTP: <strong>123456</strong>
                    </p>
                    {otpTimer > 0 ? (
                      <span className="otp-timer">
                        <Clock size={13} /> Resend in {otpTimer}s
                      </span>
                    ) : (
                      <button type="button" className="otp-resend-btn" onClick={handleSendOtp}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" className="primary-btn full-width mt-4">
                {otpSent ? (t('verifyAndEnter') || 'Verify & Enter') : (t('sendOtpCode') || 'Send OTP')}
              </button>
            </form>
          )}

          {/* Email Form */}
          {loginType === 'email' && (
            <form onSubmit={handleEmailSignIn}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-icon-wrap">
                  <Mail size={15} className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                    placeholder="doctor@hospital.com"
                  />
                </div>
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <div className="input-icon-wrap">
                  <Lock size={15} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setEmailError(''); }}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {emailError && <p className="auth-error-msg"><AlertCircle size={13} /> {emailError}</p>}
              <button type="button" className="forgot-password-link">
                Forgot Password?
              </button>
              <button type="submit" className="primary-btn full-width mt-4">
                Sign In to HeloDoc ➜
              </button>
            </form>
          )}

          {/* Divider + Google SSO */}
          <div className="google-auth-separator"><span>OR</span></div>
          <button className="google-sso-btn full-width" onClick={() => openModal('googleAuth')}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={18} height={18} />
            <span>Continue with Google Account</span>
          </button>

          {/* Guest Access */}
          <button className="guest-access-btn" onClick={handleGuestAccess}>
            👁️ Continue as Guest (Map & Info only)
          </button>

          {/* ToS */}
          <p className="auth-tos-text">
            By signing in, you agree to our{' '}
            <span className="auth-tos-link">Terms of Service</span>{' '}
            and{' '}
            <span className="auth-tos-link">Privacy Policy</span>
          </p>
        </div>
      )}

      {/* ================== SIGN UP ================== */}
      {authMode === 'signup' && (
        <div className="auth-form-card">
          {/* Progress Indicator */}
          <div className="signup-progress">
            <div className={`signup-step ${signupStep >= 1 ? 'done' : ''}`}>
              <span>1</span><label>Role</label>
            </div>
            <div className="signup-progress-line" />
            <div className={`signup-step ${signupStep >= 2 ? 'done' : ''}`}>
              <span>2</span><label>Details</label>
            </div>
            <div className="signup-progress-line" />
            <div className={`signup-step ${signupStep >= 3 ? 'done' : ''}`}>
              <span>3</span><label>Verify</label>
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {signupStep === 1 && (
            <div className="signup-step-content">
              <h3 className="signup-step-title">Who are you?</h3>
              <p className="signup-step-sub">Select your role to get started</p>
              <div className="signup-role-grid">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    className={`signup-role-card ${selectedRole === role.id ? 'active' : ''}`}
                    onClick={() => setSelectedRole(role.id)}
                    style={selectedRole === role.id ? { borderColor: role.color } : {}}
                  >
                    <span className="signup-role-icon">{role.icon}</span>
                    <span className="signup-role-label">{role.label}</span>
                    <span className="signup-role-native">{role.native}</span>
                    {selectedRole === role.id && (
                      <div className="signup-role-check" style={{ background: role.color }}>
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button className="primary-btn full-width mt-4" onClick={handleSignupNext}>
                Continue as {ROLES.find(r => r.id === selectedRole)?.label} ➜
              </button>
            </div>
          )}

          {/* Step 2: Details Form */}
          {signupStep === 2 && (
            <div className="signup-step-content">
              <button className="signup-back-btn" onClick={() => setSignupStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <h3 className="signup-step-title">
                {ROLES.find(r => r.id === selectedRole)?.icon} Create Your Account
              </h3>

              {/* Common Fields */}
              <div className="signup-form-grid">
                <div className="form-group full">
                  <label>Full Name <span className="required">*</span></label>
                  <div className="input-icon-wrap">
                    <User size={15} className="input-icon" />
                    <input
                      type="text"
                      value={signupForm.fullName}
                      onChange={e => updateSignupForm('fullName', e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone <span className="required">*</span></label>
                  <div className="phone-input-wrap small">
                    <span className="country-prefix">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={signupForm.phone}
                      onChange={e => updateSignupForm('phone', e.target.value.replace(/\D/, ''))}
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-icon-wrap">
                    <Mail size={15} className="input-icon" />
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={e => updateSignupForm('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Patient-specific fields */}
                {selectedRole === 'patient' && <>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <div className="input-icon-wrap">
                      <Calendar size={15} className="input-icon" />
                      <input type="date" value={signupForm.dob} onChange={e => updateSignupForm('dob', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select value={signupForm.gender} onChange={e => updateSignupForm('gender', e.target.value)} className="signup-select">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="form-group full">
                    <label>Address</label>
                    <div className="input-icon-wrap">
                      <MapPin size={15} className="input-icon" />
                      <input
                        type="text"
                        value={signupForm.address}
                        onChange={e => updateSignupForm('address', e.target.value)}
                        placeholder="Flat No, Street, City"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact</label>
                    <div className="input-icon-wrap">
                      <Phone size={15} className="input-icon" />
                      <input
                        type="tel"
                        maxLength={10}
                        value={signupForm.emergencyContact}
                        onChange={e => updateSignupForm('emergencyContact', e.target.value.replace(/\D/, ''))}
                        placeholder="Emergency mobile"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Preferred Language</label>
                    <select
                      value={signupForm.preferredLang}
                      onChange={e => updateSignupForm('preferredLang', e.target.value)}
                      className="signup-select"
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>{l.native} ({l.label})</option>
                      ))}
                    </select>
                  </div>
                </>}

                {/* Doctor-specific fields */}
                {selectedRole === 'doctor' && <>
                  <div className="form-group">
                    <label>Hospital / Clinic</label>
                    <div className="input-icon-wrap">
                      <Building2 size={15} className="input-icon" />
                      <input
                        type="text"
                        value={signupForm.hospital}
                        onChange={e => updateSignupForm('hospital', e.target.value)}
                        placeholder="Hospital name"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={signupForm.department}
                      onChange={e => updateSignupForm('department', e.target.value)}
                      placeholder="Cardiology, Ortho..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Specialty</label>
                    <select value={signupForm.specialty} onChange={e => updateSignupForm('specialty', e.target.value)} className="signup-select">
                      <option value="">Select Specialty</option>
                      {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Medical Reg. No.</label>
                    <div className="input-icon-wrap">
                      <ShieldCheck size={15} className="input-icon" />
                      <input
                        type="text"
                        value={signupForm.medRegNo}
                        onChange={e => updateSignupForm('medRegNo', e.target.value)}
                        placeholder="MCI / NMC Reg No."
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      value={signupForm.experience}
                      onChange={e => updateSignupForm('experience', e.target.value)}
                      placeholder="e.g. 12"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Consultation Fee (₹)</label>
                    <input
                      type="number"
                      value={signupForm.consultFee}
                      onChange={e => updateSignupForm('consultFee', e.target.value)}
                      placeholder="e.g. 500"
                      min="0"
                    />
                  </div>
                  <div className="form-group full">
                    <label>Available Days</label>
                    <div className="day-selector">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <button
                          key={day}
                          type="button"
                          className={`day-chip ${signupForm.availableDays.includes(day) ? 'active' : ''}`}
                          onClick={() => toggleDay(day)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </>}
              </div>

              <button className="primary-btn full-width mt-4" onClick={handleSignupNext}>
                Continue to Verification ➜
              </button>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {signupStep === 3 && (
            <div className="signup-step-content">
              <button className="signup-back-btn" onClick={() => setSignupStep(2)}>
                <ArrowLeft size={16} /> Back
              </button>
              <h3 className="signup-step-title">Verify Your Mobile</h3>
              <p className="signup-step-sub">OTP sent to +91 {signupForm.phone || '9876543210'}</p>

              <div className="form-group">
                <label>Enter 6-Digit OTP</label>
                <OTPInput value={signupOtp} onChange={setSignupOtp} />
                <p className="field-hint text-emerald-600">✓ Demo OTP: <strong>123456</strong></p>
              </div>

              <div className="signup-tos-check">
                <input
                  type="checkbox"
                  id="tos-check"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                />
                <label htmlFor="tos-check" className="tos-label">
                  I agree to the <span className="auth-tos-link">Terms of Service</span> and{' '}
                  <span className="auth-tos-link">Privacy Policy</span>
                </label>
              </div>

              <button
                className="primary-btn full-width mt-4"
                onClick={handleSignupComplete}
                disabled={!agreedToTerms}
              >
                Create Account & Enter HeloDoc 🎉
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthTab;
