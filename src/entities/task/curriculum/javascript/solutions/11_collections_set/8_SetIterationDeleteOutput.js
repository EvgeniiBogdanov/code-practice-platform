const set = new Set([1, 2, 3, 4]);

for (const v of set) {
  console.log("iter", v);
  if (v % 2 === 0) {
    set.delete(v);
  }
}

console.log("final", [...set]);
// iter 1
// iter 2
// iter 3
// iter 4
// final [ 1, 3 ]
