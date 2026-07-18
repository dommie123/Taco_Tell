import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicTable from "../../../components/common/dynamicTable/dynamicTable";

describe('DynamicTable Component Unit Tests', () => {
  
  // --- 1. BASIC FUNCTIONALITY & USER SCENARIOS ---
  
  test('should render the correct number of rows based on the input array', () => {
    const mockData = [
      { id: 1, name: 'John Doe', role: 'Admin' },
      { id: 2, name: 'Jane Smith', role: 'User' },
      { id: 3, name: 'Bob Johnson', role: 'Editor' },
    ];
    render(<DynamicTable data={mockData} />);
    
    // Verify 3 rows are rendered (excluding the header)
    const rows = screen.getAllByRole('row');
    // rows[0] is usually the header, so we expect 3 additional rows
    expect(rows.length).toBe(4); 
  });

  test('should render a "no data" message when the list is empty', () => {
    render(<DynamicTable data={[]} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('should render a "no data" message when no list is provided (null/undefined)', () => {
    render(<DynamicTable data={null} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
    
    render(<DynamicTable data={undefined} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  // --- 2. HEADER LOGIC & DATA MAPPING ---

  test('should transform keys into human-readable headers', () => {
    const mockData = [
      { employee_id: 101, full_name: 'Alice', contact_number: '555-0101' }
    ];
    render(<DynamicTable data={mockData} />);
    
    // We expect "employee_id" to become "Employee Id" or similar human-readable format
    // Note: The exact string depends on your chosen formatting logic (e.g., Title Case)
    expect(screen.getByText(/Employee Id/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Number/i)).toBeInTheDocument();
  });

  test('should handle objects with missing keys gracefully', () => {
    const mockData = [
      { id: 1, name: 'John Doe', role: 'Admin' },
      { id: 2, name: 'Jane Smith' } // Missing "role"
    ];
    render(<DynamicTable data={mockData} />);
    
    // Row 2 should still render, and the "role" cell should be empty/blank
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3); // Header + 2 rows
    expect(rows[2]).toBeInTheDocument(); 
  });

  // --- 3. SECURITY SCENARIOS ---

  test('should not execute scripts injected via data values (XSS Protection)', () => {
    const maliciousData = [
      { 
        name: '<img src=x onerror=alert("XSS")>', 
        role: 'Attacker' 
      }
    ];
    render(<DynamicTable data={maliciousData} />);
    
    // The component should render the string literally, not execute the onerror script
    expect(screen.getByText(/<img src=x onerror=alert("XSS")>/i)).toBeInTheDocument();
    // We check that no alert was triggered (jest doesn't catch browser alerts easily, 
    // but we ensure the DOM contains the literal string).
  });

  test('should not render properties from the Object prototype', () => {
    const mockData = [
      { id: 1, name: 'John' }
    ];
    // Attempting to see if the component renders "toString" or "hasOwnProperty"
    render(<DynamicTable data={mockData} />);
    
    expect(screen.queryByText(/toString/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/hasOwnProperty/i)).not.toBeInTheDocument();
  });

  // --- 4. RENDERING & UI SCENARIOS ---

  test('should not render the table structure when data is missing', () => {
    render(<DynamicTable data={[]} />);
    const table = screen.queryByRole('table');
    expect(table).not.toBeInTheDocument();
  });

  test('should maintain layout integrity with very long content in cells', () => {
    const longData = [
      { id: 1, name: 'A'.repeat(100), role: 'Very Long Role Name That Might Wrap Or Break The Layout' }
    ];
    render(<DynamicTable data={longData} />);
    
    const row = screen.getAllByRole('row')[1];
    expect(row).toBeInTheDocument();
    // Ensure the row still exists and hasn't disappeared due to overflow issues
    expect(row).toHaveStyle('overflow: hidden').orHaveStyle('word-wrap: break-word');
  });

  test('should render correctly with only one data object', () => {
    const mockData = [{ id: 1, name: 'Solo User' }];
    render(<DynamicTable data={mockData} />);
    
    expect(screen.getAllByRole('row').length).toBe(2); // Header + 1 row
    expect(screen.getByText('Solo User')).toBeInTheDocument();
  });
});
