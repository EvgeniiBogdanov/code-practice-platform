export interface FeedItem {
  id: string;
}

export interface FeedPage<T extends FeedItem> {
  items: T[];
  nextCursor: string | null;
}

export function mergeFeedPages<T extends FeedItem>(pages: readonly FeedPage<T>[]): FeedPage<T> {
  // Map.set по существующему ключу меняет значение, но не двигает запись:
  // позиция остаётся от первого появления, данные — от последнего.
  const byId = new Map<string, T>();
  for (const page of pages) {
    for (const item of page.items) byId.set(item.id, item);
  }
  return { items: [...byId.values()], nextCursor: pages.at(-1)?.nextCursor ?? null };
}
