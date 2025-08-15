// src/services/assessmentApi.ts
import { authenticatedFetch, getApiUrl, getAuthToken } from '@/config/api';

export interface SubmitQuizPayload {
    answers: Record<number, number>; // 1..32 (Likert 1..5)
    skills?: Record<string, { selected: boolean; level: number }>;
    preferences?: { learningStyle: string[]; timeCommitment: string; budget: string };
}

export const assessmentApi = {
    async submitQuiz(payload: SubmitQuizPayload) {
        return authenticatedFetch('/api/careers/submit-quiz', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async getProgress() {
        const token = getAuthToken();
        const res = await fetch(getApiUrl('/api/assessment-progress/me'), {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        if (!res.ok) throw new Error('Failed to load assessment progress');
        return res.json() as Promise<{ currentStep: number; data: any; answers: Record<number, number> }>;
    },

    async saveProgress(body: { currentStep: number; data: any; answers: Record<number, number> }) {
        return authenticatedFetch('/api/assessment-progress/me', {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    async clearProgress() {
        const token = getAuthToken();
        const res = await fetch(getApiUrl('/api/assessment-progress/me'), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        if (!res.ok) throw new Error('Failed to clear assessment progress');
        return res.json();
    },
};
