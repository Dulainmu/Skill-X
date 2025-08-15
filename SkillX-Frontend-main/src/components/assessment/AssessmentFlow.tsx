// src/components/assessment/AssessmentFlow.tsx
import React, { useState, useEffect } from 'react';
import { EnhancedProgress } from '@/components/assessment/EnhancedProgress';
import { GoalSelection } from './steps/GoalSelection';
import { SkillsAssessment } from './steps/SkillsAssessment';
import { PersonalityQuiz } from './steps/PersonalityQuiz';
import { Preferences } from './steps/Preferences';
import { Results } from './steps/Results';
import { useQuiz } from '@/contexts/QuizContext';
import { assessmentApi } from '@/services/assessmentApi';
import type { BackendRecommendationsResponse } from '@/types/backendRecommendations';
import { useNavigate } from 'react-router-dom';

interface AssessmentData {
  goals: string | null;
  skills: Record<string, { selected: boolean; level: number }>;
  personality: Record<string, any>;
  personalityType: string;
  personalityData: any;
  preferences: {
    learningStyle: string[];
    timeCommitment: string;
    budget: string;
  };
  portfolio: File | null;

  // NEW: store backend recommendations payload
  backend?: BackendRecommendationsResponse;
}

const STORAGE_KEY = 'skillx-assessment-state-v1';

const STEPS = [
  { id: 1, name: 'Goal Setting', component: GoalSelection, estimatedTime: 1, icon: '🎯' },
  { id: 2, name: 'Skills Assessment', component: SkillsAssessment, estimatedTime: 4, icon: '⚡' },
  { id: 3, name: 'Personality Quiz', component: PersonalityQuiz, estimatedTime: 3, icon: '🧠' },
  { id: 4, name: 'Learning Preferences', component: Preferences, estimatedTime: 2, icon: '📚' },
  { id: 5, name: 'Your Results', component: Results, estimatedTime: 0, icon: '🎉' },
];

// Validation rules for each step
const VALIDATION_RULES = {
  1: (data: AssessmentData) => {
    if (!data.goals || data.goals.trim() === '') {
      return { isValid: false, message: 'Please select a career goal to continue' };
    }
    return { isValid: true, message: '' };
  },
  2: (data: AssessmentData) => {
    const selectedSkills = Object.values(data.skills).filter(s => s.selected && s.level > 0);
    if (selectedSkills.length === 0) {
      return { isValid: false, message: 'Please select at least one skill and set its level' };
    }
    if (selectedSkills.length < 3) {
      return { isValid: false, message: 'Selecting 3+ skills will give you better career matches' };
    }
    return { isValid: true, message: '' };
  },
  3: (data: AssessmentData) => {
    const answers = Object.keys(data.personality || {});
    if (answers.length < 20) {
      return { isValid: false, message: 'Please complete all personality questions for accurate results' };
    }
    return { isValid: true, message: '' };
  },
  4: (data: AssessmentData) => {
    if (!data.preferences.learningStyle || data.preferences.learningStyle.length === 0) {
      return { isValid: false, message: 'Please select your preferred learning styles' };
    }
    if (!data.preferences.timeCommitment) {
      return { isValid: false, message: 'Please select your time commitment preference' };
    }
    return { isValid: true, message: '' };
  }
};

