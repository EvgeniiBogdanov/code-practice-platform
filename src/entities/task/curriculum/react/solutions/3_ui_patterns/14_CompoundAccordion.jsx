import React, { createContext, useContext, useState } from 'react';

const AccordionContext = createContext(null);
const AccordionItemContext = createContext(null);

export function Accordion({ children, defaultOpenId = null, allowMultiple = false }) {
  const [openIds, setOpenIds] = useState(() => {
    if (!defaultOpenId) return new Set();
    return new Set(Array.isArray(defaultOpenId) ? defaultOpenId : [defaultOpenId]);
  });

  const toggleItem = (id) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isItemOpen = (id) => openIds.has(id);

  return (
    <AccordionContext.Provider value={{ isItemOpen, toggleItem }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, children }) {
  const accordion = useContext(AccordionContext);

  if (!accordion) {
    throw new Error('Accordion.Item должен использоваться внутри Accordion');
  }

  const isOpen = accordion.isItemOpen(id);

  return (
    <AccordionItemContext.Provider value={{ id, isOpen }}>
      <div>{children}</div>
    </AccordionItemContext.Provider>
  );
}

function AccordionHeader({ children }) {
  const accordion = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);

  if (!accordion || !item) {
    throw new Error('Accordion.Header должен использоваться внутри Accordion.Item');
  }

  return (
    <h4>
      <button
        type="button"
        onClick={() => accordion.toggleItem(item.id)}
        aria-expanded={item.isOpen}
      >
        <span>{children}</span> <span>{item.isOpen ? '▲' : '▼'}</span>
      </button>
    </h4>
  );
}

function AccordionBody({ children }) {
  const item = useContext(AccordionItemContext);

  if (!item) {
    throw new Error('Accordion.Body должен использоваться внутри Accordion.Item');
  }

  if (!item.isOpen) {
    return null;
  }

  return <div>{children}</div>;
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
