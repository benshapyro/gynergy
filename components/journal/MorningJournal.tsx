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

export function MorningJournal() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number | null>(null);
  const [moodFactorSelections, setMoodFactorSelections] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [affirmations, setAffirmations] = useState(['', '', '', '', '']);
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [excitement, setExcitement] = useState(['', '', '']);
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
          morning_completed: true,
          morning_mood_score: mood,
          morning_mood_factors: moodFactorSelections,
          morning_reflection: reflection,
          morning_points: 5, // Will be updated by trigger
        }, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (journalError) throw journalError;
      if (!journalEntry) throw new Error('Failed to create journal entry');

      // Save affirmations
      if (affirmations.some(a => a.trim())) {
        const { error: affirmationsError } = await supabase
          .from('affirmations')
          .insert(
            affirmations
              .filter(a => a.trim())
              .map(affirmation => ({
                journal_entry_id: journalEntry.id,
                affirmation
              }))
          );

        if (affirmationsError) throw affirmationsError;
      }

      // Save gratitude and excitement items
      const gratitudeItems = gratitude
        .filter(g => g.trim())
        .map(content => ({
          journal_entry_id: journalEntry.id,
          type: 'gratitude',
          content
        }));

      const excitementItems = excitement
        .filter(e => e.trim())
        .map(content => ({
          journal_entry_id: journalEntry.id,
          type: 'excitement',
          content
        }));

      if (gratitudeItems.length > 0 || excitementItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('gratitude_excitement')
          .insert([...gratitudeItems, ...excitementItems]);

        if (itemsError) throw itemsError;
      }

      // Call the complete_morning_entry function to update points and streak
      const { error: completeError } = await supabase
        .rpc('complete_morning_entry', {
          entry_id: journalEntry.id
        });

      if (completeError) throw completeError;

      toast.success('Journal entry saved successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error saving journal:', error);
      toast.error(error.message || 'Failed to save journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="journal-container">
      {/* Progress Steps */}
      <div className="progress-steps">
        {[1, 2, 3, 4, 5].map((s) => (
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
            <h2>How are you feeling this morning?</h2>
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
          </div>
        )}

        {step === 2 && (
          <div className="mood-factors-section">
            <h2>What's influencing your mood?</h2>
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
        )}

        {step === 3 && (
          <div className="reflection-section">
            <h2>Morning Reflection</h2>
            <p className="subtitle">Take a moment to reflect on your intentions for today</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What would make today great? What challenges might you face?"
              rows={4}
            />
          </div>
        )}

        {step === 4 && (
          <div className="affirmations-section">
            <h2>Daily Affirmations</h2>
            <p className="subtitle">Write 5 positive affirmations for yourself</p>
            {affirmations.map((affirmation, index) => (
              <input
                key={index}
                type="text"
                value={affirmation}
                onChange={(e) => {
                  const newAffirmations = [...affirmations];
                  newAffirmations[index] = e.target.value;
                  setAffirmations(newAffirmations);
                }}
                placeholder={`Affirmation ${index + 1}`}
              />
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="gratitude-section">
            <h2>Gratitude & Excitement</h2>
            <div className="gratitude-list">
              <h3>I am grateful for...</h3>
              {gratitude.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newGratitude = [...gratitude];
                    newGratitude[index] = e.target.value;
                    setGratitude(newGratitude);
                  }}
                  placeholder={`Gratitude ${index + 1}`}
                />
              ))}
            </div>
            <div className="excitement-list">
              <h3>I am excited about...</h3>
              {excitement.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newExcitement = [...excitement];
                    newExcitement[index] = e.target.value;
                    setExcitement(newExcitement);
                  }}
                  placeholder={`Excitement ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        {step > 1 && (
          <button 
            className="nav-button back"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        )}
        {step < 5 ? (
          <button 
            className="nav-button next"
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !mood}
          >
            Next
          </button>
        ) : (
          <button 
            className="nav-button submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
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
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .step {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .step.active {
          background: rgb(255, 200, 120);
          box-shadow: 0 0 12px rgba(255, 200, 120, 0.4);
        }

        .step.completed {
          background: rgb(255, 200, 120);
          opacity: 0.6;
        }

        .step-content {
          background: rgba(32, 32, 32, 0.6);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          margin-bottom: 2rem;
          min-height: 400px;
        }

        h2 {
          font-size: 1.75rem;
          font-weight: 600;
          color: rgb(240, 240, 240);
          margin: 0 0 1rem;
          text-align: center;
        }

        .subtitle {
          color: rgb(160, 160, 160);
          text-align: center;
          margin-bottom: 2rem;
        }

        .mood-options {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 3rem;
        }

        .mood-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mood-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .mood-button.selected {
          background: rgba(255, 200, 120, 0.1);
          border-color: rgb(255, 200, 120);
          transform: translateY(-2px);
        }

        .mood-emoji {
          font-size: 2rem;
        }

        .mood-label {
          color: rgb(200, 200, 200);
          font-size: 0.875rem;
        }

        textarea, input {
          width: 100%;
          background: rgba(16, 16, 16, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          color: rgb(220, 220, 220);
          font-size: 1rem;
          margin-bottom: 1rem;
          resize: none;
          transition: all 0.3s ease;
        }

        textarea:focus, input:focus {
          outline: none;
          border-color: rgb(255, 200, 120);
          box-shadow: 0 0 0 2px rgba(255, 200, 120, 0.1);
        }

        .gratitude-list, .excitement-list {
          margin-bottom: 2rem;
        }

        h3 {
          font-size: 1.25rem;
          color: rgb(200, 200, 200);
          margin-bottom: 1rem;
        }

        .navigation-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .nav-button {
          background: rgb(255, 200, 120);
          color: rgb(32, 32, 32);
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          background: rgb(255, 220, 160);
          transform: translateY(-2px);
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .nav-button.back {
          background: rgba(255, 255, 255, 0.1);
          color: rgb(200, 200, 200);
        }

        .nav-button.back:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .mood-factors-section {
          text-align: center;
        }

        .mood-factors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .factor-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: rgb(200, 200, 200);
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .factor-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .factor-button.selected {
          background: rgba(255, 200, 120, 0.1);
          border-color: rgb(255, 200, 120);
          color: rgb(255, 200, 120);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .journal-container {
            padding: 1rem;
          }

          .step-content {
            padding: 1.5rem;
          }

          .mood-options {
            flex-wrap: wrap;
          }

          .mood-button {
            flex: 1 1 calc(50% - 0.5rem);
            padding: 1rem;
          }

          h2 {
            font-size: 1.5rem;
          }

          .mood-factors-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 0.75rem;
          }

          .factor-button {
            padding: 0.625rem 0.875rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
} 