const log = (data: string[], num: number): boolean => {
  console.log(data, num);
  return false;
};

type LogReturnType = ReturnType<typeof log>;
type LogSecondParam = Parameters<typeof log>[1];
