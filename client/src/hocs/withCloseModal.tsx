import { useCallback } from 'react';

import styles from './withCloseModal.module.css';
import { CLOSE_URL } from '../const';

type withCloseModalProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

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
    );
  };

  return ModalWithClose;
};
