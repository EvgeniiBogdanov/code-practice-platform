const USERS_MESSAGES = [];

const ConditionalRendering = () => {
  const unreadCount = USERS_MESSAGES.length;

  return (
    <div>
      <h3>Ваш профиль</h3>
      {/* Исправление: явное сравнение > 0 предотвращает вывод числа 0 */}
      {unreadCount > 0 && <p>У вас невостребованных сообщений: {unreadCount}</p>}
    </div>
  );
};

export default ConditionalRendering;
