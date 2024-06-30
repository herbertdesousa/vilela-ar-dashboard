export class LocalStorageDatasource {
  get(key: string): object | null {
    const dataStr = window.localStorage.getItem(key);

    if (!dataStr) return null;

    return JSON.parse(dataStr);
  }

  set(key: string, value: object) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}
