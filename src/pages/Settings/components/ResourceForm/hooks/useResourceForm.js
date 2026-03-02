import { useState } from "react";

// Manages resource creation form state with auto-generated ID from title.
// Includes category selection and validation (non-empty title required).

const CATEGORIES = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "devops", label: "DevOps" },
  { value: "data", label: "Data" },
  { value: "design", label: "Design" },
  { value: "other", label: "Other" },
];

// Generates a URL-safe slug from a title (lowercase, hyphenated, alphanumeric only)
export const generateIdFromTitle = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const useResourceForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");

  const resetForm = () => {
    setTitle("");
    setCategory("other");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    try {
      await onSubmit({
        title: title.trim(),
        track_id: generateIdFromTitle(title),
        category,
      });
    } finally {
      resetForm();
    }
  };

  return {
    state: {
      title,
      category,
      generatedId: title ? generateIdFromTitle(title) : null,
    },
    methods: { setTitle, setCategory, handleSubmit, resetForm },
    categories: CATEGORIES,
  };
};
