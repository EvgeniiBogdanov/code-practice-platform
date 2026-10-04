// Опишите типы для событий разных видов так, чтобы TypeScript
// мог сужать тип внутри обработчика в зависимости от вида события.

const handleEvent = (event) => {
  if (event.type === "click") {
    console.log(event.x, event.y);
  } else if (event.type === "keypress") {
    console.log(event.key);
  }
};
