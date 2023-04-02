import { useEffect, useState } from 'react';

export const useCountDown = (startValue: number, action: () => void) => {
  const [counter, setCounter] = useState(startValue);

  useEffect(() => {
    const id = setTimeout(() => {
      setCounter((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [counter]);

  useEffect(() => {
    if (counter === 0) {
      action();
    }
  }, [counter, action]);

  return counter;
};
