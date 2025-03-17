import { render, screen } from '@testing-library/react';
import App from './App';

test("renders Toronto Date, Time and Weather heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Toronto Date, Time and Weather/i);
  expect(headingElement).toBeInTheDocument();
});
