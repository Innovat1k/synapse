import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRelativeTime } from "./useRelativeTime";

describe("useRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-09T14:30:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for < 60 seconds', () => {
    const thirtySecondsAgo = new Date("2026-04-09T14:29:30Z").toISOString();
    const { result } = renderHook(() => useRelativeTime(thirtySecondsAgo));
    expect(result.current).toBe("just now");
  });

  it('returns "Xm ago" for 1-59 minutes', () => {
    const fiveMinutesAgo = new Date("2026-04-09T14:25:00Z").toISOString();
    const { result } = renderHook(() => useRelativeTime(fiveMinutesAgo));
    expect(result.current).toBe("5m ago");
  });

  it('returns "Xh ago" for 1-23 hours', () => {
    const threeHoursAgo = new Date("2026-04-09T11:30:00Z").toISOString();
    const { result } = renderHook(() => useRelativeTime(threeHoursAgo));
    expect(result.current).toBe("3h ago");
  });

  it('returns "Xd ago" for 1-6 days', () => {
    const twoDaysAgo = new Date("2026-04-07T14:30:00Z").toISOString();
    const { result } = renderHook(() => useRelativeTime(twoDaysAgo));
    expect(result.current).toBe("2d ago");
  });

  it("returns an absolute date for 7+ days", () => {
    const tenDaysAgo = new Date("2026-03-30T14:30:00Z").toISOString();
    const { result } = renderHook(() => useRelativeTime(tenDaysAgo));
    expect(result.current).toMatch(/Mar 30|Mar 30/);
  });

  it("updates after 5 minutes", () => {
    const now = new Date("2026-04-09T14:30:00Z").toISOString();
    const { result } = renderHook(() => useRelativeTime(now));

    expect(result.current).toBe("just now");

    // Move forward 5 minutes + 1 second
    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000);
    });

    expect(result.current).toBe("5m ago");
  });

  it("updates when the tab becomes visible again", () => {
    const now = new Date("2026-04-09T14:30:00Z").toISOString();
    const { result } = renderHook(() => useRelativeTime(now));

    expect(result.current).toBe("just now");

    // Simulate going to background then returning
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        writable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // Move forward 2 minutes
    act(() => {
      vi.advanceTimersByTime(2 * 60 * 1000);
    });

    // Return to tab
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        writable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current).toBe("2m ago");
  });
});
