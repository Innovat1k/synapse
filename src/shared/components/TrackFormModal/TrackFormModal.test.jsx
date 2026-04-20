import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TrackFormModal } from "./TrackFormModal";
import { MemoryRouter } from "react-router-dom";
import { TEST_USER_ID } from "@mocks/stores";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: TEST_USER_ID },
  }),
}));

describe("TrackFormModal", () => {
  let user;
  let RouteWrapper;
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    RouteWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
    mockOnSubmit.mockClear();
    mockOnClose.mockClear();
  });

  describe("Rendering", () => {
    it("renders modal content when opened", () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
        { wrapper: RouteWrapper },
      );

      expect(
        screen.getByRole("heading", { name: /Configure New Track/i }),
      ).toBeInTheDocument();

      expect(screen.getByLabelText(/Track Title/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Cancel/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onClose when Cancel button is clicked", async () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
        { wrapper: RouteWrapper },
      );

      await user.click(screen.getByRole("button", { name: /Cancel/i }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    describe("Form Submission", () => {
      it("submits real user data", async () => {
        render(
          <TrackFormModal
            isOpened={true}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
          />,
          { wrapper: RouteWrapper },
        );

        await user.type(screen.getByLabelText(/Track Title/i), "Test Track");

        await user.selectOptions(screen.getByLabelText(/Category/i), "other");

        await user.click(screen.getByRole("button", { name: /Create Track/i }));

        await waitFor(() => {
          expect(mockOnSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              title: "Test Track",
              user_id: TEST_USER_ID,
              track_id: "test-track",
              category: "other",
            }),
          );
        });
      });

      it("disables submit button when loading", () => {
        render(
          <TrackFormModal
            isOpened={true}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
            isLoading={true}
          />,
          { wrapper: RouteWrapper },
        );

        expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
      });
    });
  });
});
