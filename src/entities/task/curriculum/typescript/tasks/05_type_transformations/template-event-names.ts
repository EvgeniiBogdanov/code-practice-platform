// Опишите тип для названий обработчиков событий вида "on" + название события
// с большой буквы, например: onClick, onFocus, onHover —
// на основе списка исходных названий событий. Назовите тип EventHandlerName.

type EventName = "click" | "focus" | "hover";

// EventHandlerName должен принимать только "onClick" | "onFocus" | "onHover"
