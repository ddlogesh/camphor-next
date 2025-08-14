export default class LRUCache<T> {
  private cache: Map<number, T[]>;
  private limit: number;

  constructor(limit: number = 3) {
    this.cache = new Map();
    this.limit = limit;
  }

  set(page: number, rows: T[]): void {
    this.cache.set(page, rows);
    if (this.cache.size > this.limit) {
      const firstKey = this.cache.keys().next().value!;
      this.cache.delete(firstKey);
    }
  }

  get(page: number): T[] | null {
    if (this.cache.has(page)) {
      const val = this.cache.get(page)!;
      // refresh LRU position
      this.cache.delete(page);
      this.cache.set(page, val);
      return val;
    }
    return null;
  }

  clear(): void {
    this.cache.clear();
  }
}
