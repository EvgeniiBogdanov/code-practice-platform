import React from 'react';

export default function Feed({ posts, filterCategory }) {
  //  ПРАВИЛЬНО: Вычисляем производное состояние "на лету"
  // Если массив очень большой, можно обернуть это в useMemo
  const filteredPosts = filterCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === filterCategory);

  return (
    <ul>
      {filteredPosts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}

/*
=== Разбор решения ===
Проблема: Компонент рендерится дважды. Сначала он рендерится с изменениями из filterCategory, затем срабатывает useEffect, обновляет filteredPosts, и компонент рендерится еще раз. Это классический анти-паттерн. Если данные можно вычислить из существующих пропсов или стейта во время рендера, для них не нужен отдельный useState и useEffect.

Как надо (Рефакторинг): Просто вычисляем отфильтрованные посты прямо в теле компонента.
*/
