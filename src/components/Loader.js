import React from 'react';
import { useSpring, animated } from 'react-spring';
import { Spin } from 'antd';
import './styles/Loader.css';

const Loader = () => {
  const wheelAnimation = useSpring({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    config: { duration: 2000 },
    loop: true,
  });

  const trackAnimation = useSpring({
    from: { transform: 'translateX(0%)' },
    to: { transform: 'translateX(-100%)' },
    config: { duration: 3000 },
    loop: true,
  });

  return (
    <div className="loader-container">
      <div className="train">
        <animated.div style={wheelAnimation} className="train-wheel" />
      </div>
  
    </div>
  );
};

export default Loader;


