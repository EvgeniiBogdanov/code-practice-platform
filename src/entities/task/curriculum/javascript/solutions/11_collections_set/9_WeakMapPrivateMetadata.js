const visitCounts = new WeakMap();

const trackVisit = (user) => {
  const count = visitCounts.get(user) || 0;
  visitCounts.set(user, count + 1);
};

const getVisitCount = (user) => {
  return visitCounts.get(user) || 0;
};

// Пример вызова:
const user = { name: "Alice" };
trackVisit(user);
trackVisit(user);
console.log(getVisitCount(user)); // 2
