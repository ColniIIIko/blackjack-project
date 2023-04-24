import { Winner } from '../types/general';

export const getEndGameLabel = (isEnd: boolean, isBusted: boolean, winner: Winner | null) => {
  if (!isEnd) return null;

  if (isBusted) return 'BUST';

  if (winner === 'player') return 'WIN';

  if (winner === 'draw') return 'PUSH';

  return 'LOSE';
};
