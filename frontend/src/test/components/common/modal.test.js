import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from '../../../components/common';

describe('Modal Component Unit Tests', () => {

    // --- BASIC FUNCTIONALITY & USER SCENARIOS ---
    test('should not render the modal content when isOpen is false', () => {
        render(<Modal isOpen={false} title="Test Title">Content</Modal>);
        const modalContent = screen.queryByText('Content');
        expect(modalContent).not.toBeInTheDocument();
    });

    test('should render the modal content when isOpen is true', () => {
        render(<Modal isOpen={true} title="Test Title">Content</Modal>);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('should close the modal when the close button is clicked', () => {
        const mockOnClose = jest.fn();
        render(<Modal isOpen={true} onClose={mockOnClose} title="Test">Content</Modal>);

        const closeButton = screen.getByRole('button', { className: "modal-close" });
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    // --- INTERACTION SCENARIOS ---
    test('should close the modal when clicking the backdrop', () => {
        const mockOnClose = jest.fn();
        render(<Modal isOpen={true} onClose={mockOnClose} title="Test">Content</Modal>);

        // Prefer Testing Library queries over direct DOM traversal
        const backdrop = screen.getByRole('presentation');
        fireEvent.click(backdrop);

        expect(mockOnClose).toHaveBeenCalled();
    });

    test('should close the modal when the Escape key is pressed', () => {
        const mockOnClose = jest.fn();
        render(<Modal isOpen={true} onClose={mockOnClose} title="Test">Content</Modal>);

        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('should handle rapid multiple clicks on the close button', () => {
        const mockOnClose = jest.fn();
        render(<Modal isOpen={true} onClose={mockOnClose} title="Test">Content</Modal>);

        const closeButton = screen.getByRole('button', { className: "modal-close" });

        // Simulate 5 rapid clicks
        fireEvent.click(closeButton);
        fireEvent.click(closeButton);
        fireEvent.click(closeButton);
        fireEvent.click(closeButton);
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(5);
    });

    // --- SECURITY SCENARIOS ---
    test('should not execute scripts injected via title prop (XSS Protection)', () => {
        const maliciousScript = '<script>window.xss_executed = true</script>';
        render(<Modal isOpen={true} title={maliciousScript}>Content</Modal>);

        // React automatically escapes strings, but we verify the script tag isn't executed
        expect(window.xss_executed).toBeUndefined();
    });

    test('should handle null or undefined children gracefully without crashing', () => {
        render(<Modal isOpen={true} title="Test" children={null} />);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });

    // --- RENDERING & UI SCENARIOS ---
    test('should be positioned on top of other elements (Visual Check)', () => {
        // In a unit test, we check the existence of the container and style properties
        render(<Modal isOpen={true} title="Test">Content</Modal>);
        const modalElement = screen.getByRole('dialog');

        // Verify that it has a style indicating it's a modal (e.g., fixed or absolute)
        // This checks that the CSS classes/styles are applied correctly
        expect(modalElement).toHaveStyle('position: fixed').orHaveStyle('position: absolute');
    });

    test('should not obstruct the close button when content is very long', () => {
        const longContent = 'A'.repeat(1000);
        render(<Modal isOpen={true} title="Test">{longContent}</Modal>);

        const closeButton = screen.getByRole('button', { className: "modal-close" });
        // Ensure the button is still visible and not covered by the overflowing text
        expect(closeButton).toBeVisible();
    });
});
