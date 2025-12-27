import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import DatetimeInput from "./DatetimeInput";
import userEvent from "@testing-library/user-event";

const MOCK_DATE_VALUE = "2025-02-15T14:32";

describe("DatetimeInput", () => {
  it("displays correct data value for each date inputs", () => {
    render(<DatetimeInput id="logged_at" value={MOCK_DATE_VALUE} />);

    expect(screen.getByLabelText(/date/i)).toHaveValue("2025-02-15");
    expect(screen.getByLabelText(/time/i)).toHaveValue("14:32");
  });

  describe("Interactions", () => {
    let user;
    beforeEach(() => {
      user = userEvent.setup();
    });

    it("changes date value while typing in date input", async () => {
      render(
        <DatetimeInput
          id="logged_at"
          value={MOCK_DATE_VALUE}
          onChange={vi.fn()}
        />
      );

      const dateInput = screen.getByLabelText(/date/i);

      await user.clear(dateInput);
      await user.type(dateInput, "2025-12-23");
      expect(dateInput).toHaveValue("2025-12-23");
    });

    it("changes time value while typing in time input", async () => {
      render(
        <DatetimeInput
          id="logged_at"
          value={MOCK_DATE_VALUE}
          onChange={vi.fn()}
        />
      );

      const timeInput = screen.getByLabelText(/time/i);

      await user.clear(timeInput);
      await user.type(timeInput, "10:39");
      expect(timeInput).toHaveValue("10:39");
    });
  });
});
