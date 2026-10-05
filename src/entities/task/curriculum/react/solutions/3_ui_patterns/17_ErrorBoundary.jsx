import React, { Component, useState } from 'react';

// Error Boundary до сих пор пишется только классом:
// у функциональных компонентов нет аналога getDerivedStateFromError
class ErrorBoundary extends Component {
  state = { error: null };

  // Render phase: переключаемся на fallback при ошибке в потомке
  static getDerivedStateFromError(error) {
    return { error };
  }

  // Commit phase: место для логирования в Sentry и аналоги
  componentDidCatch(error, info) {
    console.error('Пойманная ошибка:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          <p>Что-то пошло не так: {this.state.error.message}</p>
          <button onClick={this.reset}>Попробовать снова</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const BuggyCounter = () => {
  const [count, setCount] = useState(0);
  if (count === 3) throw new Error('Счётчик сломался на значении 3');
  return <button onClick={() => setCount((c) => c + 1)}>Кликов: {count} (упадёт на 3)</button>;
};

// Error Boundary ловит ошибки только при рендере, в методах жизненного цикла и конструкторах.
// Обработчики событий вызываются вне рендера, поэтому их ошибки обрабатывают через try/catch
// и, при необходимости, переводят в состояние.
const HandlerError = () => {
  const [message, setMessage] = useState(null);

  const handleClick = () => {
    try {
      throw new Error('Ошибка в обработчике');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Ошибка в обработчике</button>
      {message && <p>Обработано вручную: {message}</p>}
    </div>
  );
};

const App = () => (
  <div>
    <h3>Дашборд</h3>
    {/* Каждый виджет — в своей границе: падение одного не задевает остальные.
        После reset BuggyCounter монтируется заново со счётчиком 0 */}
    <ErrorBoundary>
      <BuggyCounter />
    </ErrorBoundary>
    <ErrorBoundary>
      <HandlerError />
    </ErrorBoundary>
    <p>Этот текст должен оставаться на экране</p>
  </div>
);

export default App;
