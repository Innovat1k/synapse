import { renderHook } from "@testing-library/react";
import { describe } from "vitest";
import { useFormValidation } from "./useFormValidation";

describe("useFormValidation", () => {
  const mockFormData = ({
    email = "octobuser@gmail.com",
    password = "secure00",
    confirmPassword = "secure00",
  }) => {
    return {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
  };

  it("throws error if password is empty", () => {
    const { result } = renderHook(() =>
      useFormValidation(mockFormData({ password: "" }))
    );

    expect(result.current.errors.password).toMatch(
      /^(?=.*password)(?=.*required).*$/i
    );
  });

  it("throws error if password is under 6 characters length", () => {
    const { result } = renderHook(() =>
      useFormValidation(
        mockFormData({ password: "lower", confirmPassword: "lower" })
      )
    );

    expect(result.current.errors.password).toMatch(/at least 6 characters/i);
  });

  it("throws error if confirmPassword is different of password", () => {
    const { result } = renderHook(() =>
      useFormValidation(
        mockFormData({ password: "lower1", confirmPassword: "upper2" })
      )
    );

    expect(result.current.errors.confirmPassword).toMatch(
      /doesn't match the password|different password /i
    );
  });

  it("disables validation if required formData are wrong or empty", () => {
    const { result } = renderHook(() =>
      useFormValidation(
        mockFormData({
          email: "",
          password: "lower1",
          confirmPassword: "upper2",
        })
      )
    );

    expect(result.current.isValid).toBeFalsy();
  });

  it("enables validation if required formData are correct", () => {
    const { result } = renderHook(() =>
      useFormValidation(mockFormData({ email: "octobuser@gmail.com" }))
    );

    expect(result.current.isValid).toBeTruthy();
  });
});
