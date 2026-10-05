import React, { useRef, useState } from 'react';

//  РЕШЕНИЕ:
export type Option<T> = {
  label: string;
  value: T;
};

// 1. React 19: ref — обычный проп, поэтому просто описываем его в типе пропсов
export type SelectProps<T> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ref?: React.Ref<HTMLSelectElement>;
};

// 2. Обычная generic-функция: без forwardRef тип T не стирается
export function Select<T>({ options, value, onChange, ref }: SelectProps<T>) {
  // 3. DOM умеет хранить только строки, поэтому в <option> кладём индекс,
  //    а настоящее значение берём из массива — без any и без приведений `as`
  const selectedIndex = options.findIndex((option) => option.value === value);

  return (
    <select
      ref={ref}
      value={selectedIndex}
      onChange={(e) => onChange(options[Number(e.target.value)].value)}
    >
      {options.map((option, index) => (
        <option key={option.label} value={index}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type Theme = 'dark' | 'light';

const THEME_OPTIONS: Option<Theme>[] = [
  { label: 'Тёмная тема', value: 'dark' },
  { label: 'Светлая тема', value: 'light' },
];

export default function Demo() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isSubscribed, setIsSubscribed] = useState(true);

  return (
    <div>
      {/* T = Theme: onChange={setTheme} проходит проверку, 'blue' в опциях — уже ошибка */}
      <Select ref={selectRef} options={THEME_OPTIONS} value={theme} onChange={setTheme} />

      {/* T = boolean: значение приходит именно boolean, а не строка "true" */}
      <Select
        options={[
          { label: 'Да', value: true },
          { label: 'Нет', value: false },
        ]}
        value={isSubscribed}
        onChange={setIsSubscribed}
      />
    </div>
  );
}
