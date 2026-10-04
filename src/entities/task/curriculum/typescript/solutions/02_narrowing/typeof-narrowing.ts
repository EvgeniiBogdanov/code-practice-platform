const formatId = (id: string | number): string => {
  if (typeof id === "string") {
    return id.toUpperCase();
  }
  return id.toFixed(2);
};
