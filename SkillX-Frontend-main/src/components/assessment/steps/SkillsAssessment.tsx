import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SkillsAssessmentProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  isLoading?: boolean;
  canGoBack: boolean;
}

const SKILL_CATEGORIES = {
  'Frontend Development': [
    'HTML/CSS',
    'JavaScript',
    'React',
    'Vue.js',
    'Angular',
    'TypeScript',
  ],
  'Backend Development': [
    'Node.js',
    'Python',
    'Java',
    'C#',
    'PHP',
    'Ruby',
  ],
  'Data & Analytics': [
    'SQL',
    'Python',
    'R',
    'Excel',
    'Tableau',
    'Power BI',
  ],
  'Design & UX': [
    'Figma',
    'Adobe Creative Suite',
    'Sketch',
    'User Research',
    'Prototyping',
    'UI Design',
  ],
};

const SKILL_LEVELS = [
  { 
    value: 0, 
    label: 'None', 
    color: 'bg-gray-200',
    description: 'No experience with this skill'
  },
  { 
    value: 1, 
    label: 'Beginner', 
    color: 'bg-blue-200',
    description: 'Basic understanding, can follow tutorials'
  },
  { 
    value: 2, 
    label: 'Novice', 
    color: 'bg-blue-400',
    description: 'Can work on simple projects independently'
  },
  { 
    value: 3, 
    label: 'Intermediate', 
    color: 'bg-blue-600',
    description: 'Can handle complex projects and mentor beginners'
  },
  { 
    value: 4, 
    label: 'Advanced', 
    color: 'bg-blue-800',
    description: 'Expert level, can architect solutions and lead teams'
  },
];

