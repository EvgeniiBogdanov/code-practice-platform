import React from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * Компонент индикатора `StatusBadge` поддерживает два режима отображения:
 * - Режим счетчика: отображает число непрочитанных сообщений (`count`)
 * - Режим точки: отображает только визуальный маркер наличия событий (`dot`)
 *
 * ПРОБЛЕМА:
 * Текущий интерфейс пропсов разрешает передавать оба свойства одновременно (`count={5} dot={true}`),
 * что приводит к неоднозначности отображения и визуальным конфликтам в интерфейсе.
 *
 * ТРЕБОВАНИЯ:
 * 1. Спроектируйте тип пропсов компонента так, чтобы режимы были взаимоисключающими:
 *    при передаче `count` должно быть запрещено передавать `dot`, и наоборот.
 * 2. Обеспечьте возможность отображения пустого бейджа, если ни один из параметров не передан.
 */

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
      <StatusBadge count={5} dot={true} />
    </div>
  );
}
