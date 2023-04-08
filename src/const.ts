import { getCardsString } from './utils/cardsStrings';

export const cardSuits = ['clubs', 'diamonds', 'hearts', 'spades'] as const;
export const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

const cardsPath = getCardsString().map((card) => new URL(`/src/assets/${card}.svg`, import.meta.url));
export const CHIP_URL = new URL('/src/assets/chip.svg', import.meta.url);
export const BACK_URL = new URL('/src/assets/back.svg', import.meta.url);
export const LOGO_URL = new URL('/src/assets/evolution.svg', import.meta.url);
export const ASSET_PATHS = [...cardsPath, CHIP_URL, BACK_URL];
