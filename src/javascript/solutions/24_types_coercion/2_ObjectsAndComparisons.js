console.log([] + []);       // ""
console.log([] + {});       // "[object Object]"
console.log({} + []);       // "[object Object]"
console.log(+true);         // 1
console.log(+null);         // 0
console.log(+undefined);    // NaN
console.log(+"   ");        // 0
console.log(null > 0);      // false
console.log(null == 0);     // false
console.log(null >= 0);     // true
