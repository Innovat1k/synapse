import { useEffect, useMemo, useState, useRef } from "react";
import { formatMinutes } from "@utils/utils";
import { useActivityValidation } from "./useActivityValidation";

/**
 * Custom hook to manage form state and validation logic for creating or editing an activity.
 * All comments in English for international standardization
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

  const initialTouchedState = useMemo(
    () => ({
      skill_id: false,
      logged_at: false,
      duration: false,
      activity_type: false,
    }),
    [],
  );

  const [touched, setTouched] = useState(initialTouchedState);

  // Get inputs error and form validation state
  const isSkillContext = !!id;

  const { errors, isValid: isFormValid } = useActivityValidation({
    activityData,
    durationData,
    options: { isSkillContext },
    touched,
  });

  const hasInitialized = useRef(false);

  // 1. Reset data when modal gets closed
  useEffect(() => {
    if (!isOpened) {
      setActivityData({});
      setDurationData({ hours: 0, minutes: 0 });
      setTouched(initialTouchedState);
      hasInitialized.current = false;
    }
  }, [isOpened, initialTouchedState]);

  // 2. Initialize data ONLY ONCE when modal opens
  useEffect(() => {
    // Skip if not opened or already initialized this session
    if (!isOpened || hasInitialized.current) {
      return;
    }

    if (mode === "create") {
      setActivityData({
        activity_type: "learning",
        logged_at: new Date().toISOString(),
        notes: "",
        // Initialize skill_id only once (id comes from CurrentFocus context or null)
        skill_id: id || "",
      });
      setDurationData({ hours: 0, minutes: 0 });
      setTouched(initialTouchedState);
    } else if (mode === "edit" && initialData?.id) {
      setActivityData({
        ...initialData,
        activity_type: initialData.activity_type || "learning",
        logged_at: initialData.logged_at || new Date().toISOString(),
        notes: initialData.notes || "",
        skill_id: initialData.skill_id || "",
      });

      // Duration conversion for edit mode
      if (initialData.duration_minutes !== null) {
        const hours = Math.floor(initialData.duration_minutes / 60);
        const minutes = initialData.duration_minutes % 60;
        setDurationData({ hours, minutes });
      }
    }

    hasInitialized.current = true;
  }, [isOpened, mode, initialData, id, initialTouchedState]);

  // Change duration inputs value and convert durationData to minutes
  const handleChangeDuration = (e) => {
    setDurationData((prev) => ({
      ...prev,
      [e.target.id]: Number(e.target.value) || 0,
    }));
    setTouched((prev) => ({ ...prev, duration: true }));
  };

  // Change inputs value - THIS IS KEY: preserves user selections
  const handleChange = (e) => {
    const { id: fieldId, value } = e.target;

    setActivityData((prev) => ({
      ...prev,
      [fieldId]: value ?? "",
    }));
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
  };

  // Complete activity data for submission
  const selected_skill =
    skills.find((skill) => skill.skill_id === activityData.skill_id) || null;

  const activity = useMemo(() => {
    const isoLoggedAt = activityData?.logged_at
      ? new Date(activityData.logged_at).toISOString()
      : new Date().toISOString();

    return {
      ...activityData,
      skill_id: activityData.skill_id,
      track_id: selected_skill?.track_id || "default-track",
      logged_at: isoLoggedAt,
      duration_minutes: formatMinutes(durationData),
    };
  }, [activityData, selected_skill, durationData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }

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
