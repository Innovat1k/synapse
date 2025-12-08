import { useEffect, useMemo, useState } from "react";
import { formatMinutes } from "../../../utils/utils";

export const useActivityForm = ({
  mode = "edit",
  skills = [],
  initialData,
  id,
  onSubmit,
}) => {
  const [activityData, setActivityData] = useState({});
  const [durationData, setDurationData] = useState({
    hours: 0,
    minutes: 0,
  });

  // Synchronize initialData on edit mode and clear form data if mode changes
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setActivityData({ ...initialData });
    } else {
      setActivityData({});
      setDurationData({ hours: 0, minutes: 0 });
    }
  }, [mode, initialData]);

  // Change duration inputs value and convert durationData to minutes
  const handleChangeDuration = (e) => {
    setDurationData((prev) => ({
      ...prev,
      [e.target.id]: Number(e.target.value),
    }));

    setActivityData((prev) => ({
      ...prev,
      duration_minutes: formatMinutes({
        hours: durationData.hours,
        minutes: durationData.minutes,
      }),
    }));
  };

  // Change inputs value
  const handleChange = (e) => {
    const { id, value } = e.target;

    setActivityData((prev) => ({
      ...prev,
      [id]: id === "logged_at" ? new Date(value).toISOString() : value,
    }));
  };

  // Convert and assign initial activity duration_minutes to durationData
  const total_minutes = initialData?.duration_minutes;

  const assignDuration = () => {
    if (total_minutes === undefined) return;

    const hours = Math.floor(total_minutes / 60);
    const minutes = total_minutes % 60;

    setDurationData({ hours, minutes });
  };

  useEffect(() => {
    assignDuration();
  }, [initialData]);

  // Complete activity data
  const selected_skill = skills.find((skill) => skill.skill_id === id) || {};

  const activity = useMemo(() => {
    return {
      ...activityData,
      skill_id: selected_skill.skill_id,
      activity_type: "learning",
      duration_minutes: formatMinutes({
        hours: durationData.hours,
        minutes: durationData.minutes,
      }),
    };
  }, [activityData, selected_skill, durationData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...(initialData?.id ? { id: initialData.id } : {}),
      ...activity,
    });
  };

  return {
    activityData,
    durationData,
    handleChange,
    handleChangeDuration,
    handleSubmit,
  };
};
