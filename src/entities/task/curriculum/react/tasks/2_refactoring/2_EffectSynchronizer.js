// Проведите рефакторинг компонента Feed: избавьтесь от избыточного состояния и лишних рендеров.

import React, { useState, useEffect } from 'react';

export default function Feed({ posts, filterCategory }) {
  const [filteredPosts, setFilteredPosts] = useState([]);

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