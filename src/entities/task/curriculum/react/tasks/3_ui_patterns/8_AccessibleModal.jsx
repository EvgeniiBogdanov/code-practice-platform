import React, { useState } from 'react';

/**
 * Задача: Доступное модальное окно
 *
 * Требования:
 * 1. Компонент Modal({ isOpen, onClose, title, children }) рендерится через createPortal в document.body.
 * 2. Закрытие:
 *    - по клавише Escape;
 *    - по клику на затемнённый фон (overlay), но НЕ по клику внутри окна;
 *    - по кнопке «Закрыть».
 * 3. Фокус:
 *    - при открытии фокус переходит внутрь модалки (на кнопку «Закрыть»);
 *    - Tab и Shift+Tab не выпускают фокус за пределы модалки (focus trap);
 *    - после закрытия фокус возвращается на кнопку, которая открыла модалку.
 * 4. Разметка: role="dialog", aria-modal="true", aria-labelledby на заголовок.
 * 5. Все подписки на события снимаются при закрытии.
 */

const Modal = ({ isOpen, onClose, title, children }) => {
  // Напишите ваш код здесь
  return null;
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Открыть настройки</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Настройки">
        <label>
          Имя <input />
        </label>
        <button>Сохранить</button>
      </Modal>
    </div>
  );
};

export default App;
