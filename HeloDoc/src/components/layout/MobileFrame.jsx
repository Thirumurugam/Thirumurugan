import React from 'react';
import { useApp } from '../../context/AppContext';
import { Medical3DBackground } from './Medical3DBackground';
import { InApp3DBackdrop } from './InApp3DBackdrop';

export const MobileFrame = ({ children }) => {
  const { deviceView, dynamicIslandText, islandExpanded } = useApp();

  const getFrameClass = () => {
    if (deviceView === 'iphone') return 'frame-iphone';
    if (deviceView === 'android') return 'frame-android';
    return 'frame-fullscreen';
  };

  return (
    <main className="app-viewport-wrapper" id="viewport-wrapper">
      {/* Interactive 3D WebGL Medical Space Background */}
      <Medical3DBackground />

      <div className={`mobile-device-frame ${getFrameClass()}`} id="device-frame">
        {/* Device Hardware Features */}
        <div className="device-notch" id="device-notch">
          <div className={`dynamic-island ${islandExpanded ? 'expanded' : ''}`} id="dynamic-island">
            <div className="island-camera"></div>
            <div className="island-indicator" id="island-indicator">
              <span className="island-pulse"></span>
              <span className="island-text" id="island-text">{dynamicIslandText}</span>
            </div>
          </div>
        </div>

        {/* Inner Screen with Multi-Layer 3D Backdrop */}
        <div className="device-screen" id="app-screen">
          <InApp3DBackdrop />
          {children}
          {/* Device Bottom Gesture Bar */}
          <div className="device-home-bar"></div>
        </div>
      </div>
    </main>
  );
};

