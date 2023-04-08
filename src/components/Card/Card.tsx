import React, { memo } from 'react';
import { Card as CardType } from '../../types/cards';
import { ASSET_PATHS, BACK_URL } from '../../const';

type Props = CardType & {
  transformIndex?: number;
};

function Card({ isHidden, suit, value, transformIndex }: Props) {
  const style = { '--index': transformIndex } as React.CSSProperties;

  const imageUrl = isHidden ? BACK_URL : ASSET_PATHS.find((url) => url.href.includes(`${suit}_${value}`))!;

  return (
    <img
      style={style}
      src={imageUrl.href}
      alt={isHidden ? 'back' : `${suit} ${value}`}
    />
  );
}

export default memo(Card);
