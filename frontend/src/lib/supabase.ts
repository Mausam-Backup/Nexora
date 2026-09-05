/**
 * Nexora ERP - Unified Supabase Database Client & Resilient Fallback Engine
 * Provides direct live connectivity to Supabase PostgreSQL when credentials exist,
 * with zero-crash automatic fallback to local reactive storage and comprehensive mock datasets.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const PROD_SUPABASE_URL = 'https://nyfcwrctaijipmaqozes.supabase.co'
const PROD_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZmN3cmN0YWlqaXBtYXFvemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDgyMjcsImV4cCI6MjEwNDEyNDIyN30.xq6MMy-lHASOy_8SRz-8HniH2jp-MJuUEbrKxvRws-4'

const SUPABASE_URL = (
  import.meta.env?.VITE_SUPABASE_URL ||
  import.meta.env?.SUPABASE_URL ||
  PROD_SUPABASE_URL
).trim()

const SUPABASE_ANON_KEY = (
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  import.meta.env?.SUPABASE_ANON_KEY ||
  PROD_SUPABASE_ANON_KEY
).trim()

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('placeholder') && 
  !SUPABASE_ANON_KEY.includes('placeholder')
)

// Live Supabase client instance (connected to production Supabase)
export const rawSupabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

interface QueryFilter {
  column: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in'
  value: any
}

// Comprehensive Fallback Seed Dictionary across all institutional modules
const INITIAL_TABLE_SEEDS: Record<string, any[]> = {
  profiles: [
    // Teachers & Faculty
    {
      id: 'EMP-001',
      name: 'Prof. John Doe',
      email: 'john.doe@college.edu',
      phone: '+91 9876543230',
      role: 'teacher',
      department: 'Computer Science',
      branch: 'Computer Science',
      designation: 'Professor',
      employee_id: 'EMP-001',
      joining_date: '2018-07-15',
      qualification: 'Ph.D in Computer Science',
      experience_years: 12,
      office_room: 'CS-201',
      salary: 85000,
      status: 'active'
    },
    {
      id: 'EMP-012',
      name: 'Dr. Priya Menon',
      email: 'priya.menon@college.edu',
      phone: '+91 9876543231',
      role: 'teacher',
      department: 'Electronics & Communication',
      branch: 'Electronics & Communication',
      designation: 'Associate Professor',
      employee_id: 'EMP-012',
      joining_date: '2019-08-20',
      qualification: 'Ph.D in Electronics Engineering',
      experience_years: 8,
      office_room: 'ECE-105',
      salary: 75000,
      status: 'active'
    },
    {
      id: 'EMP-023',
      name: 'Prof. Rajesh Kumar',
      email: 'rajesh.kumar@college.edu',
      phone: '+91 9876543232',
      role: 'teacher',
      department: 'Mechanical Engineering',
      branch: 'Mechanical Engineering',
      designation: 'Professor',
      employee_id: 'EMP-023',
      joining_date: '2015-06-10',
      qualification: 'Ph.D in Mechanical Engineering',
      experience_years: 15,
      office_room: 'ME-301',
      salary: 90000,
      status: 'active'
    },
    {
      id: 'EMP-034',
      name: 'Dr. Anita Singh',
      email: 'anita.singh@college.edu',
      phone: '+91 9876543233',
      role: 'teacher',
      department: 'Civil Engineering',
      branch: 'Civil Engineering',
      designation: 'Assistant Professor',
      employee_id: 'EMP-034',
      joining_date: '2020-01-15',
      qualification: 'Ph.D in Civil Engineering',
      experience_years: 6,
      office_room: 'CE-202',
      salary: 65000,
      status: 'active'
    },
    {
      id: 'EMP-045',
      name: 'Prof. Suresh Patel',
      email: 'suresh.patel@college.edu',
      phone: '+91 9876543234',
      role: 'teacher',
      department: 'Information Technology',
      branch: 'Information Technology',
      designation: 'Associate Professor',
      employee_id: 'EMP-045',
      joining_date: '2017-09-01',
      qualification: 'M.Tech in Information Technology',
      experience_years: 10,
      office_room: 'IT-150',
      salary: 70000,
      status: 'inactive'
    },
    // Students
    {
      id: '1',
      name: 'Demo Student',
      email: 'student@college.edu',
      phone: '+91 9876543210',
      role: 'student',
      department: 'Computer Science and Engineering',
      branch: 'Computer Science and Engineering',
      semester: 6,
      roll_number: '20CS001',
      admission_year: '2021',
      gpa: 8.85,
      status: 'active'
    },
    {
      id: '2',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@college.edu',
      phone: '+91 9876543211',
      role: 'student',
      department: 'Computer Science and Engineering',
      branch: 'Computer Science and Engineering',
      semester: 6,
      roll_number: '20CS002',
      admission_year: '2021',
      gpa: 6.20,
      status: 'active'
    },
    // Administrators & CoE
    {
      id: 'admin_1',
      name: 'Dr. Vikramaditya Dean',
      email: 'admin@college.edu',
      role: 'admin',
      designation: 'Dean of Academic Affairs',
      department: 'Academic Administration',
      status: 'active'
    },
    {
      id: 'coe_1',
      name: 'Controller of Examinations',
      email: 'coe@college.edu',
      role: 'examination_controller',
      designation: 'Chief Examination Controller',
      department: 'Examination Branch',
      status: 'active'
    }
  ],

  branches: [
    { id: 'CSE', name: 'Computer Science and Engineering', code: 'CSE', duration: '4 years', total_credits: 180, semesters: 8, current_students: 420 },
    { id: 'ECE', name: 'Electronics & Communication Engineering', code: 'ECE', duration: '4 years', total_credits: 180, semesters: 8, current_students: 380 },
    { id: 'ME', name: 'Mechanical Engineering', code: 'ME', duration: '4 years', total_credits: 180, semesters: 8, current_students: 310 },
    { id: 'CE', name: 'Civil Engineering', code: 'CE', duration: '4 years', total_credits: 180, semesters: 8, current_students: 260 },
    { id: 'IT', name: 'Information Technology', code: 'IT', duration: '4 years', total_credits: 180, semesters: 8, current_students: 280 }
  ],

  courses: [
    { id: 'CS301', code: 'CS301', name: 'Database Management Systems', credits: 4, semester: 6, instructor: 'Prof. John Doe', type: 'core', category: 'Theory + Lab' },
    { id: 'CS302', code: 'CS302', name: 'Software Engineering', credits: 4, semester: 6, instructor: 'Prof. Suresh Patel', type: 'core', category: 'Theory' },
    { id: 'CS303', code: 'CS303', name: 'Computer Networks', credits: 4, semester: 6, instructor: 'Dr. Priya Menon', type: 'core', category: 'Theory + Lab' },
    { id: 'CS304', code: 'CS304', name: 'Operating Systems Architecture', credits: 4, semester: 6, instructor: 'Dr. Vikram Sharma', type: 'core', category: 'Theory + Lab' },
    { id: 'CS305', code: 'CS305', name: 'Theory of Computation', credits: 3, semester: 6, instructor: 'Prof. John Doe', type: 'core', category: 'Theory' },
    { id: 'CS306', code: 'CS306', name: 'Machine Learning Foundations', credits: 4, semester: 6, instructor: 'Prof. John Doe', type: 'elective', category: 'Elective' }
  ],

  announcements: [
    {
      id: '1',
      title: 'University Rankings Update',
      content: 'We are proud to announce that our university has moved up 5 positions in the national institutional rankings.',
      author: 'Administration',
      priority: 'high',
      category: 'General',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      attachments: []
    },
    {
      id: '2',
      title: 'New Campus Facilities Opening',
      content: 'The new sports complex and library extension will be opened next month. Student biometric access begins next week.',
      author: 'Facilities Management',
      priority: 'medium',
      category: 'Infrastructure',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      attachments: []
    },
    {
      id: '3',
      title: 'Mid-term Examination Schedule Released',
      content: 'The mid-term examination timetable for all branches has been finalized by the Office of the Controller of Examinations.',
      author: 'Academic Office',
      priority: 'high',
      category: 'Academic',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      attachments: []
    }
  ],

  campus_events: [
    {
      id: '1',
      title: 'Nexora TechHack 2026',
      description: 'Annual 36-hour inter-collegiate hackathon with over 500 participants across AI, Web3, and Systems tracks.',
      category: 'Hackathon',
      date: '2026-03-15',
      time: '09:00 AM',
      location: 'Main Auditorium & Innovation Lab',
      organizer: 'Department of Computer Science',
      capacity: 500,
      registered: 412,
      featured: true
    },
    {
      id: '2',
      title: 'Annual Cultural Festival - Zephyr 2026',
      description: '3 days of dance, music, drama, art exhibitions, and celebrity artist nights.',
      category: 'Cultural',
      date: '2026-04-02',
      time: '05:00 PM',
      location: 'University Amphitheatre',
      organizer: 'Student Affairs Council',
      capacity: 2500,
      registered: 1890,
      featured: true
    }
  ],

  exam_cycles: [
    {
      id: 'CYCLE-2024-ODD',
      name: 'Autumn End-Semester Examination 2024-25',
      academicYear: '2024-2025',
      term: 'Odd Semester',
      startDate: '2024-11-20',
      endDate: '2024-12-05',
      status: 'evaluation'
    },
    {
      id: 'CYCLE-2025-EVEN',
      name: 'Spring Mid-Semester Examination 2024-25',
      academicYear: '2024-2025',
      term: 'Even Semester',
      startDate: '2025-03-10',
      endDate: '2025-03-22',
      status: 'active'
    }
  ],

  exam_rooms: [
    { id: 'ROOM-LH101', room_number: 'LH-101', building: 'Aryabhatta Lecture Hall Complex', capacity: 40, rows_count: 8, cols_count: 5, is_active: true },
    { id: 'ROOM-LH102', room_number: 'LH-102', building: 'Aryabhatta Lecture Hall Complex', capacity: 40, rows_count: 8, cols_count: 5, is_active: true },
    { id: 'ROOM-CSLAB1', room_number: 'CS-LAB-1', building: 'Turing Computing Center', capacity: 30, rows_count: 6, cols_count: 5, is_active: true }
  ],

  exam_hall_tickets: [
    {
      id: 1,
      cycle_id: 'CYCLE-2024-ODD',
      student_id: '1',
      roll_number: '20CS001',
      is_eligible: true,
      attendance_percentage: 88.5,
      fee_cleared: true,
      qr_token: 'HT-2024-ODD-STD001-VERIFIED'
    },
    {
      id: 2,
      cycle_id: 'CYCLE-2024-ODD',
      student_id: '2',
      roll_number: '20CS002',
      is_eligible: false,
      attendance_percentage: 62.4,
      fee_cleared: true,
      debar_reason: 'Statutory attendance shortage (<75%)'
    }
  ]
}

/**
 * Resilient Query Builder with dual-mode support:
 * 1. Live Supabase database execution with automatic try-catch
 * 2. Seamless instant local storage caching & fallback
 */
