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
