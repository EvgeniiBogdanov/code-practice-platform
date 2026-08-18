import React from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * В дизайн-системе создается полиморфный компонент `Button`, который визуально
 * оформлен как кнопка, но должен уметь рендериться как обычная `<button>`, так и как ссылка `<a>`
 * (или другой переданный HTML-элемент) при указании соответствующего пропа `as`.
 *
 * ПРОБЛЕМА:
 * Текущие типы захардкожены под фиксированный набор свойств. При попытке отрендерить ссылку
 * (`as="a"`) и передать атрибуты ссылки (`href`, `target`) TypeScript выдает ошибку компиляции.
 * Ручное перечисление атрибутов в интерфейсе громоздко и ненадежно.
 *
 * ТРЕБОВАНИЯ:
 * 1. Компонент должен динамически рендерить указанный в `as` HTML-тег (по умолчанию `<button>`).
 * 2. Обеспечьте автоматическую поддержку всех стандартных HTML-атрибутов для выбранного тега:
 *    при `as="a"` должны быть доступны свойства ссылки (`href`, `target`), а при `as="button"` — свойства кнопки (`type`, `disabled`).
 * 3. Исключите коллизии между собственными пропсами компонента и нативными атрибутами элемента.
 */

type ButtonProps = {
  as?: 'button' | 'a';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export function Button({ as = 'button', children, ...rest }: ButtonProps) {
  const Component = as;
  return <Component {...rest}>{children}</Component>;
}

export default function Demo() {
  return (
    <div>
      <Button as="a" href="https://google.com" target="_blank">
        Ссылка
      </Button>
      <Button as="button" onClick={() => alert('Clicked')}>
        Кнопка
      </Button>
    </div>
  );
}
