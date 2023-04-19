import React from 'react';
import { render } from '@testing-library/react';
import { UserContext } from '../stores/UserStore/UserStore';
import PlayerInfo from '../components/Player/PlayerInfo';

const renderPlayerInfo = (
  userId: string = '1',
  playerId: string = '1',
  name: string = 'anonymous',
  insuranceBet: number | null = null
) =>
  render(
    <UserContext.Provider value={{ id: userId } as any}>
      <PlayerInfo
        id={playerId}
        name={name}
        insuranceBet={insuranceBet}
      />
    </UserContext.Provider>
  );

describe('PlayerInfo', () => {
  it('should render the name and insurance bet', () => {
    const name = 'anonymous';
    const bet = 25;
    const { getByText } = renderPlayerInfo('1', '1', name, bet);

    const playerName = getByText(name);
    expect(playerName).toBeInTheDocument();

    const insuranceBet = getByText(bet.toString());
    expect(insuranceBet).toBeInTheDocument();
  });

  it('should add the "player-me" class to the name element when the player id matches the user id', () => {
    const { getByText } = renderPlayerInfo();

    const playerName = getByText('anonymous');
    expect(playerName).toHaveClass('player-name player-me');
  });

  it('should not display the insurance bet if it is null', () => {
    const { queryByRole } = renderPlayerInfo('1', '1', 'aaa', null);

    const insuranceBet = queryByRole('img');
    expect(insuranceBet).not.toBeInTheDocument();
  });
});
