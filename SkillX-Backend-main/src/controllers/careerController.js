//careerController.js
// src/controllers/careerController.js
const QuizResult = require('../models/QuizResult');
const { matchCareers } = require('../utils/careerMatch');
const { scorePersonality, mapProfileToTraitFlags } = require('../utils/personalityScoring');

// Input validation helper
function validateAssessmentInput(body) {
    const errors = [];
    
    if (!body.skills || typeof body.skills !== 'object') {
        errors.push('Skills object is required');
    } else {
        const selectedSkills = Object.values(body.skills).filter(s => s.selected && s.level > 0);
        if (selectedSkills.length === 0) {
            errors.push('At least one skill must be selected with level > 0');
        }
    }
    
    if (!body.preferences || typeof body.preferences !== 'object') {
        errors.push('Preferences object is required');
    } else {
        if (!body.preferences.learningStyle || !Array.isArray(body.preferences.learningStyle) || body.preferences.learningStyle.length === 0) {
            errors.push('Learning style preferences are required');
        }
    }
    
    if (!body.answers || typeof body.answers !== 'object') {
        errors.push('Quiz answers are required');
    } else {
        const answerCount = Object.keys(body.answers).length;
        if (answerCount < 20) {
            errors.push(`Expected at least 20 quiz answers, got ${answerCount}`);
        }
    }
    
    return errors;
}

