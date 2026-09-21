import React from 'react';
import { useApp } from '../../context/AppContext';

export const InApp3DBackdrop = () => {
  const { elderMode } = useApp();

  return (
    <div className={`in-app-3d-backdrop ${elderMode ? 'calm-mode' : ''}`} aria-hidden="true">
      {/* 1. Volumetric Animated Floating 3D Orbs */}
      <div className="ambient-3d-orb orb-cyan" />
      <div className="ambient-3d-orb orb-blue" />
      <div className="ambient-3d-orb orb-emerald" />
      <div className="ambient-3d-orb orb-violet" />

      {/* 2. 3D Holographic Perspective Floor Grid */}
      <div className="perspective-grid-3d" />

      {/* 3. Real-time ECG Heartbeat Waveform Strip */}
      <div className="ecg-monitor-ticker">
        <svg className="ecg-svg" viewBox="0 0 600 32" preserveAspectRatio="none">
          <path
            className="ecg-pulse-line"
            d="M0,16 L120,16 L130,16 L135,6 L142,26 L148,2 L154,22 L158,16 L200,16 L320,16 L330,16 L335,6 L342,26 L348,2 L354,22 L358,16 L400,16 L520,16 L530,16 L535,6 L542,26 L548,2 L554,22 L558,16 L600,16"
          />
        </svg>
      </div>

      {/* 4. Subtle Ambient Light Ray */}
      <div className="ambient-light-ray" />
    </div>
  );
};

export default InApp3DBackdrop;
