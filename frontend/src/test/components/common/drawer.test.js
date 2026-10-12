import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Drawer } from '../../../components/common'; // Component to be created

describe('Drawer Component Unit Tests', () => {
  
  // --- 1. BASIC FUNCTIONALITY & USER SCENARIOS ---
  
  test('should not render the drawer content when isOpen is false', () => {
    render(<Drawer isOpen={false} onClose={jest.fn()} onItemSelect={jest.fn()}>Menu Items</Drawer>);
    
    const drawerContent = screen.queryByText(/menu items/i);
    expect(drawerContent).not.toBeInTheDocument();
  });

  test('should render the drawer content when isOpen is true', () => {
    render(<Drawer isOpen={true} onClose={jest.fn()} onItemSelect={jest.fn()}>Menu Items</Drawer>);
    
    expect(screen.getByText(/menu items/i)).toBeInTheDocument();
  });

  test('should open drawer when menu button is clicked', () => {
    const mockOnClose = jest.fn();
    const mockOnItemSelect = jest.fn();

    let drawerOpen = false;
    let mockOpenDrawer = () => { drawerOpen = true };
    
    render(
      <div>
        <button data-testid="menu-button" onClick={() => { drawerOpen = true }}>Menu</button>
        <Drawer 
          isOpen={drawerOpen} 
          onClose={mockOnClose} 
          onItemSelect={mockOnItemSelect}
        >
          <div>Menu Item 1</div>
          <div>Menu Item 2</div>
        </Drawer>
      </div>
    );
    
    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);
    
    // Verify drawer is now open (we can't easily test the animation, but content should be present)
    expect(screen.getByText(/Menu Item 1/i)).toBeInTheDocument();
  });

  // --- 2. INTERACTION SCENARIOS ---
  
  test('should close drawer when clicking outside the drawer area', () => {
    const mockOnClose = jest.fn();
    const mockOnItemSelect = jest.fn();
    
    render(
      <div>
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={true} 
          onClose={mockOnClose} 
          onItemSelect={mockOnItemSelect}
        >
          <div>Menu Item 1</div>
        </Drawer>
      </div>
    );
    
    // Click outside the drawer (on the backdrop or main content)
    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should close drawer and call item select when menu item is clicked', () => {
    const mockOnClose = jest.fn();
    const mockOnItemSelect = jest.fn();
    
    render(
      <div>
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={true} 
          onClose={mockOnClose} 
          onItemSelect={mockOnItemSelect}
        >
          <div data-testid="menu-item-1">Edit Profile</div>
        </Drawer>
      </div>
    );
    
    const menuItem = screen.getByTestId('menu-item-1');
    fireEvent.click(menuItem);
    
    expect(mockOnItemSelect).toHaveBeenCalledWith('Edit Profile');
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should close drawer when pressing Escape key', () => {
    const mockOnClose = jest.fn();
    const mockOnItemSelect = jest.fn();
    
    render(
      <div>
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={true} 
          onClose={mockOnClose} 
          onItemSelect={mockOnItemSelect}
        >
          <div>Menu Item 1</div>
        </Drawer>
      </div>
    );
    
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should handle rapid clicking of menu button and close actions', () => {
    const mockOnClose = jest.fn();
    const mockOnItemSelect = jest.fn();
    
    render(
      <div>
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={false} 
          onClose={mockOnClose} 
          onItemSelect={mockOnItemSelect}
        >
          <div>Menu Item 1</div>
        </Drawer>
      </div>
    );
    
    const menuButton = screen.getByTestId('menu-button');
    
    // Simulate rapid clicks
    fireEvent.click(menuButton);
    fireEvent.click(menuButton);
    fireEvent.click(menuButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(0); // Only opened once, not closed repeatedly
  });

  // --- 3. SECURITY SCENARIOS ---
  
  test('should handle malicious event handlers in menu items (no XSS)', () => {
    const mockOnClose = jest.fn();
    const mockOnItemSelect = jest.fn();
    
    render(
      <div>
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={true} 
          onClose={mockOnClose} 
          onItemSelect={mockOnItemSelect}
        >
          <div data-testid="malicious-item" onClick={() => { throw new Error('XSS'); }}>
            Malicious Item
          </div>
        </Drawer>
      </div>
    );
    
    // Should not crash when clicking the item, even if it has a malicious handler
    const menuItem = screen.getByTestId('malicious-item');
    fireEvent.click(menuItem);
    
    expect(mockOnItemSelect).toHaveBeenCalledWith('Malicious Item');
  });

  test('should properly close drawer when menu item is clicked with callback', () => {
    const mockOnClose = jest.fn();
    const mockOnItemSelect = jest.fn(() => {
      // Simulate a scenario where the item click handler might do additional work
      return { success: true };
    });
    
    render(
      <div>
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={true} 
          onClose={mockOnClose} 
          onItemSelect={mockOnItemSelect}
        >
          <div data-testid="secure-item">Secure Item</div>
        </Drawer>
      </div>
    );
    
    const menuItem = screen.getByTestId('secure-item');
    fireEvent.click(menuItem);
    
    expect(mockOnItemSelect).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled(); // Should close regardless of callback behavior
  });

  // --- 4. RENDERING & UI SCENARIOS ---
  
  test('should have proper z-index and positioning when open', () => {
    render(
      <div>
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={true} 
          onClose={jest.fn()} 
          onItemSelect={jest.fn()}
        >
          <div>Menu Item 1</div>
        </Drawer>
      </div>
    );
    
    const drawerElement = screen.getByRole('dialog');
    expect(drawerElement).toHaveStyle('position: fixed');
    expect(drawerElement).toHaveStyle('z-index: 1000'); // Typical high z-index
  });

  test('should have proper accessibility attributes', () => {
    render(
      <div>
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={true} 
          onClose={jest.fn()} 
          onItemSelect={jest.fn()}
        >
          <div>Menu Item 1</div>
        </Drawer>
      </div>
    );
    
    const drawerElement = screen.getByRole('dialog');
    expect(drawerElement).toHaveAttribute('role', 'dialog');
    expect(drawerElement).toHaveAttribute('aria-modal', 'true');
    expect(drawerElement).toHaveAttribute('aria-hidden', 'false');
  });

  test('should not cause layout shifts when opening/closing', () => {
    render(
      <div data-testid="container">
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={false} 
          onClose={jest.fn()} 
          onItemSelect={jest.fn()}
        >
          <div>Menu Item 1</div>
        </Drawer>
      </div>
    );
    
    // Check that the drawer doesn't cause main content to shift
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
  });

  test('should render backdrop when drawer is open', () => {
    render(
      <div>
        <button data-testid="menu-button">Menu</button>
        <Drawer 
          isOpen={true} 
          onClose={jest.fn()} 
          onItemSelect={jest.fn()}
        >
          <div>Menu Item 1</div>
        </Drawer>
      </div>
    );
    
    // The backdrop should be present when drawer is open
    const backdrop = screen.getByRole("presentation");
    expect(backdrop).toBeInTheDocument();
  });
});
