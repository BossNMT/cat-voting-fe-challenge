import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Multiple rapid changes
    rerender({ value: 'change1', delay: 500 });
    act(() => { vi.advanceTimersByTime(250); });
    
    rerender({ value: 'change2', delay: 500 });
    act(() => { vi.advanceTimersByTime(250); });
    
    rerender({ value: 'final', delay: 500 });
    
    // Should still be initial after 500ms total
    expect(result.current).toBe('initial');
    
    // Only after full delay from last change
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    expect(result.current).toBe('final');
  });
});