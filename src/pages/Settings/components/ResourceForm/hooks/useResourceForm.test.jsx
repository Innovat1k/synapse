import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useResourceForm, generateIdFromTitle } from "./useResourceForm";
import { MemoryRouter } from "react-router-dom";
import { TEST_USER_ID } from "@mocks/stores";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: TEST_USER_ID },
  }),
}));

describe("generateIdFromTitle", () => {
  it("normalizes titles into clean IDs", () => {
    expect(generateIdFromTitle("React Basics")).toBe("react-basics");
    expect(generateIdFromTitle("Advanced   React")).toBe("advanced-react");
    expect(generateIdFromTitle("React.js & Node!")).toBe("reactjs-node");
    expect(generateIdFromTitle("  React Basics  ")).toBe("react-basics");
    expect(generateIdFromTitle("")).toBe("");
    expect(generateIdFromTitle("React")).toBe("react");
  });
});

const RouteWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;

describe("useResourceForm", () => {
  let onSubmit;

  beforeEach(() => {
    onSubmit = vi.fn();
  });

  const renderForm = () =>
    renderHook(() => useResourceForm({ onSubmit }), { wrapper: RouteWrapper });

  describe("initial state", () => {
    it("initializes form with expected defaults and categories", () => {
      const { result } = renderForm();

      expect(result.current.state.title).toBe("");
      expect(result.current.state.category).toBe("other");
      expect(result.current.state.generatedId).toBeNull();

      expect(result.current.categories).toHaveLength(6);
      expect(result.current.categories[0].value).toBe("frontend");
    });
  });

  describe("form state behavior", () => {
    it("updates title, category and auto-generates id", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("React Basics");
        result.current.methods.setCategory("frontend");
      });

      expect(result.current.state.title).toBe("React Basics");
      expect(result.current.state.category).toBe("frontend");
      expect(result.current.state.generatedId).toBe("react-basics");
    });

    it("updates generatedId when title changes over time", () => {
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

  describe("submission", () => {
    it("submits formatted data with trimmed title", () => {
      const { result } = renderForm();
      const preventDefault = vi.fn();

      act(() => {
        result.current.methods.setTitle("  React Basics  ");
        result.current.methods.setCategory("frontend");
      });

      act(() => {
        result.current.methods.handleSubmit({ preventDefault });
      });

      expect(preventDefault).toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalledWith({
        title: "React Basics",
        track_id: "react-basics",
        category: "frontend",
        user_id: TEST_USER_ID,
      });
    });

    it("does not submit when title is empty or whitespace", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(onSubmit).not.toHaveBeenCalled();

      act(() => {
        result.current.methods.setTitle("   ");
        result.current.methods.handleSubmit({ preventDefault: vi.fn() });
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("reset behavior", () => {
    it("resets entire form state", () => {
      const { result } = renderForm();

      act(() => {
        result.current.methods.setTitle("React Basics");
        result.current.methods.setCategory("frontend");
      });

      act(() => {
        result.current.methods.resetForm();
      });

      expect(result.current.state).toEqual({
        title: "",
        category: "other",
        generatedId: null,
      });
    });
  });
});
