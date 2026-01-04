import { useEffect, useMemo, useState } from "react";
import { formatMinutes } from "../../../utils/utils";
import { useActivityValidation } from "./useActivityValidation";

/**
 * Custom hook to manage form state and validation logic for creating or editing an activity.
 *
 * Handles:
 * - Initialization and reset of activity data based on mode ("create" or "edit")
 * - Synchronization with modal open/close state
 * - Duration input management (hours/minutes → total minutes)
 * - Validation via `useActivityValidation`
 * - Controlled input updates and touched-state tracking for real-time validation
 *
 * @param {Object} options - Configuration object
 * @param {string} [options.mode="edit"] - Form mode: "create" or "edit"
 * @param {Array} options.skills - List of available skills (used to infer context)
 * @param {Object} [options.initialData] - Initial activity data when editing
 * @param {string} options.id - Skill ID (used as fallback for skill_id in create mode)
 * @param {Function} options.onSubmit - Callback triggered on valid form submission
 * @param {boolean} options.isOpened - Controls form reset when modal closes
 *
 * @returns {Object} Form state and handlers:
 * - `activityData` – current values of non-duration fields
 * - `durationData` – { hours, minutes }
 * - `errors` – validation messages (only for touched fields)
 * - `isFormValid` – boolean indicating overall validity
 * - `methods` – { handleChange, handleChangeDuration, handleSubmit }
 */

export const useActivityForm = ({
  mode = "edit",
  skills = [],
  initialData,
  id,
  onSubmit,
  isOpened,
}) => {
  const [activityData, setActivityData] = useState({
    activity_type: "",
    logged_at: "",
    notes: "",
    skill_id: "",
  });

  const [durationData, setDurationData] = useState({
    hours: 0,
    minutes: 0,
  });

  //
const initialTouchedState = useMemo(() => ({
  skill_id: false,
  logged_at: false,
  duration: false,
  activity_type: false,
}), []);

  const [touched, setTouched] = useState(initialTouchedState);

  // Get inputs error and form validation state
  const isSkillContext = !!id;

  const { errors, isValid: isFormValid } = useActivityValidation({
    activityData,
    durationData,
    options: { isSkillContext },
    touched,
  });

  // Synchronize initialData on edit mode and clear form data if mode changes
  // 1. Reset data when modal get closed
  useEffect(() => {
    if (!isOpened) {
      setActivityData({});
      setDurationData({ hours: 0, minutes: 0 });
      setTouched(initialTouchedState);
    }
  }, [isOpened, initialTouchedState]);

  // 2. Initialize data when modal get opened
  useEffect(() => {
    if (!isOpened) return;

    if (mode === "create") {
      setActivityData({
        activity_type: "learning",
        logged_at: new Date().toISOString(),
        notes: "",
        skill_id: id || "",
      });
      setDurationData({ hours: 0, minutes: 0 });
    } else if (mode === "edit" && initialData?.id) {
      setActivityData({
        ...initialData,
        activity_type: initialData.activity_type || "learning",
        logged_at: initialData.logged_at || new Date().toISOString(),
        notes: initialData.notes || "",
        skill_id: initialData.skill_id || "",
      });

      // Duration
      if (initialData.duration_minutes != null) {
        const hours = Math.floor(initialData.duration_minutes / 60);
        const minutes = initialData.duration_minutes % 60;
        setDurationData({ hours, minutes });
      }
    }
  }, [isOpened, mode, initialData, id]);

  // Change duration inputs value and convert durationData to minutes
  const handleChangeDuration = (e) => {
    setDurationData((prev) => ({
      ...prev,
      [e.target.id]: Number(e.target.value) || 0,
    }));
    setTouched((prev) => ({ ...prev, duration: true }));
  };

  // Change inputs value
  const handleChange = (e) => {
    const { id, value } = e.target;

    setActivityData((prev) => ({
      ...prev,
      [id]: value ?? "",
    }));
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  // Complete activity data
  const selected_skill = skills.find((skill) => skill.skill_id === id) || null;

  const activity = useMemo(() => {
    // If logged_at doesn't exist -> use current date
    const isoLoggedAt = activityData?.logged_at
      ? new Date(activityData.logged_at).toISOString()
      : new Date().toISOString();

    return {
      ...activityData,

      // Priority: selected_skill > value from activityData
      skill_id: selected_skill?.skill_id || activityData.skill_id,
      logged_at: isoLoggedAt,
      duration_minutes: formatMinutes(durationData),
    };
  }, [activityData, selected_skill, durationData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSubmit({
      ...(initialData?.id ? { id: initialData.id } : {}),
      ...activity,
    });
  };

  return {
    activityData,
    durationData,
    methods: { handleChange, handleChangeDuration, handleSubmit },
    isFormValid,
    errors,
  };
};
