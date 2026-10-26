declare module "@tanstack/history" {
  interface HistoryState {
    /**
     * Set when a theory article is opened with «Следующая статья» or «Предыдущая статья»: the reader
     * goes through the articles in order, so «back» leads to the previous article. A visit from the
     * folder page or the sidebar has no such mark, and «back» leads to the folder.
     */
    readingInOrder?: boolean;
  }
}

export {};
