export interface IStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export class LocalStorageStorage implements IStorage {
  public get(key: string) { 
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key); 
  }
  public set(key: string, val: string) { 
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, val); 
  }
  public remove(key: string) { 
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key); 
  }
}
