import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import PurgeActivitiesModal from "./PurgeActivitiesModal";
import userEvent from "@testing-library/user-event";

const mockSkill = { name: "javascript" };

const renderComponent = ({
  context = "confirm-step",
  closeModal = vi.fn(),
  openFinalVerification = vi.fn(),
  handlePurge = vi.fn(),
  changeValue = vi.fn(),
  skillValue = "javascript",
  skill = mockSkill,
}) => {
  render(
    <PurgeActivitiesModal
      isOpened={true}
      context={context}
      activityCount={3}
      skill={skill}
      closeModal={closeModal}
      openFinalVerification={openFinalVerification}
      handlePurge={handlePurge}
      skillValue={skillValue}
      changeValue={changeValue}
    />
  );
};

describe("PurgeActivitiesModal", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("calls closeModal if closure button is clicked", async () => {
    const mockCloseModal = vi.fn();
    renderComponent({ context: "confirm-step", closeModal: mockCloseModal });

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockCloseModal).toHaveBeenCalled();
  });

  describe("Confirmation Step", () => {
    it("renders PurgeActivitiesModal with confirmation step attributes", () => {
      renderComponent({ context: "confirm-step" });

      expect(
        screen.getByRole("heading", {
          name: /Irreversible Purge Confirmation/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByText(/you are about to delete/i)).toBeInTheDocument();
      expect(screen.getByText(/javascript/i)).toBeInTheDocument();
      expect(screen.getByText(/attention/i)).toBeInTheDocument();
      expect(screen.getByText(/this action is permanent/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Continue to purge/i })
      ).toBeInTheDocument();
    });

    it("calls openFinalVerification if confirmed", async () => {
      const mockOpenFinalVerification = vi.fn();
      renderComponent({
        context: "confirm-step",
        openFinalVerification: mockOpenFinalVerification,
      });

      expect(
        screen.getByRole("heading", {
          name: /Irreversible Purge Confirmation/i,
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /continue to purge/i })
      );

      expect(mockOpenFinalVerification).toHaveBeenCalled();
    });
  });

  describe("Verification Step", () => {
    it("renders PurgeActivitiesModal with verification step attributes", () => {
      renderComponent({ context: "verification-step" });

      expect(
        screen.getByRole("heading", { name: /Confirm Skill Name/i })
      ).toBeInTheDocument();

      expect(screen.getByText(/to confirm deletion of/i)).toBeInTheDocument();

      expect(screen.getByText("3 activities")).toBeInTheDocument();

      expect(screen.getByText('"javascript"')).toBeInTheDocument();

      expect(
        screen.getByLabelText(/enter skill name/i)
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /purge permanently/i })
      ).toBeInTheDocument();
    });

    it("calls handlePurge when submitting the form", async () => {
      const mockHandlePurge = vi.fn();
      renderComponent({
        context: "verification-step",
        handlePurge: mockHandlePurge,
      });

      expect(
        screen.getByLabelText(/enter skill name/i)
      ).toHaveValue("javascript");

      await user.click(
        screen.getByRole("button", { name: /purge permanently/i })
      );

      expect(mockHandlePurge).toHaveBeenCalled();
    });
  });
});
