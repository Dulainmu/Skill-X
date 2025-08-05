import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ResultsProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  isLoading?: boolean;
  canGoBack: boolean;
}

interface CareerMatch {
  id: string;
  title: string;
  match: number;
  description: string;
  whyMatch: string[];
  skillsToLearn: Array<{ skill: string; timeframe: string }>;
  salary: string;
  timeToJobReady: string;
  growth: string;
  recommendedLevel: 'Entry' | 'Intermediate' | 'Senior';
  levelReason: string;
}

interface PersonalityInsight {
  trait: string;
  description: string;
  strength: string;
  icon: string;
  score: number;
}

interface Strength {
  name: string;
  description: string;
  icon: string;
  impact: string;
}

const PERSONALITY_INSIGHTS: PersonalityInsight[] = [
  {
    trait: 'Analytical Thinker',
    description: 'You approach problems systematically and enjoy breaking down complex challenges',
    strength: 'Excellent at troubleshooting and optimization',
    icon: '🧠',
    score: 85
  },
  {
    trait: 'Creative Problem Solver',
    description: 'You think outside the box and find innovative solutions',
    strength: 'Great for design and innovation roles',
    icon: '💡',
    score: 78
  },
  {
    trait: 'Collaborative Leader',
    description: 'You work well in teams and naturally take initiative',
    strength: 'Perfect for leadership and management positions',
    icon: '🤝',
    score: 92
  },
  {
    trait: 'Detail-Oriented',
    description: 'You pay attention to the small things that make a big difference',
    strength: 'Ideal for quality assurance and precision work',
    icon: '🔍',
    score: 88
  }
];

const STRENGTHS: Strength[] = [
  {
    name: 'Technical Aptitude',
    description: 'Strong foundation in programming and technical concepts',
    icon: '⚡',
    impact: 'High demand in tech industry'
  },
  {
    name: 'Communication Skills',
    description: 'Ability to explain complex ideas clearly and effectively',
    icon: '💬',
    impact: 'Essential for team collaboration'
  },
  {
    name: 'Adaptability',
    description: 'Quick learner who can adjust to new technologies and environments',
    icon: '🔄',
    impact: 'Valuable in fast-changing industries'
  },
  {
    name: 'Problem Solving',
    description: 'Natural ability to identify issues and develop solutions',
    icon: '🎯',
    impact: 'Core skill for any technical role'
  }
];

const SKILL_LEVELS: { [key: string]: { label: string; description: string } } = {
  '0': { label: 'No Experience', description: 'You have no prior experience with this skill.' },
  '1': { label: 'Beginner', description: 'You have basic knowledge and can perform simple tasks.' },
  '2': { label: 'Intermediate', description: 'You have solid understanding and can apply concepts.' },
  '3': { label: 'Advanced', description: 'You are proficient and can teach others.' },
  '4': { label: 'Expert', description: 'You are an expert in this field.' }
};

