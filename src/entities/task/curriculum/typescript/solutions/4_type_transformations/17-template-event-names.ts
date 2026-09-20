type EventName = "click" | "focus" | "hover";

type EventHandlerName = `on${Capitalize<EventName>}`;

const handler: EventHandlerName = "onClick";
