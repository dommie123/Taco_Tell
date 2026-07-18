import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeTable from "../../../components/feature/employeesTable/employeesTable";

describe('EmployeeTable Component Unit Tests', () => {

  // --- 1. RENDERING & EMPTY STATE ---

  test('renders "No Data" message and "Add Employee" button when array is empty', () => {
    render(<EmployeeTable data={[]} />);
    
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add employee/i })).toBeInTheDocument();
    // Ensure table structure is NOT rendered
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('hides "Add Employee" button and "No Data" message when data is present', () => {
    const mockData = [{ id: 1, first_name: 'John', last_name: 'Doe', phone_number: '555-0101' }];
    render(<EmployeeTable data={mockData} />);
    
    expect(screen.queryByText(/no data/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add employee/i })).not.toBeInTheDocument();
  });

  // --- 2. HEADER & CONTENT LOGIC ---

  test('renders the specific required headers', () => {
    const mockData = [{ id: 1, first_name: 'John', last_name: 'Doe', phone_number: '555-0101' }];
    render(<EmployeeTable data={mockData} />);
    
    // Check for specific human-readable versions of the keys
    expect(screen.getByText(/Employee Id/i)).toBeInTheDocument();
    expect(screen.getByText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
  });

  test('renders the correct number of rows for the given data', () => {
    const mockData = [
      { id: 1, first_name: 'Alice', last_name: 'A', phone_number: '1' },
      { id: 2, first_name: 'Bob', last_name: 'B', phone_number: '2' }
    ];
    render(<EmployeeTable data={mockData} />);
    
    const rows = screen.getAllByRole('row');
    // 1 Header row + 2 Data rows = 3
    expect(rows.length).toBe(3);
  });

  // --- 3. GHOST COLUMN & CONTEXT MENU INTERACTIONS ---

  test('opens context menu when ghost column button is clicked', () => {
    const mockData = [{ id: 1, first_name: 'John', last_name: 'Doe', phone_number: '555' }];
    render(<EmployeeTable data={mockData} />);
    
    // Find the icon button (using a placeholder for the icon/button role)
    const actionButton = screen.getAllByRole('button').find(btn => btn.textContent === '' || btn.textContent === ' '); 
    // Note: Adjust the selector based on the actual icon/button structure
    fireEvent.click(actionButton);

    // Verify menu options appear
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/remove/i)).toBeInTheDocument();
  });

  test('calls remove callback with correct ID when "Remove" is clicked', () => {
    const mockData = [{ id: 99, first_name: 'John', last_name: 'Doe', phone_number: '555' }];
    const mockRemove = jest.fn();
    
    render(<EmployeeTable data={mockData} onRemove={mockRemove} />);
    
    // Open menu and click remove
    const actionButton = screen.getAllByRole('button')[1]; // Adjust index based on "Add Employee" button
    fireEvent.click(actionButton);
    
    const removeBtn = screen.getByText(/remove/i);
    fireEvent.click(removeBtn);

    expect(mockRemove).toHaveBeenCalledWith(99);
  });

  test('calls edit callback with correct ID when "Edit" is clicked', () => {
    const mockData = [{ id: 42, first_name: 'John', last_name: 'Doe', phone_number: '555' }];
    const mockEdit = jest.fn();
    
    render(<EmployeeTable data={mockData} onEdit={mockEdit} />);
    
    const actionButton = screen.getAllByRole('button')[1];
    fireEvent.click(actionButton);
    
    const editBtn = screen.getByText(/edit/i);
    fireEvent.click(editBtn);

    expect(mockEdit).toHaveBeenCalledWith(42);
  });

  // --- 4. SECURITY & EDGE CASES ---

  test('should not execute XSS injected into employee names', () => {
    const maliciousData = [{ 
      id: 1, 
      first_name: '<img src=x onerror=alert(1)>', 
      last_name: 'Hacker', 
      phone_number: '000' 
    }];
    render(<EmployeeTable data={maliciousData} />);
    
    // Verify the string is rendered but the script is not executed
    expect(screen.getByText(/<img src=x onerror=alert(1)>/i)).toBeInTheDocument();
  });

  test('handles missing data fields gracefully without crashing', () => {
    const incompleteData = [{ id: 1, first_name: 'John' }]; // Missing last_name and phone_number
    render(<EmployeeTable data={incompleteData} />);
    
    // The table should still render and not throw an error
    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
  });

  // --- 5. UI / PERFORMANCE ---

  test('ensures context menu is not visible by default', () => {
    const mockData = [{ id: 1, first_name: 'John', last_name: 'Doe', phone_number: '555' }];
    render(<EmployeeTable data={mockData} />);
    
    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/remove/i)).not.toBeInTheDocument();
  });

  test('retains layout integrity when table is very wide', () => {
    const wideData = [{ 
      id: 1, 
      first_name: 'Very Long Name That Might Overflow The Table Container', 
      last_name: 'Lastname', 
      phone_number: '1234567890' 
    }];
    render(<EmployeeTable data={wideData} />);
    
    const table = screen.getByRole('table');
    // Check for basic layout styles (to be refined based on your CSS framework)
    expect(table).toHaveStyle('table-layout: fixed').orHaveStyle('width: 100%');
  });
});
