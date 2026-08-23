import { useState } from 'react';

const Subscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleChange(e) {
    // Для чекбоксов используем e.target.checked, который возвращает true или false
    setIsSubscribed(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isSubscribed}
          onChange={handleChange}
        />
        Получать новости на email
      </label>
      <p>
        Статус: {isSubscribed ? 'Вы подписаны на рассылку.' : 'Вы не подписаны на рассылку.'}
      </p>
    </>
  );
};

export default Subscription;
