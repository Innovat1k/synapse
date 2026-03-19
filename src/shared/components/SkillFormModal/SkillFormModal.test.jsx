import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";

import SkillFormModal from "./SkillFormModal";
import { useSkillForm } from "./hooks/useSkillForm";
import { useTracks } from "../../../pages/Settings/app/tracks/hooks/useTracks";

vi.mock("./hooks/useSkillForm", () => ({
  useSkillForm: vi.fn(),
}));

vi.mock("../../../pages/Settings/app/tracks/hooks/useTracks", () => ({
  useTracks: vi.fn(),
}));

// MOCK FACTORY
function createSkillFormMock(overrides = {}) {
  return {
    skillFormData: {
      name: "",
      category: "",
      level: 1,
      description: "",
      tags: [],
      track_id: "",
    },
    newTag: "",
    tracks: [],
    isLoadingTracks: false,
    methods: {
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleChangeTag: vi.fn(),
      handleAddTag: vi.fn(),
      handleRemoveTag: vi.fn(),
      handleOverlayClick: vi.fn(),
      handleChangeTrack: vi.fn(),
      ...overrides.methods,
    },
    ...overrides,
  };
}

function createTracksMock(overrides = {}) {
  return {
    status: {
      isCreating: false,
    },
    createForm: {
      isOpen: false,
      open: vi.fn(),
      close: vi.fn(),
    },
    actions: {
      create: vi.fn(),
    },
    ...overrides,
  };
}

// TEST BUILDER
function createSkillModal(options = {}) {
  const props = {
    isOpened: true,
    mode: "create",
    isSubmitting: false,
    onClose: vi.fn(),
    onDelete: vi.fn(),
    onSubmit: vi.fn(),
    ...options.props,
  };

  const skillFormMock = createSkillFormMock(options.skillForm);
  const tracksMock = createTracksMock(options.tracks);

  useSkillForm.mockReturnValue(skillFormMock);
  useTracks.mockReturnValue(tracksMock);

  const utils = render(<SkillFormModal {...props} />);

  return {
    ...utils,
    props,
    skillFormMock,
    tracksMock,
  };
}

// TEST DATA
const mockSkill = {
  name: "React JS",
  category: "frontend",
  level: 4,
  description: "Completed React course",
  tags: ["programming", "visual"],
  track_id: "react-track",
};

describe("SkillFormModal", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe("Rendering", () => {
    it("renders create skill form", () => {
      createSkillModal();

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /save skill/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it("renders edit mode with prefilled data", () => {
      createSkillModal({
        props: { mode: "edit" },
        skillForm: { skillFormData: mockSkill },
      });

      const nameInput = screen.getByLabelText(/name/i);
      const categorySelect = screen.getByLabelText(/category/i);
      const notesTextarea = screen.getByLabelText(/description/i);
      const levelSlider = screen.getByRole("slider");

      expect(nameInput).toHaveValue("React JS");
      expect(categorySelect).toHaveValue("frontend");
      expect(notesTextarea).toHaveValue("Completed React course");
      expect(levelSlider).toHaveValue("4");
    });

    it("renders delete confirmation modal", () => {
      createSkillModal({
        props: { mode: "delete", initialData: mockSkill },
      });

      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /delete permanently/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /keep it/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Tracks", () => {
    it("shows loading tracks state", () => {
      createSkillModal({
        skillForm: { isLoadingTracks: true },
      });

      expect(screen.getByText(/loading tracks/i)).toBeInTheDocument();
    });

    it("shows empty tracks state", () => {
      createSkillModal({
        skillForm: { tracks: [] },
      });

      expect(screen.getByText(/no tracks available/i)).toBeInTheDocument();
    });

    it("renders track select when tracks exist", async () => {
      await act(async () => {
        createSkillModal({
          skillForm: {
            tracks: [{ track_id: "react", title: "React Architecture" }],
          },
        });
      });

      expect(screen.getByText(/learning track/i)).toBeInTheDocument();
    });

    it("opens track creation modal", async () => {
      const { tracksMock } = createSkillModal();

      await user.click(screen.getByRole("button", { name: /create/i }));

      expect(tracksMock.createForm.open).toHaveBeenCalled();
    });

    it("selects a track from dropdown", async () => {
      const { skillFormMock } = createSkillModal({
        skillForm: {
          tracks: [{ track_id: "react", title: "React" }],
        },
      });

      await user.click(screen.getByRole("button", { name: /learning track/i }));
      await waitFor(() =>
        screen.getByRole("listbox", { name: /learning track/i }),
      );

      await user.click(screen.getByRole("option", { name: "React" }));

      expect(skillFormMock.methods.handleChangeTrack).toHaveBeenCalledWith(
        "react",
      );
    });

    it("shows 'Create' button only when no tracks exist", async () => {
      await act(async () => {
        createSkillModal({
          skillForm: { tracks: [{ track_id: "react", title: "React" }] },
        });
      });
      expect(screen.queryByText(/create/i)).not.toBeInTheDocument();

      await act(async () => {
        createSkillModal({ skillForm: { tracks: [] } });
      });
      expect(screen.getByText(/create/i)).toBeInTheDocument();
    });
  });

  describe("Form interactions", () => {
    it("calls handleChange when input fields change", async () => {
      const { skillFormMock } = createSkillModal({
        props: { mode: "edit" },
        skillForm: { skillFormData: mockSkill },
      });

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "X");

      expect(skillFormMock.methods.handleChange).toHaveBeenCalled();

      const categoryInput = screen.getByLabelText(/category/i);
      await user.type(categoryInput, "Y");

      expect(skillFormMock.methods.handleChange).toHaveBeenCalled();
    });

    it("submits form on update click", async () => {
      const { skillFormMock } = createSkillModal({
        props: { mode: "edit" },
        skillForm: { skillFormData: mockSkill },
      });

      await user.click(screen.getByRole("button", { name: /update skill/i }));

      expect(skillFormMock.methods.handleSubmit).toHaveBeenCalled();
    });
  });

  describe("Delete flow", () => {
    it("calls onDelete when clicking delete permanently", async () => {
      const { props } = createSkillModal({
        props: { mode: "delete", initialData: mockSkill },
      });

      await user.click(
        screen.getByRole("button", { name: /delete permanently/i }),
      );

      expect(props.onDelete).toHaveBeenCalledWith(mockSkill);
    });

    it("calls onClose when clicking keep it", async () => {
      const { props } = createSkillModal({
        props: { mode: "delete", initialData: mockSkill },
      });

      await user.click(screen.getByRole("button", { name: /keep it/i }));

      expect(props.onClose).toHaveBeenCalled();
    });
  });

  describe("Loading states", () => {
    it("disables submit button when submitting", () => {
      createSkillModal({
        props: { isSubmitting: true },
      });

      const submitButton = screen.getByRole("button", {
        name: /creating/i,
      });

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/creating/i);
    });
  });
});
