import React from 'react';

import styles from './button.module.css';

type Props = {
  children: string;
  onClick?: () => void;
};

function Button({ children, onClick }: Props) {
  return (
    <button
      className={styles['btn']}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
