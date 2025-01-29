'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import toast from 'react-hot-toast';

interface MoodOption {
  value: number;
  label: string;
  emoji: string;
}

const moodOptions: MoodOption[] = [
  { value: 1, label: 'Very Low', emoji: '😔' },
  { value: 2, label: 'Low', emoji: '😕' },
  { value: 3, label: 'Neutral', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '🙂' },
  { value: 5, label: 'Great', emoji: '😊' }
];

const moodFactors = [
  'Good sleep', 'Poor sleep',
  'Exercise', 'Healthy food',
  'Social connection', 'Solitude',
  'Productive work', 'Work stress',
  'Family time', 'Personal time',
  'Creative activity', 'Learning something new',
  'Nature time', 'Screen time',
  'Meditation', 'Physical discomfort',
  'Weather', 'Other'
];

export function EveningJournal() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number | null>(null);
  const [moodFactorSelections, setMoodFactorSelections] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMoodFactor = (factor: string) => {
    setMoodFactorSelections(prev => 
      prev.includes(factor)
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      // Create or update journal entry for today
      const { data: journalEntry, error: journalError } = await supabase
        .from('journal_entries')
        .upsert({
          user_id: user.id,
          date: today,
          evening_completed: true,
          evening_mood_score: mood,
          evening_mood_factors: moodFactorSelections,
          evening_reflection: reflection,
          evening_points: 5, // Will be updated by trigger
        }, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (journalError) throw journalError;
      if (!journalEntry) throw new Error('Failed to create journal entry');

      // Call the complete_evening_entry function to update points and streak
      const { error: completeError } = await supabase
        .rpc('complete_evening_entry', {
          entry_id: journalEntry.id,
          tomorrow_plan: tomorrowPlan
        });

      if (completeError) throw completeError;

      toast.success('Evening journal entry saved successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error saving journal:', error);
      toast.error(error.message || 'Failed to save journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="journal-container">
      {/* Progress Steps */}
      <div className="progress-steps">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`step ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="step-content">
        {step === 1 && (
          <div className="mood-section">
            <h2>How are you feeling this evening?</h2>
            <div className="mood-options">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  className={`mood-button ${mood === option.value ? 'selected' : ''}`}
                  onClick={() => setMood(option.value)}
                >
                  <span className="mood-emoji">{option.emoji}</span>
                  <span className="mood-label">{option.label}</span>
                </button>
              ))}
            </div>
            <div className="mood-factors-section">
              <h3>What influenced your mood today?</h3>
              <p className="subtitle">Select all factors that apply</p>
              <div className="mood-factors-grid">
                {moodFactors.map((factor) => (
                  <button
                    key={factor}
                    className={`factor-button ${moodFactorSelections.includes(factor) ? 'selected' : ''}`}
                    onClick={() => toggleMoodFactor(factor)}
                  >
                    {factor}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="reflection-section">
            <h2>Evening Reflection</h2>
            <p className="subtitle">Take a moment to reflect on your day</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What went well today? What could have gone better? What did you learn?"
              rows={6}
            />
          </div>
        )}

        {step === 3 && (
          <div className="tomorrow-section">
            <h2>Plan for Tomorrow</h2>
            <p className="subtitle">Set your intentions for tomorrow</p>
            <textarea
              value={tomorrowPlan}
              onChange={(e) => setTomorrowPlan(e.target.value)}
              placeholder="What are your main goals for tomorrow? What would make tomorrow great?"
              rows={6}
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        {step > 1 && (
          <button
            className="nav-button prev"
            onClick={() => setStep(prev => prev - 1)}
            disabled={isSubmitting}
          >
            Previous
          </button>
        )}
        
        {step < 3 ? (
          <button
            className="nav-button next"
            onClick={() => setStep(prev => prev + 1)}
            disabled={
              (step === 1 && (mood === null || moodFactorSelections.length === 0)) ||
              (step === 2 && !reflection.trim()) ||
              isSubmitting
            }
          >
            Next
          </button>
        ) : (
          <button
            className="nav-button submit"
            onClick={handleSubmit}
            disabled={!tomorrowPlan.trim() || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Complete Journal'}
          </button>
        )}
      </div>

      <style jsx>{`
        .journal-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .step {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .step.active {
          background: rgb(255, 200, 120);
          transform: scale(1.2);
        }

        .step.completed {
          background: rgb(160, 200, 120);
        }

        .step-content {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: rgb(240, 240, 240);
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 1.5rem 0 0.5rem;
          color: rgb(220, 220, 220);
        }

        .subtitle {
          color: rgb(180, 180, 180);
          margin-bottom: 1rem;
        }

        .mood-options {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .mood-button {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .mood-button:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .mood-button.selected {
          background: rgba(255, 200, 120, 0.2);
          border-color: rgb(255, 200, 120);
        }

        .mood-emoji {
          font-size: 2rem;
        }

        .mood-label {
          font-size: 0.875rem;
          color: rgb(200, 200, 200);
        }

        .mood-factors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .factor-button {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: rgb(220, 220, 220);
          transition: all 0.3s ease;
        }

        .factor-button:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .factor-button.selected {
          background: rgba(255, 200, 120, 0.2);
          border-color: rgb(255, 200, 120);
        }

        textarea {
          width: 100%;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: white;
          font-size: 1rem;
          line-height: 1.5;
          resize: vertical;
        }

        textarea:focus {
          outline: none;
          border-color: rgb(255, 200, 120);
        }

        .navigation-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .nav-button {
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-button.prev {
          background: rgba(255, 255, 255, 0.1);
          color: rgb(220, 220, 220);
        }

        .nav-button.next,
        .nav-button.submit {
          background: rgb(255, 200, 120);
          color: rgb(32, 32, 32);
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .journal-container {
            padding: 1rem;
          }

          .mood-options {
            flex-direction: column;
          }

          .mood-factors-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }
        }
      `}</style>
    </div>
  );
} 