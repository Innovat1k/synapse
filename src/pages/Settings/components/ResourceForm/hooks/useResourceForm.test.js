import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useResourceForm, generateIdFromTitle } from "./useResourceForm";

describe("generateIdFromTitle", () => {
  it("converts title to kebab-case ID", () => {
    expect(generateIdFromTitle("React Basics")).toBe("react-basics");
  });

  it("handles multiple spaces", () => {
    expect(generateIdFromTitle("Advanced   React")).toBe("advanced-react");
  });

  it("removes special characters", () => {
    expect(generateIdFromTitle("React.js & Node!")).toBe("reactjs-node");
  });

  it("trims leading/trailing hyphens", () => {
    expect(generateIdFromTitle("  React Basics  ")).toBe("react-basics");
  });

  it("handles empty string", () => {
    expect(generateIdFromTitle("")).toBe("");
  });

  it("handles single word", () => {
    expect(generateIdFromTitle("React")).toBe("react");
  });
});

describe("useResourceForm", () => {
  let onSubmit;

  beforeEach(() => {
    onSubmit = vi.fn();
  });

  const renderForm = () => {
    return renderHook(() => useResourceForm({ onSubmit }));
  };

  describe("initial state", () => {
    it("has empty title", () => {
      const { result } = renderForm();
      expect(result.current.state.title).toBe("");
    });

    it("has default category 'other'", () => {
      const { result } = renderForm();
      expect(result.current.state.category).toBe("other");
    });

    it("has null generatedId when title empty", () => {
      const { result } = renderForm();
      expect(result.current.state.generatedId).toBeNull();
    });

    it("exposes all categories", () => {
      const { result } = renderForm();
      expect(result.current.categories).toHaveLength(6);
      expect(result.current.categories[0].value).toBe("frontend");
    });
  });

  describe("state updates", () => {
    it("updates title", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("React Basics");
      });

      expect(result.current.state.title).toBe("React Basics");
    });

    it("updates category", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setCategory("frontend");
      });

      expect(result.current.state.category).toBe("frontend");
    });

    it("generates ID from title", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("React Basics");
      });

      expect(result.current.state.generatedId).toBe("react-basics");
    });

    it("updates ID when title changes", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("React");
      });
      expect(result.current.state.generatedId).toBe("react");

      act(() => {
        result.current.methods.setTitle("Node.js");
      });
      expect(result.current.state.generatedId).toBe("nodejs");
    });
  });

  describe("handleSubmit", () => {
    it("calls onSubmit with formatted data", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("React Basics");
        result.current.methods.setCategory("frontend");
      });

      act(() => {
        result.current.methods.handleSubmit({
          preventDefault: vi.fn(),
        });
      });

      expect(onSubmit).toHaveBeenCalledWith({
        title: "React Basics",
        track_id: "react-basics",
        category: "frontend",
      });
    });

    it("trims title before submit", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("  React Basics  ");
      });

      act(() => {
        result.current.methods.handleSubmit({
          preventDefault: vi.fn(),
        });
      });

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "React Basics",
          track_id: "react-basics",
        }),
      );
    });

    it("does not submit if title empty", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.handleSubmit({
          preventDefault: vi.fn(),
        });
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("does not submit if title only whitespace", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("   ");
      });

      act(() => {
        result.current.methods.handleSubmit({
          preventDefault: vi.fn(),
        });
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("calls preventDefault on event", () => {
      const { result } = renderForm();
      const preventDefault = vi.fn();

      act(() => {
        result.current.methods.setTitle("React");
      });

      act(() => {
        result.current.methods.handleSubmit({ preventDefault });
      });

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe("resetForm", () => {
    it("resets title to empty", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("React Basics");
      });
      expect(result.current.state.title).toBe("React Basics");

      act(() => {
        result.current.methods.resetForm();
      });

      expect(result.current.state.title).toBe("");
    });

    it("resets category to 'other'", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setCategory("frontend");
      });
      expect(result.current.state.category).toBe("frontend");

      act(() => {
        result.current.methods.resetForm();
      });

      expect(result.current.state.category).toBe("other");
    });

    it("resets generatedId to null", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("React");
      });
      expect(result.current.state.generatedId).toBe("react");

      act(() => {
        result.current.methods.resetForm();
      });

      expect(result.current.state.generatedId).toBeNull();
    });
  });
});
