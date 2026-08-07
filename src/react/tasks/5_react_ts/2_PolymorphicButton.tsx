import React from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Компонент Button должен уметь менять свой HTML-тег с помощью пропа as 
// (например as="a" или as="button") и принимать все нативные атрибуты соответствующего HTML-элемента.
// Сейчас все типы жестко завязаны на HTMLButtonElement, что вызывает ошибки TypeScript 
// при попытке передать href или target.

type ButtonProps = {
  as?: 'button' | 'a';
  children: React.ReactNode;
  // ❌ Нативные атрибуты прописаны вручную неполно или с ошибками
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
      {/* Должно работать без ошибок TS */}
      <Button as="a" href="https://google.com" target="_blank">
        Ссылка
      </Button>
      <Button as="button" onClick={() => alert('Clicked')}>
        Кнопка
      </Button>
    </div>
  );
}
