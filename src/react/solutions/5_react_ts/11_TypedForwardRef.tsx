import React, { useRef, forwardRef } from 'react';

//  РЕШЕНИЕ:
export type Option<T> = {
  label: string;
  value: T;
};

export type SelectProps<T> = {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
};

// 1. Создаем внутренний компонент с параметром <T,>
function SelectInner<T extends string | number>(
  props: SelectProps<T>,
  ref: React.Ref<HTMLSelectElement>
) {
  return (
    <select
      ref={ref}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as T)}
    >
      {props.options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// 2. Оборачиваем в HOC с явным приведением сигнатуры типа дженерика
export const Select = forwardRef(SelectInner) as <T extends string | number>(
  props: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> }
) => React.ReactElement;

export default function Demo() {
  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <div>
      <Select
        ref={selectRef}
        options={[
          { label: 'Черная тема', value: 'dark' },
          { label: 'Светлая тема', value: 'light' }
        ]}
        value="dark"
        // val автовыводится строго как 'dark' | 'light' (без any)!
        onChange={(val) => console.log('Выбрана тема:', val)}
      />
    </div>
  );
}

/*
=== Разбор решения ===
Проблема: Встроенный тип `React.forwardRef` имеет ограничение в встроенных TS-дефинициях: он оборачивает компонент в фиксированный интерфейс `ForwardRefExoticComponent`, который полностью «стирает» дженерик-параметры `<T>` функции компонентов.

Как надо (React + TS):
1. Объявляем внутреннюю дженерик-функцию компонента `SelectInner<T>(...)`.
2. Используем утверждение типов сигнатуры внешнего HOC: `forwardRef(...) as <T>(props: SelectProps<T> & { ref?: React.Ref<...> }) => React.ReactElement`.
3. Это возвращает компоненту полную дженерик-мощь с поддержкой проброса `ref`.
*/
