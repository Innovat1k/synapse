import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFormData } from "./useFormData";

describe("useFormData", () => {
  const mockEvent = (eventId, eventValue) => {
    return { target: { id: eventId, value: eventValue } };
  };

  it("changes formData values according to input", () => {
    const { result } = renderHook(() => useFormData());

    act(() => {
      result.current.handleChange(mockEvent("email", "usermail@gmail.com"));
    });

    act(() => {
      result.current.handleChange(mockEvent("password", "secure00use"));
    });

    act(() => {
      result.current.handleChange(mockEvent("confirmPassword", "secure00use"));
    });

    expect(result.current.formData.email).toEqual("usermail@gmail.com");
    expect(result.current.formData.password).toEqual("secure00use");
    expect(result.current.formData.confirmPassword).toEqual("secure00use");
  });

  it("marks touched state if unfocused", () => {
    const { result } = renderHook(() => useFormData());

    act(() => {
      result.current.handleBlur(mockEvent("password"));
    });

    act(() => {
      result.current.handleBlur(mockEvent("confirmPassword"));
    });

    expect(result.current.touched.password).toBeTruthy();
    expect(result.current.touched.confirmPassword).toBeTruthy();
  });

  it("allow switching between SignIn and SignUp state, and resets formData and touched values", () => {
    const { result } = renderHook(() => useFormData());

    act(() => {
      result.current.handleChange(mockEvent("email", "octobuser@gmail.com"));
    });

    act(() => {
      result.current.handleBlur(mockEvent("email"));
    });

    expect(result.current.formData.email).toEqual("octobuser@gmail.com");
    expect(result.current.touched.email).toBeTruthy();

    act(() => {
      result.current.handleToggleAuth();
    });

    expect(result.current.isLogin).toBeFalsy();
    expect(result.current.formData.email).toEqual("");
    expect(result.current.touched.email).toBeFalsy();
  });
});
