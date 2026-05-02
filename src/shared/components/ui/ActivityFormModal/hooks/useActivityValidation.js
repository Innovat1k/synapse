import { useMemo } from "react";

// Validates activity form with field-specific rules and touch-aware error reporting.
// Skill selection is optional in skill context; duration must be > 0 minutes.
export const useActivityValidation = ({
  activityData,
  durationData,
  options = {},
  touched,
}) => {
  const { isSkillContext = false } = options;

  return useMemo(() => {
    const totalMinutes =
      (durationData?.hours || 0) * 60 + (durationData?.minutes || 0);
    const isDurationValid = totalMinutes > 0;

    const isSkillValid = isSkillContext || !!activityData?.skill_id;

    const isActivityTypeValid = !!activityData?.activity_type;

    const isLoggedAtValid = !!activityData?.logged_at;

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
