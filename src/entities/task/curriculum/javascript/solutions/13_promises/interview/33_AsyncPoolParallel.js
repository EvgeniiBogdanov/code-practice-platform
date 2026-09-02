const sleep = (ms, v) => () => new Promise((r) => setTimeout(() => r(v), ms));
const tasks = [sleep(50, 'a'), sleep(10, 'b'), sleep(20, 'c')];

async function asyncPool(count, tasks) {
  const results = new Array(tasks.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await tasks[currentIndex]();
    }
  };

  const workers = Array.from({ length: Math.min(count, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

asyncPool(2, tasks).then(console.log); // ['a', 'b', 'c']
