import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PersonalityQuizProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  isLoading?: boolean;
  canGoBack: boolean;
}

// MBTI-style questions for each dimension
const QUESTIONS = [
  // Extraversion (E) vs Introversion (I)
  {
    id: 'social_energy',
    question: 'I feel energized when spending time with large groups of people',
    dimension: 'EI',
    direction: 'E',
    opposite: 'I'
  },
  {
    id: 'alone_time',
    question: 'I need time alone to recharge and process my thoughts',
    dimension: 'EI',
    direction: 'I',
    opposite: 'E'
  },
  {
    id: 'social_events',
    question: 'I enjoy being the center of attention at social gatherings',
    dimension: 'EI',
    direction: 'E',
    opposite: 'I'
  },
  {
    id: 'deep_conversations',
    question: 'I prefer deep, meaningful conversations with one or two people',
    dimension: 'EI',
    direction: 'I',
    opposite: 'E'
  },

  // Sensing (S) vs Intuition (N)
  {
    id: 'practical_details',
    question: 'I focus on practical details and concrete facts',
    dimension: 'SN',
    direction: 'S',
    opposite: 'N'
  },
  {
    id: 'big_picture',
    question: 'I enjoy thinking about abstract concepts and future possibilities',
    dimension: 'SN',
    direction: 'N',
    opposite: 'S'
  },
  {
    id: 'step_by_step',
    question: 'I prefer to work step-by-step with clear, structured approaches',
    dimension: 'SN',
    direction: 'S',
    opposite: 'N'
  },
  {
    id: 'creative_solutions',
    question: 'I like to explore creative solutions and think outside the box',
    dimension: 'SN',
    direction: 'N',
    opposite: 'S'
  },

  // Thinking (T) vs Feeling (F)
  {
    id: 'logical_decisions',
    question: 'I make decisions based on logical analysis and objective criteria',
    dimension: 'TF',
    direction: 'T',
    opposite: 'F'
  },
  {
    id: 'people_impact',
    question: 'I consider how my decisions will affect people and relationships',
    dimension: 'TF',
    direction: 'F',
    opposite: 'T'
  },
  {
    id: 'constructive_criticism',
    question: 'I value constructive criticism and direct feedback',
    dimension: 'TF',
    direction: 'T',
    opposite: 'F'
  },
  {
    id: 'harmony',
    question: 'I prioritize maintaining harmony and positive relationships',
    dimension: 'TF',
    direction: 'F',
    opposite: 'T'
  },

  // Judging (J) vs Perceiving (P)
  {
    id: 'planning',
    question: 'I like to plan ahead and have a clear schedule',
    dimension: 'JP',
    direction: 'J',
    opposite: 'P'
  },
  {
    id: 'flexibility',
    question: 'I prefer to keep my options open and adapt as situations change',
    dimension: 'JP',
    direction: 'P',
    opposite: 'J'
  },
  {
    id: 'deadlines',
    question: 'I work best with clear deadlines and structured timelines',
    dimension: 'JP',
    direction: 'J',
    opposite: 'P'
  },
  {
    id: 'spontaneity',
    question: 'I enjoy spontaneity and going with the flow',
    dimension: 'JP',
    direction: 'P',
    opposite: 'J'
  }
];

const RESPONSE_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

