import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('<Modal />', () => {
  it('does not render when closed', () => {
    render(<Modal open={false} onClose={vi.fn()} title='Test'>content</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog with role, aria-modal, aria-labelledby when open', () => {
    render(<Modal open onClose={vi.fn()} title='Test Modal' titleId='t1'>content</Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 't1');
    expect(screen.getByText('Test Modal')).toHaveAttribute('id', 't1');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title='Test'>content</Modal>);
    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title='Test'>content</Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders children inside the dialog', () => {
    render(<Modal open onClose={vi.fn()} title='Test'><p>Hello inside</p></Modal>);
    expect(screen.getByText('Hello inside')).toBeInTheDocument();
  });
});
