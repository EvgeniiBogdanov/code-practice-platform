# Разбор задачи: «Общий шаблон API»

## 1. Что дано

Два объекта описывают API. У обоих есть строковое поле `entity` и объект `endpoints`. Каждый endpoint содержит HTTP-метод и URL. Различаются имена операций:

- у `vtemplateObject` — `getVtemplates` и `postVtemplates`;
- у `reportObject` — `getReports` и `putReports`.

## 2. Что нужно получить

- Общий шаблон, одинаковый для всех API.
- Точный набор ключей каждого объекта: `reportObject.endpoints.getReports` есть, `reportObject.endpoints.getVtemplates` — ошибка.
- `method` ограничен допустимыми HTTP-методами.
- Имена операций не повторяются вручную: они уже написаны в самом объекте.

## 3. Почему Record<string, Endpoint> слишком широк

Словарь с ключом `string` сообщает: «здесь могут быть произвольные строковые имена». Он не требует `getReports`, не обнаруживает опечатку и не отражает закрытый набор операций.

Отличие объектов удобно вынести в параметр типа `K` — объединение разрешённых имён.

## 4. Решение по шагам

### Шаг 1. Описать один endpoint

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface Endpoint {
  method: HttpMethod;
  url: string;
}
```

### Шаг 2. Шаблон с параметром набора ключей

```ts
interface ApiObject<K extends string> {
  entity: string;
  endpoints: { [P in K]: Endpoint };
}
```

`{ [P in K]: Endpoint }` — отображаемый тип: для каждого ключа из `K` создаётся обязательное поле типа `Endpoint`. Это то же самое, что `Record<K, Endpoint>`.

### Шаг 3. Не дублировать ключи — вывести их

Можно описать типы вручную: `ApiObject<"getReports" | "putReports">`. Но тогда имена операций записаны дважды — в типе и в объекте. Добавили операцию в объект и забыли тип — ошибка; переименовали — нужно править два места.

Вместо этого пусть TypeScript выведет `K` сам:

```ts
const defineApi = <K extends string>(api: ApiObject<K>): ApiObject<K> => api;
```

Когда аргумент сопоставляется с отображаемым типом `{ [P in K]: Endpoint }`, TypeScript выполняет **обратный вывод**: `K` становится объединением ключей переданного объекта endpoints, а каждое значение проверяется по `Endpoint`. Контекстный тип `Endpoint` также сохраняет литерал `"GET"` вместо расширения до `string`.

Функция ничего не делает во время выполнения — она существует только ради вывода типов. Такие функции-«идентичности» (`defineConfig`, `defineComponent`, `createSlice`) — популярный приём библиотек.

### Полный код

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface Endpoint {
  method: HttpMethod;
  url: string;
}

interface ApiObject<K extends string> {
  entity: string;
  endpoints: {
    [P in K]: Endpoint;
  };
}

const defineApi = <K extends string>(api: ApiObject<K>): ApiObject<K> => api;

const reportObject = defineApi({
  entity: "report",
  endpoints: {
    getReports: { method: "GET", url: "report" },
    putReports: { method: "PUT", url: "report" },
  },
});
```

## 5. Что проверяет компилятор

| Ситуация | Результат |
| --- | --- |
| `method: "PATCH"` | ошибка: не входит в `HttpMethod` |
| `url` отсутствует | ошибка: нет обязательного поля |
| `reportObject.endpoints.getReports` | `Endpoint` |
| `reportObject.endpoints.getVtemplates` | ошибка: нет такого ключа |

## 6. Альтернатива: satisfies

```ts
const reportObject = {
  entity: "report",
  endpoints: { ... },
} satisfies ApiObject<string>;
```

`satisfies` проверит форму и сохранит точные ключи переменной. Отличие от фабрики: у переменной не будет именованного типа `ApiObject<"getReports" | "putReports">` — у неё тип самого литерала. Если тип API нужно передавать в другие обобщённые функции, например в генератор клиента, фабрика удобнее. Оба ответа на собеседовании засчитают, если вы объясните разницу.

## 7. Частые ошибки

- Описывать каждый объект отдельным интерфейсом с повтором `method` и `url` в каждом endpoint.
- Использовать `Record<string, Endpoint>` и терять набор операций.
- Дублировать ключи в типе вручную, когда их можно вывести.
- Аннотировать переменную `const reportObject: ApiObject<string> = ...` и тем самым расширить ключи до `string`.

## 8. Что запомнить

Общая форма выносится в обобщённый тип, а различия — в параметр. Параметр не обязательно указывать вручную: TypeScript умеет выводить ключи из отображаемого типа, и функция-идентичность превращает этот вывод в удобный API.