// 16 Personality Types with descriptions and career implications
const PERSONALITY_TYPES = {
  'INTJ': {
    name: 'The Architect',
    description: 'Imaginative and strategic thinkers with a plan for everything',
    traits: ['Analytical', 'Strategic', 'Independent', 'Innovative'],
    careerStrengths: ['Strategic planning', 'Problem solving', 'Research', 'Systems design'],
    idealCareers: ['Data Scientist', 'Systems Architect', 'Research Analyst', 'Strategic Consultant'],
    workStyle: 'Prefers independent work with clear objectives and strategic thinking'
  },
  'INTP': {
    name: 'The Logician',
    description: 'Innovative inventors with an unquenchable thirst for knowledge',
    traits: ['Logical', 'Creative', 'Curious', 'Objective'],
    careerStrengths: ['Technical analysis', 'Innovation', 'Complex problem solving', 'Research'],
    idealCareers: ['Software Engineer', 'Research Scientist', 'Financial Analyst', 'Technical Consultant'],
    workStyle: 'Enjoys solving complex problems and exploring new ideas independently'
  },
  'ENTJ': {
    name: 'The Commander',
    description: 'Bold, imaginative and strong-willed leaders',
    traits: ['Decisive', 'Confident', 'Strategic', 'Natural leader'],
    careerStrengths: ['Leadership', 'Strategic planning', 'Decision making', 'Project management'],
    idealCareers: ['Product Manager', 'Business Consultant', 'Executive', 'Project Manager'],
    workStyle: 'Thrives in leadership roles with clear goals and strategic direction'
  },
  'ENTP': {
    name: 'The Debater',
    description: 'Smart and curious thinkers who cannot resist an intellectual challenge',
    traits: ['Innovative', 'Quick-witted', 'Adaptable', 'Entrepreneurial'],
    careerStrengths: ['Innovation', 'Problem solving', 'Communication', 'Adaptability'],
    idealCareers: ['Entrepreneur', 'Marketing Manager', 'Sales Director', 'Innovation Consultant'],
    workStyle: 'Enjoys dynamic environments with intellectual challenges and new opportunities'
  },
  'INFJ': {
    name: 'The Advocate',
    description: 'Quiet and mystical, yet very inspiring and tireless idealists',
    traits: ['Idealistic', 'Compassionate', 'Creative', 'Insightful'],
    careerStrengths: ['Writing', 'Counseling', 'Creative direction', 'Human resources'],
    idealCareers: ['UX Designer', 'Content Strategist', 'HR Manager', 'Counselor'],
    workStyle: 'Prefers meaningful work that helps others and aligns with personal values'
  },
  'INFP': {
    name: 'The Mediator',
    description: 'Poetic, kind and altruistic people, always eager to help a good cause',
    traits: ['Idealistic', 'Creative', 'Empathetic', 'Adaptable'],
    careerStrengths: ['Creative writing', 'Design', 'Counseling', 'Teaching'],
    idealCareers: ['Content Creator', 'Graphic Designer', 'Teacher', 'Social Worker'],
    workStyle: 'Values creative freedom and work that makes a positive impact'
  },
  'ENFJ': {
    name: 'The Protagonist',
    description: 'Charismatic and inspiring leaders, able to mesmerize their listeners',
    traits: ['Charismatic', 'Inspiring', 'Reliable', 'Passionate'],
    careerStrengths: ['Leadership', 'Communication', 'Mentoring', 'Public speaking'],
    idealCareers: ['Team Lead', 'Marketing Manager', 'Teacher', 'Public Relations'],
    workStyle: 'Excels at inspiring and leading teams toward shared goals'
  },
  'ENFP': {
    name: 'The Campaigner',
    description: 'Enthusiastic, creative and sociable free spirits',
    traits: ['Enthusiastic', 'Creative', 'Sociable', 'Independent'],
    careerStrengths: ['Creativity', 'Communication', 'Motivation', 'Adaptability'],
    idealCareers: ['Marketing Specialist', 'Event Planner', 'Journalist', 'Creative Director'],
    workStyle: 'Thrives in creative, people-oriented environments with variety'
  },
  'ISTJ': {
    name: 'The Logistician',
    description: 'Practical and fact-minded individuals, whose reliability cannot be doubted',
    traits: ['Practical', 'Reliable', 'Organized', 'Detail-oriented'],
    careerStrengths: ['Organization', 'Reliability', 'Attention to detail', 'Planning'],
    idealCareers: ['Project Manager', 'Accountant', 'Quality Assurance', 'Operations Manager'],
    workStyle: 'Prefers structured environments with clear procedures and responsibilities'
  },
  'ISFJ': {
    name: 'The Defender',
    description: 'Very dedicated and warm protectors, always ready to defend their loved ones',
    traits: ['Supportive', 'Reliable', 'Patient', 'Practical'],
    careerStrengths: ['Support', 'Organization', 'Attention to detail', 'Customer service'],
    idealCareers: ['Customer Success Manager', 'Administrative Assistant', 'Nurse', 'Teacher'],
    workStyle: 'Values helping others in structured, supportive environments'
  },
  'ESTJ': {
    name: 'The Executive',
    description: 'Excellent administrators, unsurpassed at managing things or people',
    traits: ['Organized', 'Decisive', 'Practical', 'Natural leader'],
    careerStrengths: ['Management', 'Organization', 'Decision making', 'Leadership'],
    idealCareers: ['Operations Manager', 'Business Analyst', 'Sales Manager', 'Executive Assistant'],
    workStyle: 'Excels at organizing and managing people and processes efficiently'
  },
  'ESFJ': {
    name: 'The Consul',
    description: 'Extraordinarily caring, social and popular people',
    traits: ['Supportive', 'Sociable', 'Reliable', 'Practical'],
    careerStrengths: ['Customer service', 'Team coordination', 'Communication', 'Organization'],
    idealCareers: ['Customer Success Manager', 'HR Specialist', 'Event Coordinator', 'Sales Representative'],
    workStyle: 'Thrives in people-oriented roles with clear structure and social interaction'
  },
  'ISTP': {
    name: 'The Virtuoso',
    description: 'Bold and practical experimenters, masters of all kinds of tools',
    traits: ['Practical', 'Flexible', 'Logical', 'Hands-on'],
    careerStrengths: ['Technical skills', 'Problem solving', 'Adaptability', 'Hands-on work'],
    idealCareers: ['Technical Support', 'Mechanic', 'IT Specialist', 'Quality Control'],
    workStyle: 'Enjoys hands-on technical work with flexibility and practical problem solving'
  },
  'ISFP': {
    name: 'The Adventurer',
    description: 'Flexible and charming artists, always ready to explore and experience something new',
    traits: ['Artistic', 'Flexible', 'Practical', 'Spontaneous'],
    careerStrengths: ['Creativity', 'Adaptability', 'Hands-on skills', 'Aesthetic sense'],
    idealCareers: ['Graphic Designer', 'Photographer', 'Interior Designer', 'Fashion Designer'],
    workStyle: 'Values creative freedom and hands-on work with aesthetic appeal'
  },
  'ESTP': {
    name: 'The Entrepreneur',
    description: 'Smart, energetic and very perceptive people',
    traits: ['Energetic', 'Practical', 'Spontaneous', 'Natural leader'],
    careerStrengths: ['Quick thinking', 'Adaptability', 'Leadership', 'Problem solving'],
    idealCareers: ['Sales Manager', 'Entrepreneur', 'Emergency Responder', 'Athletic Coach'],
    workStyle: 'Thrives in dynamic, action-oriented environments with immediate results'
  },
  'ESFP': {
    name: 'The Entertainer',
    description: 'Spontaneous, energetic and enthusiastic entertainers',
    traits: ['Spontaneous', 'Sociable', 'Practical', 'Optimistic'],
    careerStrengths: ['Communication', 'Adaptability', 'People skills', 'Entertainment'],
    idealCareers: ['Event Planner', 'Sales Representative', 'Tour Guide', 'Customer Service'],
    workStyle: 'Enjoys social, dynamic environments with variety and immediate interaction'
  }
};

