import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AdditionalSkills } from "./AdditionalSkills";
import { 
  Code, 
  Database, 
  BarChart3, 
  Palette, 
  FileText, 
  CheckCircle2,
  Star,
  TrendingUp,
  Zap,
  Target
} from 'lucide-react';

interface SkillsAssessmentProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  isLoading?: boolean;
  canGoBack: boolean;
}

const SKILL_CATEGORIES = {
  'Frontend Development': {
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'TypeScript']
  },
  'Backend Development': {
    icon: Database,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    skills: ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby']
  },
  'Data & Analytics': {
    icon: BarChart3,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    skills: ['SQL', 'Python', 'R', 'Excel', 'Tableau', 'Power BI']
  },
  'Design & UX': {
    icon: Palette,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    skills: ['Figma', 'Adobe Creative Suite', 'Sketch', 'User Research', 'Prototyping', 'UI Design']
  },
};

const SKILL_LEVELS = [
  { 
    value: 0, 
    label: 'No Experience', 
    color: 'bg-gray-100 border-gray-300', 
    textColor: 'text-gray-600',
    description: 'No experience with this skill',
    icon: '○'
  },
  { 
    value: 1, 
    label: 'Beginner', 
    color: 'bg-blue-100 border-blue-300', 
    textColor: 'text-blue-700',
    description: 'Basic understanding, can follow tutorials',
    icon: '●'
  },
  { 
    value: 2, 
    label: 'Intermediate', 
    color: 'bg-blue-200 border-blue-400', 
    textColor: 'text-blue-800',
    description: 'Can work on projects independently',
    icon: '●●'
  },
  { 
    value: 3, 
    label: 'Advanced', 
    color: 'bg-blue-300 border-blue-500', 
    textColor: 'text-blue-900',
    description: 'Can handle complex projects and mentor beginners',
    icon: '●●●'
  },
  { 
    value: 4, 
    label: 'Expert', 
    color: 'bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-600', 
    textColor: 'text-white',
    description: 'Expert level, can architect solutions and lead teams',
    icon: '●●●●'
  },
];

