// src/services/recommendationApi.ts
import type { CareerRecommendation } from '@/types/recommendations';
import type { BackendRecommendationsResponse, BackendTopMatch } from '@/types/backendRecommendations';
import { getApiUrl, getAuthToken } from '@/config/api';

/**
 * Adapter: map a BackendTopMatch to the legacy CareerRecommendation type
 * so existing UI can keep rendering without changes.
 */
function mapTopMatchToLegacy(match: BackendTopMatch): CareerRecommendation {
  return {
    id: match.pathId,
    name: match.name,
    description: match.description,
    matchPercentage: typeof match.currentRole?.score === 'number' ? match.currentRole.score : 0,
    roadmap: [], // your UI uses this, but backend supplies richer "paths" separately
    skills: [],  // you could pull from nextRole.missingSkills if you want to show something here
    averageSalary: match.averageSalary || 'N/A',
    jobGrowth: match.jobGrowth || 'N/A',
    totalXp: 0,
    difficulty: 'Intermediate',
  };
}

export const recommendationsApi = {
  /**
   * Fetch the full backend shape (topMatches, profile, paths).
   */
  async getBackendRecommendations(): Promise<BackendRecommendationsResponse> {
    const token = getAuthToken();

    const res = await fetch(getApiUrl('/api/recommendations/personalized'), {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`GET /api/recommendations/personalized failed: ${res.status} ${text}`);
    }

    const data = (await res.json()) as BackendRecommendationsResponse;
    return {
      topMatches: Array.isArray(data.topMatches) ? data.topMatches : [],
      profile: data.profile,
      paths: Array.isArray(data.paths) ? data.paths : [],
      timestamp: data.timestamp,
    };
  },

  /**
   * Legacy helper: return an array compatible with your existing CareerRecommendation[] UI.
   * This maps backend topMatches → CareerRecommendation.
   */
  async getRecommendations(): Promise<CareerRecommendation[]> {
    const payload = await this.getBackendRecommendations();
    return (payload.topMatches || []).map(mapTopMatchToLegacy);
  },

  /**
   * Keep existing helpers below (unchanged APIs).
   */
  async getCareerById(careerId: string): Promise<CareerRecommendation | null> {
    const token = getAuthToken();

    // Try direct detail if your backend exposes it
    if (token) {
      try {
        const res = await fetch(getApiUrl(`/api/careers/${careerId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = (await res.json()) as CareerRecommendation;
          return data;
        }
      } catch {
        // ignore and fall back
      }
    }

    // Fallback: search within mapped recommendations
    const recs = await this.getRecommendations();
    return recs.find((c) => c.id === careerId) || null;
  },

  async getCareerSkills(
      careerId: string
  ): Promise<{ career: CareerRecommendation; skills: any[] } | null> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(getApiUrl(`/api/careers/${careerId}/skills`), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch {
        // ignore; return null below
      }
    }

    return null;
  },
};
