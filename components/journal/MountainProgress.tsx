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
    // Animate progress on mount and when points change
    setProgress((currentPoints / totalPoints) * 100);
  }, [currentPoints, totalPoints]);

  return (
    <div className="mountain-progress">
      <h2 className="mountain-title">CLIMBING THE MOUNTAIN OF GROWTH</h2>
      <div className="mountain-container">
        <div className="mountain-path">
          <div 
            className="progress-line"
            style={{ width: `${progress}%` }}
          />
          {milestones.map((milestone, index) => {
            const milestoneProgress = (milestone.points / totalPoints) * 100;
            const isCurrent = currentPoints >= milestone.points;
            
            return (
              <div
                key={index}
                className={`milestone ${isCurrent ? 'achieved' : ''}`}
                style={{ left: `${milestoneProgress}%` }}
              >
                <div className="milestone-marker" />
                <span className="milestone-label">{milestone.label}</span>
                <span className="milestone-points">{milestone.points}pts</span>
              </div>
            );
          })}
        </div>
        <div className="mountain-illustration" />
      </div>
      <style jsx>{`
        .mountain-progress {
          padding: var(--spacing-xl) 0;
          color: var(--color-text);
        }

        .mountain-title {
          text-align: center;
          margin-bottom: var(--spacing-lg);
          font-size: 1.75rem;
          color: var(--color-primary);
        }

        .mountain-container {
          position: relative;
          height: 300px;
          background: linear-gradient(
            to bottom,
            var(--color-gray-900),
            var(--color-gray-800)
          );
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--color-gray-700);
        }

        .mountain-path {
          position: relative;
          height: 100%;
          padding: var(--spacing-xl);
        }

        .progress-line {
          position: absolute;
          bottom: 35%;
          left: 0;
          height: 3px;
          background: var(--color-primary);
          transition: width var(--transition-slow);
          box-shadow: 0 0 30px var(--color-primary);
        }

        .milestone {
          position: absolute;
          bottom: calc(35% + 16px);
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all var(--transition-normal);
        }

        .milestone-marker {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-gray-600);
          border: 2px solid var(--color-gray-500);
          margin-bottom: var(--spacing-sm);
          transition: all var(--transition-normal);
        }

        .milestone.achieved .milestone-marker {
          background: var(--color-primary);
          border-color: var(--color-accent);
          box-shadow: 0 0 20px var(--color-primary);
          transform: scale(1.2);
        }

        .milestone-label {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-gray-500);
          margin-bottom: var(--spacing-xs);
          transition: all var(--transition-normal);
          white-space: nowrap;
        }

        .milestone.achieved .milestone-label {
          color: var(--color-text);
          transform: scale(1.05);
        }

        .milestone-points {
          font-size: 0.675rem;
          color: var(--color-gray-600);
          font-weight: 500;
        }

        .milestone.achieved .milestone-points {
          color: var(--color-primary);
        }

        .mountain-illustration {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70%;
          background: linear-gradient(
            170deg,
            var(--color-gray-800) 0%,
            var(--color-gray-700) 40%,
            var(--color-gray-600) 70%,
            var(--color-gray-500) 100%
          );
          clip-path: polygon(
            0% 100%,
            20% 65%,
            35% 80%,
            50% 45%,
            65% 60%,
            80% 30%,
            100% 50%,
            100% 100%
          );
          opacity: 0.4;
        }

        .mountain-illustration::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--color-gray-900)
          );
        }
      `}</style>
    </div>
  );
} 