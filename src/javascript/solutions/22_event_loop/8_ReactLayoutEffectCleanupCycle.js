// Порядок вывода в консоли:
// App
// useLayoutEffect
// useEffect 1
// useEffect 2
// App
// useLayoutEffect cleanup
// useLayoutEffect
// useEffect 1 cleanup
// useEffect 2 cleanup
// useEffect 1
// useEffect 2

import { useState, useEffect, useLayoutEffect } from "react";

export default function App() {
  console.log('App');

  const [state, setState] = useState(0);

  useEffect(() => {
    setState((state) => state + 1);
  }, []);

  useEffect(() => {
    console.log('useEffect 1');
    return () => {
      console.log('useEffect 1 cleanup');
    };
  }, [state]);

  useEffect(() => {
    console.log('useEffect 2');
    return () => {
      console.log('useEffect 2 cleanup');
    };
  }, [state]);

  useLayoutEffect(() => {
    console.log('useLayoutEffect');
    return () => {
      console.log('useLayoutEffect cleanup');
    };
  }, [state]);

  return null;
}
