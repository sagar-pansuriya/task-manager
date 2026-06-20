import { act, renderHook } from "@testing-library/react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not update immediately when the input value changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });

    expect(result.current).toBe("a");
  });

  it("updates to the latest value after the delay elapses", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("ab");
  });

  it("resets the timer on rapid successive changes (only the last value wins)", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });
    act(() => {
      jest.advanceTimersByTime(150);
    });
    rerender({ value: "abc" });
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current).toBe("abc");
  });
});
