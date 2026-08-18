import React, { useRef, forwardRef } from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * Переиспользуемый компонент выпадающего списка `Select` принимает массив опций произвольного типа данных
 * и должен пробрасывать ссылку (`ref`) на нативный элемент `<select>`.
 *
 * ПРОБЛЕМА:
 * При оборачивании компонента в `React.forwardRef` теряется обобщенный тип элементов списка:
 * аргумент колбэка `onChange` и выбранное значение сбрасываются до `any`, из-за чего теряется автокомплит значений.
 *
 * ТРЕБОВАНИЯ:
 * 1. Сохраните возможность передачи `ref` на нативный HTML-элемент `<select>`.
 * 2. Обеспечьте сохранение обобщенного типа данных для опций, чтобы значение в `onChange` строго соответствовало
 *    типу элементов переданного массива без использования `any` и без потери типобезопасности при использовании.
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
