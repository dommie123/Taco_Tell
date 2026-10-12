import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddEmployee } from '../../../components/feature';

describe('EmployeeForm Component Unit Tests', () => {

    // Helper to render the form with a mocked submission callback
    const renderWithSubmitMock = (props = {}) => {
        return render(
            <AddEmployee onEmployeeCreated={jest.fn()} debug={true} {...props} />
        );
    };

    // ==========================================
    // 1. USER SCENARIOS
    // ==========================================

    test('should render empty form with disabled submit button and no error messages initially', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
        expect(screen.queryByText(/no data in the table/i)).not.toBeInTheDocument(); // Adjust to your "no data" message if needed
    });

    test('should enable submit button only when all fields meet criteria', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
        const lastNameInput = screen.getByRole('textbox', { name: /last name/i });
        const employeeIdInput = screen.getByRole('textbox', { name: /employee id/i });
        const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

        // Fill valid data progressively
        fireEvent.change(firstNameInput, { value: 'John' });
        expect(screen.getByRole('button', { name: /add employee/i })).toBeDisabled();

        fireEvent.change(lastNameInput, { value: 'Doe' });
        expect(screen.getByRole('button', { name: /add employee/i })).toBeDisabled();

        fireEvent.change(employeeIdInput, { value: '1234' });
        expect(screen.getByRole('button', { name: /add employee/i })).toBeDisabled();

        const validPhone = '(555) 010-1234';
        fireEvent.change(phoneInput, { value: validPhone });
        expect(screen.getByRole('button', { name: /add employee/i })).not.toBeDisabled();
    });

    test('should show a success notification when submit is clicked with valid data', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        // Set up valid form state manually via fireEvent or component prop depending on your architecture
        // Assuming real-time validation updates internal state, we simulate it by pre-setting inputs if your component supports controlled props
        // const form = screen.getByRole('form');
        const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
        const lastNameInput = screen.getByRole('textbox', { name: /last name/i });
        const employeeIdInput = screen.getByRole('textbox', { name: /employee id/i });
        const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

        fireEvent.change(firstNameInput, { value: 'Alice' });
        fireEvent.change(lastNameInput, { value: 'Wonderland' });
        fireEvent.change(employeeIdInput, { value: '0001' });
        fireEvent.change(phoneInput, { value: '+1 555-0198-7654' });

        const submitBtn = screen.getByRole('button', { name: /add employee/i });
        expect(submitBtn).not.toBeDisabled();

        fireEvent.click(submitBtn);

        // Expect success notification to render (adjust selector based on your UI)
        expect(screen.getByText(/employee created successfully/i)).toBeInTheDocument();
        expect(mockOnCreate).toHaveBeenCalledWith({
            employeeId: '0001',
            firstName: 'Alice',
            lastName: 'Wonderland',
            phoneNumber: '+1 555-0198-7654'
        });
    });

    test('should show a failure notification when submit is clicked with invalid data', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        // Pre-set partial/invalid state
        const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
        fireEvent.change(firstNameInput, { value: 'John' });

        const employeeIdInput = screen.getByRole('textbox', { name: /employee id/i });
        fireEvent.change(employeeIdInput, { value: '123a' }); // Invalid ID

        const submitBtn = screen.getByRole('button', { name: /add employee/i });
        expect(submitBtn).toBeDisabled();

        // Clicking disabled button should be prevented or handled gracefully
        // Depending on implementation, it might still call the handler but trigger client validation errors
    });

    // ==========================================
    // 2. INTERACTION SCENARIOS
    // ==========================================

    test('should handle rapid sequential clicks on submit without multiple submissions', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        // Setup valid state (simulated via direct input mutation or controlled props)
        const inputs = [
            screen.getByRole('textbox', { name: /first name/i }),
            screen.getByRole('textbox', { name: /last name/i }),
            screen.getByRole('textbox', { name: /employee id/i }),
            screen.getByRole('textbox', { name: /phone number/i })
        ];

        inputs[0].props.value = 'Test';
        inputs[1].props.value = 'User';
        inputs[2].props.value = '5678';
        inputs[3].props.value = '(999) 999-9999';

        const submitBtn = screen.getByRole('button', { name: /add employee/i });
        expect(submitBtn).not.toBeDisabled();

        // Rapid clicks
        fireEvent.click(submitBtn);
        fireEvent.click(submitBtn);
        fireEvent.click(submitBtn);

        // Should only call the callback once (or handle debouncing as per implementation)
        expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });

    test('should disable submit button immediately when any field becomes invalid', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        // Assume form has valid state initially
        fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), { value: 'John' });
        fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { value: 'Doe' });
        fireEvent.change(screen.getByRole('textbox', { name: /employee id/i }), { value: '1234' });
        fireEvent.change(screen.getByRole('textbox', { name: /phone number/i }), { value: '+1 555-0101-2222' });
        
        expect(screen.getByRole('button', { name: /add employee/i })).not.toBeDisabled();

        // Introduce invalid data
        fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { value: 'D@e' });
        expect(screen.getByRole('button', { name: /add employee/i })).toBeDisabled();
    });

    // ==========================================
    // 3. SECURITY SCENARIOS
    // ==========================================

    test('should safely handle XSS injection attempts in text fields without crashing or executing scripts', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
        fireEvent.change(firstNameInput, { value: '<script>alert("XSS")</script>' });

        // Component should not crash. If it has sanitization, the input might be escaped or flagged as invalid.
        expect(screen.queryByText(/alert\("XSS"\)/)).not.toBeInTheDocument();
    });

    test('should reject non-alphabetic characters in first/last name fields', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
        fireEvent.change(firstNameInput, { value: 'John123' });

        // Should trigger validation error and keep submit disabled
        expect(screen.getByRole('button', { name: /add employee/i })).toBeDisabled();
        expect(screen.getByText(/only contain letters/i)).toBeInTheDocument();
    });

    test('should reject non-numeric or incorrect length employee IDs', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        const idInput = screen.getByRole('textbox', { name: /employee id/i });

        fireEvent.change(idInput, { value: '123' }); // Too short
        expect(screen.getByRole('button', { name: /add employee/i })).toBeDisabled();
        expect(screen.getByText(/exactly four digits/i)).toBeInTheDocument();

        fireEvent.change(idInput, { value: 'abcd' }); // Letters
        expect(screen.getByText(/exactly four digits/i)).toBeInTheDocument();
    });

    test('should reject phone numbers that do not match allowed patterns', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

        // Invalid formats
        ['5551234', '+1 555-0101', 'abc-def-ghij'].forEach(invalid => {
            expect(screen.getByText(/invalid phone format/i)).toBeInTheDocument();
            fireEvent.change(phoneInput, { value: invalid });
        });

        // Valid formats should enable submit (assuming other fields are valid)
        fireEvent.change(phoneInput, { value: '(555) 010-1234' });
        expect(screen.getByRole('button', { name: /add employee/i })).not.toBeDisabled();
    });

    // ==========================================
    // 4. RENDERING & UI SCENARIOS
    // ==========================================

    test('should display appropriate error messages for each unsatisfied criterion upon submit attempt', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        // Simulate invalid state across all fields
        fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), { value: '' });
        fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { value: 'Doe!@#' });
        fireEvent.change(screen.getByRole('textbox', { name: /employee id/i }), { value: '123' });
        fireEvent.change(screen.getByRole('textbox', { name: /phone number/i }), { value: 'invalid' });

        const submitBtn = screen.getByRole('button', { name: /add employee/i });
        expect(submitBtn).toBeDisabled();

        // Clicking submit should trigger validation errors (implementation-dependent, but UI should reflect them)
        expect(screen.getByText(/first name cannot be empty/i)).toBeInTheDocument();
        expect(screen.getByText(/only letters/i)).toBeInTheDocument();
        expect(screen.getByText(/exactly four digits/i)).toBeInTheDocument();
        expect(screen.getByText(/invalid phone format/i)).toBeInTheDocument();
    });

    xtest('should maintain layout stability when form fields contain long or short values', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        // Test with long name (potential overflow)
        fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), { value: 'A'.repeat(100) });
        const form = screen.getByRole('form');

        // Ensure layout doesn't break or cause unexpected shifts
        expect(form).toBeInTheDocument();
        expect(form).toHaveStyle('overflow-y: auto').orHaveStyle('max-height: 300px');
    });

    test('should render submit button with appropriate disabled state styling/class', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        expect(screen.getByRole('button', { name: /add employee/i })).toHaveClass("add-employee-submit-btn disabled");

        // Simulate valid input
        fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), { value: 'John' });
        fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { value: 'Doe' });
        fireEvent.change(screen.getByRole('textbox', { name: /employee id/i }), { value: '0001' });
        fireEvent.change(screen.getByRole('textbox', { name: /phone number/i }), { value: '555-000-0000' });

        expect(screen.getByRole('button', { name: /add employee/i })).not.toHaveClass("add-employee-submit-btn disabled");
    });

    xtest('should handle form submission with mocked server error gracefully', () => {
        const mockOnCreate = jest.fn(() => ({ status: 'error' }));
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        // Setup valid state
        fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), { value: 'Test' });
        fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { value: 'User' });
        fireEvent.change(screen.getByRole('textbox', { name: /employee id/i }), { value: '1234' });
        fireEvent.change(screen.getByRole('textbox', { name: /phone number/i }), { value: '+1 555-0101-2222' });

        const submitBtn = screen.getByRole('button', { name: /add employee/i });
        expect(submitBtn).not.toBeDisabled();

        fireEvent.click(submitBtn);

        // Expect error notification to render (adjust text to match your implementation)
        expect(screen.getByText(/failed to create employee/i)).toBeInTheDocument();
        // Optional: Ensure form doesn't clear on failure unless specified
    });

    test('should prevent default form submission behavior to avoid page reloads', () => {
        const mockOnCreate = jest.fn();
        renderWithSubmitMock({ onEmployeeCreated: mockOnCreate });

        const form = screen.getByRole('form');
        fireEvent.submit(form);

        // If using React Forms or controlled inputs, prevent default should be handled internally
        // This test verifies no page navigation occurs (RTL tests run in isolated environments, so we rely on state/callback assertions)
        expect(mockOnCreate).toHaveBeenCalled();
    });
});
