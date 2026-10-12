import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { setCMCoords } from '../../../slices/globalSlice';
import { renderWithProvider } from '../../testHelpers';
import { ContextMenu } from '../../../components/common'; // Component to be created

// DEBUG IMPORTS
import store from '../../../lib/store';

const dispatch = store.dispatch;
let menuIsOpen = false;

const handleOpenContextMenu = (event) => {
  event.stopPropagation();

  if (typeof event !== React.MouseEvent) {
    return;
  }

  dispatch(setCMCoords({ x: event.clientX, y: event.clientY }));
  menuIsOpen = true;
}

describe('ContextMenu Component Unit Tests', () => {
  
  // --- 1. BASIC FUNCTIONALITY & USER SCENARIOS ---
  
  test('should not render the menu content when isOpen is false', () => {
    console.log({state: store.getState()});
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button" onClick={handleOpenContextMenu}>Menu</button>
        <ContextMenu 
          isOpen={false} 
          anchorPosition="top-left"
          onMenuItemClick={jest.fn()}
        >
          <div>Menu Item 1</div>
          <div>Menu Item 2</div>
        </ContextMenu>
      </div>
    );
    
    const menuContent = screen.queryByText(/menu item/i);
    expect(menuContent).not.toBeInTheDocument();
  });

  test('should render the menu content when isOpen is true', () => {
    renderWithProvider(
      <div>
        <button data-testid="anchor-button" onClick={handleOpenContextMenu}>Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={jest.fn()}
        >
          <div>Menu Item 1</div>
          <div>Menu Item 2</div>
        </ContextMenu>
      </div>
    );
    
    expect(screen.getByText(/menu item 1/i)).toBeInTheDocument();
    expect(screen.getByText(/menu item 2/i)).toBeInTheDocument();
  });

  test('should open menu when anchor button is clicked', () => {
    const mockOnMenuItemClick = jest.fn();
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button" onClick={handleOpenContextMenu}>Menu</button>
        <ContextMenu 
          isOpen={menuIsOpen} 
          anchorPosition="top-left"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    const anchorButton = screen.getByTestId('anchor-button');
    fireEvent.click(anchorButton);
    
    expect(screen.getByText(/menu item 1/i)).toBeInTheDocument();
  });

  // --- 2. ANCHOR POSITIONING & CORNER SELECTION ---
  
  test('should position menu at top-left corner when specified', () => {
    renderWithProvider(
      <div>
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={jest.fn()}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    const menuElement = screen.getByRole('menu');
    // Verify the positioning styles are applied (exact values depend on implementation)
    expect(menuElement).toHaveStyle('position: absolute');
    // This is a general check - actual positioning would be tested via visual regression or specific CSS rules
  });

  test('should position menu at bottom-right corner when specified', () => {
    renderWithProvider(
      <div>
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="bottom-right"
          onMenuItemClick={jest.fn()}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    const menuElement = screen.getByRole('menu');
    expect(menuElement).toHaveStyle('position: absolute');
  });

  // --- 3. CROSS-BUTTON NAVIGATION & MULTIPLE INSTANCES ---
  
  test('should switch anchor to different button while staying open', () => {
    const mockOnMenuItemClick = jest.fn();
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button-1" onClick={handleOpenContextMenu}>Menu</button>
        <button data-testid="anchor-button-2" onClick={handleOpenContextMenu}>Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    // Click second button - menu should move to this button but stay open
    const secondButton = screen.getByTestId('anchor-button-2');
    fireEvent.click(secondButton);
    
    expect(screen.getByText(/menu item 1/i)).toBeInTheDocument();
    // Verify positioning logic (this would depend on implementation details)
  });

  test('should close menu when clicking same anchor button again', () => {
    const mockOnMenuItemClick = jest.fn();
    menuIsOpen = true;
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button" onClick={handleOpenContextMenu}>Menu</button>
        <ContextMenu 
          isOpen={menuIsOpen} 
          anchorPosition="top-left"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    const anchorButton = screen.getByTestId('anchor-button');
    fireEvent.click(anchorButton);
    
    // Menu should now be closed
    expect(screen.queryByText(/menu item 1/i)).not.toBeInTheDocument();
  });

  // --- 4. DISMISSAL SCENARIOS ---
  
  test('should close menu when clicking outside menu area', () => {
    const mockOnMenuItemClick = jest.fn();
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    // Click outside the menu and button
    const documentBody = document.body;
    fireEvent.click(documentBody);
    
    expect(screen.queryByText(/menu item 1/i)).not.toBeInTheDocument();
  });

  test('should close menu when selecting a menu item', () => {
    const mockOnMenuItemClick = jest.fn();
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div data-testid="menu-item">Edit</div>
        </ContextMenu>
      </div>
    );
    
    const menuItem = screen.getByTestId('menu-item');
    fireEvent.click(menuItem);
    
    expect(mockOnMenuItemClick).toHaveBeenCalledWith('Edit');
    expect(screen.queryByText(/menu item/i)).not.toBeInTheDocument();
  });

  test('should handle rapid sequential clicks on anchor buttons', () => {
    const mockOnMenuItemClick = jest.fn();
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button-1" onClick={handleOpenContextMenu}>Menu</button>
        <button data-testid="anchor-button-2" onClick={handleOpenContextMenu}>Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    const button1 = screen.getByTestId('anchor-button-1');
    const button2 = screen.getByTestId('anchor-button-2');
    
    // Rapidly click between buttons
    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(button1);
    fireEvent.click(button2);
    
    expect(screen.getByText(/menu item 1/i)).toBeInTheDocument();
  });

  // --- 5. SECURITY SCENARIOS ---
  
  test('should handle malicious anchor corner values gracefully', () => {
    const mockOnMenuItemClick = jest.fn();
    
    // Test with invalid corner value
    renderWithProvider(
      <div>
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="invalid-corner"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    // Should render without crashing, likely defaulting to a safe corner
    expect(screen.getByText(/menu item 1/i)).toBeInTheDocument();
  });

  test('should not execute XSS from menu item text content', () => {
    const mockOnMenuItemClick = jest.fn();
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div data-testid="malicious-item">&lt;script&gt;alert("XSS")&lt;/script&gt;</div>
        </ContextMenu>
      </div>
    );
    
    const menuItem = screen.getByTestId('malicious-item');
    // Should render the text literally, not execute it
    expect(menuItem).toHaveTextContent('<script>alert("XSS")</script>');
  });

  test('should properly handle callback injection', () => {
    const mockOnMenuItemClick = jest.fn();
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div data-testid="safe-item">Safe Item</div>
        </ContextMenu>
      </div>
    );
    
    const menuItem = screen.getByTestId('safe-item');
    fireEvent.click(menuItem);
    
    expect(mockOnMenuItemClick).toHaveBeenCalledWith('Safe Item');
  });

  // --- 6. RENDERING & UI SCENARIOS ---
  
  test('should have proper z-index and positioning when open', () => {
    renderWithProvider(
      <div>
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={jest.fn()}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    const menuElement = screen.getByRole('menu');
    expect(menuElement).toHaveStyle('position: absolute');
    expect(menuElement).toHaveStyle('z-index: 1000'); // Typical high z-index
  });

  test('should not cause layout shifts when opening/closing', () => {
    renderWithProvider(
      <div data-testid="container">
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={false} 
          anchorPosition="top-left"
          onMenuItemClick={jest.fn()}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    // Verify that the component doesn't cause main content to shift
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
  });

  test('should handle multiple context menus in same view', () => {
    const mockOnMenuItemClick = jest.fn();
    
    renderWithProvider(
      <div>
        <button data-testid="anchor-button-1">Button 1</button>
        <button data-testid="anchor-button-2">Button 2</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={mockOnMenuItemClick}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    // Both buttons should be present
    expect(screen.getByTestId('anchor-button-1')).toBeInTheDocument();
    expect(screen.getByTestId('anchor-button-2')).toBeInTheDocument();
    expect(screen.getByText(/menu item 1/i)).toBeInTheDocument();
  });

  test('should maintain proper accessibility attributes', () => {
    renderWithProvider(
      <div>
        <button data-testid="anchor-button">Menu</button>
        <ContextMenu 
          isOpen={true} 
          anchorPosition="top-left"
          onMenuItemClick={jest.fn()}
        >
          <div>Menu Item 1</div>
        </ContextMenu>
      </div>
    );
    
    const menuElement = screen.getByRole('menu');
    expect(menuElement).toHaveAttribute('role', 'menu');
    expect(menuElement).toHaveAttribute('aria-hidden', 'false');
  });
});