export const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({
  data,
  onNext,
  onPrevious,
  canGoBack,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(data.personality || {});

  const handleResponse = (value: number) => {
    const question = QUESTIONS[currentQuestion];
    setResponses(prev => ({
      ...prev,
      [question.id]: {
        value,
        dimension: question.dimension,
        direction: question.direction,
        opposite: question.opposite
      },
    }));

    // Auto-advance to next question, but stop at the last question
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      }
      // If this is the last question, don't auto-advance
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      onPrevious();
    }
  };

  const calculatePersonalityType = (responses: any) => {
    const dimensions = {
      EI: { E: 0, I: 0 },
      SN: { S: 0, N: 0 },
      TF: { T: 0, F: 0 },
      JP: { J: 0, P: 0 }
    };

    Object.values(responses).forEach((response: any) => {
      if (response && response.dimension && response.direction) {
        const value = response.value;
        const direction = response.direction;
        const opposite = response.opposite;
        
        dimensions[response.dimension as keyof typeof dimensions][direction as keyof typeof dimensions.EI] += value;
        dimensions[response.dimension as keyof typeof dimensions][opposite as keyof typeof dimensions.EI] += (6 - value);
      }
    });

    const type = [
      dimensions.EI.E > dimensions.EI.I ? 'E' : 'I',
      dimensions.SN.S > dimensions.SN.N ? 'S' : 'N',
      dimensions.TF.T > dimensions.TF.F ? 'T' : 'F',
      dimensions.JP.J > dimensions.JP.P ? 'J' : 'P'
    ].join('');

    return {
      type,
      dimensions,
      personalityData: PERSONALITY_TYPES[type as keyof typeof PERSONALITY_TYPES]
    };
  };

  const handleContinue = () => {
    try {
      console.log('Responses:', responses);
      const personalityResult = calculatePersonalityType(responses);
      console.log('Personality Result:', personalityResult);
      
      onNext({ 
        personality: responses,
        personalityType: personalityResult.type,
        personalityData: personalityResult.personalityData,
        dimensions: personalityResult.dimensions
      });
    } catch (error) {
      console.error('Error in handleContinue:', error);
      // Fallback: just pass the responses without calculation
      onNext({ 
        personality: responses,
        personalityType: 'INTJ', // Default fallback
        personalityData: PERSONALITY_TYPES['INTJ'],
        dimensions: { EI: { E: 0, I: 0 }, SN: { S: 0, N: 0 }, TF: { T: 0, F: 0 }, JP: { J: 0, P: 0 } }
      });
    }
  };

  const question = QUESTIONS[currentQuestion];
  const currentResponse = responses[question?.id]?.value;
  const isComplete = Object.keys(responses).length === QUESTIONS.length || 
    (currentQuestion === QUESTIONS.length - 1 && currentResponse !== undefined);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Discover Your Personality Type
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Answer these questions to understand your work style and preferences
        </p>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </div>
      </div>

      {question && (
        <Card className="max-w-2xl mx-auto p-8">
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-foreground text-center">
              "{question.question}"
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {RESPONSE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleResponse(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    currentResponse === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                </button>
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center space-x-2 pt-4">
              {QUESTIONS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index <= currentQuestion
                      ? 'bg-primary'
                      : index < Object.keys(responses).length
                      ? 'bg-success-green'
                      : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
        >
          {currentQuestion === 0 ? 'Back' : 'Previous Question'}
        </Button>
        
        {isComplete && (
          <Button
            onClick={handleContinue}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};