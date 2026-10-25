// Лента подгружается страницами по курсору. Пока пользователь читает, в ленте
// появляются новые посты, и соседние страницы пересекаются: один пост приходит
// дважды, во второй раз — с обновлённым текстом и счётчиком лайков.
//
// Реализуйте mergeFeedPages(pages), где страница — { items, nextCursor }:
// - возвращает одну страницу: все элементы по порядку страниц;
// - элемент с уже встречавшимся id не дублируется: он остаётся на месте
//   первого появления, но с данными из последней версии (более свежей);
// - nextCursor берётся у последней страницы (null, если страниц нет или лента закончилась);
// - входные страницы и элементы не изменяются.

export interface FeedItem {
  id: string;
}

export interface FeedPage<T extends FeedItem> {
  items: T[];
  nextCursor: string | null;
}

export function mergeFeedPages<T extends FeedItem>(pages: readonly FeedPage<T>[]): FeedPage<T> {
  return { items: [], nextCursor: null };
}
