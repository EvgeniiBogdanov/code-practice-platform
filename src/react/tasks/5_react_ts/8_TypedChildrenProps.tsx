import React from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Разработчик везде использует тип any для children и не разграничивает случаи, 
// когда нужен любой рендерящийся фрагмент (ReactNode) или конкретный элемент (ReactElement).
//
// Требования:
// 1. Для компонентов-оберток Card использовать React.PropsWithChildren
// 2. Для CardHeader ограничить проп icon строго до одного валидного React-элемента (React.ReactElement)
// 3. Для CardBody использовать React.ReactNode

type CardHeaderProps = {
  title: string;
  icon: any; // ❌ Должен быть только валидный React-элемент
};

export function CardHeader({ title, icon }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon}
      <h3>{title}</h3>
    </div>
  );
}

type CardProps = {
  children: any; // ❌ Неверная типизация
};

export function Card({ children }: CardProps) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      {children}
    </div>
  );
}

export default function Demo() {
  return (
    <Card>
      <CardHeader title="Уведомления" icon={<span>🔔</span>} />
      <p>Текст карточки...</p>
    </Card>
  );
}
