const safeExecutionTracer = (actionFn, cleanupFn) => {
  let status = "success";
  let value;
  let cleanupExecuted = false;

  try {
    value = actionFn();
  } catch (err) {
    status = "caught_error";
    value = err instanceof Error ? err.message : String(err);
  } finally {
    if (typeof cleanupFn === "function") {
      cleanupFn();
    }
    cleanupExecuted = true;
  }

  return {
    status,
    value,
    cleanupExecuted,
  };
};

// Пример вызова:
let cleaned = false;
console.log(
  safeExecutionTracer(
    () => 42,
    () => { cleaned = true; }
  )
);
// { status: 'success', value: 42, cleanupExecuted: true }

console.log(
  safeExecutionTracer(
    () => { throw new Error("database_timeout"); },
    () => { cleaned = true; }
  )
);
// { status: 'caught_error', value: 'database_timeout', cleanupExecuted: true }