// Detailed skill descriptions for each level
const SKILL_DESCRIPTIONS = {
  'HTML/CSS': {
    0: 'No experience with HTML/CSS',
    1: 'Can create basic HTML structure, apply simple CSS styles, and understand fundamental concepts like tags, classes, and basic styling',
    2: 'Can build responsive layouts, use CSS frameworks like Bootstrap, understand flexbox/grid, and create mobile-friendly designs',
    3: 'Can create complex layouts, animations, optimize for performance, use CSS preprocessors, and implement advanced techniques',
    4: 'Can architect CSS systems, create design systems, mentor others, and lead frontend architecture decisions'
  },
  'JavaScript': {
    0: 'No experience with JavaScript',
    1: 'Can write basic functions, manipulate DOM elements, understand variables, loops, and basic ES6 syntax',
    2: 'Can work with APIs, handle events, use modern ES6+ features, understand async/await, and build simple applications',
    3: 'Can build complex applications, use frameworks (React/Vue/Angular), debug effectively, and implement advanced patterns',
    4: 'Can architect applications, optimize performance, lead development teams, and make architectural decisions'
  },
  'React': {
    0: 'No experience with React',
    1: 'Can create basic components, understand props/state, use JSX, and follow React patterns',
    2: 'Can build functional components with hooks, manage component lifecycle, use context, and implement routing',
    3: 'Can create complex applications, optimize performance, use advanced patterns, and implement state management',
    4: 'Can architect React applications, create custom hooks, lead React teams, and make architectural decisions'
  },
  'Node.js': {
    0: 'No experience with Node.js',
    1: 'Can create basic server scripts, understand npm, and work with simple Express routes',
    2: 'Can build REST APIs, handle middleware, work with databases, and implement authentication',
    3: 'Can create complex applications, optimize performance, implement microservices, and use advanced patterns',
    4: 'Can architect Node.js systems, lead backend teams, and make architectural decisions'
  },
  'Python': {
    0: 'No experience with Python',
    1: 'Can write basic scripts, understand fundamental concepts, work with data types, and use basic libraries',
    2: 'Can work with libraries (pandas, numpy), handle data structures, create simple applications, and use OOP',
    3: 'Can build complex applications, work with frameworks (Django/Flask), optimize code, and implement algorithms',
    4: 'Can architect systems, create libraries, lead Python development teams, and make architectural decisions'
  },
  'Java': {
    0: 'No experience with Java',
    1: 'Can write basic programs, understand OOP concepts, work with data types, and use basic libraries',
    2: 'Can build applications, work with frameworks (Spring), handle databases, and implement design patterns',
    3: 'Can create complex applications, optimize performance, work with microservices, and implement advanced patterns',
    4: 'Can architect Java systems, lead development teams, and make architectural decisions'
  },
  'C#': {
    0: 'No experience with C#',
    1: 'Can write basic programs, understand OOP concepts, work with .NET framework, and use basic libraries',
    2: 'Can build applications, work with ASP.NET, handle databases, and implement design patterns',
    3: 'Can create complex applications, optimize performance, work with cloud services, and implement advanced patterns',
    4: 'Can architect C# systems, lead development teams, and make architectural decisions'
  },
  'PHP': {
    0: 'No experience with PHP',
    1: 'Can write basic scripts, understand syntax, work with forms, and use basic functions',
    2: 'Can build web applications, work with frameworks (Laravel), handle databases, and implement MVC patterns',
    3: 'Can create complex applications, optimize performance, work with APIs, and implement advanced patterns',
    4: 'Can architect PHP systems, lead development teams, and make architectural decisions'
  },
  'Ruby': {
    0: 'No experience with Ruby',
    1: 'Can write basic scripts, understand syntax, work with gems, and use basic OOP concepts',
    2: 'Can build web applications, work with Rails, handle databases, and implement MVC patterns',
    3: 'Can create complex applications, optimize performance, work with APIs, and implement advanced patterns',
    4: 'Can architect Ruby systems, lead development teams, and make architectural decisions'
  },
  'SQL': {
    0: 'No experience with SQL',
    1: 'Can write basic SELECT queries, understand database concepts, and work with simple WHERE clauses',
    2: 'Can write complex queries, joins, subqueries, and basic database design with normalization',
    3: 'Can optimize queries, design databases, work with large datasets, and implement stored procedures',
    4: 'Can architect database systems, create stored procedures, lead data teams, and make architectural decisions'
  },
  'R': {
    0: 'No experience with R',
    1: 'Can write basic scripts, understand data types, work with data frames, and create simple visualizations',
    2: 'Can perform statistical analysis, create complex visualizations, work with packages, and handle data manipulation',
    3: 'Can build predictive models, perform advanced analytics, create packages, and implement machine learning',
    4: 'Can lead data science teams, create statistical frameworks, and make architectural decisions'
  },
  'Excel': {
    0: 'No experience with Excel',
    1: 'Can create basic spreadsheets, use simple formulas, and create basic charts',
    2: 'Can use advanced formulas, pivot tables, VBA macros, and create complex data models',
    3: 'Can build complex dashboards, automate processes, create financial models, and perform advanced analysis',
    4: 'Can lead Excel automation projects, create templates, and train others on advanced Excel techniques'
  },
  'Tableau': {
    0: 'No experience with Tableau',
    1: 'Can create basic visualizations, connect to data sources, and use simple calculations',
    2: 'Can create complex dashboards, use advanced calculations, implement filters, and optimize performance',
    3: 'Can build interactive dashboards, create custom calculations, implement advanced features, and optimize for performance',
    4: 'Can lead Tableau projects, create best practices, train others, and make architectural decisions'
  },
  'Power BI': {
    0: 'No experience with Power BI',
    1: 'Can create basic reports, connect to data sources, and use simple DAX formulas',
    2: 'Can create complex reports, use advanced DAX, implement data models, and optimize performance',
    3: 'Can build complex dashboards, create custom visuals, implement advanced DAX, and optimize for performance',
    4: 'Can lead Power BI projects, create best practices, train others, and make architectural decisions'
  },
  'Figma': {
    0: 'No experience with Figma',
    1: 'Can create basic designs, use fundamental tools, and understand design principles',
    2: 'Can create components, use design systems, collaborate effectively, and implement responsive design',
    3: 'Can create complex designs, build design systems, optimize workflows, and implement advanced features',
    4: 'Can lead design teams, create design strategies, mentor designers, and make architectural decisions'
  },
  'Adobe Creative Suite': {
    0: 'No experience with Adobe Creative Suite',
    1: 'Can use basic tools in Photoshop, Illustrator, or InDesign for simple design tasks',
    2: 'Can create complex designs, use advanced features, work with multiple tools, and understand design principles',
    3: 'Can create professional designs, optimize workflows, use advanced techniques, and mentor others',
    4: 'Can lead creative teams, create design strategies, establish workflows, and make architectural decisions'
  },
  'Sketch': {
    0: 'No experience with Sketch',
    1: 'Can create basic designs, use fundamental tools, and understand design principles',
    2: 'Can create components, use design systems, collaborate effectively, and implement responsive design',
    3: 'Can create complex designs, build design systems, optimize workflows, and implement advanced features',
    4: 'Can lead design teams, create design strategies, mentor designers, and make architectural decisions'
  },
  'User Research': {
    0: 'No experience with User Research',
    1: 'Can conduct basic interviews, create simple surveys, and understand user needs',
    2: 'Can conduct usability testing, create personas, perform competitive analysis, and synthesize findings',
    3: 'Can lead research projects, create research strategies, perform advanced analysis, and mentor others',
    4: 'Can lead research teams, establish research practices, create frameworks, and make strategic decisions'
  },
  'Prototyping': {
    0: 'No experience with Prototyping',
    1: 'Can create basic wireframes, use simple prototyping tools, and understand user flows',
    2: 'Can create interactive prototypes, use advanced tools, conduct user testing, and iterate designs',
    3: 'Can create complex prototypes, establish prototyping workflows, mentor others, and optimize processes',
    4: 'Can lead prototyping strategies, establish best practices, train teams, and make architectural decisions'
  },
  'UI Design': {
    0: 'No experience with UI Design',
    1: 'Can create basic interfaces, understand design principles, and use design tools',
    2: 'Can create complex interfaces, implement design systems, ensure accessibility, and optimize usability',
    3: 'Can lead design projects, establish design systems, mentor designers, and optimize workflows',
    4: 'Can lead design teams, create design strategies, establish best practices, and make architectural decisions'
  }
};

