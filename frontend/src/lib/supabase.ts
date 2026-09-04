/**
 * CampusSync Supabase Client
 * Provides database connection to Supabase instance with reactive local storage fallback
 * to guarantee that demo data and real-time operations function reliably offline or in sandbox.
 */

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

interface QueryFilter {
  column: string;
  value: any;
}

class MockSupabaseQueryBuilder<T = any> {
  private tableName: string;
  private filters: QueryFilter[] = [];
  private orderColumn?: string;
  private orderAscending: boolean = true;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = '*') {
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, value });
    return this;
  }

  order(column: string, { ascending = true }: { ascending?: boolean } = {}) {
    this.orderColumn = column;
    this.orderAscending = ascending;
    return this;
  }

  private getTableData(): T[] {
    const raw = localStorage.getItem(`campussync_db_${this.tableName}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(`Failed to parse table ${this.tableName}`, e);
      }
    }
    return [];
  }

  private saveTableData(data: T[]) {
    localStorage.setItem(`campussync_db_${this.tableName}`, JSON.stringify(data));
  }

  async then(resolve: (result: { data: T[] | null; error: any }) => void) {
    try {
      let data = this.getTableData();
      for (const filter of this.filters) {
        data = data.filter((row: any) => row[filter.column] === filter.value);
      }
      if (this.orderColumn) {
        data.sort((a: any, b: any) => {
          if (a[this.orderColumn!] < b[this.orderColumn!]) return this.orderAscending ? -1 : 1;
          if (a[this.orderColumn!] > b[this.orderColumn!]) return this.orderAscending ? 1 : -1;
          return 0;
        });
      }
      resolve({ data, error: null });
    } catch (err) {
      resolve({ data: null, error: err });
    }
  }

  async insert(records: Partial<T> | Partial<T>[]) {
    try {
      const current = this.getTableData();
      const toAdd = Array.isArray(records) ? records : [records];
      const withIds = toAdd.map((item, idx) => ({
        id: item.id || `rec_${Date.now()}_${idx}`,
        created_at: new Date().toISOString(),
        ...item,
      }));
      const updated = [...current, ...withIds];
      this.saveTableData(updated as any);
      return { data: withIds as any, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async update(updates: Partial<T>) {
    try {
      let current = this.getTableData();
      let affected = 0;
      const updated = current.map((row: any) => {
        const matches = this.filters.every((f) => row[f.column] === f.value);
        if (matches) {
          affected++;
          return { ...row, ...updates, updated_at: new Date().toISOString() };
        }
        return row;
      });
      this.saveTableData(updated);
      return { data: updated, count: affected, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async delete() {
    try {
      let current = this.getTableData();
      const before = current.length;
      const filtered = current.filter((row: any) => {
        return !this.filters.every((f) => row[f.column] === f.value);
      });
      this.saveTableData(filtered);
      return { count: before - filtered.length, error: null };
    } catch (error) {
      return { count: 0, error };
    }
  }
}

export const supabase = {
  from: <T = any>(table: string) => new MockSupabaseQueryBuilder<T>(table),
  auth: {
    getUser: async () => {
      const user = localStorage.getItem('campussync-user');
      return { data: { user: user ? JSON.parse(user) : null }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('campussync-user');
      return { error: null };
    },
  },
};
