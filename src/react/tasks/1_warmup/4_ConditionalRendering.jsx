// Задача:
// В текущем коде при unreadCount = 0 на экране отображается цифра "0" вместо скрытия блока.
// Исправьте условный рендеринг так, чтобы при 0 сообщений компонент ничего не рендерил.

const USERS_MESSAGES = []; // В данный момент сообщений 0

const ConditionalRendering = () => {
  const unreadCount = USERS_MESSAGES.length;

  return (
    <div>
      <h3>Ваш профиль</h3>
      {/* Ошибка: выводит 0 при unreadCount = 0 */}
      {unreadCount && <p>У вас невостребованных сообщений: {unreadCount}</p>}
    </div>
  );
};

export default ConditionalRendering;
