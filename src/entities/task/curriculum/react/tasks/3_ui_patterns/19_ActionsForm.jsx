import React, { useState } from 'react';

/**
 * Задача: Форма комментария на Actions (React 19)
 *
 * Сейчас форма вручную управляет isPending, error и списком. Перепишите её на API React 19.
 *
 * Требования:
 * 1. Отправка через <form action={...}> и useActionState: состояние формы (список комментариев
 *    и ошибка) возвращается из action, без ручных useState для isPending и error.
 * 2. Новый комментарий появляется в списке сразу (useOptimistic) с пометкой «отправляется...».
 *    Если сервер вернул ошибку, оптимистичный комментарий исчезает, а под формой выводится ошибка.
 * 3. Кнопка отправки — отдельный компонент SubmitButton, который узнаёт о статусе через useFormStatus
 *    и блокируется во время отправки.
 * 4. Пустой комментарий не отправляется.
 */

// Имитация сервера: отвечает через 1 с, на текст с «ошибка» возвращает ошибку
const postComment = (text) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (text.toLowerCase().includes('ошибка')) reject(new Error('Сервер отклонил комментарий'));
      else resolve({ id: Date.now(), text });
    }, 1000)
  );

const CommentForm = () => {
  const [comments, setComments] = useState([{ id: 1, text: 'Первый!' }]);
  const [text, setText] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    try {
      const comment = await postComment(text);
      setComments((prev) => [...prev, comment]);
      setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>{c.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button disabled={isPending}>{isPending ? 'Отправка...' : 'Отправить'}</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CommentForm;
