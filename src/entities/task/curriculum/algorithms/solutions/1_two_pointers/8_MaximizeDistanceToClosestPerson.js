const maxDistToClosest = (seats) => {
  // prev — индекс последнего занятого места слева от текущей позиции
  let prev = -1;
  let best = 0;

  for (let i = 0; i < seats.length; i++) {
    if (seats[i] === 1) {
      // Первое занятое место: свободный «хвост» слева, садимся в самый край (расстояние i).
      // Иначе садимся посередине между двумя занятыми местами.
      best = prev === -1 ? i : Math.max(best, Math.floor((i - prev) / 2));
      prev = i;
    }
  }

  // Свободный «хвост» справа от последнего занятого места
  return Math.max(best, seats.length - 1 - prev);
};

// Пример вызова:
console.log(maxDistToClosest([1, 0, 0, 0, 1, 0, 1])); // 2
console.log(maxDistToClosest([1, 0, 0, 0]));          // 3
console.log(maxDistToClosest([0, 1]));                // 1
