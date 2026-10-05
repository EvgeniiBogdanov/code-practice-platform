import { useRef } from 'react';

const UncontrolledForm = () => {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = inputRef.current;

    // Значение живёт в DOM: читаем его только в момент отправки
    console.log('Отправлено значение:', input.value);

    input.value = '';
    input.focus();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* defaultValue задаёт начальное значение, не превращая поле в управляемое */}
      <input ref={inputRef} name="username" defaultValue="" placeholder="Ваше имя" />
      <button type="submit">Отправить</button>
    </form>
  );
};

export default UncontrolledForm;
