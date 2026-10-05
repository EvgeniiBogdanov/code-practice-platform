import React, { createContext, useContext, useId, useState } from 'react';

const AccordionContext = createContext(null);
const AccordionItemContext = createContext(null);

// Хуки доступа: одна проверка вместо копий в каждом подкомпоненте
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Компоненты Accordion.* должны использоваться внутри <Accordion>');
  return context;
};

const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error('Accordion.Header и Accordion.Body должны быть внутри <Accordion.Item>');
  return context;
};

export function Accordion({ children, defaultOpenId = null, allowMultiple = false }) {
  const [openIds, setOpenIds] = useState(() => {
    if (!defaultOpenId) return new Set();
    return new Set(Array.isArray(defaultOpenId) ? defaultOpenId : [defaultOpenId]);
  });

  const toggleItem = (id) => {
    setOpenIds((prev) => {
      // single-режим: открываем только выбранную секцию, multiple — сохраняем остальные
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <AccordionContext value={{ isItemOpen: (id) => openIds.has(id), toggleItem }}>
      <div>{children}</div>
    </AccordionContext>
  );
}

function AccordionItem({ id, children }) {
  const { isItemOpen } = useAccordion();
  // Пара id связывает кнопку заголовка и панель для скринридеров
  const baseId = useId();

  const item = {
    id,
    isOpen: isItemOpen(id),
    headerId: `${baseId}-header`,
    panelId: `${baseId}-panel`,
  };

  return (
    <AccordionItemContext value={item}>
      <div>{children}</div>
    </AccordionItemContext>
  );
}

function AccordionHeader({ children }) {
  const { toggleItem } = useAccordion();
  const { id, isOpen, headerId, panelId } = useAccordionItem();

  return (
    <h4>
      <button
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => toggleItem(id)}
      >
        <span>{children}</span> <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
      </button>
    </h4>
  );
}

function AccordionBody({ children }) {
  const { isOpen, headerId, panelId } = useAccordionItem();

  if (!isOpen) return null;

  return (
    <div id={panelId} role="region" aria-labelledby={headerId}>
      {children}
    </div>
  );
}

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

export default function CompoundAccordionDemo() {
  const [allowMultiple, setAllowMultiple] = useState(false);

  return (
    <div>
      <h2>Часто задаваемые вопросы (FAQ)</h2>

      <div>
        <label>
          <input
            type="checkbox"
            checked={allowMultiple}
            onChange={(e) => setAllowMultiple(e.target.checked)}
          />
          Разрешить открытие нескольких секций одновременно (allowMultiple)
        </label>
      </div>

      {/* key сбрасывает аккордеон при смене режима: в single-режиме не может быть открыто несколько секций */}
      <Accordion key={String(allowMultiple)} defaultOpenId="1" allowMultiple={allowMultiple}>
        <Accordion.Item id="1">
          <Accordion.Header>Что такое Compound Components?</Accordion.Header>
          <Accordion.Body>
            <p>
              Compound Components (составные компоненты) — это паттерн проектирования React,
              при котором набор компонентов работает совместно, разделяя общее неявное состояние
              через React-контекст без ручного проброса пропсов (prop drilling).
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item id="2">
          <Accordion.Header>В чем преимущество перед монолитным компонентом?</Accordion.Header>
          <Accordion.Body>
            <p>
              Гибкость верстки: потребитель библиотеки может свободно менять разметку,
              оборачивать секции в кастомные контейнеры и вставлять промежуточные элементы,
              не нарушая логику работы виджета.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item id="3">
          <Accordion.Header>Где применяется этот паттерн?</Accordion.Header>
          <Accordion.Body>
            <p>
              В современных библиотеках компонентов: Radix UI, Headless UI, Reach UI,
              а также во внутренних UI-китах большинства бигтех-компаний.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
