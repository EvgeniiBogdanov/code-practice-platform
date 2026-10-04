interface ClickEvent {
  type: "click";
  x: number;
  y: number;
}

interface KeyPressEvent {
  type: "keypress";
  key: string;
}

type AppEvent = ClickEvent | KeyPressEvent;

const handleEvent = (event: AppEvent): void => {
  if (event.type === "click") {
    console.log(event.x, event.y);
  } else if (event.type === "keypress") {
    console.log(event.key);
  }
};
