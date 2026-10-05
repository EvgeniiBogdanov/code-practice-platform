import React, { createContext, useContext, useState } from 'react';

/**
 * Задача: Составной компонент Аккордеон (Compound Components)
 *
 * Реализуйте паттерн Compound Components для компонента Accordion:
 * 1. Структура компонентов:
 *    - Accordion: корневой компонент, хранит состояние открытых секций.
 *    - Accordion.Item: контейнер конкретной секции, принимает уникальный id.
 *    - Accordion.Header: кнопка-заголовок, при клике переключает видимость своей секции.
 *    - Accordion.Body: контейнер содержимого, отображается только когда секция открыта.
 *
 * 2. Управление состоянием через Context (без prop drilling):
 *    - Дочерние компоненты (Item, Header, Body) не должны требовать ручной передачи
 *      пропсов isOpen или onToggle извне.
 *    - Вся координация осуществляется через React Context.
 *
 * 3. Режимы работы Accordion:
 *    - allowMultiple = false (по умолчанию): одновременно может быть открыта только одна секция.
 *    - allowMultiple = true: можно раскрывать произвольное количество секций.
 *    - defaultOpenId: id начально открытой секции.
 *
 * 4. Доступность (a11y):
 *    - Заголовок содержит кнопку с атрибутом aria-expanded (true / false).
 *    - Чистая семантика без inline-стилей.
 */

// Создайте контексты и компоненты здесь

export function Accordion({ children, defaultOpenId = null, allowMultiple = false }) {
  // Напишите ваш код здесь
  return <div>{children}</div>;
}

// Прикрепите подкомпоненты:
// Accordion.Item = ...
// Accordion.Header = ...
// Accordion.Body = ...

export default function CompoundAccordionDemo() {
  return (
    <div>
      <h2>Часто задаваемые вопросы</h2>
      {/* Пример использования Accordion с вложенными Item, Header, Body */}
    </div>
  );
}
