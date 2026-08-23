import { useRef } from "react";

const UncontrolledForm = () => {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (inputRef.current) {
      // 1. Читаем текущее значение напрямую из DOM
      console.log("Отправлено значение:", inputRef.current.value);
      
      // 2. Очищаем значение
      inputRef.current.value = "";
      
      // 3. Возвращаем фокус
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Ваше имя" />
      <button onClick={handleSubmit}>Отправить</button>
    </div>
  );
};

export default UncontrolledForm;
