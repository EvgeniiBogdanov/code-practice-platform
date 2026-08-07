const filterByStatusesSet = (arr, statuses) => {
  const statusSet = new Set(statuses);
  return arr.filter((app) => statusSet.has(app.status));
};
