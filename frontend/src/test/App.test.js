import { render, screen } from '@testing-library/react';
import App from '../App/App';

import '@testing-library/jest-dom';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Taco Tell/i);
  expect(linkElement).toBeInTheDocument();
});
