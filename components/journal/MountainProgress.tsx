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
        {[...Array(100)].map((_, i) => (
          <div 
            key={i} 
            className={`star star-${i % 3}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 10}s`,
              transform: `scale(${0.8 + Math.random() * 0.4})`
            }}
          />
        ))}
      </div>

      {/* SVG Mountains */}
      <svg 
        className="mountains" 
        viewBox="0 0 1200 600" 
        preserveAspectRatio="none"
      >
        {/* Far Background Mountains */}
        <path 
          className="mountain mountain-4"
          d="M-100 600 L100 480 L300 520 L500 450 L700 500 L900 460 L1100 490 L1300 470 L1300 600 Z" 
        />
        <path 
          className="mountain mountain-3"
          d="M-100 600 L50 500 L200 540 L400 480 L600 520 L800 470 L1000 510 L1200 480 L1300 600 Z" 
        />
        
        {/* Mid Background Mountains */}
        <path 
          className="mountain mountain-2"
          d="M-50 600 L100 520 L300 560 L500 500 L700 550 L900 490 L1100 540 L1250 510 L1250 600 Z" 
        />
        
        {/* Main Mountain */}
        <path 
          className="mountain mountain-1"
          d="M100 600 L100 600 L600 200 L1100 600 L1100 600 Z" 
        />

        {/* Progress Path */}
        <path
          className="progress-path"
          d="M100 600 L600 200"
          fill="none"
          strokeDasharray="1400"
          strokeDashoffset={1400 - (progress * 14)}
        />

        {/* Milestone Markers */}
        {milestones.map((milestone, index) => {
          const milestoneProgress = (milestone.points / totalPoints) * 100;
          
          // Calculate position along the mountain slope
          const progress = milestone.points / totalPoints;
          const x = 100 + (progress * 500); // From 100 to 600 (mountain peak)
          const y = 600 - (progress * 400); // From 600 to 200 (mountain height)
          
          // Mark as achieved if current points are higher than this milestone
          const isAchieved = currentPoints >= milestone.points;
          
          return (
            <g 
              key={index}
              className={`milestone ${isAchieved ? 'achieved' : ''}`}
              transform={`translate(${x}, ${y})`}
            >
              <text 
                className="milestone-label" 
                y="-20"
                x="-15"
                textAnchor="end"
              >
                {milestone.label}
              </text>
              <circle className="milestone-marker" r="5" />
            </g>
          );
        })}
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
          min-height: 500px;
          background: linear-gradient(
            to bottom,
            rgb(8, 8, 12),
            rgb(16, 16, 24)
          );
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
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle 5s infinite;
        }

        .star-0 {
          width: 1px;
          height: 1px;
          box-shadow: 
            0 0 2px rgba(255, 255, 255, 0.8),
            0 0 4px rgba(255, 255, 255, 0.4);
        }

        .star-1 {
          width: 2px;
          height: 2px;
          box-shadow: 
            0 0 4px rgba(255, 255, 255, 0.8),
            0 0 8px rgba(255, 255, 255, 0.4);
        }

        .star-2 {
          width: 3px;
          height: 3px;
          box-shadow: 
            0 0 6px rgba(255, 255, 255, 0.8),
            0 0 12px rgba(255, 255, 255, 0.4);
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.2); 
          }
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
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mountain-1 {
          fill: rgb(32, 32, 40);
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
        }

        .mountain-2 {
          fill: rgb(24, 24, 32);
        }

        .mountain-3 {
          fill: rgb(20, 20, 28);
        }

        .mountain-4 {
          fill: rgb(16, 16, 24);
        }

        .progress-path {
          stroke: rgb(255, 200, 120);
          stroke-width: 3;
          filter: drop-shadow(0 0 8px rgba(255, 200, 120, 0.8));
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
          stroke-linecap: round;
        }

        .milestone {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .milestone-marker {
          fill: rgb(80, 80, 96);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .milestone.achieved .milestone-marker {
          fill: rgb(255, 200, 120);
          filter: drop-shadow(0 0 6px rgba(255, 200, 120, 0.8));
        }

        .milestone-label {
          font-size: 13px;
          fill: rgb(140, 140, 160);
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
        }

        .milestone.achieved .milestone-label {
          fill: rgb(255, 200, 120);
          filter: drop-shadow(0 0 6px rgba(255, 200, 120, 0.4));
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