import React from 'react';
import rainbowPoop from '../assets/rainbow_poop.png';

const FallingRain = ({ onEnter }) => {
  return (
    <div className="home-screen" onClick={onEnter}>
      <img src={rainbowPoop} alt="Rainbow Poop" className="hero-poop" />
      <h1 className="main-title">응응가가</h1>
    </div>
  );
};

export default FallingRain;
