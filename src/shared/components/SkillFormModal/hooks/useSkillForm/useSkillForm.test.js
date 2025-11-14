import { act, renderHook } from "@testing-library/react";
import { describe, expect } from "vitest";
import { useSkillForm } from "../useSkillForm/useSkillForm";

describe("useSkillForm", () => {
  it("synchronizes skillFormData with initialData when in edit mode", () => {
    const initialData = {
      id: 10,
      name: "React",
      category: "frontend",
      level: 4,
      description: "Library",
      tags: ["js", "ui"],
    };
    const { result, rerender } = renderHook((props) => useSkillForm(props), {
      initialProps: { mode: "edit", initialData: null },
    });

    rerender({ mode: "edit", initialData });

    expect(result.current.skillFormData).toEqual(initialData);
  });

  it("resets form when mode is not edit", () => {
    const initialData = {
      name: "Vue",
      category: "frontend",
      level: 2,
      description: "Framework",
      tags: ["js"],
    };
    const { result, rerender } = renderHook((props) => useSkillForm(props), {
      initialProps: { mode: "edit", initialData },
    });

    rerender({ mode: "create", initialData: null });
    expect(result.current.skillFormData).toEqual({
      name: "",
      category: "",
      level: 1,
      description: "",
      tags: [],
    });
  });

  it("changes skillFormData values according to input event", () => {
    const mockNameInput = { target: { id: "name", value: "javascript" } };
    const mockCategoryInput = { target: { id: "category", value: "frontend" } };
    const mockLevelInput = { target: { id: "level", value: 3 } };
    const { result } = renderHook(() => useSkillForm({ mode: "edit" }));

    act(() => {
      result.current.methods.handleChange(mockNameInput);
    });
    act(() => {
      result.current.methods.handleChange(mockCategoryInput);
    });
    act(() => {
      result.current.methods.handleChange(mockLevelInput);
    });

    expect(result.current.skillFormData).toEqual({
      name: "javascript",
      category: "frontend",
      level: 3,
      description: "",
      tags: [],
    });
  });

  it("changes current tag value", () => {
    const mockTagInput = { target: { value: "programing" } };
    const { result } = renderHook(() => useSkillForm({ mode: "edit" }));

    act(() => {
      result.current.methods.handleChangeTag(mockTagInput);
    });

    expect(result.current.newTag).toEqual("programing");
  });

  it("adds new tag to skillFormData", () => {
    const mockTagInput = { target: { value: "ux" } };
    const { result } = renderHook(() => useSkillForm({ mode: "edit" }));

    act(() => {
      result.current.methods.handleChangeTag(mockTagInput);
    });

    expect(result.current.newTag).toEqual("ux");

    act(() => {
      result.current.methods.handleAddTag();
    });

    expect(result.current.skillFormData.tags).toEqual(["ux"]);
    expect(result.current.newTag).toEqual("");
  });

  it("doesn't add an existing tag", () => {
    const mockTagInput = { target: { value: "visual" } };
    const { result } = renderHook(() => useSkillForm({ mode: "edit" }));

    act(() => {
      result.current.methods.handleChangeTag(mockTagInput);
    });
    act(() => {
      result.current.methods.handleAddTag();
    });

    expect(result.current.skillFormData.tags).toEqual(["visual"]);

    act(() => {
      result.current.methods.handleChangeTag(mockTagInput);
    });
    act(() => {
      result.current.methods.handleAddTag();
    });

    expect(result.current.skillFormData.tags).not.toEqual(["visual", "visual"]);
    expect(result.current.skillFormData.tags).toEqual(["visual"]);
  });

  it("removes selected tag from skillFormData", () => {
    const mockTagInput1 = { target: { value: "styling" } };
    const mockTagInput2 = { target: { value: "css" } };
    const { result } = renderHook(() => useSkillForm({ mode: "edit" }));

    act(() => {
      result.current.methods.handleChangeTag(mockTagInput1);
    });
    act(() => {
      result.current.methods.handleAddTag();
    });
    act(() => {
      result.current.methods.handleChangeTag(mockTagInput2);
    });
    act(() => {
      result.current.methods.handleAddTag();
    });
    expect(result.current.skillFormData.tags).toEqual(["styling", "css"]);
    act(() => {
      result.current.methods.handleRemoveTag("styling");
    });

    expect(result.current.skillFormData.tags).toEqual(["css"]);
  });

  it("calls onClose when clicking on the overlay itself", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useSkillForm({ mode: "edit", onClose })
    );

    const mockEvent = {
      target: "overlay",
      currentTarget: "overlay",
    };

    act(() => {
      result.current.methods.handleOverlayClick(mockEvent);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit with correct data", () => {
    const onSubmit = vi.fn();
    const initialData = {
      id: 42,
      name: "Angular",
      category: "frontend",
      level: 5,
      description: "",
      tags: [],
    };
    const { result } = renderHook(() =>
      useSkillForm({ mode: "edit", initialData, onSubmit })
    );

    act(() => {
      result.current.methods.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(onSubmit).toHaveBeenCalledWith(initialData);
  });
});
