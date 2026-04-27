import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderItemList from '../OrderItemList';

describe('<OrderItemList />', () => {
  it('renders empty list when no items', () => {
    const { container } = render(<OrderItemList items={[]} />);
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelectorAll('li').length).toBe(0);
  });

  it('renders Jewelry item with name, quantity, color, price', () => {
    const items = [{
      ItemType: 'Jewelry',
      quantity: 2,
      jewelries: [{
        documentId: 'j1',
        name: 'Gold Ring',
        color: 'Gold',
        discount: 0,
        price: 100,
        image: { url: 'https://example.com/ring.jpg' }
      }]
    }];

    render(<OrderItemList items={items} />);
    expect(screen.getByText(/Gold Ring/)).toBeInTheDocument();
    expect(screen.getByText(/2 pcs/)).toBeInTheDocument();
    expect(screen.getByText(/Color: Gold/)).toBeInTheDocument();
    expect(screen.getByText(/Cost: 100\.00/)).toBeInTheDocument();
  });

  it('renders Waistbead item with size', () => {
    const items = [{
      ItemType: 'Waistbead',
      quantity: 1,
      waistbeadSize: 36,
      waistbeads: [{
        documentId: 'w1',
        Name: 'Beach Beads',
        price: 50,
        image: { url: 'https://example.com/wb.jpg' }
      }]
    }];

    render(<OrderItemList items={items} />);
    expect(screen.getByText(/Beach Beads/)).toBeInTheDocument();
    expect(screen.getByText(/Size: 36 inches/)).toBeInTheDocument();
  });

  it('renders Unknown Item for unrecognized ItemType', () => {
    render(<OrderItemList items={[{ ItemType: 'Mystery', quantity: 1 }]} />);
    expect(screen.getByText('Unknown Item')).toBeInTheDocument();
  });

  it('renders multiple items with stable keys', () => {
    const items = [
      { ItemType: 'Jewelry', quantity: 1, jewelries: [{ documentId: 'j1', name: 'A', price: 10 }] },
      { ItemType: 'Jewelry', quantity: 1, jewelries: [{ documentId: 'j2', name: 'B', price: 20 }] }
    ];
    render(<OrderItemList items={items} />);
    expect(screen.getByText(/A/)).toBeInTheDocument();
    expect(screen.getByText(/B/)).toBeInTheDocument();
  });
});
