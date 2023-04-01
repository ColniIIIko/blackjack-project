import { useEffect, useState } from 'react';

const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = img.onabort = function () {
      reject(src);
    };
    img.src = src;
  });
};

export const useImagePreloader = (imageList: string[]) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const effect = async () => {
      const imagesPromiseList: Promise<HTMLImageElement>[] = [];
      for (const path of imageList) {
        imagesPromiseList.push(preloadImage(path));
      }

      await Promise.all(imagesPromiseList);
      setIsLoading(false);
    };

    effect();
  }, [imageList]);

  return { isLoading };
};
