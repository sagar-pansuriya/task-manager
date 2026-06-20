import { renderHook, act } from "@testing-library/react";
import { usePagination } from "@/hooks/usePagination";

function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => i + 1);
}

describe("usePagination", () => {
  it("returns the first page of items by default", () => {
    const { result } = renderHook(() => usePagination(makeItems(25), 10, "key-a"));

    expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.hasPrevPage).toBe(false);
    expect(result.current.hasNextPage).toBe(true);
  });

  it("advances to the next page and back", () => {
    const { result } = renderHook(() => usePagination(makeItems(25), 10, "key-a"));

    act(() => result.current.nextPage());
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageItems).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

    act(() => result.current.prevPage());
    expect(result.current.currentPage).toBe(1);
  });

  it("does not advance past the last page", () => {
    const { result } = renderHook(() => usePagination(makeItems(15), 10, "key-a"));

    act(() => result.current.nextPage());
    expect(result.current.currentPage).toBe(2);
    expect(result.current.hasNextPage).toBe(false);

    act(() => result.current.nextPage());
    expect(result.current.currentPage).toBe(2); // stays clamped
  });

  it("resets to page 1 when the reset key changes (e.g. a new filter/search)", () => {
    const { result, rerender } = renderHook(
      ({ items, resetKey }: { items: number[]; resetKey: string }) => usePagination(items, 10, resetKey),
      { initialProps: { items: makeItems(25), resetKey: "all:" } },
    );

    act(() => result.current.nextPage());
    expect(result.current.currentPage).toBe(2);

    rerender({ items: makeItems(5), resetKey: "completed:" });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5]);
  });
});
