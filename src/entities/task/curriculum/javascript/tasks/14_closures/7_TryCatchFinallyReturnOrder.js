// Что выведет данный код в консоль и почему?

function testReturn() {
  try {
    return 1;
  } catch (e) {
    return 2;
  } finally {
    return 3;
  }
}

console.log(testReturn());