export const SkillsAssessment: React.FC<SkillsAssessmentProps> = ({
  data,
  onNext,
  onPrevious,
  canGoBack,
}) => {
  const [skills, setSkills] = useState(data.skills || {});
  const [portfolio, setPortfolio] = useState<File | null>(data.portfolio || null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const updateSkill = (skillName: string, level: number) => {
    setSkills(prev => ({
      ...prev,
      [skillName]: {
        selected: level > 0,
        level: level,
      },
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPortfolio(file);
    }
  };

  const handleContinue = () => {
    onNext({ skills, portfolio });
  };

  const getSkillDescription = (skillName: string, level: number) => {
    return SKILL_DESCRIPTIONS[skillName as keyof typeof SKILL_DESCRIPTIONS]?.[level] || 
           SKILL_LEVELS[level]?.description || 
           'No description available';
  };

  const getSelectedSkillsCount = () => {
    return Object.values(skills).filter((skill: any) => skill.selected && skill.level > 0).length;
  };

  return (
    <TooltipProvider>
      <div className="space-y-10">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">⚡</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-secondary to-green-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">{getSelectedSkillsCount()}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              What are your current skills?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Select your skills and rate your proficiency level from 0-4
            </p>
          </div>

          {/* Skills Progress Stats */}
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{getSelectedSkillsCount()}</div>
              <div className="text-sm text-muted-foreground">Skills Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {Object.values(skills).filter((skill: any) => skill.level >= 3).length}
              </div>
              <div className="text-sm text-muted-foreground">Advanced Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {Object.values(skills).filter((skill: any) => skill.level >= 2).length}
              </div>
              <div className="text-sm text-muted-foreground">Intermediate+</div>
            </div>
          </div>
        </div>

        {/* Enhanced Skill Level Guide */}
        <Card className="p-8 bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">Skill Level Guide</h3>
            <p className="text-muted-foreground">Hover over skill level buttons for detailed descriptions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-border/50">
              <div className="w-12 h-8 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <span className="text-sm font-semibold text-gray-600">0</span>
              </div>
              <div className="font-semibold text-gray-600">None</div>
              <div className="text-xs text-muted-foreground">No experience</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-200">
              <div className="w-12 h-8 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                <span className="text-sm font-semibold text-blue-700">1</span>
              </div>
              <div className="font-semibold text-blue-700">Beginner</div>
              <div className="text-xs text-muted-foreground">Basic understanding</div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-xl shadow-sm border border-blue-300">
              <div className="w-12 h-8 mx-auto mb-3 bg-blue-200 rounded-lg flex items-center justify-center border border-blue-300">
                <span className="text-sm font-semibold text-blue-800">2</span>
              </div>
              <div className="font-semibold text-blue-800">Novice</div>
              <div className="text-xs text-muted-foreground">Can work independently</div>
            </div>
            <div className="text-center p-4 bg-blue-200 rounded-xl shadow-sm border border-blue-400">
              <div className="w-12 h-8 mx-auto mb-3 bg-blue-300 rounded-lg flex items-center justify-center border border-blue-400">
                <span className="text-sm font-semibold text-blue-900">3</span>
              </div>
              <div className="font-semibold text-blue-900">Intermediate</div>
              <div className="text-xs text-muted-foreground">Can handle complex tasks</div>
            </div>
            <div className="text-center p-4 bg-blue-300 rounded-xl shadow-sm border border-blue-500">
              <div className="w-12 h-8 mx-auto mb-3 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center border border-primary">
                <span className="text-sm font-semibold text-white">4</span>
              </div>
              <div className="font-semibold text-blue-950">Advanced</div>
              <div className="text-xs text-muted-foreground">Can lead and mentor</div>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          {Object.entries(SKILL_CATEGORIES).map(([category, skillList]) => (
            <Card key={category} className="p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">
                    {category === 'Frontend Development' ? '🎨' :
                     category === 'Backend Development' ? '⚙️' :
                     category === 'Data & Analytics' ? '📊' : '🎯'}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{category}</h3>
                  <p className="text-muted-foreground">Rate your proficiency in each skill</p>
                </div>
              </div>
              
              <div className="space-y-6">
                                {skillList.map((skill) => {
                  const skillLevel = skills[skill]?.level || 0;
                  return (
                    <div key={skill} className="flex items-center justify-between py-6 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-all duration-200 rounded-lg px-4">
                      <div className="flex items-center space-x-6">
                        <div className="min-w-[140px]">
                          <span className="font-semibold text-foreground">{skill}</span>
                        </div>
                        <div className="flex space-x-1">
                          {SKILL_LEVELS.map((level) => (
                            <Tooltip key={level.value}>
                              <TooltipTrigger asChild>
                                <button
                                  className={`relative w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                                    skillLevel >= level.value
                                      ? 'bg-primary border-primary shadow-md'
                                      : 'bg-white border-gray-300 hover:border-primary hover:shadow-sm'
                                  }`}
                                  onClick={() => updateSkill(skill, level.value)}
                                >
                                  <span className="text-xs font-medium">{level.value}</span>
                                  {skillLevel >= level.value && (
                                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full border border-primary"></div>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="space-y-2">
                                  <p className="font-semibold">{level.label}</p>
                                  <p className="text-sm">
                                    {getSkillDescription(skill, level.value)}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                      {skillLevel > 0 && (
                        <Badge variant="secondary" className="text-xs px-3 py-1">
                          {SKILL_LEVELS[skillLevel]?.label}
                        </Badge>
                      )}
                    </div>
                  );
                })}
                
                {/* Skill-specific level guide for this category */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Skill Level Guide for {category}</span>
                    <div className="flex space-x-1">
                      {SKILL_LEVELS.map((level) => (
                        <div
                          key={level.value}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            level.value === 0 ? 'bg-gray-200 border-gray-300' :
                            level.value === 1 ? 'bg-blue-100 border-blue-300' :
                            level.value === 2 ? 'bg-blue-200 border-blue-400' :
                            level.value === 3 ? 'bg-blue-300 border-blue-500' :
                            'bg-primary border-primary'
                          }`}
                        >
                          <span className="text-xs font-medium">{level.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Hover over skill level buttons to see detailed descriptions</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Enhanced Portfolio Upload */}
          <Card className="p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-green-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📄</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Portfolio or Resume (Optional)</h3>
                <p className="text-muted-foreground">Upload your work to help us provide better recommendations</p>
              </div>
            </div>
            
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
                  <div className="text-center p-8 bg-success/10 rounded-xl border-2 border-success/20 hover:bg-success/20 transition-all duration-300">
                    <div className="text-4xl mb-4">✅</div>
                    <p className="font-semibold text-foreground text-lg">{portfolio.name}</p>
                    <p className="text-sm text-muted-foreground mt-2">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50 transition-all duration-300">
                    <div className="text-5xl mb-4 text-muted-foreground">📄</div>
                    <p className="font-semibold text-foreground text-lg">
                      Click to upload portfolio or resume
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      PDF, DOC, or DOCX files only
                    </p>
                  </div>
                )}
              </label>
            </div>
          </Card>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex justify-between items-center pt-12">
          <div>
            {canGoBack && (
              <Button
                variant="outline"
                onClick={onPrevious}
                className="px-8 py-3 text-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
            )}
          </div>
          
          <Button
            onClick={handleContinue}
            className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};