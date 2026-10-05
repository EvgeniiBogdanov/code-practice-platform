import React, { useRef, forwardRef } from 'react';

/**
 * Собеседование: React + TypeScript (React 19)
 *
 * КОНТЕКСТ:
 * Переиспользуемый компонент выпадающего списка `Select` принимает массив опций произвольного типа
 * и должен пробрасывать ссылку (`ref`) на нативный элемент `<select>`.
 * Компонент написан во времена React 18 через `forwardRef`.
 *
 * ПРОБЛЕМА:
 * `forwardRef` стирает обобщённый тип: пропсы объявлены как `SelectProps<any>`, а значение в `onChange`
 * приводится через `as any`. Автокомплит и проверка типов значений потеряны,
 * а `e.target.value` всегда строка — даже если в опциях лежат boolean или number.
 *
 * ТРЕБОВАНИЯ:
 * 1. Сохраните передачу `ref` на нативный `<select>`, используя возможности React 19.
 * 2. Компонент должен быть generic: тип значения в `onChange` строго совпадает с типом `value` в опциях.
 * 3. Компонент работает с любыми значениями опций (строки, числа, boolean), без `any` и приведений `as`.
 */

type Option<T> = {
  label: string;
  value: T;
};

type SelectProps<T> = {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
};

export const Select = forwardRef(function Select(
  props: SelectProps<any>,
  ref: React.Ref<HTMLSelectElement>
) {
  return (
    <select
      ref={ref}
      value={String(props.value)}
      onChange={(e) => props.onChange(e.target.value as any)}
    >
      {props.options.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

export default function Demo() {
  const selectRef = useRef<HTMLSelectElement>(null);
  return (
    <Select
      ref={selectRef}
      options={[{ label: 'Да', value: true }, { label: 'Нет', value: false }]}
      value={true}
      onChange={(val) => console.log(val)}
    />
  );
}