export const AssessmentFlow = () => {
  const navigate = useNavigate();
  const { answers, setIsLoading } = useQuiz();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AssessmentData>({
    goals: null,
    skills: {},
    personality: {},
    personalityType: '',
    personalityData: null,
    preferences: {
      learningStyle: [],
      timeCommitment: '',
      budget: '',
    },
    portfolio: null,
  });
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  // restore saved progress on mount (local first, then server if logged in)
  useEffect(() => {
    (async () => {
      try {
        // Local restore
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as { currentStep?: number; data?: AssessmentData };
          if (saved?.currentStep && saved?.data) {
            setCurrentStep(Math.min(Math.max(saved.currentStep, 1), STEPS.length));
            setData({ ...saved.data, portfolio: null });
          }
        }

        // Server restore (if token present)
        try {
          const server = await assessmentApi.getProgress();
          if (server) {
            if (server.currentStep) setCurrentStep(Math.min(Math.max(server.currentStep, 1), STEPS.length));
            if (server.data) setData(prev => ({ ...prev, ...server.data, portfolio: null }));
            // Merge answers from server into QuizContext local storage
            // answers are held in QuizContext localStorage under 'skillx-quiz-answers'
            if (server.answers && Object.keys(server.answers).length) {
              localStorage.setItem('skillx-quiz-answers', JSON.stringify(server.answers));
            }
          }
        } catch {}
      } catch {}
    })();
  }, []);

  // persist progress whenever step or data changes (local + server if logged in)
  useEffect(() => {
    try {
      const sanitized: AssessmentData = { ...data, portfolio: null };
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentStep, data: sanitized })
      );
      // Best-effort sync to server (non-blocking)
      const answersRaw = localStorage.getItem('skillx-quiz-answers');
      const answersMap = answersRaw ? JSON.parse(answersRaw) : {};
      assessmentApi.saveProgress({ currentStep, data: sanitized, answers: answersMap }).catch(() => {});
    } catch {}
  }, [currentStep, data]);

  const currentStepData = STEPS.find(step => step.id === currentStep);
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  const totalTime = STEPS.slice(currentStep - 1).reduce((sum, step) => sum + step.estimatedTime, 0);

  // Validate current step before allowing progression
  const validateCurrentStep = (): { isValid: boolean; message: string } => {
    const rule = VALIDATION_RULES[currentStep as keyof typeof VALIDATION_RULES];
    if (!rule) return { isValid: true, message: '' };
    return rule(data);
  };

  // When step 4 (Preferences) completes, submit the whole payload to backend,
  // save the backend recommendations into `data.backend`, then go to Results.
  const handleNext = async (stepData: any) => {
    setData(prev => ({ ...prev, ...stepData }));

    // Validate current step before proceeding
    const validation = validateCurrentStep();
    if (!validation.isValid) {
      setValidationErrors(prev => ({ ...prev, [currentStep]: validation.message }));
      return;
    }

    // Clear validation error for this step
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentStep];
      return newErrors;
    });

    // If we're finishing step 4 and moving to Results, submit now
    if (currentStep === 4) {
      try {
        setIsLoading(true);

        const payload = {
          answers,                    // from QuizContext (1..32 Likert)
          skills: { ...(stepData?.skills || data.skills) },
          preferences: { ...(stepData?.preferences || data.preferences) },
        };

        const backend: BackendRecommendationsResponse = await assessmentApi.submitQuiz(payload);

        setData(prev => ({ ...prev, backend }));
      } catch (err) {
        console.error('submitQuiz failed:', err);
        // still proceed to Results; Results.tsx can fetch fallback if needed
      } finally {
        setIsLoading(false);
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveAndExit = () => {
    try {
      const sanitized: AssessmentData = { ...data, portfolio: null };
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentStep, data: sanitized })
      );
      const answersRaw = localStorage.getItem('skillx-quiz-answers');
      const answersMap = answersRaw ? JSON.parse(answersRaw) : {};
      assessmentApi.saveProgress({ currentStep, data: sanitized, answers: answersMap }).catch(() => {});
    } catch {}
    navigate('/home');
  };

  const handleResetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    assessmentApi.clearProgress().catch(() => {});
    setCurrentStep(1);
    setData({
      goals: null,
      skills: {},
      personality: {},
      personalityType: '',
      personalityData: null,
      preferences: {
        learningStyle: [],
        timeCommitment: '',
        budget: '',
      },
      portfolio: null,
      backend: undefined,
    });
    setValidationErrors({});
  };

  const CurrentStepComponent = currentStepData?.component;

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50/20 to-purple-50/20 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="w-10"></div>
              <div className="flex-1 max-w-lg mx-8">
                <EnhancedProgress
                    current={currentStep}
                    total={STEPS.length}
                    progress={progress}
                    timeRemaining={totalTime}
                    stepName={currentStepData?.name}
                    stepIcon={currentStepData?.icon}
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveAndExit}
                  className="px-3 py-2 text-xs md:text-sm rounded-md border border-border/60 hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Save & Exit
                </button>
                <button
                  onClick={handleResetProgress}
                  className="px-3 py-2 text-xs md:text-sm rounded-md border border-border/60 hover:border-destructive/50 hover:text-destructive transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Step Guidance */}
            {currentStep < 5 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <span className="text-lg">ℹ️</span>
                  <span className="font-medium">Step {currentStep}: {currentStepData?.name}</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {currentStepData?.estimatedTime} minute(s) estimated for this step.
                </p>
              </div>
            )}

            {/* Validation Error Display */}
            {validationErrors[currentStep] && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <span className="text-lg">⚠️</span>
                  <span className="font-medium">{validationErrors[currentStep]}</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Please complete this step before continuing to get the best results.
                </p>
              </div>
            )}

            {CurrentStepComponent && (
                <div className="animate-fade-in">
                  <CurrentStepComponent
                      data={data}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      canGoBack={currentStep > 1}
                  />
                </div>
            )}
          </div>
        </main>

        {currentStep > 1 && (
            <div className="fixed bottom-6 right-6 z-30">
              <button
                  onClick={handlePrevious}
                  className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-border/50 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
        )}
      </div>
  );
};
