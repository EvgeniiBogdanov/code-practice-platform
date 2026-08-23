console.log(NaN === NaN);                           // false
console.log(Object.is(NaN, NaN));                   // true
console.log(+0 === -0);                             // true
console.log(Object.is(+0, -0));                     // false
console.log(isNaN("hello"));                        // true
console.log(Number.isNaN("hello"));                 // false
console.log(0 || 42);                               // 42
console.log(0 ?? 42);                               // 0
console.log("" || "default");                       // "default"
console.log("" ?? "default");                       // ""
console.log(typeof []);                             // 'object'
console.log(Array.isArray([]));                     // true
console.log(Object.prototype.toString.call(null));   // '[object Null]'
