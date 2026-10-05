import React, { useState } from 'react';

export const mockToggleLikeApi = (nextLiked, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Сбой сети: сервер временно недоступен'));
      } else {
        resolve({ success: true, liked: nextLiked });
      }
    }, 800);
  });
};

export default function OptimisticLike({
  initialLikes = 42,
  initialLiked = false,
  onToggleLike = mockToggleLikeApi,
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [simulateError, setSimulateError] = useState(false);

  const handleToggleLike = async () => {
    if (isLoading) return;

    // Сохраняем снимок текущего состояния для возможного отката
    const prevLiked = isLiked;
    const prevCount = likesCount;

    const nextLiked = !prevLiked;
    const nextCount = nextLiked ? prevCount + 1 : prevCount - 1;

    // 1. Оптимистичное обновление интерфейса
    setIsLiked(nextLiked);
    setLikesCount(nextCount);
    setErrorMessage('');
    setIsLoading(true);

    try {
      // 2. Отправка сетевого запроса
      await onToggleLike(nextLiked, simulateError);
    } catch (error) {
      // 3. Откат к исходному состоянию при сбое
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      setErrorMessage(
        error instanceof Error ? error.message : 'Произошла ошибка при сохранении'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3>Пост: Архитектура современного React</h3>
      <p>
        Оптимистичный UI позволяет пользователю мгновенно видеть отклик интерфейса,
        не дожидаясь ответа сервера.
      </p>

      <div>
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLoading}
          aria-pressed={isLiked}
        >
          {isLiked ? '❤️ В избранном' : '🤍 В избранное'} ({likesCount})
          {isLoading && ' — сохранение...'}
        </button>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
          />
          Имитировать сбой сервера (для проверки отката Rollback)
        </label>
      </div>

      {errorMessage && (
        <p role="alert">
          ⚠️ {errorMessage} (состояние возвращено к исходному)
        </p>
      )}
    </div>
  );
}
