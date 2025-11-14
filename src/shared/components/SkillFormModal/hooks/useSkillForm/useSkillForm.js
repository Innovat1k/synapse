import { useEffect, useState } from "react";

const initialFormData = {
  name: "",
  category: "",
  level: 1,
  description: "",
  tags: [],
};

export const useSkillForm = ({
  mode = "edit",
  initialData,
  onSubmit,
  onClose,
}) => {
  const [skillFormData, setSkillFormData] = useState(initialFormData);
  const [newTag, setNewTag] = useState("");

  // Synchronize initialData on edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setSkillFormData({ ...initialData });
    } else {
      setSkillFormData(initialFormData);
    }
  }, [mode, initialData]);

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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...(initialData?.id ? { id: initialData.id } : {}),
      ...skillFormData,
    });
  };

  return {
    skillFormData,
    newTag,
    methods: {
      handleChange,
      handleChangeTag,
      handleAddTag,
      handleOverlayClick,
      handleRemoveTag,
      handleSubmit,
    },
  };
};
