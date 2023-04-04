import { useEffect, useState } from 'react';

export const useCountDown = (startValue: number, action: () => void) => {
  const [counter, setCounter] = useState(startValue);

  useEffect(() => {
    let id: number;
    if (counter > 0) {
      id = window.setTimeout(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(id);
  }, [counter]);

  useEffect(() => {
    if (counter === 0) {
      action();
    }
  }, [counter, action]);

  return counter;
};
