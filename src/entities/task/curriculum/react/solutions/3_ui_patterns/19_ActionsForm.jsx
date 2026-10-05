import React, { useActionState, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';

const postComment = (text) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (text.toLowerCase().includes('ошибка')) reject(new Error('Сервер отклонил комментарий'));
      else resolve({ id: Date.now(), text });
    }, 1000)
  );

// useFormStatus читает статус ближайшей родительской <form> — без пропсов
const SubmitButton = () => {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Отправка...' : 'Отправить'}</button>;
};

const INITIAL_STATE = { comments: [{ id: 1, text: 'Первый!' }], error: null };

const CommentForm = () => {
  // Action получает предыдущее состояние и FormData, а возвращает новое состояние.
  // isPending и error больше не нужно вести вручную
  const [state, formAction] = useActionState(async (prevState, formData) => {
    const text = String(formData.get('text') ?? '').trim();
    if (!text) return { ...prevState, error: 'Комментарий не может быть пустым' };

    // Показываем комментарий сразу. Когда action завершится, React вернёт список
    // к подтверждённому state.comments — при ошибке «откатывать» вручную ничего не нужно
    addOptimistic({ id: `temp-${crypto.randomUUID()}`, text, isSending: true });

    try {
      const comment = await postComment(text);
      return { comments: [...prevState.comments, comment], error: null };
    } catch (err) {
      return { ...prevState, error: err.message };
    }
  }, INITIAL_STATE);

  // Базовое значение — подтверждённые комментарии, поверх них — ещё не подтверждённые
  const [optimisticComments, addOptimistic] = useOptimistic(
    state.comments,
    (current, newComment) => [...current, newComment]
  );

  return (
    <div>
      <ul>
        {optimisticComments.map((c) => (
          <li key={c.id}>
            {c.text} {c.isSending && <small>(отправляется...)</small>}
          </li>
        ))}
      </ul>
      {/* После завершения action React 19 сам сбрасывает неуправляемые поля формы */}
      <form action={formAction}>
        <input name="text" />
        <SubmitButton />
      </form>
      {state.error && <p role="alert">{state.error}</p>}
    </div>
  );
};

export default CommentForm;
