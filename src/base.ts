/**
 * BaseFast v2.5: Professional Atomic File System.
 * Uses Origin Private File System (OPFS) for actual file-based storage.
 */

export class BaseFast {
  private data: any[] = [];
  private filename: string | null = null;

  constructor(data: any[] = []) {
    this.data = data;
  }

  /**
   * Connect to an actual file in OPFS
   */
  static async connect(filename: string) {
    const db = new BaseFast();
    db.filename = filename;
    await db.load();
    return db;
  }

  static from(data: any[]) {
    return new BaseFast(data);
  }

  /**
   * Load JSON from OPFS file
   */
  async load() {
    if (!this.filename) return;
    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle(this.filename, { create: true });
      const file = await fileHandle.getFile();
      const text = await file.text();
      this.data = text ? JSON.parse(text) : [];
    } catch (e) {
      console.warn('BaseFast: Load failed, using empty data.', e);
      this.data = [];
    }
  }

  /**
   * Atomic Save to OPFS file
   */
  async save(newData?: any[]) {
    if (newData) this.data = newData;
    if (!this.filename) return;
    
    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle(this.filename, { create: true });
      const writable = await (fileHandle as any).createWritable();
      await writable.write(JSON.stringify(this.data));
      await writable.close();
    } catch (e) {
      console.error('BaseFast: Save failed.', e);
    }
  }

  select(fields: string | string[]) {
    if (fields === '*') return this;
    const fieldList = Array.isArray(fields) ? fields : [fields];
    this.data = this.data.map(item => {
      const newItem: any = {};
      fieldList.forEach(f => newItem[f] = item[f]);
      return newItem;
    });
    return this;
  }

  where(predicate: (item: any) => boolean) {
    this.data = this.data.filter(predicate);
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    this.data.sort((a, b) => {
      const va = a[field];
      const vb = b[field];
      if (va < vb) return direction === 'asc' ? -1 : 1;
      if (va > vb) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return this;
  }

  limit(count: number) {
    this.data = this.data.slice(0, count);
    return this;
  }

  async exec() {
    return this.data; // Already async context usually
  }

  all() {
    return this.data;
  }
}

if (typeof window !== 'undefined') {
  (window as any).BaseFast = BaseFast;
}
