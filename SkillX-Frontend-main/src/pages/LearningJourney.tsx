import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const mockSkills = [
  { id: 'react', name: 'React', status: 'completed', badge: 'React Pro' },
  { id: 'node', name: 'Node.js', status: 'in-progress', badge: 'Node Novice' },
  { id: 'sql', name: 'SQL', status: 'locked', badge: 'SQL Starter' },
];

const mockMaterials = {
  react: [
    { id: 'mat1', title: 'Intro to React', type: 'video', status: 'completed' },
    { id: 'mat2', title: 'JSX & Components', type: 'article', status: 'completed' },
    { id: 'mat3', title: 'React State', type: 'article', status: 'completed' },
  ],
  node: [
    { id: 'mat4', title: 'Node.js Basics', type: 'video', status: 'in-progress' },
    { id: 'mat5', title: 'Express Routing', type: 'article', status: 'not-started' },
  ],
  sql: [
    { id: 'mat6', title: 'SQL Fundamentals', type: 'video', status: 'locked' },
  ],
};

const mockQuizzes = {
  react: [
    { id: 'quiz1', title: 'React Basics Quiz', status: 'completed' },
  ],
  node: [
    { id: 'quiz2', title: 'Node.js Quiz', status: 'not-started' },
  ],
  sql: [],
};

const mockProjects = {
  react: [
    { id: 'proj1', title: 'Build a Todo App', status: 'completed' },
  ],
  node: [
    { id: 'proj2', title: 'REST API Project', status: 'not-started' },
  ],
  sql: [],
};

const LearningJourney: React.FC = () => {
  const [currentSkillIdx, setCurrentSkillIdx] = useState(1); // Node.js in-progress
  const currentSkill = mockSkills[currentSkillIdx];
  const materials = mockMaterials[currentSkill.id] || [];
  const quizzes = mockQuizzes[currentSkill.id] || [];
  const projects = mockProjects[currentSkill.id] || [];
  const [feedback, setFeedback] = useState<{[matId: string]: {rating: number, comment: string}} | {}>({});
  const mockRatings = {
    mat1: { avg: 4.5, count: 12, comments: ['Great intro!', 'Very clear.'] },
    mat2: { avg: 4.0, count: 8, comments: ['Helpful', 'Good examples.'] },
    mat4: { avg: 5.0, count: 2, comments: ['Loved it!'] },
  };

  // Progress calculation
  const totalItems = materials.length + quizzes.length + projects.length;
  const completedItems = [...materials, ...quizzes, ...projects].filter(i => i.status === 'completed').length;
  const progress = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Learning Journey</h1>
      {/* Skill Roadmap */}
      <div className="flex gap-6 items-center mb-10">
        {mockSkills.map((skill, idx) => (
          <div key={skill.id} className="flex flex-col items-center">
            <button
              className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2 border-4
                ${skill.status === 'completed' ? 'bg-green-500 text-white border-green-700' :
                  skill.status === 'in-progress' ? 'bg-yellow-400 text-white border-yellow-600' :
                  'bg-gray-200 text-gray-500 border-gray-300'}
                ${idx === currentSkillIdx ? 'ring-4 ring-blue-400' : ''}`}
              disabled={skill.status === 'locked'}
              onClick={() => setCurrentSkillIdx(idx)}
            >
              {skill.name[0]}
            </button>
            <span className="text-sm font-medium mb-1">{skill.name}</span>
            <span className={`text-xs ${skill.status === 'completed' ? 'text-green-600' : skill.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-400'}`}>{skill.status.replace('-', ' ')}</span>
            {skill.status === 'completed' && (
              <span className="mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">🏅 {skill.badge}</span>
            )}
          </div>
        ))}
      </div>
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-3" />
        <div className="text-right text-xs mt-1">{progress}% complete</div>
      </div>
      {/* Materials, Quizzes, Projects */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Learning Materials</h2>
        <ul className="mb-4">
          {materials.map(mat => (
            <li key={mat.id} className="flex flex-col gap-1 mb-3 border-b pb-2">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${mat.status === 'completed' ? 'bg-green-500' : mat.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-300'}`}></span>
                <span>{mat.title}</span>
                <span className="text-xs text-gray-400 ml-2">[{mat.type}]</span>
                {mat.status === 'not-started' && <Button size="sm" className="ml-2">Start</Button>}
                {mat.status === 'in-progress' && <Button size="sm" className="ml-2">Continue</Button>}
                {mat.status === 'completed' && <span className="ml-2 text-green-600 text-xs">✓ Completed</span>}
              </div>
              {/* Feedback UI */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">Avg: {mockRatings[mat.id]?.avg || '-'} ({mockRatings[mat.id]?.count || 0} ratings)</span>
                <span className="ml-2 flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      className={`text-lg ${feedback[mat.id]?.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => setFeedback(f => ({ ...f, [mat.id]: { ...f[mat.id], rating: star } }))}
                    >★</button>
                  ))}
                </span>
                <input
                  className="border rounded px-2 py-1 text-xs ml-2"
                  placeholder="Add a comment"
                  value={feedback[mat.id]?.comment || ''}
                  onChange={e => setFeedback(f => ({ ...f, [mat.id]: { ...f[mat.id], comment: e.target.value } }))}
                  style={{ width: 120 }}
                />
                <Button size="sm" className="ml-1" onClick={() => alert('Feedback submitted (mock)!')}>Submit</Button>
              </div>
              {/* Recent comments */}
              {mockRatings[mat.id]?.comments && (
                <div className="text-xs text-gray-500 mt-1">Recent: {mockRatings[mat.id].comments.slice(0,2).join(' | ')}</div>
              )}
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-bold mb-2">Quizzes</h2>
        <ul className="mb-4">
          {quizzes.map(quiz => (
            <li key={quiz.id} className="flex items-center gap-2 mb-1">
              <span className={`w-3 h-3 rounded-full ${quiz.status === 'completed' ? 'bg-green-500' : quiz.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-300'}`}></span>
              <span>{quiz.title}</span>
              {quiz.status === 'not-started' && <Button size="sm" className="ml-2">Start</Button>}
              {quiz.status === 'in-progress' && <Button size="sm" className="ml-2">Continue</Button>}
              {quiz.status === 'completed' && <span className="ml-2 text-green-600 text-xs">✓ Completed</span>}
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-bold mb-2">Projects</h2>
        <ul>
          {projects.map(proj => (
            <li key={proj.id} className="flex items-center gap-2 mb-1">
              <span className={`w-3 h-3 rounded-full ${proj.status === 'completed' ? 'bg-green-500' : proj.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-300'}`}></span>
              <span>{proj.title}</span>
              {proj.status === 'not-started' && <Button size="sm" className="ml-2">Start</Button>}
              {proj.status === 'in-progress' && <Button size="sm" className="ml-2">Continue</Button>}
              {proj.status === 'completed' && <span className="ml-2 text-green-600 text-xs">✓ Completed</span>}
            </li>
          ))}
        </ul>
      </div>
      {/* Badge/Certificate */}
      {currentSkill.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-4">
          <span className="text-3xl">🏅</span>
          <div>
            <div className="font-bold text-green-700">Congratulations!</div>
            <div className="text-green-600">You earned the <span className="font-semibold">{currentSkill.badge}</span> badge for completing {currentSkill.name}.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningJourney;
