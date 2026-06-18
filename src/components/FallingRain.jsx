import React from 'react';
import rainbowPoop from '../assets/rainbow_poop.png';

const FallingRain = ({ onEnter }) => {
  return (
    <div className="landing-screen" onClick={onEnter}>
      <div className="landing-content">
        <img src={rainbowPoop} alt="Rainbow Poop" className="hero-poop" />
      </div>
    </div>
  );
};

export default FallingRain;
