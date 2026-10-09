// Как получить возвращаемый тип функции и тип её второго параметра?
// Объявите типы LogReturnType и LogSecondParam, не дублируя сигнатуру log.

const log = (data: string[], num: number): boolean => {
  console.log(data, num);
  return false;
};
