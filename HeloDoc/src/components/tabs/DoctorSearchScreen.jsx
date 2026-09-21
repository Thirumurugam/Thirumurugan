import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Star, MapPin, Clock, IndianRupee, Filter, Search,
  ChevronRight, Phone, Video, Building2, Languages,
  Award, Calendar, Heart, ShieldCheck, X
} from 'lucide-react';

const DEMO_DOCTORS = [
  {
    id: 'doc-201', name: 'Dr. Priya Nair', photo: null, specialty: 'Cardiologist',
    department: 'Cardiology', hospital: 'Apollo Hospitals, Greams Road', hospitalId: 'h1',
    experience: '14 years', rating: 4.9, reviewCount: 312, fee: 800,
    languages: ['English', 'Tamil', 'Malayalam'], gender: 'female',
    consultModes: ['in-person', 'video'], insurance: ['Ayushman Bharat', 'Star Health'],
    nextSlot: 'Today 2:00 PM', available: true, verified: true,
    qualifications: 'MBBS, MD (Cardiology), FACC',
    about: 'Specialist in interventional cardiology, heart failure, and preventive cardiac care.'
  },
  {
    id: 'doc-101', name: 'Dr. Rajesh Kumar', photo: null, specialty: 'Orthopaedic Surgeon',
    department: 'Orthopedics', hospital: 'AIIMS, New Delhi', hospitalId: 'h2',
    experience: '18 years', rating: 4.8, reviewCount: 489, fee: 600,
    languages: ['English', 'Hindi', 'Tamil'], gender: 'male',
    consultModes: ['in-person'], insurance: ['PM-JAY', 'Arogyasri'],
    nextSlot: 'Today 4:30 PM', available: true, verified: true,
    qualifications: 'MBBS, MS (Ortho), DNB',
    about: 'Expert in joint replacement, sports injuries, and spinal disorders.'
  },
  {
    id: 'doc-301', name: 'Dr. Ananya Singh', photo: null, specialty: 'General Physician',
    department: 'General Medicine', hospital: 'JIPMER, Puducherry', hospitalId: 'h3',
    experience: '9 years', rating: 4.7, reviewCount: 201, fee: 400,
    languages: ['English', 'Hindi', 'Telugu'], gender: 'female',
    consultModes: ['in-person', 'video', 'chat'], insurance: ['Ayushman Bharat'],
    nextSlot: 'Tomorrow 10:00 AM', available: true, verified: true,
    qualifications: 'MBBS, MD (General Medicine)',
    about: 'Experienced in managing diabetes, hypertension, fever, and preventive care.'
  },
  {
    id: 'doc-401', name: 'Dr. Suresh Babu', photo: null, specialty: 'Neurologist',
    department: 'Neurology', hospital: 'Fortis Hospital, Bengaluru', hospitalId: 'h1',
    experience: '22 years', rating: 4.9, reviewCount: 634, fee: 1200,
    languages: ['English', 'Kannada', 'Tamil'], gender: 'male',
    consultModes: ['in-person', 'video'], insurance: ['Star Health', 'Max Bupa'],
    nextSlot: 'Tomorrow 11:30 AM', available: true, verified: true,
    qualifications: 'MBBS, DM (Neurology), FAAN',
    about: 'Specialist in epilepsy, movement disorders, stroke, and neurodegenerative conditions.'
  },
  {
    id: 'doc-501', name: 'Dr. Kavitha Reddy', photo: null, specialty: 'Diabetologist',
    department: 'Endocrinology', hospital: 'Apollo Hospitals, Greams Road', hospitalId: 'h1',
    experience: '11 years', rating: 4.8, reviewCount: 278, fee: 700,
    languages: ['English', 'Telugu', 'Tamil'], gender: 'female',
    consultModes: ['in-person', 'video'], insurance: ['Ayushman Bharat', 'United India'],
    nextSlot: 'Today 5:00 PM', available: true, verified: true,
    qualifications: 'MBBS, MD (Medicine), Fellowship in Diabetes',
    about: 'Expert in Type 1 & 2 diabetes management, thyroid disorders, and obesity medicine.'
  }
];

const SPECIALTIES = ['All', 'Cardiology', 'Orthopedics', 'General Medicine', 'Neurology', 'Endocrinology', 'Dermatology', 'Ophthalmology', 'ENT'];

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
];
const AVAILABLE_DATES = [
  { label: 'Today', date: 'Sep 19', day: 'Fri' },
  { label: 'Tomorrow', date: 'Sep 20', day: 'Sat' },
  { label: '', date: 'Sep 22', day: 'Mon' },
  { label: '', date: 'Sep 23', day: 'Tue' },
  { label: '', date: 'Sep 24', day: 'Wed' }
];

