import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Room from '@/components/Room/Room';

const onJoin = jest.fn();

const renderRoom = (playersCount: number = 1, maxPlayersCount: number = 4) =>
  render(
    <Room
      id='123456'
      playersCount={playersCount}
      maxPlayersCount={maxPlayersCount}
      onJoin={onJoin}
    />
  );

describe('Room', () => {
  it('should render room correctly', () => {
    const { getByText } = renderRoom();
    expect(getByText('room#1234')).toBeInTheDocument();
    expect(getByText('players: 1/4')).toBeInTheDocument();
  });

  it('should add "room_full" class if playersCount equals maxPlayersCount', () => {
    const { container } = renderRoom(4, 4);
    expect(container.firstChild!).toHaveClass('room_full');
  });

  it('should call onJoin callback when clicked', () => {
    const { container } = renderRoom();
    fireEvent.click(container.firstChild!);
    expect(onJoin).toHaveBeenCalledWith('123456');
  });
});
