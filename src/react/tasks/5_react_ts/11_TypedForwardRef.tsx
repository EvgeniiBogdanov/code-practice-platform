import React, { useRef, forwardRef } from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Компонент Select является дженериком по типу значений options (T).
// Но при обычном использовании React.forwardRef дженерик T сбрасывается до any!
//
// Требования:
// Реализуйте обертку или типизацию дженерик-компонента с forwardRef, 
// чтобы при передаче options типа { label: string; value: 'a' | 'b' } 
// onChange отдавал значение строго типа T.

type Option<T> = {
  label: string;
  value: T;
};

type SelectProps<T> = {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
};

// ❌ Стандартный forwardRef теряет параметр <T>
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