export const SkillsAssessment: React.FC<SkillsAssessmentProps> = ({
                                                                    data,
                                                                    onNext,
                                                                    onPrevious,
                                                                    canGoBack,
                                                                  }) => {
  const [skills, setSkills] = useState<Record<string, { selected: boolean; level: number }>>(data.skills || {});
  const [portfolio, setPortfolio] = useState<File | null>(data.portfolio || null);

  const updateSkill = (skillName: string, level: number) => {
    setSkills(prev => ({
      ...prev,
      [skillName]: {
        selected: level > 0,
        level,
      },
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPortfolio(file);
  };

  const normalizeSkillsForBackend = (src: Record<string, { selected: boolean; level: number }>) => {
    const out: Record<string, { selected: boolean; level: number }> = {};
    for (const [name, info] of Object.entries(src || {})) {
      if (!info || !info.selected || info.level === undefined) continue;
      if (name === 'HTML/CSS') {
        out['HTML'] = { selected: true, level: info.level };
        out['CSS'] = { selected: true, level: info.level };
      } else {
        out[name] = { selected: true, level: info.level };
      }
    }
    return out;
  };

  const handleContinue = () => {
    const normalized = normalizeSkillsForBackend(skills);
    onNext({ skills: normalized, portfolio });
  };

  const getSelectedSkillsCount = () => {
    return Object.values(skills).filter((s: any) => s.selected && s.level > 0).length;
  };

  const getAverageSkillLevel = () => {
    const selectedSkills = Object.values(skills).filter((s: any) => s.selected && s.level > 0);
    if (selectedSkills.length === 0) return 0;
    const total = selectedSkills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round((total / selectedSkills.length) * 10) / 10;
  };

  const getCompletionPercentage = () => {
    const totalSkills = Object.values(SKILL_CATEGORIES).reduce((sum, category) => sum + category.skills.length, 0);
    const selectedSkills = getSelectedSkillsCount();
    return Math.round((selectedSkills / totalSkills) * 100);
  };

  return (
      <TooltipProvider>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Zap className="w-12 h-12 text-white" />
              </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">{getSelectedSkillsCount()}</span>
            </div>
            </div>

            <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Skills Assessment
              </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Evaluate your technical proficiency across different domains to help us match you with the perfect career path
              </p>
            </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{getSelectedSkillsCount()}</div>
                <div className="text-sm text-gray-500 font-medium">Skills Selected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{getAverageSkillLevel()}</div>
                <div className="text-sm text-gray-500 font-medium">Avg. Level</div>
                </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{getCompletionPercentage()}%</div>
                <div className="text-sm text-gray-500 font-medium">Completion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {Object.values(skills).filter((s: any) => s.level >= 3).length}
                </div>
                <div className="text-sm text-gray-500 font-medium">Advanced+</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Assessment Progress</span>
                <span>{getCompletionPercentage()}%</span>
          </div>
              <Progress value={getCompletionPercentage()} className="h-3" />
            </div>
          </div>
            </div>

        {/* Skill Level Guide */}
        <Card className="overflow-hidden border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Target className="w-6 h-6 text-blue-600" />
              Skill Proficiency Levels
            </CardTitle>
            <p className="text-gray-600 font-normal">Hover over each level to see detailed descriptions</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {SKILL_LEVELS.map((level) => (
                <Tooltip key={level.value}>
                  <TooltipTrigger asChild>
                    <div className={`text-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${level.color}`}>
                      <div className="text-2xl mb-2">{level.icon}</div>
                      <div className={`font-semibold ${level.textColor}`}>{level.value}</div>
                      <div className={`text-sm font-medium ${level.textColor}`}>{level.label}</div>
                </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-semibold">{level.label}</p>
                      <p className="text-sm text-gray-600">{level.description}</p>
              </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
          </Card>

        {/* Skills Categories */}
        <div className="space-y-6">
          {Object.entries(SKILL_CATEGORIES).map(([category, categoryData]) => {
            const IconComponent = categoryData.icon;
            const selectedInCategory = categoryData.skills.filter(skill => 
              skills[skill]?.selected && skills[skill]?.level > 0
            ).length;
            const categoryProgress = (selectedInCategory / categoryData.skills.length) * 100;

            return (
              <Card key={category} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className={`${categoryData.bgColor} border-b ${categoryData.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${categoryData.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-gray-800">{category}</CardTitle>
                        <p className="text-gray-600 font-normal">
                          {selectedInCategory} of {categoryData.skills.length} skills selected
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-700">{Math.round(categoryProgress)}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Progress value={categoryProgress} className="h-2" />
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {categoryData.skills.map((skill) => {
                      const skillLevel = skills[skill]?.level || 0;
                      const isSelected = skillLevel > 0;
                      
                      return (
                        <div key={skill} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="min-w-[160px]">
                                <span className="font-semibold text-gray-800">{skill}</span>
                                {isSelected && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600 font-medium">
                                      {SKILL_LEVELS[skillLevel]?.label}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                {SKILL_LEVELS.map((level) => (
                                    <Tooltip key={level.value}>
                                      <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                        className={`relative w-10 h-10 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                                                skillLevel >= level.value
                                            ? 'bg-blue-600 border-blue-600 shadow-md text-white'
                                            : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-sm'
                                            }`}
                                            onClick={() => updateSkill(skill, level.value)}
                                        >
                                        <span className="text-sm font-semibold">{level.value}</span>
                                        {skillLevel === level.value && (
                                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                          )}
                                        </button>
                                      </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="space-y-2">
                                          <p className="font-semibold">{level.label}</p>
                                        <p className="text-sm text-gray-600">{level.description}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                ))}
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(skillLevel)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                  ))}
                                </div>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                  Level {skillLevel}
                                </Badge>
                              </div>
                            )}
                          </div>
                          </div>
                      );
                    })}
                  </div>
                </CardContent>
                </Card>
            );
          })}
        </div>

        {/* Additional Skills */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <CardTitle className="flex items-center gap-3 text-xl text-purple-800">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Additional Skills
            </CardTitle>
            <p className="text-purple-600 font-normal">Add any other skills that might be relevant to your career goals</p>
          </CardHeader>
          <CardContent className="p-6">
            <AdditionalSkills
                value={skills}
                setValue={setSkills}
            />
          </CardContent>
        </Card>

            {/* Portfolio Upload */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200">
            <CardTitle className="flex items-center gap-3 text-xl text-emerald-800">
              <FileText className="w-6 h-6 text-emerald-600" />
              Portfolio & Resume
            </CardTitle>
            <p className="text-emerald-600 font-normal">Upload your work to help us provide more personalized recommendations</p>
          </CardHeader>
          <CardContent className="p-6">
              <div className="file-upload-area">
                <input
                    type="file"
                    id="portfolio"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                />
                <label htmlFor="portfolio" className="cursor-pointer">
                  {portfolio ? (
                  <div className="text-center p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-200 hover:bg-emerald-100 transition-all duration-300">
                    <div className="text-5xl mb-4">✅</div>
                    <p className="font-semibold text-emerald-800 text-lg">{portfolio.name}</p>
                    <p className="text-sm text-emerald-600 mt-2">Click to change file</p>
                      </div>
                  ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300">
                    <div className="text-6xl mb-4 text-gray-400">📄</div>
                    <p className="font-semibold text-gray-700 text-lg">
                          Click to upload portfolio or resume
                        </p>
                    <p className="text-sm text-gray-500 mt-2">
                      PDF, DOC, or DOCX files only • Optional
                        </p>
                      </div>
                  )}
                </label>
              </div>
          </CardContent>
            </Card>

          {/* Navigation */}
        <div className="flex justify-between items-center pt-8 pb-4">
            <div>
              {canGoBack && (
                  <Button
                      variant="outline"
                      onClick={onPrevious}
                className="px-8 py-3 text-lg font-medium hover:shadow-lg transition-all duration-300 border-2"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                Previous
                  </Button>
              )}
            </div>

            <Button
                onClick={handleContinue}
            className="px-10 py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
            >
            Continue Assessment
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </TooltipProvider>
  );
};
