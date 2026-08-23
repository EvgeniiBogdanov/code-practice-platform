import React from 'react';

//  РЕШЕНИЕ:
// Создаем взаимоисключающее объединение типом never
type CountMode = {
  count: number;
  dot?: never;
};

type DotMode = {
  dot: boolean;
  count?: never;
};

export type StatusBadgeProps = CountMode | DotMode;

export function StatusBadge(props: StatusBadgeProps) {
  if ('dot' in props && props.dot) {
    return <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'red' }} />;
  }

  if ('count' in props && props.count !== undefined) {
    return <span style={{ background: 'red', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{props.count}</span>;
  }

  return null;
}

export default function Demo() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <StatusBadge count={5} />
      <StatusBadge dot={true} />
    </div>
  );
}
