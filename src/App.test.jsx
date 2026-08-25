import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './pages/Login';

test('renders Login component', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  const headingElement = screen.getByRole('heading', { name: /welcome back/i });
  expect(headingElement).toBeInTheDocument();
});
