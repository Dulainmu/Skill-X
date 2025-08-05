import React, { useState } from 'react';
import { EnhancedProgress } from '@/components/assessment/EnhancedProgress';
import { GoalSelection } from './steps/GoalSelection';
import { SkillsAssessment } from './steps/SkillsAssessment';
import { PersonalityQuiz } from './steps/PersonalityQuiz';
import { Preferences } from './steps/Preferences';
import { Results } from './steps/Results';

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
}

const STEPS = [
  { id: 1, name: 'Goal Setting', component: GoalSelection, estimatedTime: 1, icon: '🎯' },
  { id: 2, name: 'Skills Assessment', component: SkillsAssessment, estimatedTime: 4, icon: '⚡' },
  { id: 3, name: 'Personality Quiz', component: PersonalityQuiz, estimatedTime: 3, icon: '🧠' },
  { id: 4, name: 'Learning Preferences', component: Preferences, estimatedTime: 2, icon: '📚' },
  { id: 5, name: 'Your Results', component: Results, estimatedTime: 0, icon: '🎉' },
];

export const AssessmentFlow = () => {
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

  const currentStepData = STEPS.find(step => step.id === currentStep);
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  const totalTime = STEPS.slice(currentStep - 1).reduce((sum, step) => sum + step.estimatedTime, 0);

  const handleNext = (stepData: any) => {
    console.log('handleNext called with stepData:', stepData);
    console.log('Current step before:', currentStep);
    setData(prev => ({ ...prev, ...stepData }));
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => {
        console.log('Setting step to:', prev + 1);
        return prev + 1;
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
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
            {/* Empty space for balance */}
            <div className="w-10"></div>

            {/* Progress */}
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

            {/* Step indicator */}
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {currentStepData?.name}
                </div>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm">{currentStepData?.icon}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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

      {/* Floating action button for quick navigation */}
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