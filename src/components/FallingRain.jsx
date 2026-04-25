import React from 'react';
import rainbowPoop from '../assets/rainbow_poop.png';

const FallingRain = ({ onEnter }) => {
  return (
    <div className="landing-screen" onClick={onEnter}>
      <div className="landing-content">
        <h1 className="landing-title-split top">
          <span className="char" style={{ backgroundColor: '#ff80ab' }}>응</span>
          <span className="char" style={{ backgroundColor: '#80d8ff' }}>응</span>
        </h1>
        <img src={rainbowPoop} alt="Rainbow Poop" className="hero-poop" />
        <h1 className="landing-title-split bottom">
          <span className="char" style={{ backgroundColor: '#69f0ae' }}>가</span>
          <span className="char" style={{ backgroundColor: '#ffd180' }}>가</span>
        </h1>
      </div>
    </div>
  );
};

export default FallingRain;
