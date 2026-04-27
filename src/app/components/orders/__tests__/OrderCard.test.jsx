import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderCard from '../OrderCard';
import { mockOrder } from '@/test/mocks/strapi';

describe('<OrderCard />', () => {
  it('renders order data', () => {
    render(<OrderCard order={mockOrder} onTrackOrder={vi.fn()} onReorder={vi.fn()} />);
    expect(screen.getByText(`Order #${mockOrder.orderId}`)).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText(`$${mockOrder.subtotal}`)).toBeInTheDocument();
  });

  it('renders correct status badge with aria-label', () => {
    render(<OrderCard order={mockOrder} onTrackOrder={vi.fn()} onReorder={vi.fn()} />);
    const badge = screen.getByLabelText(/order status/i);
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toMatch(/processing/i);
  });

  it('expands to show details when "View Details" clicked', () => {
    render(<OrderCard order={mockOrder} onTrackOrder={vi.fn()} onReorder={vi.fn()} />);
    expect(screen.queryByText('Shipping Address')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /view details/i }));
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
  });

  it('calls onTrackOrder when status is shipped', () => {
    const onTrack = vi.fn();
    const shippedOrder = { ...mockOrder, order_status: 'shipped' };
    render(<OrderCard order={shippedOrder} onTrackOrder={onTrack} onReorder={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /track order/i }));
    expect(onTrack).toHaveBeenCalledWith(shippedOrder.orderId);
  });
});
