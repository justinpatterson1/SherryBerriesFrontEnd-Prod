import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavDropdown from '../NavDropdown';

describe('<NavDropdown />', () => {
  it('renders the trigger button as collapsed', () => {
    render(<NavDropdown pathname='/' />);
    const trigger = screen.getByRole('button', { name: /products/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('opens menu on click and shows category links', async () => {
    render(<NavDropdown pathname='/' />);
    const trigger = screen.getByRole('button', { name: /products/i });
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /jewelry/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /waistbeads/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /clothing/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /aftercare/i })).toBeInTheDocument();
  });

  it('opens on Enter and ArrowDown', () => {
    render(<NavDropdown pathname='/' />);
    const trigger = screen.getByRole('button', { name: /products/i });

    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('marks Products as active when pathname starts with /product', () => {
    render(<NavDropdown pathname='/product/jewelry' />);
    const trigger = screen.getByRole('button', { name: /products/i });
    expect(trigger.className).toMatch(/text-brand/);
  });
});
