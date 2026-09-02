// Что выведет данный код в консоль и почему?

async function testError() {
  try {
    const res = await Promise.reject("Ошибка A");
    console.log("После reject:", res);
  } catch (e) {
    console.log("Поймано в catch:", e);
    return "Восстановлено";
  } finally {
    console.log("Блок finally");
  }
}

testError().then(console.log);
