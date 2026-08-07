import React from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Компонент StatusBadge должен уметь работать в двух режимах:
// Режим A: с числовым числом уведомлений (count: number)
// Режим B: с точкой-индикатором (dot: true)
// 
// Сейчас тип допускает одновременный проброс и count, и dot, что приводит к багам отрисовки.
// 
// Требования:
// Сформируйте взаимоисключающий тип пропсов StatusBadgeProps, чтобы нельзя было одновременно
// передать count и dot.

type StatusBadgeProps = {
  count?: number;
  dot?: boolean;
};

export function StatusBadge({ count, dot }: StatusBadgeProps) {
  if (dot) return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'red' }} />;
  if (count !== undefined) return <span style={{ background: 'red', color: 'white', padding: '2px 6px', borderRadius: 10 }}>{count}</span>;
  return null;
}

export default function Demo() {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {/* ❌ TypeScript не должен разрешать передавать оба пропса одновременно! */}
      <StatusBadge count={5} dot={true} />
    </div>
  );
}
