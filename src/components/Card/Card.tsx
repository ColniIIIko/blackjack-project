import React from 'react';
import { Card as CardType } from '../../types/cards';

type Props = CardType & {
  transformIndex?: number;
};

function Card({ isHidden, suit, value, transformIndex }: Props) {
  const style = { '--index': transformIndex } as React.CSSProperties;
  return (
    <img
      style={style}
      src={`/src/assets/${isHidden ? 'back.svg' : `${suit}_${value}.svg`}`}
      alt={isHidden ? 'back' : `${suit} ${value}`}
    />
  );
}

export default Card;