export class ResilientSupabaseQueryBuilder<T = any> {
  private tableName: string
  private filters: QueryFilter[] = []
  private orderColumn?: string
  private orderAscending: boolean = true
  private limitCount?: number

  constructor(tableName: string) {
    this.tableName = tableName
  }

  select(columns: string = '*') {
    return this
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: 'eq', value })
    return this
  }

  neq(column: string, value: any) {
    this.filters.push({ column, operator: 'neq', value })
    return this
  }

  order(column: string, { ascending = true }: { ascending?: boolean } = {}) {
    this.orderColumn = column
    this.orderAscending = ascending
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  private getTableData(): T[] {
    const key = `campussync_db_${this.tableName}`
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch (e) {
        console.error(`[DB Cache] Failed to parse table ${this.tableName}`, e)
      }
    }
    // Return initial seed if available
    const seed = INITIAL_TABLE_SEEDS[this.tableName] || []
    if (seed.length > 0) {
      localStorage.setItem(key, JSON.stringify(seed))
    }
    return [...seed] as T[]
  }

  private saveTableData(data: T[]) {
    localStorage.setItem(`campussync_db_${this.tableName}`, JSON.stringify(data))
  }

  // Promise resolution support: allows await supabase.from('table').select()
  async then<TResult1 = { data: T[] | null; error: any }>(
    onfulfilled?: ((value: { data: T[] | null; error: any }) => TResult1 | PromiseLike<TResult1>) | null
  ): Promise<TResult1> {
    let result: { data: T[] | null; error: any } = { data: null, error: null }

    if (rawSupabase) {
      try {
        let query: any = rawSupabase.from(this.tableName).select('*')
        for (const f of this.filters) {
          if (f.operator === 'eq') query = query.eq(f.column, f.value)
          if (f.operator === 'neq') query = query.neq(f.column, f.value)
        }
        if (this.orderColumn) {
          query = query.order(this.orderColumn, { ascending: this.orderAscending })
        }
        if (this.limitCount) {
          query = query.limit(this.limitCount)
        }
        const res = await query
        if (!res.error && res.data && res.data.length > 0) {
          result = { data: res.data as T[], error: null }
          // Cache successful live data to local storage for offline resilience
          this.saveTableData(res.data as T[])
          return onfulfilled ? onfulfilled(result) as any : (result as any)
        }
      } catch (supabaseError) {
        console.warn(`[Supabase Fallback] Error fetching ${this.tableName}, using cached store:`, supabaseError)
      }
    }

    // Fallback: Local Cache
    try {
      let data = this.getTableData()
      for (const filter of this.filters) {
        if (filter.operator === 'eq') {
          data = data.filter((row: any) => row[filter.column] === filter.value)
        } else if (filter.operator === 'neq') {
          data = data.filter((row: any) => row[filter.column] !== filter.value)
        }
      }
      if (this.orderColumn) {
        data.sort((a: any, b: any) => {
          if (a[this.orderColumn!] < b[this.orderColumn!]) return this.orderAscending ? -1 : 1
          if (a[this.orderColumn!] > b[this.orderColumn!]) return this.orderAscending ? 1 : -1
          return 0
        })
      }
      if (this.limitCount) {
        data = data.slice(0, this.limitCount)
      }
      result = { data, error: null }
    } catch (err) {
      result = { data: this.getTableData(), error: err }
    }

    return onfulfilled ? onfulfilled(result) as any : (result as any)
  }

  async insert(records: Partial<T> | Partial<T>[]) {
    const toAdd = Array.isArray(records) ? records : [records]
    const withMetadata = toAdd.map((item: any, idx) => ({
      id: item.id || `rec_${Date.now()}_${idx}`,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...item,
    }))

    // Try live Supabase first
    if (rawSupabase) {
      try {
        const { data, error } = await rawSupabase.from(this.tableName).insert(withMetadata).select()
        if (!error && data) {
          const current = this.getTableData()
          this.saveTableData([...data, ...current] as any)
          return { data, error: null }
        }
      } catch (e) {
        console.warn(`[Supabase Insert Fallback] ${this.tableName}:`, e)
      }
    }

    // Local Storage execution
    try {
      const current = this.getTableData()
      const updated = [...withMetadata, ...current]
      this.saveTableData(updated as any)
      return { data: withMetadata as any, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  async update(updates: Partial<T>) {
    // Try live Supabase first
    if (rawSupabase && this.filters.length > 0) {
      try {
        let query: any = rawSupabase.from(this.tableName).update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        for (const f of this.filters) {
          if (f.operator === 'eq') query = query.eq(f.column, f.value)
        }
        const { data, error } = await query.select()
        if (!error) {
          // Sync local storage
          let current = this.getTableData()
          const updated = current.map((row: any) => {
            const matches = this.filters.every(f => row[f.column] === f.value)
            return matches ? { ...row, ...updates, updated_at: new Date().toISOString() } : row
          })
          this.saveTableData(updated)
          return { data, count: data?.length || 1, error: null }
        }
      } catch (e) {
        console.warn(`[Supabase Update Fallback] ${this.tableName}:`, e)
      }
    }

    // Local Storage execution
    try {
      let current = this.getTableData()
      let affected = 0
      const updated = current.map((row: any) => {
        const matches = this.filters.every((f) => row[f.column] === f.value)
        if (matches) {
          affected++
          return { ...row, ...updates, updated_at: new Date().toISOString() }
        }
        return row
      })
      this.saveTableData(updated)
      return { data: updated, count: affected, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  async delete() {
    // Try live Supabase first
    if (rawSupabase && this.filters.length > 0) {
      try {
        let query: any = rawSupabase.from(this.tableName).delete()
        for (const f of this.filters) {
          if (f.operator === 'eq') query = query.eq(f.column, f.value)
        }
        const { error } = await query
        if (!error) {
          let current = this.getTableData()
          const filtered = current.filter((row: any) => {
            return !this.filters.every(f => row[f.column] === f.value)
          })
          this.saveTableData(filtered)
          return { count: current.length - filtered.length, error: null }
        }
      } catch (e) {
        console.warn(`[Supabase Delete Fallback] ${this.tableName}:`, e)
      }
    }

    // Local Storage execution
    try {
      let current = this.getTableData()
      const before = current.length
      const filtered = current.filter((row: any) => {
        return !this.filters.every((f) => row[f.column] === f.value)
      })
      this.saveTableData(filtered)
      return { count: before - filtered.length, error: null }
    } catch (error) {
      return { count: 0, error }
    }
  }
}

/**
 * Universal Unified Supabase Client
 * Interacts with live Supabase database or graceful local store seamlessly.
 */
export const supabase = {
  from: <T = any>(table: string) => new ResilientSupabaseQueryBuilder<T>(table),
  
  auth: {
    getUser: async () => {
      if (rawSupabase) {
        try {
          const { data, error } = await rawSupabase.auth.getUser()
          if (!error && data?.user) return { data, error: null }
        } catch (e) {}
      }
      const user = localStorage.getItem('campussync-user')
      return { data: { user: user ? JSON.parse(user) : null }, error: null }
    },
    signOut: async () => {
      if (rawSupabase) {
        try {
          await rawSupabase.auth.signOut()
        } catch (e) {}
      }
      localStorage.removeItem('campussync-user')
      return { error: null }
    },
  },
}

/**
 * High-level helper: Fetch table data with fallback
 */
export async function fetchTableData<T>(table: string, defaultData: T[] = []): Promise<T[]> {
  try {
    const { data, error } = await supabase.from<T>(table).select('*')
    if (!error && data && data.length > 0) {
      return data
    }
  } catch (err) {
    console.error(`[DB Fetch Exception] ${table}:`, err)
  }
  return defaultData
}

/**
 * High-level helper: Save/Upsert single record
 */
export async function saveTableRecord<T extends { id?: string | number }>(
  table: string,
  record: T
): Promise<{ success: boolean; data?: T; error?: any }> {
  try {
    if (record.id) {
      const { data, error } = await supabase.from<T>(table).eq('id', record.id).update(record)
      if (!error) return { success: true, data: data as any }
    }
    const { data, error } = await supabase.from<T>(table).insert(record)
    return { success: !error, data: data as any, error }
  } catch (error) {
    return { success: false, error }
  }
}
