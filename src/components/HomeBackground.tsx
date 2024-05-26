import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const dotSpacing = 32;

const Meteor = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #9fef00;
  box-shadow: 0 0 15px 3px #9fef00;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    left: 0;
    width: 2px;
    height: 100px;
    background: linear-gradient(to bottom, #9fef00, transparent);
  }
`;

const StyledSvg = styled.svg`
  pointer-events: none;
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  fill: rgba(100, 100, 100, 0.5);
`;

const StyledRect = styled.rect`
  width: 100%;
  height: 100%;
  stroke-width: 0;
`;

const generateMeteor = (id: number, gridSizeX: number, gridSizeY: number) => {
  const column = Math.floor(Math.random() * gridSizeX);
  const startRow = Math.floor(Math.random() * (gridSizeY - 12));
  const travelDistance = 5 + Math.floor(Math.random() * 10); // Between 5 and 15 spaces
  const duration = 1.5 + Math.random(); // 1.5 to 2.5 seconds duration

  return {
    id,
    column,
    startRow,
    endRow: startRow + travelDistance,
    duration,
    key: Math.random() + Math.random(),
  };
};

const DotPattern = ({ className }: { className?: string }) => {
  const countOfMeteors = 6;
  const [gridSizeX, setGridSizeX] = useState(Math.floor(window.innerWidth / dotSpacing));
  const [gridSizeY, setGridSizeY] = useState(Math.floor(window.innerHeight / dotSpacing));
  const [meteors, setMeteors] = useState(() => Array.from({ length: countOfMeteors }, (_, index) => generateMeteor(index, gridSizeX, gridSizeY)));

  const handleAnimationComplete = (id: number) => {
    setMeteors(current =>
      current.map(meteor => {
        if (meteor.id === id) {
          return generateMeteor(id, gridSizeX, gridSizeY);
        }
        return meteor;
      })
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setGridSizeX(Math.floor(window.innerWidth / dotSpacing));
      setGridSizeY(Math.floor(window.innerHeight / dotSpacing));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <StyledSvg className={className}>
        <defs>
          <pattern id="dot-pattern" width={dotSpacing} height={dotSpacing} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={2} />
          </pattern>
        </defs>
        <StyledRect fill="url(#dot-pattern)" />
      </StyledSvg>

      {meteors.map(({ id, column, startRow, endRow, duration, key }) => (
        <Meteor
          key={key}
          initial={{
            x: column * dotSpacing,
            y: startRow * dotSpacing,
            opacity: 1
          }}
          animate={{
            y: endRow * dotSpacing,
            opacity: 0
          }}
          transition={{
            duration,
            // ease: "easeInOut"
            ease: [0.7, 0.75, 0.75, 1]
          }}
          onAnimationComplete={() => handleAnimationComplete(id)}
        />
      ))}
    </>
  );
};

export default DotPattern;
