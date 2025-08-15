import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  getAllCareerPaths,
  createCareerPath,
  updateCareerPath,
  deleteCareerPath
} from '@/api/adminApi';

interface CareerPath {
  id: string;
  name: string;
  industry: string;
  description?: string;
  roles?: number;
  updatedAt?: string;
  salaryRange?: string;
  growthProjection?: string;
}

const emptyForm: Partial<CareerPath & {
  vector: string;
  skills: string;
  roadmap: string;
  detailedRoadmap: string;
}> = {
  name: '',
  industry: '',
  description: '',
  salaryRange: '',
  growthProjection: '',
  vector: '',
  skills: '',
  roadmap: '',
  detailedRoadmap: '',
};

const steps = [
  'Basic Info',
  'Vector',
  'Skills',
  'Roadmap',
  'Detailed Roadmap',
];

const CareerPaths: React.FC = () => {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<CareerPath>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [roadmapList, setRoadmapList] = useState<string[]>([]);

  // Fetch all career paths
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCareerPaths();
      setCareerPaths(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load career paths');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open form for create or edit
  const openForm = (cp?: CareerPath) => {
    setForm(cp ? { ...cp } : emptyForm);
    setEditingId(cp ? cp.id : null);
    setShowForm(true);
    setStep(0); // Reset step when opening form
    setSkillsList([]);
    setRoadmapList([]);
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit create or edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await (editingId ? updateCareerPath(editingId, form) : createCareerPath(form));
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchData();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to save career path');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this career path?')) return;
    setDeletingId(id);
    try {
      await deleteCareerPath(id);
      fetchData();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete career path');
    } finally {
      setDeletingId(null);
    }
  };

  // Stepper navigation
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Dynamic skills editor
  const addSkill = (skill: string) => {
    if (skill && !skillsList.includes(skill)) setSkillsList([...skillsList, skill]);
  };
  const removeSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  // Dynamic roadmap editor
  const addRoadmapStep = (stepText: string) => {
    if (stepText) setRoadmapList([...roadmapList, stepText]);
  };
  const removeRoadmapStep = (idx: number) => {
    setRoadmapList(roadmapList.filter((_, i) => i !== idx));
  };
  const moveRoadmapStep = (from: number, to: number) => {
    if (to < 0 || to >= roadmapList.length) return;
    const updated = [...roadmapList];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setRoadmapList(updated);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-2 md:px-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Career Paths</h1>
        <Button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition" onClick={() => openForm()}>Create New Career Path</Button>
      </div>
      {loading ? (
        <div className="text-center py-10 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : (
        <Card className="overflow-x-auto shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider"># Roles</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {careerPaths.map((path) => (
                <tr key={path.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{path.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{path.industry}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{path.roles ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{path.updatedAt ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="outline" className="mr-2" onClick={() => openForm(path)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(path.id)} disabled={deletingId === path.id}>
                      {deletingId === path.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative border border-gray-100">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* Stepper header */}
            <div className="mb-6 flex items-center gap-4">
              {steps.map((label, idx) => (
                <div key={label} className={`flex items-center gap-2 ${idx === step ? 'font-bold text-blue-700' : 'text-gray-400'}`}>
                  <span className={`rounded-full w-6 h-6 flex items-center justify-center border ${idx === step ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}>{idx + 1}</span>
                  <span>{label}</span>
                  {idx < steps.length - 1 && <span className="w-8 h-0.5 bg-gray-200 mx-2" />}
                </div>
              ))}
            </div>
            {/* Stepper form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 0 && (
                <>
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      name="name"
                      value={form.name || ''}
                      onChange={handleChange}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Industry</label>
                    <input
                      name="industry"
                      value={form.industry || ''}
                      onChange={handleChange}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={form.description || ''}
                      onChange={handleChange}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Salary Range</label>
                      <input
                        name="salaryRange"
                        value={form.salaryRange || ''}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Growth Projection</label>
                      <input
                        name="growthProjection"
                        value={form.growthProjection || ''}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  {/* Vector step: 12 number inputs in a row */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Vector (12 comma-separated numbers)</label>
                    <input
                      name="vector"
                      value={form.vector || ''}
                      onChange={handleChange}
                      required
                      pattern="^([-+]?[0-9]*\.?[0-9]+,\s*){11}([-+]?[0-9]*\.?[0-9]+)$"
                      title="Enter 12 numbers separated by commas"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  {/* Skills step: tag input */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
                    <input
                      name="skills"
                      value={form.skills || ''}
                      onChange={handleChange}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <div className="flex gap-2 flex-wrap mb-2 mt-2">
                      {skillsList.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="ml-1 text-xs">&times;</button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add skill and press Enter"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill((e.target as HTMLInputElement).value.trim());
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  {/* Roadmap step: dynamic list */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Roadmap (comma-separated steps)</label>
                    <input
                      name="roadmap"
                      value={form.roadmap || ''}
                      onChange={handleChange}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <ul className="mb-2 mt-2">
                      {roadmapList.map((stepText, idx) => (
                        <li key={idx} className="flex items-center gap-2 mb-1">
                          <span className="flex-1">{stepText}</span>
                          <button type="button" onClick={() => moveRoadmapStep(idx, idx - 1)} disabled={idx === 0} className="text-xs">↑</button>
                          <button type="button" onClick={() => moveRoadmapStep(idx, idx + 1)} disabled={idx === roadmapList.length - 1} className="text-xs">↓</button>
                          <button type="button" onClick={() => removeRoadmapStep(idx)} className="text-xs text-red-600">Remove</button>
                        </li>
                      ))}
                    </ul>
                    <input
                      type="text"
                      placeholder="Add roadmap step and press Enter"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRoadmapStep((e.target as HTMLInputElement).value.trim());
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </>
              )}
              {/* Detailed Roadmap step will be added next ... */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>Back</Button>
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>Next</Button>
                ) : (
                  <Button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition" disabled={submitting}>
                    {submitting ? (editingId ? 'Saving...' : 'Creating...') : (editingId ? 'Save' : 'Create')}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPaths;
