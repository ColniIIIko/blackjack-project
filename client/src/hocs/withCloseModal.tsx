import { createContext, useCallback } from 'react';

import { CLOSE_URL } from '@/const';

import styles from './withCloseModal.module.css';

type withCloseModalProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ModalContext = createContext<null | React.Dispatch<React.SetStateAction<boolean>>>(null);

export const withCloseModal = <P extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>>(
  Modal: React.ComponentType<P>
) => {
  const ModalWithClose: React.FC<P & withCloseModalProps> = ({ setIsOpen, onClick, children, ...props }) => {
    const onClose = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsOpen(false);
        if (onClick) {
          onClick(e);
        }
      },
      [onClick, setIsOpen]
    );

    return (
      <ModalContext.Provider value={setIsOpen}>
        <Modal
          {...(props as unknown as P)}
          onClick={onClose}
        >
          <div
            className={styles['close-btn']}
            onClick={() => setIsOpen(false)}
          >
            <img
              className={styles['close-ico']}
              src={CLOSE_URL.href}
              alt='close'
            />
          </div>
          {children}
        </Modal>
      </ModalContext.Provider>
    );
  };

  return ModalWithClose;
};
