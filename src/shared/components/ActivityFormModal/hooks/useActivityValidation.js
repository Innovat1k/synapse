import { useMemo } from "react";

/**
 * Custom hook that computes validation state and errors for an activity form.
 *
 * Applies field-specific validation rules:
 * - Duration must total > 0 minutes
 * - Skill selection is required only outside a skill-specific context
 * - Activity type and logged date are always required
 *
 * Errors are only reported for fields that have been "touched" (interacted with),
 * enabling a clean UX with real-time feedback after user interaction.
 *
 * @param {Object} options
 * @param {Object} options.activityData - Current values of activity fields
 * @param {Object} options.durationData - { hours: number, minutes: number }
 * @param {Object} [options.options] - Additional flags
 * @param {boolean} [options.options.isSkillContext=false] - If true, skill_id is not required (inferred from route/context)
 * @param {Object} options.touched - Tracks which fields the user has interacted with
 *
 * @returns {{ errors: Object, isValid: boolean }}
 * - `errors`: map of field names to error messages (empty if valid or untouched)
 * - `isValid`: true only if all required fields are valid (regardless of touched state)
 */

export const useActivityValidation = ({
  activityData,
  durationData,
  options = {},
  touched,
}) => {
  const { isSkillContext = false } = options;

  return useMemo(() => {
    // 1. Duration
    const totalMinutes =
      (durationData?.hours || 0) * 60 + (durationData?.minutes || 0);
    const isDurationValid = totalMinutes > 0;

    // 2. Skill (only if not in skill context)
    const isSkillValid = isSkillContext || !!activityData?.skill_id;

    // 3. Activity type (required)
    const isActivityTypeValid = !!activityData?.activity_type;

    // 4. Logged at (required)
    const isLoggedAtValid = !!activityData?.logged_at;

    // Errors (if touched)
    const errors = {};

    if (touched.duration && !isDurationValid) {
      errors.duration = "Duration must be at least 1 minute.";
    }

    if (touched.skill_id && !isSkillContext && !activityData?.skill_id) {
      errors.skill = "Please select a skill.";
    }

    if (touched.activity_type && !isActivityTypeValid) {
      errors.activity_type = "Please select an activity type.";
    }

    if (touched.logged_at && !isLoggedAtValid) {
      errors.logged_at = "Please select a date and time.";
    }

    // ✅ isValid = all valid, even not touched
    const isValid =
      isDurationValid && isSkillValid && isActivityTypeValid && isLoggedAtValid;

    return { errors, isValid };
  }, [
    activityData?.activity_type,
    activityData?.logged_at,
    activityData?.skill_id,
    durationData?.hours,
    durationData?.minutes,
    isSkillContext,
    touched.activity_type,
    touched.duration,
    touched.logged_at,
    touched.skill_id,
  ]);
};
