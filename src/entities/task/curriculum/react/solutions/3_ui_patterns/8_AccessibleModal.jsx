import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'grid',
  placeItems: 'center',
};
const dialogStyle = { background: 'white', color: 'black', padding: 16, borderRadius: 8, minWidth: 280 };

const Modal = ({ isOpen, onClose, title, children }) => {
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Запоминаем, кто открыл модалку, чтобы вернуть фокус после закрытия
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      // Focus trap: зацикливаем Tab между первым и последним элементом
      const focusable = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    // Закрываем, только если кликнули ровно по фону, а не по содержимому окна
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} style={dialogStyle}>
        <h2 id={titleId}>{title}</h2>
        {children}
        <button ref={closeButtonRef} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>,
    document.body
  );
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Открыть настройки</button>
      <Modal isOpen={isOpen} onClose={close} title="Настройки">
        <label>
          Имя <input />
        </label>
        <button>Сохранить</button>
      </Modal>
    </div>
  );
};

export default App;
