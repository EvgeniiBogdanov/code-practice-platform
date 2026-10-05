import { useState } from 'react';

const App = () => {
  // useState возвращает пару: текущее значение и функцию для его изменения
  const [text, setText] = useState('test');
  
  return <div>{text}</div>;
};

export default App;