exports.submitQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`Assessment submission started for user ${userId}`);

        // Accept either:
        // 1) New schema: { skills, answers: { "1":1..5, ... }, preferences: { learningStyle?: string[] } }
        // 2) Legacy:     { skills, personalityTraits: {...}, preferences }
        const { skills, answers, personalityTraits, preferences } = req.body || {};

        // Input validation
        const validationErrors = validateAssessmentInput(req.body);
        if (validationErrors.length > 0) {
            console.warn(`Assessment validation failed for user ${userId}:`, validationErrors);
            return res.status(400).json({ 
                message: 'Invalid assessment data', 
                errors: validationErrors,
                details: 'Please check your inputs and try again'
            });
        }

        console.log(`Assessment validation passed for user ${userId}, processing...`);

        // Build map if array was sent
        let answersMap = {};
        if (Array.isArray(answers)) {
            for (const a of answers) answersMap[a.questionId] = a.score;
        } else if (answers && typeof answers === 'object') {
            answersMap = answers;
        }

        // Compute profile (Mini-IPIP-20 + RIASEC + WorkValues). Merge learning preferences.
        let profile = null;
        try {
            if (Object.keys(answersMap).length) {
                profile = scorePersonality(answersMap, preferences);
                console.log(`Personality profile computed for user ${userId}:`, {
                    RIASEC: Object.keys(profile.RIASEC).length,
                    BigFive: Object.keys(profile.BigFive).length,
                    WorkValues: Object.keys(profile.WorkValues).length,
                    learningStyle: profile.learningStyle
                });
            } else {
                // Neutral stub if no answers provided (not recommended but keeps API robust)
                profile = {
                    RIASEC: { Realistic:0.5, Investigative:0.5, Artistic:0.5, Social:0.5, Enterprising:0.5, Conventional:0.5 },
                    BigFive: { Openness:0.5, Conscientiousness:0.5, Extraversion:0.5, Agreeableness:0.5, Neuroticism:0.5 },
                    WorkValues: { Achievement:0.5, Independence:0.5, Recognition:0.5, Relationships:0.5, Support:0.5, WorkingConditions:0.5 },
                    learningStyle: preferences.learningStyle || []
                };
                console.warn(`Using neutral personality profile for user ${userId} - no quiz answers provided`);
            }
        } catch (profileError) {
            console.error(`Personality scoring failed for user ${userId}:`, profileError);
            return res.status(500).json({ 
                message: 'Failed to process personality assessment', 
                error: 'Personality scoring error',
                details: 'Please try again or contact support if the issue persists'
            });
        }

        // Legacy boolean flags still supported
        const traitFlags = (personalityTraits && typeof personalityTraits === 'object')
            ? personalityTraits
            : mapProfileToTraitFlags(profile);

        const careerPaths = require('../data/careerPaths.json');
        console.log(`Loaded ${careerPaths.length} career paths for matching`);

        // User object for matcher
        const user = {
            skills,                      // { "React": {selected:true, level:2}, ... }
            personalityTraits: traitFlags, // only used by legacy roles still listing personalityTraits[]
            preferences                  // { learningStyle?: string[] }
        };

        // Career matching
        let ranked;
        try {
            ranked = matchCareers(careerPaths, user, { profile });
            console.log(`Career matching completed for user ${userId}, found ${ranked.length} paths`);
        } catch (matchingError) {
            console.error(`Career matching failed for user ${userId}:`, matchingError);
            return res.status(500).json({ 
                message: 'Failed to match careers', 
                error: 'Career matching error',
                details: 'Please try again or contact support if the issue persists'
            });
        }

        const topMatches = ranked.slice(0, 3).map((p) => ({
            pathId: p.id,
            name: p.name,
            description: p.description,
            industry: p.industry,
            averageSalary: p.averageSalary,
            jobGrowth: p.jobGrowth,
            currentRole: p.currentRole
                ? { title: p.currentRole.roleTitle, level: p.currentRole.level, score: p.currentRole.weightedScore }
                : null,
            nextRole: p.nextRole
                ? { title: p.nextRole.roleTitle, level: p.nextRole.level, missingSkills: p.nextRole.missingSkills }
                : null
        }));

        // Validate top matches have valid scores
        const validMatches = topMatches.filter(match => {
            if (match.currentRole && typeof match.currentRole.score === 'number' && 
                !isNaN(match.currentRole.score) && match.currentRole.score >= 0 && match.currentRole.score <= 100) {
                return true;
            }
            console.warn(`Match ${match.pathId} has invalid score:`, match.currentRole?.score);
            return false;
        });

        if (validMatches.length === 0) {
            console.error(`No valid matches found for user ${userId} - all matches have invalid scores`);
            return res.status(500).json({ 
                message: 'Career matching failed', 
                error: 'No valid matches generated',
                details: 'Please try again or contact support if the issue persists'
            });
        }

        console.log(`Generated ${validMatches.length} valid top matches for user ${userId}`);

        // Save to database
        try {
            await QuizResult.findOneAndUpdate(
                { user: userId },
                { user: userId, topMatches: validMatches, submittedAt: new Date() },
                { upsert: true, new: true }
            );
            console.log(`Quiz results saved for user ${userId}`);
        } catch (dbError) {
            console.error(`Failed to save quiz results for user ${userId}:`, dbError);
            // Continue with response even if save fails
        }

        return res.status(200).json({
            topMatches: validMatches,
            profile, // useful for UI (radar charts, explanations)
            paths: ranked.map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                industry: p.industry,
                averageSalary: p.averageSalary,
                jobGrowth: p.jobGrowth,
                currentRole: p.currentRole,
                nextRole: p.nextRole,
                roles: p.roles
            }))
        });
    } catch (err) {
        console.error('submitQuiz error:', err);
        res.status(500).json({ 
            message: 'Server error', 
            error: err.message,
            details: 'An unexpected error occurred. Please try again or contact support.'
        });
    }
};

exports.getMyRecommendation = async (req, res) => {
    try {
        const userId = req.user.id;
        const doc = await QuizResult.findOne({ user: userId });
        if (!doc) return res.status(404).json({ message: 'No quiz result yet.' });
        res.json(doc);
    } catch (err) {
        console.error('getMyRecommendation error:', err);
        res.status(500).json({ 
            message: 'Server error', 
            error: err.message,
            details: 'Failed to retrieve your recommendations. Please try again.'
        });
    }
};