const DoctorCard = ({ doc, onBook, onViewProfile }) => (
  <div className="doctor-search-card">
    <div className="doctor-card-top">
      <div className="doctor-avatar-wrap">
        <div className="doctor-avatar-circle">
          {doc.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
        </div>
        {doc.verified && (
          <div className="doctor-verified-badge" title="Verified Doctor">
            <ShieldCheck size={12} />
          </div>
        )}
      </div>
      <div className="doctor-card-info">
        <h3 className="doctor-card-name">{doc.name}</h3>
        <p className="doctor-card-spec">{doc.specialty} • {doc.experience}</p>
        <p className="doctor-card-hospital">
          <Building2 size={12} />
          {doc.hospital}
        </p>
        <p className="doctor-card-qual">{doc.qualifications}</p>
      </div>
      <button className="doctor-fav-btn" aria-label="Save doctor">
        <Heart size={16} />
      </button>
    </div>

    <div className="doctor-card-stats">
      <div className="doctor-stat-chip">
        <Star size={13} className="text-amber-500" />
        <strong>{doc.rating}</strong>
        <span>({doc.reviewCount})</span>
      </div>
      <div className="doctor-stat-chip">
        <IndianRupee size={13} className="text-emerald-500" />
        <strong>₹{doc.fee}</strong>
        <span>/ visit</span>
      </div>
      <div className="doctor-stat-chip">
        <Languages size={13} className="text-blue-500" />
        <span>{doc.languages.slice(0, 2).join(', ')}</span>
      </div>
    </div>

    <div className="doctor-card-modes">
      {doc.consultModes.includes('in-person') && (
        <span className="doctor-mode-pill inperson">🏥 In-Person</span>
      )}
      {doc.consultModes.includes('video') && (
        <span className="doctor-mode-pill video">🎥 Video</span>
      )}
      {doc.consultModes.includes('chat') && (
        <span className="doctor-mode-pill chat">💬 Chat</span>
      )}
    </div>

    <div className="doctor-card-slot-row">
      <div className="doctor-next-slot">
        <Clock size={13} className="text-green-500" />
        <span>Next: <strong>{doc.nextSlot}</strong></span>
      </div>
      <div className="doctor-card-actions">
        <button className="doctor-profile-btn" onClick={() => onViewProfile(doc)}>
          Profile
        </button>
        <button className="doctor-book-btn" onClick={() => onBook(doc)}>
          Book Now
        </button>
      </div>
    </div>
  </div>
);

const DoctorProfile = ({ doc, onClose, onBook }) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <div className="doctor-profile-overlay">
      <div className="doctor-profile-sheet">
        <button className="doctor-profile-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Profile Header */}
        <div className="doctor-profile-hero">
          <div className="doctor-profile-avatar">
            {doc.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}
          </div>
          <div className="doctor-profile-details">
            <div className="doctor-profile-name-row">
              <h2>{doc.name}</h2>
              {doc.verified && (
                <div className="doctor-profile-verified">
                  <ShieldCheck size={14} />
                  <span>Verified</span>
                </div>
              )}
            </div>
            <p className="doctor-profile-spec">{doc.specialty}</p>
            <p className="doctor-profile-qual">{doc.qualifications}</p>
            <div className="doctor-profile-stats-row">
              <div className="doctor-profile-stat">
                <Star size={14} className="text-amber-500" />
                <span>{doc.rating} ({doc.reviewCount} reviews)</span>
              </div>
              <div className="doctor-profile-stat">
                <Award size={14} className="text-blue-500" />
                <span>{doc.experience}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital */}
        <div className="doctor-profile-section">
          <div className="doctor-profile-hospital-card">
            <Building2 size={16} className="text-blue-500" />
            <div>
              <p className="doctor-profile-hospital-name">{doc.hospital}</p>
              <p className="doctor-profile-dept">{doc.department}</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="doctor-profile-section">
          <h4 className="doctor-profile-section-title">About</h4>
          <p className="doctor-profile-about">{doc.about}</p>
        </div>

        {/* Languages & Insurance */}
        <div className="doctor-profile-row-wrap">
          <div className="doctor-profile-section half">
            <h4 className="doctor-profile-section-title">Languages</h4>
            <div className="doctor-tags">
              {doc.languages.map(l => (
                <span key={l} className="doctor-tag lang">{l}</span>
              ))}
            </div>
          </div>
          <div className="doctor-profile-section half">
            <h4 className="doctor-profile-section-title">Insurance</h4>
            <div className="doctor-tags">
              {doc.insurance.map(i => (
                <span key={i} className="doctor-tag insurance">{i}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Consultation Modes */}
        <div className="doctor-profile-section">
          <h4 className="doctor-profile-section-title">Consultation Fee</h4>
          <div className="doctor-fee-cards">
            {doc.consultModes.map(mode => (
              <div key={mode} className="doctor-fee-card">
                <span className="doctor-fee-mode-icon">
                  {mode === 'in-person' ? '🏥' : mode === 'video' ? '🎥' : '💬'}
                </span>
                <span className="doctor-fee-mode-label">
                  {mode === 'in-person' ? 'In-Person' : mode === 'video' ? 'Video Call' : 'Chat'}
                </span>
                <span className="doctor-fee-amount">₹{doc.fee}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Date Picker */}
        <div className="doctor-profile-section">
          <h4 className="doctor-profile-section-title">
            <Calendar size={15} />
            Select Date
          </h4>
          <div className="doctor-date-picker">
            {AVAILABLE_DATES.map((d, i) => (
              <button
                key={i}
                className={`doctor-date-chip ${selectedDate === i ? 'active' : ''}`}
                onClick={() => { setSelectedDate(i); setSelectedSlot(null); }}
              >
                {d.label && <span className="doctor-date-badge">{d.label}</span>}
                <span className="doctor-date-day">{d.day}</span>
                <span className="doctor-date-num">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Picker */}
        <div className="doctor-profile-section">
          <h4 className="doctor-profile-section-title">
            <Clock size={15} />
            Select Time
          </h4>
          <div className="doctor-slot-grid">
            {TIME_SLOTS.map((slot, i) => (
              <button
                key={i}
                className={`doctor-slot-chip ${selectedSlot === slot ? 'active' : ''} ${i % 3 === 2 ? 'unavailable' : ''}`}
                onClick={() => i % 3 !== 2 && setSelectedSlot(slot)}
                disabled={i % 3 === 2}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Book Button */}
        <div className="doctor-profile-book-section">
          <div className="doctor-profile-fee-summary">
            <span>Consultation Fee:</span>
            <strong>₹{doc.fee}</strong>
          </div>
          <button
            className="doctor-profile-book-btn"
            onClick={() => onBook(doc, AVAILABLE_DATES[selectedDate], selectedSlot)}
            disabled={!selectedSlot}
          >
            {selectedSlot ? `Book for ${AVAILABLE_DATES[selectedDate].date}, ${selectedSlot}` : 'Select a Time Slot'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DoctorSearchScreen = () => {
  const {
    initiateAppointmentBooking, navigateToTab, triggerDynamicIsland, t
  } = useApp();

  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [showProfile, setShowProfile] = useState(null);
  const [sortBy, setSortBy] = useState('rating');

  const filtered = DEMO_DOCTORS.filter(d => {
    const matchQ = d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.specialty.toLowerCase().includes(query.toLowerCase()) ||
      d.hospital.toLowerCase().includes(query.toLowerCase());
    const matchSpec = specialty === 'All' || d.department === specialty || d.specialty === specialty;
    return matchQ && matchSpec;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'fee') return a.fee - b.fee;
    return 0;
  });

  const handleBook = (doc, dateObj, slot) => {
    const dateLabel = dateObj ? `${dateObj.day}, ${dateObj.date}` : 'Today';
    const timeSlot = slot || doc.nextSlot;
    initiateAppointmentBooking({
      doctorId: doc.id,
      doctorName: doc.name,
      specialty: doc.specialty,
      hospital: doc.hospital,
      department: doc.department,
      room: 'Room 201',
      floor: '2nd Floor (OPD)',
      date: dateLabel,
      timeSlot,
      fee: doc.fee,
      finalPrice: doc.fee,
      subsidyDiscount: 0
    });
    setShowProfile(null);
    triggerDynamicIsland(`Booking: ${doc.name} 📅`);
  };

  return (
    <div className="doctor-search-container">
      {/* Search Bar */}
      <div className="doctor-search-hero">
        <h2 className="doctor-search-title">Find a Doctor</h2>
        <p className="doctor-search-sub">Book appointments with top specialists</p>
        <div className="doctor-search-input-wrap">
          <Search size={18} className="doctor-search-input-icon" />
          <input
            type="text"
            placeholder="Search by name, specialty, hospital..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="doctor-search-input-field"
          />
        </div>
      </div>

      {/* Specialty Filter Chips */}
      <div className="doctor-specialty-strip">
        {SPECIALTIES.map(s => (
          <button
            key={s}
            className={`doctor-specialty-chip ${specialty === s ? 'active' : ''}`}
            onClick={() => setSpecialty(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="doctor-sort-row">
        <span className="doctor-result-count">{filtered.length} doctors found</span>
        <div className="doctor-sort-pills">
          <button
            className={`doctor-sort-pill ${sortBy === 'rating' ? 'active' : ''}`}
            onClick={() => setSortBy('rating')}
          >
            ⭐ Rating
          </button>
          <button
            className={`doctor-sort-pill ${sortBy === 'fee' ? 'active' : ''}`}
            onClick={() => setSortBy('fee')}
          >
            💰 Fee
          </button>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="doctor-cards-list">
        {filtered.map(doc => (
          <DoctorCard
            key={doc.id}
            doc={doc}
            onBook={(d) => handleBook(d, AVAILABLE_DATES[0], null)}
            onViewProfile={(d) => setShowProfile(d)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="doctor-empty-state">
            <Search size={40} className="doctor-empty-icon" />
            <p>No doctors found for your search</p>
            <button className="doctor-clear-btn" onClick={() => { setQuery(''); setSpecialty('All'); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Doctor Profile Drawer */}
      {showProfile && (
        <DoctorProfile
          doc={showProfile}
          onClose={() => setShowProfile(null)}
          onBook={handleBook}
        />
      )}
    </div>
  );
};

export default DoctorSearchScreen;
