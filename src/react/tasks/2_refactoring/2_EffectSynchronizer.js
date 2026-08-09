// В чем подвох: Разработчик использует useEffect, чтобы следить за изменением пропсов или другого стейта, 
// и обновляет на их основе третий стейт. Это приводит к лишним перерисовкам (waterfall renders).

import React, { useState, useEffect } from 'react';

export default function Feed({ posts, filterCategory }) {
  const [filteredPosts, setFilteredPosts] = useState([]);

  // ❌ ОШИБКА: Избыточный useEffect и стейт
  useEffect(() => {
    if (filterCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => post.category === filterCategory);
      setFilteredPosts(filtered);
    }
  }, [posts, filterCategory]);

  return (
    <ul>
      {filteredPosts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}