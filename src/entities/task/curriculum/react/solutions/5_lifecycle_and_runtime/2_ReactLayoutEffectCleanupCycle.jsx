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

// Порядок вывода (React 19, Production):
// 1. Первоначальный рендер (mount, state = 0):
//    -> App
//    -> useLayoutEffect (синхронно после мутации DOM до отрисовки)
//    -> useEffect 1 (асинхронно после paint экрана)
//    -> useEffect 2
// 2. Срабатывает setState(0 + 1) внутри первого useEffect -> рендер обновления (state = 1):
//    -> App
//    -> useLayoutEffect cleanup (очистка layout-эффекта предыдущего рендера)
//    -> useLayoutEffect (новый layout-эффект)
//    -> useEffect 1 cleanup (очистка useEffect 1)
//    -> useEffect 2 cleanup (очистка useEffect 2)
//    -> useEffect 1 (новый useEffect 1)
//    -> useEffect 2 (новый useEffect 2)
