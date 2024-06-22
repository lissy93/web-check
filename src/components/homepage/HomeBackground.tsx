import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

// Global Animation Configuration Constants
const dotSpacing = 32; // Number of px between each dot
const meteorCount = 4; // Number of meteors to display at any given time
const tailLength = 80; // Length of the meteor tail in px
const distanceBase = 5; // Base distance for meteor to travel in grid units
const distanceVariance = 5; // Variance for randomization to append to travel in grid units
const durationBase = 1.5; // Base duration for meteor to travel in seconds
const durationVariance = 1; // Variance for randomization to append to travel in seconds
const delayBase = 500; // Base delay for meteor to respawn in milliseconds
const delayVariance = 1500; // Variance for randomization to append to respawn in milliseconds
const tailDuration = 0.25; // Duration for meteor tail to retract in seconds
const headEasing = [0.8, 0.6, 1, 1]; // Easing for meteor head
const tailEasing = [0.5, 0.6, 0.6, 1]; // Easing for meteor tail

const MeteorContainer = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #9fef00;
  top: 1px;
`;

const Tail = styled(motion.div)`
  position: absolute;
  top: -80px;
  left: 1px;
  width: 2px;
  height: 80px;
  background: linear-gradient(to bottom, transparent, #9fef00);
`;

const StyledSvg = styled.svg`
  pointer-events: none;
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  fill: rgba(100, 100, 100, 0.5);
  height: 100vh;
`;

const StyledRect = styled.rect`
  width: 100%;
  height: 100%;
  stroke-width: 0;
`;

const Container = styled.div`
  pointer-events: none;
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: 1;
  top: 0;
  left: 0;
  background: radial-gradient(circle at center top, transparent, transparent 60%, var(--background) 100%);
`;

const generateMeteor = (id: number, gridSizeX: number, gridSizeY: number) => {
  const column = Math.floor(Math.random() * gridSizeX);
  const startRow = Math.floor(Math.random() * (gridSizeY - 12));
  const travelDistance = distanceBase + Math.floor(Math.random() * distanceVariance);
  const duration = durationBase +  Math.floor(Math.random() * durationVariance);

  return {
    id,
    column,
    startRow,
    endRow: startRow + travelDistance,
    duration,
    tailVisible: true,
    animationStage: 'traveling',
    opacity: 1,
  };
};

const generateInitialMeteors = (gridSizeX: number, gridSizeY: number) => {
  const seen = new Set();
  return Array.from({ length: meteorCount }, (_, index) => generateMeteor(index, gridSizeX, gridSizeY))
    .filter(item => !seen.has(item.column) && seen.add(item.column));
};

const WebCheckHomeBackground = () => {
  const [gridSizeX, setGridSizeX] = useState(Math.floor(window.innerWidth / dotSpacing));
  const [gridSizeY, setGridSizeY] = useState(Math.floor(window.innerHeight / dotSpacing));
  const [meteors, setMeteors] = useState(() => generateInitialMeteors(gridSizeX, gridSizeY));

  const handleAnimationComplete = (id: number) => {
    setMeteors(current =>
      current.map(meteor => {
        if (meteor.id === id) {
          if (meteor.animationStage === 'traveling') {
            // Transition to retracting tail
            return { ...meteor, tailVisible: false, animationStage: 'retractingTail' };
          } else if (meteor.animationStage === 'retractingTail') {
            // Set to resetting and make invisible
            return { ...meteor, animationStage: 'resetting', opacity: 0 };
          } else if (meteor.animationStage === 'resetting') {
            // Respawn the meteor after a delay
            setTimeout(() => {
              setMeteors(current =>
                current.map(m => m.id === id ? generateMeteor(id, gridSizeX, gridSizeY) : m)
              );
            }, delayBase + Math.random() * delayVariance);
          }
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
      <Container />
      <StyledSvg>
        <defs>
          <pattern id="dot-pattern" width={dotSpacing} height={dotSpacing} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={2} />
          </pattern>
        </defs>
        <StyledRect fill="url(#dot-pattern)" />
      </StyledSvg>

      {meteors.map(({ id, column, startRow, endRow, duration, tailVisible, animationStage, opacity }) => {
        return (
        <MeteorContainer
          key={id}
          initial={{
            x: column * dotSpacing,
            y: startRow * dotSpacing,
            opacity: 1,
          }}
          animate={{
            opacity: tailVisible ? 1 : 0,
            y: animationStage === 'resetting' ? startRow * dotSpacing : endRow * dotSpacing,
          }}
          transition={{
            duration: animationStage === 'resetting' ? 0 : duration,
            ease: headEasing,
          }}
          onAnimationComplete={() => handleAnimationComplete(id)}
        >
          <Tail
            initial={{ top: `-${tailLength}px`, height: `${tailLength}px` }}
            animate={{ top: tailVisible ? `-${tailLength}px` : 0, height: tailVisible ? `${tailLength}px` : 0 }}
            transition={{
              duration: tailDuration,
              ease: tailEasing,
            }}
          />
        </MeteorContainer>
      );
      })}
    </>
  );
};

export default WebCheckHomeBackground;
