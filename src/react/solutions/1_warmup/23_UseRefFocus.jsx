import { useRef } from "react";

const FocusInput = () => {
  const inputRef = useRef(null);

  const handleFocus = () => {
    // Проверяем, что элемент существует, прежде чем вызывать метод
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Введите текст..." />
      <button onClick={handleFocus}>Сделать фокус</button>
    </div>
  );
};

export default FocusInput;
