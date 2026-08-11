// Жизненный цикл useEffect, useLayoutEffect и cleanup-функций
// В каком порядке выведутся логи при монтировании и обновлении состояния?

import { useState, useEffect, useLayoutEffect } from "react";

export default function App() {
  console.log("App");

  const [state, setState] = useState(0);

  useEffect(() => {
    setState((state) => state + 1);
  }, []);

  useEffect(() => {
    console.log("useEffect 1");
    return () => {
      console.log("useEffect 1 cleanup");
    };
  }, [state]);

  useEffect(() => {
    console.log("useEffect 2");
    return () => {
      console.log("useEffect 2 cleanup");
    };
  }, [state]);

  useLayoutEffect(() => {
    console.log("useLayoutEffect");
    return () => {
      console.log("useLayoutEffect cleanup");
    };
  }, [state]);

  return null;
}
