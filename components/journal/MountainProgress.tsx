'use client';

import { useEffect, useState } from 'react';

interface MountainProgressProps {
  totalPoints: number;
  currentPoints: number;
  milestones: {
    points: number;
    label: string;
  }[];
}

export default function MountainProgress({ 
  totalPoints, 
  currentPoints, 
  milestones 
}: MountainProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((currentPoints / totalPoints) * 100);
  }, [currentPoints, totalPoints]);

  // Find current milestone
  const currentMilestone = milestones.find((m, i) => 
    currentPoints >= m.points && 
    (!milestones[i + 1] || currentPoints < milestones[i + 1].points)
  );

  // Calculate next milestone points safely
  const pointsToNext = (() => {
    const nextMilestone = milestones.find(m => m.points > currentPoints);
    return nextMilestone ? nextMilestone.points - currentPoints : 0;
  })();

  return (
    <div className="mountain-container">
      {/* Background Elements */}
      <div className="stars">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* SVG Mountains */}
      <svg 
        className="mountains" 
        viewBox="0 0 1000 400" 
        preserveAspectRatio="none"
      >
        {/* Background Mountains */}
        <path 
          className="mountain mountain-3"
          d="M0 400 L200 300 L400 350 L600 280 L800 330 L1000 290 L1000 400 Z" 
        />
        <path 
          className="mountain mountain-2"
          d="M0 400 L150 320 L300 350 L450 300 L600 340 L750 290 L900 320 L1000 300 L1000 400 Z" 
        />
        
        {/* Main Mountain (that progress follows) */}
        <path 
          className="mountain mountain-1"
          d="M0 400 L0 350 L1000 100 L1000 400 Z" 
        />

        {/* Progress Path */}
        <path
          className="progress-path"
          d="M0 350 L1000 100"
          fill="none"
          strokeDasharray="1000"
          strokeDashoffset={1000 - (progress * 10)}
        />

        {/* Milestone Markers */}
        {milestones.map((milestone, index) => {
          const milestoneProgress = (milestone.points / totalPoints) * 100;
          const isCurrent = currentPoints >= milestone.points;
          const x = milestoneProgress * 10;
          const y = 350 - (milestoneProgress * 2.5);
          
          return (
            <g 
              key={index}
              className={`milestone ${isCurrent ? 'achieved' : ''}`}
              transform={`translate(${x}, ${y})`}
            >
              <circle className="milestone-marker" r="6" />
              <text 
                className="milestone-label" 
                y="-15"
                x="10"
                textAnchor="start"
              >
                {milestone.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Current Level Indicator */}
        {currentMilestone && (
          <g className="current-level">
            <text 
              x={progress * 10}
              y={350 - (progress * 2.5) + 30}
              className="current-level-label"
              textAnchor="middle"
            >
              {currentMilestone.label.toUpperCase()}
            </text>
          </g>
        )}
      </svg>

      {/* Progress Stats */}
      <div className="progress-stats">
        <div className="stat progress">
          <span className="value">{Math.round(progress)}%</span>
          <span className="label">PROGRESS</span>
        </div>
        <div className="stat points">
          <span className="value">{pointsToNext}</span>
          <span className="label">POINTS TO NEXT LEVEL</span>
        </div>
      </div>

      <style jsx>{`
        .mountain-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgb(16, 16, 16);
          border-radius: 16px;
          overflow: hidden;
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle 5s infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }

        .mountains {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
        }

        .mountain {
          transition: all 0.3s ease;
        }

        .mountain-1 {
          fill: rgb(32, 32, 32);
        }

        .mountain-2 {
          fill: rgb(28, 28, 28);
        }

        .mountain-3 {
          fill: rgb(24, 24, 24);
        }

        .progress-path {
          stroke: rgb(255, 200, 120);
          stroke-width: 3;
          filter: drop-shadow(0 0 8px rgba(255, 200, 120, 0.8));
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .milestone {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .milestone-marker {
          fill: rgb(80, 80, 80);
          r: 6;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .milestone.achieved .milestone-marker {
          fill: rgb(255, 200, 120);
          filter: drop-shadow(0 0 6px rgba(255, 200, 120, 0.8));
          r: 8;
        }

        .milestone-label {
          font-size: 14px;
          fill: rgb(120, 120, 120);
          font-weight: 600;
          letter-spacing: 0.1em;
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        .milestone.achieved .milestone-label {
          fill: rgb(220, 220, 220);
          opacity: 1;
        }

        .current-level-label {
          font-size: 18px;
          fill: rgb(255, 200, 120);
          font-weight: 700;
          filter: drop-shadow(0 0 6px rgba(255, 200, 120, 0.6));
          letter-spacing: 0.1em;
        }

        .progress-stats {
          position: absolute;
          top: 2rem;
          left: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: rgba(16, 16, 16, 0.9);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat .value {
          font-size: 2rem;
          font-weight: 700;
          color: rgb(255, 200, 120);
          line-height: 1;
          letter-spacing: 0.05em;
        }

        .stat .label {
          font-size: 0.875rem;
          color: rgb(160, 160, 160);
          font-weight: 500;
          letter-spacing: 0.1em;
        }

        @media (max-width: 768px) {
          .progress-stats {
            top: 1rem;
            left: 1rem;
            padding: 1rem;
          }

          .stat .value {
            font-size: 1.5rem;
          }

          .stat .label {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
} 