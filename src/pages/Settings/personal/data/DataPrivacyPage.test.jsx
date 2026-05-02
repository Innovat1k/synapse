import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import DataPrivacyPage from "./DataPrivacyPage";
import { useDataExport } from "./hooks/useDataExport";
import { useDataPurge } from "./hooks/useDataPurge";
import { useSkillsQuery } from "@shared/hooks/useSkillsQuery/useSkillsQuery";
import { useAllActivitiesQuery } from "@shared/hooks/useActivitiesQuery/useActivitiesQuery";
import { useTracksQuery } from "@shared/hooks/useTracksQuery";

vi.mock("./hooks/useDataExport");
vi.mock("./hooks/useDataPurge");
vi.mock("@shared/hooks/useSkillsQuery/useSkillsQuery");
vi.mock("@shared/hooks/useActivitiesQuery/useActivitiesQuery");
vi.mock("@shared/hooks/useTracksQuery");

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("DataPrivacyPage", () => {
  const mockHandleExport = vi.fn();
  const mockHandleReset = vi.fn();
  const mockSetIsResetModalOpen = vi.fn();

  let user;

  beforeEach(() => {
    user = userEvent.setup();

    useDataExport.mockReturnValue({
      isExporting: false,
      handleExport: mockHandleExport,
    });
    useDataPurge.mockReturnValue({
      isResetModalOpen: false,
      isDeleting: false,
      setIsResetModalOpen: mockSetIsResetModalOpen,
      handleReset: mockHandleReset,
    });
    useSkillsQuery.mockReturnValue({ skills: [], isLoading: false });
    useAllActivitiesQuery.mockReturnValue({ activities: [], isLoading: false });
    useTracksQuery.mockReturnValue({ tracks: [], isLoading: false });
  });

  it("renders the page correctly", () => {
    renderWithRouter(<DataPrivacyPage />);

    expect(
      screen.getByRole("heading", { name: "Data & Privacy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Manage your data, export or delete/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Export Your Data" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Download My Data/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete all data/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(
      screen.getByText(/Deleting your data will permanently delete/i),
    ).toBeInTheDocument();
  });

  it("Export button calls handleExport when clicked", async () => {
    renderWithRouter(<DataPrivacyPage />);

    await user.click(
      screen.getByRole("button", {
        name: /Download My Data/i,
      }),
    );

    expect(mockHandleExport).toHaveBeenCalledTimes(1);
  });

  it("Delete button opens modal when clicked", async () => {
    useSkillsQuery.mockReturnValue({
      skills: [{ skill_id: "1" }],
      isLoading: false,
    });
    renderWithRouter(<DataPrivacyPage />);

    await user.click(screen.getByRole("button", { name: /delete all data/i }));

    expect(mockSetIsResetModalOpen).toHaveBeenCalledWith(true);
  });

  it("Delete button is disabled when isDataEmpty is true", () => {
    useSkillsQuery.mockReturnValue({ skills: [], isLoading: false });
    useAllActivitiesQuery.mockReturnValue({ activities: [], isLoading: false });
    useTracksQuery.mockReturnValue({ tracks: [], isLoading: false });

    renderWithRouter(<DataPrivacyPage />);

    expect(
      screen.getByRole("button", { name: /delete all data/i }),
    ).toBeDisabled();
  });

  it("Delete button is enabled when data exists", () => {
    useSkillsQuery.mockReturnValue({
      skills: [{ skill_id: "1" }],
      isLoading: false,
    });
    useAllActivitiesQuery.mockReturnValue({ activities: [], isLoading: false });
    useTracksQuery.mockReturnValue({ tracks: [], isLoading: false });

    renderWithRouter(<DataPrivacyPage />);

    expect(
      screen.getByRole("button", { name: /delete all data/i }),
    ).not.toBeDisabled();
  });

  it("Modal renders when isResetModalOpen is true", () => {
    useDataPurge.mockReturnValue({
      isResetModalOpen: true,
      isDeleting: false,
      setIsResetModalOpen: mockSetIsResetModalOpen,
      handleReset: mockHandleReset,
    });

    renderWithRouter(<DataPrivacyPage />);

    expect(
      screen.getByRole("heading", { name: /delete all data\?/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Yes, delete Everything/i }),
    ).toBeInTheDocument();
  });

  it("Modal Cancel button closes modal", async () => {
    useDataPurge.mockReturnValue({
      isResetModalOpen: true,
      isDeleting: false,
      setIsResetModalOpen: mockSetIsResetModalOpen,
      handleReset: mockHandleReset,
    });

    renderWithRouter(<DataPrivacyPage />);

    await user.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(mockSetIsResetModalOpen).toHaveBeenCalledWith(false);
  });

  it("Modal Confirm button calls handleReset", async () => {
    useDataPurge.mockReturnValue({
      isResetModalOpen: true,
      isDeleting: false,
      setIsResetModalOpen: mockSetIsResetModalOpen,
      handleReset: mockHandleReset,
    });

    renderWithRouter(<DataPrivacyPage />);

    await user.click(
      screen.getByRole("button", {
        name: /Yes, delete Everything/i,
      }),
    );

    expect(mockHandleReset).toHaveBeenCalledTimes(1);
  });

  it("Export button shows loading state when isExporting", () => {
    useDataExport.mockReturnValue({
      isExporting: true,
      handleExport: mockHandleExport,
    });

    renderWithRouter(<DataPrivacyPage />);

    expect(screen.getByText("Exporting...")).toBeInTheDocument();
    expect(screen.queryByText("Download My Data")).not.toBeInTheDocument();
  });

  it("Reset modal shows loading state when isDeleting", () => {
    useDataPurge.mockReturnValue({
      isResetModalOpen: true,
      isDeleting: true,
      setIsResetModalOpen: mockSetIsResetModalOpen,
      handleReset: mockHandleReset,
    });

    renderWithRouter(<DataPrivacyPage />);

    expect(screen.getByText(/Deleting data.../i)).toBeInTheDocument();
    expect(
      screen.queryByText("Yes, delete Everything"),
    ).not.toBeInTheDocument();
  });
});
