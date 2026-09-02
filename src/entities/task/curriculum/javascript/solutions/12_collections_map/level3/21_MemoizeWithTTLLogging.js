function memoize(fn, ttl) {
  const cache = new Map(); // ключ -> { value, timestamp }

  return function (...args) {
    const key = JSON.stringify(args);
    const now = Date.now();

    // Проверяем, есть ли валидный закэшированный результат
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (now - cached.timestamp < ttl) {
        // Кэш ещё действителен
        console.log('from cache');
        return cached.value;
      } else {
        // Кэш устарел, удаляем его
        cache.delete(key);
        console.log('key delete');
      }
    }
    
    // Выполняем исходную функцию
    const result = fn(...args);
    console.log('calculated');

    // Сохраняем результат в кэш
    cache.set(key, {
      value: result,
      timestamp: Date.now()
    });
    
    return result;
  };
}
