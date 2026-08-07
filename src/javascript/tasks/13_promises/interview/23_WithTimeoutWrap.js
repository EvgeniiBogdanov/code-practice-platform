/** Напишите функцию withTimeout(promise, timeoutMs), которая оборачивает
 * переданный промис и добавляет к нему ограничение по времени.
 *
 * Требования:
 * - Если promise разрешится (resolve) или отклонится (reject) раньше,
 *   чем истечёт timeoutMs миллисекунд — возвращается тот же результат
 * - Если время timeoutMs истекло раньше, чем promise завершился —
 *   возвращаемый промис должен отклониться с ошибкой new Error('TimeoutError')
 * - Функция должна корректно работать, даже если в promise передано
 *   обычное (не-промис) значение
 */
function withTimeout(promise, timeoutMs) {
  // Ваш код здесь
}

const slowPromise = new Promise((resolve) => setTimeout(() => resolve('done'), 3000));

withTimeout(slowPromise, 1000)
  .then(console.log)
  .catch((err) => console.log(err.message)); // "TimeoutError"