const getCareerMatches = (personalityType: string, skills: any) => {
  const baseCareers = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    description: 'Create engaging user interfaces and web experiences',
    skillsToLearn: [
      { skill: 'React', timeframe: '4-6 months' },
      { skill: 'JavaScript ES6', timeframe: '2-3 months' },
      { skill: 'TypeScript', timeframe: '1-2 months' }
    ],
    salary: '$65k-$95k',
    timeToJobReady: '8-12 months',
    growth: 'High demand, 13% growth'
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    description: 'Design intuitive and user-friendly digital experiences',
    skillsToLearn: [
      { skill: 'Figma/Design Tools', timeframe: '2-3 months' },
      { skill: 'User Research', timeframe: '3-4 months' },
      { skill: 'Prototyping', timeframe: '2-3 months' }
    ],
    salary: '$70k-$100k',
    timeToJobReady: '6-10 months',
    growth: 'Very high demand, 8% growth'
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Guide product strategy and coordinate development teams',
    skillsToLearn: [
      { skill: 'Product Strategy', timeframe: '3-4 months' },
      { skill: 'Data Analysis', timeframe: '2-3 months' },
      { skill: 'Agile/Scrum', timeframe: '1-2 months' }
    ],
    salary: '$90k-$130k',
    timeToJobReady: '12-18 months',
    growth: 'High demand, 19% growth'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Analyze complex data to drive business decisions',
      skillsToLearn: [
        { skill: 'Python', timeframe: '3-4 months' },
        { skill: 'Machine Learning', timeframe: '6-8 months' },
        { skill: 'SQL', timeframe: '2-3 months' }
      ],
      salary: '$85k-$120k',
      timeToJobReady: '12-18 months',
      growth: 'Very high demand, 22% growth'
    },
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Build scalable software solutions and applications',
      skillsToLearn: [
        { skill: 'System Design', timeframe: '4-6 months' },
        { skill: 'Algorithms', timeframe: '3-4 months' },
        { skill: 'Cloud Platforms', timeframe: '2-3 months' }
      ],
      salary: '$80k-$130k',
      timeToJobReady: '10-16 months',
      growth: 'High demand, 15% growth'
    }
  ];

  // IT-focused career matching
  const personalityMatches: { [key: string]: any[] } = {
    'INTJ': [
      { career: 'data-scientist', whyMatch: ['Strategic thinking', 'Analytical approach', 'Independent work style', 'Complex problem solving'], level: 'Senior', reason: 'Your strategic and analytical nature makes you perfect for senior data science roles' },
      { career: 'product-manager', whyMatch: ['Strategic planning', 'Systems thinking', 'Independent decision making', 'Long-term vision'], level: 'Senior', reason: 'Your strategic thinking and independent nature excel in senior product leadership' },
      { career: 'software-engineer', whyMatch: ['Technical depth', 'Systematic approach', 'Independent problem solving', 'Architecture focus'], level: 'Intermediate', reason: 'Your analytical and systematic approach is ideal for intermediate engineering roles' }
    ],
    'INTP': [
      { career: 'software-engineer', whyMatch: ['Logical thinking', 'Technical innovation', 'Independent problem solving', 'Complex analysis'], level: 'Intermediate', reason: 'Your logical and innovative thinking is perfect for technical engineering roles' },
      { career: 'data-scientist', whyMatch: ['Analytical thinking', 'Research orientation', 'Independent work', 'Technical depth'], level: 'Intermediate', reason: 'Your analytical and research-oriented nature fits data science perfectly' },
      { career: 'frontend-dev', whyMatch: ['Technical skills', 'Problem solving', 'Independent work', 'Innovation focus'], level: 'Intermediate', reason: 'Your technical and innovative approach works well in frontend development' }
    ],
    'ENTJ': [
      { career: 'product-manager', whyMatch: ['Natural leadership', 'Strategic thinking', 'Decisive nature', 'Goal-oriented approach'], level: 'Senior', reason: 'Your leadership and strategic thinking make you ideal for senior product management' },
      { career: 'software-engineer', whyMatch: ['Technical leadership', 'Strategic planning', 'Decision making', 'System architecture'], level: 'Senior', reason: 'Your leadership and strategic approach excel in senior engineering roles' },
      { career: 'data-scientist', whyMatch: ['Strategic analysis', 'Leadership in research', 'Decision making', 'Technical depth'], level: 'Senior', reason: 'Your strategic and leadership qualities fit senior data science roles' }
    ],
    'ENTP': [
      { career: 'product-manager', whyMatch: ['Innovative thinking', 'Adaptability', 'Communication skills', 'Problem solving'], level: 'Intermediate', reason: 'Your innovative and adaptable nature is perfect for product management' },
      { career: 'frontend-dev', whyMatch: ['Creative problem solving', 'Adaptability', 'Innovation focus', 'Technical skills'], level: 'Intermediate', reason: 'Your creative and adaptable approach works well in frontend development' },
      { career: 'ux-designer', whyMatch: ['Creative thinking', 'User empathy', 'Innovation', 'Adaptability'], level: 'Intermediate', reason: 'Your creative and innovative thinking fits UX design perfectly' }
    ],
    'INFJ': [
      { career: 'ux-designer', whyMatch: ['User empathy', 'Creative vision', 'Attention to detail', 'Meaningful work'], level: 'Intermediate', reason: 'Your empathy and creative vision make you perfect for UX design' },
      { career: 'product-manager', whyMatch: ['User understanding', 'Strategic thinking', 'Communication', 'Meaningful impact'], level: 'Intermediate', reason: 'Your user understanding and strategic thinking fit product management well' },
      { career: 'frontend-dev', whyMatch: ['Creative problem solving', 'Attention to detail', 'User focus', 'Technical skills'], level: 'Entry', reason: 'Your creative and detail-oriented approach works well in frontend development' }
    ],
    'INFP': [
      { career: 'ux-designer', whyMatch: ['Creative expression', 'User empathy', 'Meaningful work', 'Attention to detail'], level: 'Entry', reason: 'Your creative and empathetic nature is perfect for UX design' },
      { career: 'frontend-dev', whyMatch: ['Creative problem solving', 'Independent work', 'Technical creativity', 'User focus'], level: 'Entry', reason: 'Your creative and independent approach works well in frontend development' },
      { career: 'data-scientist', whyMatch: ['Analytical thinking', 'Independent research', 'Creative analysis', 'Meaningful insights'], level: 'Entry', reason: 'Your analytical and creative thinking can work well in data science' }
    ],
    'ENFJ': [
      { career: 'product-manager', whyMatch: ['Natural leadership', 'Team motivation', 'Communication skills', 'User empathy'], level: 'Senior', reason: 'Your leadership and empathy make you ideal for senior product management' },
      { career: 'ux-designer', whyMatch: ['User empathy', 'Communication', 'Team collaboration', 'Creative leadership'], level: 'Intermediate', reason: 'Your empathy and communication skills fit UX design perfectly' },
      { career: 'frontend-dev', whyMatch: ['Team collaboration', 'Communication', 'Creative problem solving', 'User focus'], level: 'Intermediate', reason: 'Your collaborative and communicative approach works well in frontend development' }
    ],
    'ENFP': [
      { career: 'ux-designer', whyMatch: ['Creative thinking', 'User empathy', 'Adaptability', 'Communication'], level: 'Intermediate', reason: 'Your creative and empathetic nature is perfect for UX design' },
      { career: 'product-manager', whyMatch: ['Innovation', 'Communication skills', 'Adaptability', 'User focus'], level: 'Intermediate', reason: 'Your innovative and communicative approach fits product management well' },
      { career: 'frontend-dev', whyMatch: ['Creative problem solving', 'Adaptability', 'Innovation focus', 'Communication'], level: 'Intermediate', reason: 'Your creative and adaptable approach works well in frontend development' }
    ]
  };

  // Get personality-specific matches or use default
  const matches = personalityMatches[personalityType] || personalityMatches['INTJ'];
  
  return matches.map(match => {
    const career = baseCareers.find(c => c.id === match.career);
    return {
      ...career,
      whyMatch: match.whyMatch,
      recommendedLevel: match.level,
      levelReason: match.reason
    };
  });
};

