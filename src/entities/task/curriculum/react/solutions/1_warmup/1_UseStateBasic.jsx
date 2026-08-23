import { useState } from 'react';

const App = () => {
  // Создаём состояние с начальным значением пустой строки
  const [text, setText] = useState('test');
  
  return <div>{text}</div>;
};

export default App;
