import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTracks } from "@/services/tracksService";
import { useToast } from "../../Toast/hooks/useToast";
import {
  useIncomingSkillLinks,
  useOutgoingSkillLinks,
} from "@pages/SkillDetailPage/components/SkillLinks/hooks/useSkillLinks";
import { useActivitiesQuery } from "../../../hooks/useActivitiesQuery/useActivitiesQuery";

const initialFormData = {
  name: "",
  category: "",
  level: 1,
  description: "",
  tags: [],
  track_id: "",
};

export const useSkillForm = ({
  mode = "edit",
  initialData,
  onSubmit,
  isOpened,
}) => {
  const [skillFormData, setSkillFormData] = useState(initialFormData);
  const [newTag, setNewTag] = useState("");
  const [initialTrackId] = useState(initialData?.track_id || "");

  //Show a toast notification to the user
  const { showNotif } = useToast();

  // Load tracks
  const { data: tracks = [], isLoading: isLoadingTracks } = useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
    staleTime: 5 * 60 * 1000,
  });

  // Load associated data for warnings
  const { activities } = useActivitiesQuery(initialData?.skill_id);
  const { data: incomingLinks = [] } = useIncomingSkillLinks(
    initialData?.skill_id,
  );
  const { data: outgoingLinks = [] } = useOutgoingSkillLinks(
    initialData?.skill_id,
  );

  const hasAssociatedData =
    activities?.length > 0 ||
    incomingLinks?.length > 0 ||
    outgoingLinks?.length > 0;

  // Synchronize initialData on edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setSkillFormData({ ...initialData });
    } else {
      setSkillFormData(initialFormData);
    }
  }, [mode, initialData, isOpened]);

  // Change formData value
  const handleChange = (e) => {
    setSkillFormData((prev) => ({
      ...prev,
      [e.target.id]:
        e.target.id === "range" ? Number(e.target.value) : e.target.value,
    }));
  };

  // Get and change tag value
  const handleChangeTag = (e) => {
    setNewTag(e.target.value);
  };

  //Specific handler for the track
  const handleChangeTrack = useCallback((newTrackId) => {
    setSkillFormData((prev) => ({ ...prev, track_id: newTrackId }));
  }, []);

  const handleAddTag = () => {
    if (newTag.trim() && !skillFormData.tags.includes(newTag.trim())) {
      setSkillFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSkillFormData((prev) => ({
      ...prev,
      tags: skillFormData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  //Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillFormData.name.trim() || !skillFormData.track_id.trim()) {
      showNotif("Please fill in all required fields.", "error");
      return;
    }

    await onSubmit({
      ...(initialData?.skill_id ? { skill_id: initialData.skill_id } : {}),
      ...skillFormData,
    });
  };

  // Auto select the newly created track
  useEffect(() => {
    if (tracks.length === 1 && !skillFormData.track_id) {
      setSkillFormData((prev) => ({
        ...prev,
        track_id: tracks[0].track_id,
      }));
    }
  }, [tracks, skillFormData.track_id]);

  return {
    skillFormData,
    newTag,
    tracks,
    initialTrackId,
    hasAssociatedData,
    isLoadingTracks,
    methods: {
      handleChange,
      handleChangeTag,
      handleChangeTrack,
      handleAddTag,
      handleRemoveTag,
      handleSubmit,
    },
  };
};