const getLevelBadgeColor = (level: string) => {
  switch (level) {
    case 'Entry': return 'bg-green-100 text-green-800';
    case 'Intermediate': return 'bg-blue-100 text-blue-800';
    case 'Senior': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRecommendedResources = (skill: string, budget: string) => {
  const resources: { name: string; type: string; icon: string }[] = [];
  if (budget === 'free') {
    resources.push({ name: 'FreeCodeCamp', type: 'Online Course', icon: '📚' });
    resources.push({ name: 'MDN Web Docs', type: 'Documentation', icon: '📖' });
    resources.push({ name: 'GitHub', type: 'Code Repository', icon: '💻' });
  } else {
    resources.push({ name: 'Udemy', type: 'Paid Course', icon: '💰' });
    resources.push({ name: 'Coursera', type: 'Professional Certificate', icon: '📜' });
    resources.push({ name: 'Pluralsight', type: 'Premium', icon: '🔒' });
  }
  return resources.map(r => `${r.icon} ${r.name}`).join(' | ');
};

const getLearningResources = (preferences: any) => {
  const resources: { name: string; type: string; icon: string }[] = [];
  if (preferences.budget === 'free') {
    resources.push({ name: 'FreeCodeCamp', type: 'Online Course', icon: '📚' });
    resources.push({ name: 'MDN Web Docs', type: 'Documentation', icon: '📖' });
    resources.push({ name: 'GitHub', type: 'Code Repository', icon: '💻' });
  } else {
    resources.push({ name: 'Udemy', type: 'Paid Course', icon: '💰' });
    resources.push({ name: 'Coursera', type: 'Professional Certificate', icon: '📜' });
    resources.push({ name: 'Pluralsight', type: 'Premium', icon: '🔒' });
  }
  return resources;
};

const getWorkEnvironmentMatch = (preferences: any, personalityType: string) => {
  const matches: { description: string; icon: string }[] = [];
  matches.push({ description: 'Perfect for IT industry roles.', icon: '💻' });
  matches.push({ description: 'Strong technical aptitude.', icon: '⚡' });
  matches.push({ description: 'Problem-solving focused.', icon: '🎯' });
  matches.push({ description: 'Continuous learning mindset.', icon: '📚' });
  return matches;
};

export const Results: React.FC<ResultsProps> = ({
  data,
  onPrevious,
  canGoBack,
}) => {
  const [showResults, setShowResults] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading and then show results
    const timer = setTimeout(() => {
      setShowResults(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!showResults) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-16">
        <div className="relative">
          <div className="spinner"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-dark-text">
            Analyzing your profile...
          </h2>
          <p className="text-medium-text">
            We're matching your skills and preferences with career opportunities
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 animate-celebrate">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-4xl">🎉</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-secondary to-green-400 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-sm">✨</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Your Career Analysis Complete!
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Based on your skills, personality, and preferences, here's your comprehensive career assessment
          </p>
        </div>

        {/* Success stats */}
        <div className="flex justify-center space-x-8 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">5 Steps</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">100%</div>
            <div className="text-sm text-muted-foreground">Analysis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">3+</div>
            <div className="text-sm text-muted-foreground">Career Matches</div>
          </div>
        </div>
      </div>

      {/* 16 Personalities Results */}
      {data.personalityData && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
            <span className="mr-3">🧠</span>
            Your Personality Type: {data.personalityType}
          </h2>
          <div className="space-y-6">
            {/* Personality Type Overview */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-dark-text">{data.personalityData.name}</h3>
              <p className="text-medium-text max-w-2xl mx-auto">{data.personalityData.description}</p>
            </div>

            {/* Key Traits */}
            <div>
              <h4 className="font-semibold text-dark-text mb-3">Key Traits</h4>
              <div className="flex flex-wrap gap-2">
                {data.personalityData.traits.map((trait: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Career Strengths */}
            <div>
              <h4 className="font-semibold text-dark-text mb-3">Career Strengths</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {data.personalityData.careerStrengths.map((strength: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
                    <span className="text-primary">💪</span>
                    <span className="text-sm text-dark-text">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal Careers */}
            <div>
              <h4 className="font-semibold text-dark-text mb-3">Ideal Career Paths</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {data.personalityData.idealCareers.map((career: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-success-green/10 rounded-lg">
                    <span className="text-success-green">🎯</span>
                    <span className="text-sm text-dark-text">{career}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Style */}
            <div>
              <h4 className="font-semibold text-dark-text mb-3">Your Work Style</h4>
              <p className="text-medium-text p-4 bg-lighter-gray rounded-lg">
                {data.personalityData.workStyle}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Personality Insights */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
          <span className="mr-3">📊</span>
          Your Personality Dimensions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {PERSONALITY_INSIGHTS.map((insight, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <h3 className="font-semibold text-dark-text">{insight.trait}</h3>
                  <div className="flex items-center space-x-2">
                    <Progress value={insight.score} className="w-20 h-2" />
                    <span className="text-sm text-medium-text">{insight.score}%</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-medium-text">{insight.description}</p>
              <p className="text-sm font-medium text-primary">💪 {insight.strength}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Strengths */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
          <span className="mr-3">⭐</span>
          Your Key Strengths
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {STRENGTHS.map((strength, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg">
              <span className="text-2xl">{strength.icon}</span>
              <div>
                <h3 className="font-semibold text-dark-text">{strength.name}</h3>
                <p className="text-sm text-medium-text mb-2">{strength.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {strength.impact}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skill Gap Analysis */}
      {data.skills && Object.keys(data.skills).length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Skill Gap Analysis
          </h2>
          <div className="space-y-6">
            {getCareerMatches(data.personalityType || 'INTJ', data.skills || {}).slice(0, 1).map((career) => (
              <div key={career.id} className="space-y-4">
                <h3 className="text-lg font-semibold text-dark-text">
                  Skills needed for {career.title}
                </h3>
                
                {/* Current vs Required Skills */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-dark-text mb-3">Your Current Skills</h4>
                    <div className="space-y-2">
                      {Object.entries(data.skills || {}).map(([skill, skillData]: [string, any]) => {
                        if (skillData.selected && skillData.level > 0) {
                          return (
                            <div key={skill} className="flex items-center justify-between p-2 bg-success-green/10 rounded">
                              <span className="text-sm text-dark-text">{skill}</span>
                              <Badge variant="secondary" className="text-xs">
                                {SKILL_LEVELS[skillData.level]?.label}
                              </Badge>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-dark-text mb-3">Skills to Develop</h4>
                    <div className="space-y-2">
                      {career.skillsToLearn.map((skill: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-warning-orange/10 rounded">
                          <span className="text-sm text-dark-text">{skill.skill}</span>
                          <Badge variant="outline" className="text-xs">
                            {skill.timeframe}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Learning Roadmap */}
                <div>
                  <h4 className="font-medium text-dark-text mb-3">Your Learning Roadmap</h4>
                  <div className="space-y-3">
                    {career.skillsToLearn.map((skill: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-lighter-gray rounded-lg">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-dark-text">{skill.skill}</div>
                          <div className="text-sm text-medium-text">Timeline: {skill.timeframe}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getRecommendedResources(skill.skill, data.preferences?.budget || 'free')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Personalized Recommendations */}
      {data.preferences && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
            <span className="mr-3">🎯</span>
            Personalized Recommendations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Learning Resources */}
            <div>
              <h3 className="font-semibold text-dark-text mb-3 flex items-center">
                <span className="mr-2">📚</span>
                Recommended Learning Resources
              </h3>
              <div className="space-y-2">
                {getLearningResources(data.preferences).map((resource, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-primary/5 rounded">
                    <span className="text-primary">{resource.icon}</span>
                    <span className="text-sm text-dark-text">{resource.name}</span>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {resource.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Environment Match */}
            <div>
              <h3 className="font-semibold text-dark-text mb-3 flex items-center">
                <span className="mr-2">🏢</span>
                Work Environment Match
              </h3>
              <div className="space-y-2">
                {getWorkEnvironmentMatch(data.preferences, data.personalityType).map((match, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-success-green/10 rounded">
                    <span className="text-success-green">{match.icon}</span>
                    <span className="text-sm text-dark-text">{match.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Career Matches */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Your Top Career Matches
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your assessment, here are the best career paths for you
          </p>
        </div>
        
        <div className="grid gap-6 max-w-4xl mx-auto">
          {getCareerMatches(data.personalityType || 'INTJ', data.skills || {}).map((career, index) => (
            <Card key={career.id} className="p-8 hover:shadow-lg transition-all duration-300">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-2xl font-bold text-foreground">
                        {career.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {career.recommendedLevel}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{career.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{career.salary}</div>
                    <div className="text-sm text-muted-foreground">Salary Range</div>
                  </div>
                </div>

                {/* Key Points */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Why this fits you</h4>
                    <ul className="space-y-2">
                      {career.whyMatch.slice(0, 3).map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Skills to develop</h4>
                    <ul className="space-y-2">
                      {career.skillsToLearn.slice(0, 3).map((skill, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-1 h-1 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {skill.skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{career.timeToJobReady}</div>
                    <div className="text-xs text-muted-foreground">Time to Job-Ready</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{career.growth}</div>
                    <div className="text-xs text-muted-foreground">Market Growth</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <Button className="w-full">
                    Start Learning Path
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Items & Next Steps */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
          <span className="mr-3">🚀</span>
          Your Action Plan
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Immediate Actions */}
          <div>
            <h3 className="font-semibold text-dark-text mb-3 flex items-center">
              <span className="mr-2">⚡</span>
              Immediate Actions (This Week)
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded">
                <span className="text-primary">📝</span>
                <span className="text-sm text-dark-text">Update your resume with new skills</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded">
                <span className="text-primary">🔗</span>
                <span className="text-sm text-dark-text">Connect with professionals in your target field</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded">
                <span className="text-primary">📚</span>
                <span className="text-sm text-dark-text">Start your first learning course</span>
              </div>
            </div>
          </div>

          {/* Short-term Goals */}
          <div>
            <h3 className="font-semibold text-dark-text mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              Short-term Goals (Next 3 Months)
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-success-green/10 rounded">
                <span className="text-success-green">💼</span>
                <span className="text-sm text-dark-text">Complete 2-3 skill-building courses</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-success-green/10 rounded">
                <span className="text-success-green">👥</span>
                <span className="text-sm text-dark-text">Join relevant professional communities</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-success-green/10 rounded">
                <span className="text-success-green">📊</span>
                <span className="text-sm text-dark-text">Build a portfolio project</span>
              </div>
            </div>
          </div>
        </div>
      </Card>



      {/* Additional Actions */}
      <div className="text-center space-y-4 pt-8">
        <p className="text-medium-text">
          Ready to take the next step? Download your full report or refine your preferences.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="btn-secondary"
          >
            Adjust Preferences
          </Button>
          <Button className="btn-hero">
            Download Full Report
          </Button>
          <Button variant="outline" className="btn-secondary">
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
};