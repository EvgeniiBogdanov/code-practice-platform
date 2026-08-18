import React from 'react';

//  РЕШЕНИЕ:
// 1. Используем дженерик E для типа элемента (по умолчанию 'button')
type ButtonOwnProps<E extends React.ElementType = 'button'> = {
  as?: E;
  children: React.ReactNode;
};

// 2. Объединяем собственные пропсы с нативными атрибутами элемента E через ComponentPropsWithoutRef,
// исключая (Omit) совпадающие имена собственных пропсов
type ButtonProps<E extends React.ElementType = 'button'> = ButtonOwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>;

export function Button<E extends React.ElementType = 'button'>({
  as,
  children,
  ...rest
}: ButtonProps<E>) {
  const Component = as || 'button';
  return <Component {...rest}>{children}</Component>;
}

export default function Demo() {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button as="a" href="https://google.com" target="_blank">
        Перейти по ссылке (a)
      </Button>
      <Button as="button" onClick={() => alert('Клик по кнопке')}>
        Обычная кнопка (button)
      </Button>
    </div>
  );
}
