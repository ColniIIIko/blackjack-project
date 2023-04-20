import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StartGameButton from '../components/StartGameButton/StartGameButton';

const emit = jest.fn();
jest.mock('../socket', () => ({
  socket: {
    emit: (event: string) => emit(event),
  },
}));

describe('StartGameButton', () => {
  it('renders the button with the correct text', () => {
    render(<StartGameButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('START GAME');
  });

  it('should emit player-game-start event on button click', () => {
    render(<StartGameButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(emit).toHaveBeenCalledWith('player-game-start');
  });
});
