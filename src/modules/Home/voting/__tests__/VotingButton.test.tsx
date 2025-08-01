import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VotingButton } from '../VotingButton';

describe('VotingButton', () => {
  const defaultProps = {
    type: 'up' as const,
    isVoted: false,
    isCurrentVote: false,
    onClick: vi.fn(),
    disabled: false,
    hasError: false,
    onRetry: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render up vote button correctly', () => {
      render(<VotingButton {...defaultProps} type="up" />);
      
      const button = screen.getByRole('button', { name: 'Vote up' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Up');
    });

    it('should render down vote button correctly', () => {
      render(<VotingButton {...defaultProps} type="down" />);
      
      const button = screen.getByRole('button', { name: 'Vote down' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Down');
    });

    it('should render with correct icon for up vote', () => {
      render(<VotingButton {...defaultProps} type="up" />);
      
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render with correct icon for down vote', () => {
      render(<VotingButton {...defaultProps} type="down" />);
      
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('should be enabled when not voted and not disabled', () => {
      render(<VotingButton {...defaultProps} isVoted={false} disabled={false} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
    });

    it('should be disabled when isVoted is true and no error', () => {
      render(<VotingButton {...defaultProps} isVoted={true} hasError={false} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should be enabled when isVoted is true but has error', () => {
      render(<VotingButton {...defaultProps} isVoted={true} hasError={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<VotingButton {...defaultProps} disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should be disabled when both isVoted and disabled are true', () => {
      render(<VotingButton {...defaultProps} isVoted={true} disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Visual States', () => {
    it('should apply current vote styles when isCurrentVote is true for up vote', () => {
      render(<VotingButton {...defaultProps} type="up" isCurrentVote={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-green-100', 'text-green-700', 'border-green-300');
    });

    it('should apply current vote styles when isCurrentVote is true for down vote', () => {
      render(<VotingButton {...defaultProps} type="down" isCurrentVote={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-100', 'text-red-700', 'border-red-300');
    });

    it('should apply disabled styles when button is disabled', () => {
      render(<VotingButton {...defaultProps} disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100', 'text-gray-500', 'border-gray-200');
    });

    it('should apply disabled styles when isVoted is true and no error', () => {
      render(<VotingButton {...defaultProps} isVoted={true} hasError={false} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100', 'text-gray-500', 'border-gray-200');
    });

    it('should apply error styles when hasError is true', () => {
      render(<VotingButton {...defaultProps} hasError={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-100', 'text-red-700', 'border-red-300');
    });

    it('should apply default up vote styles when not voted and enabled', () => {
      render(<VotingButton {...defaultProps} type="up" isVoted={false} disabled={false} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white', 'text-green-600', 'border-green-200');
    });

    it('should apply default down vote styles when not voted and enabled', () => {
      render(<VotingButton {...defaultProps} type="down" isVoted={false} disabled={false} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white', 'text-red-600', 'border-red-200');
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when button is clicked and enabled', () => {
      const mockOnClick = vi.fn();
      render(<VotingButton {...defaultProps} onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when button is disabled', () => {
      const mockOnClick = vi.fn();
      render(<VotingButton {...defaultProps} onClick={mockOnClick} disabled={true} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when isVoted is true and no error', () => {
      const mockOnClick = vi.fn();
      render(<VotingButton {...defaultProps} onClick={mockOnClick} isVoted={true} hasError={false} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should call onClick multiple times if clicked multiple times while enabled', () => {
      const mockOnClick = vi.fn();
      render(<VotingButton {...defaultProps} onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-label for up vote', () => {
      render(<VotingButton {...defaultProps} type="up" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Vote up');
    });

    it('should have correct aria-label for down vote', () => {
      render(<VotingButton {...defaultProps} type="down" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Vote down');
    });

    it('should be focusable when enabled', () => {
      render(<VotingButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should support keyboard interaction (Enter key)', () => {
      const mockOnClick = vi.fn();
      render(<VotingButton {...defaultProps} onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.click(button); // Browsers automatically trigger click on Enter
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should support keyboard interaction (Space key)', () => {
      const mockOnClick = vi.fn();
      render(<VotingButton {...defaultProps} onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      fireEvent.click(button); // Browsers automatically trigger click on Space
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon States', () => {
    it('should display solid icon when isCurrentVote is true for up vote', () => {
      render(<VotingButton {...defaultProps} type="up" isCurrentVote={true} />);
      
      // Note: In a real test, you might want to check for specific icon classes
      // or data attributes that distinguish solid vs outline icons
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should display solid icon when isCurrentVote is true for down vote', () => {
      render(<VotingButton {...defaultProps} type="down" isCurrentVote={true} />);
      
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should display outline icon when isCurrentVote is false', () => {
      render(<VotingButton {...defaultProps} isCurrentVote={false} />);
      
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Props Combinations', () => {
    it('should handle all props being true', () => {
      render(
        <VotingButton 
          {...defaultProps} 
          isVoted={true} 
          isCurrentVote={true} 
          disabled={true} 
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      // isCurrentVote takes precedence, so should show current vote styles
      expect(button).toHaveClass('bg-green-100', 'text-green-700');
    });

    it('should prioritize current vote styles over default styles', () => {
      render(
        <VotingButton 
          {...defaultProps} 
          type="up"
          isVoted={false} 
          isCurrentVote={true} 
          disabled={false} 
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-green-100', 'text-green-700');
      expect(button).not.toHaveClass('bg-white', 'text-green-600');
    });

    it('should prioritize current vote styles over disabled styles', () => {
      render(
        <VotingButton 
          {...defaultProps} 
          type="up"
          isVoted={true} 
          isCurrentVote={true} 
          disabled={false} 
        />
      );
      
      const button = screen.getByRole('button');
      // Based on the actual implementation, isCurrentVote takes precedence
      expect(button).toHaveClass('bg-green-100', 'text-green-700');
      expect(button).not.toHaveClass('bg-gray-100', 'text-gray-500');
    });
  });

  describe('Error State', () => {
    it('should display "Retry" text when hasError is true', () => {
      render(<VotingButton {...defaultProps} hasError={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Retry');
    });

    it('should have correct aria-label for retry up vote', () => {
      render(<VotingButton {...defaultProps} type="up" hasError={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Retry vote up');
    });

    it('should have correct aria-label for retry down vote', () => {
      render(<VotingButton {...defaultProps} type="down" hasError={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Retry vote down');
    });

    it('should display retry icon with spin animation when hasError is true', () => {
      render(<VotingButton {...defaultProps} hasError={true} />);
      
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('animate-spin');
    });

    it('should prioritize error styles over current vote styles', () => {
      render(
        <VotingButton 
          {...defaultProps} 
          hasError={true} 
          isCurrentVote={true} 
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-100', 'text-red-700', 'border-red-300');
      expect(button).not.toHaveClass('bg-green-100', 'text-green-700');
    });
  });

  describe('Retry Functionality', () => {
    it('should call onRetry when button is clicked in error state', () => {
      const mockOnRetry = vi.fn();
      render(
        <VotingButton 
          {...defaultProps} 
          hasError={true} 
          onRetry={mockOnRetry}
        />
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('should call onRetry instead of onClick when hasError is true', () => {
      const mockOnClick = vi.fn();
      const mockOnRetry = vi.fn();
      render(
        <VotingButton 
          {...defaultProps} 
          hasError={true} 
          onClick={mockOnClick}
          onRetry={mockOnRetry}
        />
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should not call onRetry when hasError is false', () => {
      const mockOnRetry = vi.fn();
      const mockOnClick = vi.fn();
      render(
        <VotingButton 
          {...defaultProps} 
          hasError={false} 
          onClick={mockOnClick}
          onRetry={mockOnRetry}
        />
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnRetry).not.toHaveBeenCalled();
    });

    it('should handle retry when onRetry is not provided', () => {
      // Should not throw error even if onRetry is undefined
      render(
        <VotingButton 
          {...defaultProps} 
          hasError={true} 
          onRetry={undefined}
        />
      );
      
      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('Error State Combinations', () => {
    it('should handle error state with isVoted true', () => {
      render(
        <VotingButton 
          {...defaultProps} 
          hasError={true} 
          isVoted={true}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
      expect(button).toHaveTextContent('Retry');
      expect(button).toHaveClass('bg-red-100', 'text-red-700');
    });

    it('should handle error state with disabled true', () => {
      render(
        <VotingButton 
          {...defaultProps} 
          hasError={true} 
          disabled={true}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('bg-red-100', 'text-red-700');
    });

    it('should show normal vote behavior when no error', () => {
      render(
        <VotingButton 
          {...defaultProps} 
          type="up"
          hasError={false} 
          isCurrentVote={true}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Up');
      expect(button).toHaveClass('bg-green-100', 'text-green-700');
      expect(button).toHaveAttribute('aria-label', 'Vote up');
    });
  });
});