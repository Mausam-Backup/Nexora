-- ==============================================================================
-- CAMPUS SYNC - COMPLETE MASTER SUPABASE SCHEMA & MOCK DATA SEED SCRIPT
-- ==============================================================================
-- This script contains the 100% comprehensive schema and data extraction for
-- ALL hardcoded mock data across every module in CampusSync:
--   1. Profiles (Students, Teachers, Admins, Alumni, Guardians)
--   2. Academic Structure (Branches, Departments, Semesters, Settings)
--   3. Subjects & Course Catalog (Core, Electives, Online, Extracurriculars)
--   4. Subject Allocation & Teacher Assignments
--   5. Course Enrollments & Progress
--   6. Attendance (Teacher Subjects, Slots, Student Attendance Records)
--   7. Student & Teacher Billing, Payroll, Pay Structures & Invoices
--   8. Timetables (Student & Teacher Weekly Slot Schedules)
--   9. Exams, Exam Slots & Detailed Marks / SGPA / CGPA
--  10. Assignments, Submissions & Tasks (with Subtasks)
--  11. Academic Progress & Achievements (Dean's list, Honors)
--  12. ID Cards (Student, Teacher, Admin Digital IDs & QR data)
--  13. Campus Announcements (Admin, Student, Faculty)
--  14. Campus Events & Seminars
--  15. Community Study Groups & Threaded Chat Messages
--  16. Personal Notes & Study Reference Links
--  17. Personal Finance / Expense Transactions
--  18. Blog Posts & Articles
--  19. Student Wellness (Fitness Workouts, Meditation, Motivation, Audio Tracks)
--  20. Admin Dashboard Activities & System Statistics
-- ==============================================================================

-- 0. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing tables in reverse dependency order
DROP TABLE IF EXISTS exam_revaluations CASCADE;
DROP TABLE IF EXISTS exam_malpractices CASCADE;
DROP TABLE IF EXISTS exam_hall_tickets CASCADE;
DROP TABLE IF EXISTS exam_invigilators CASCADE;
DROP TABLE IF EXISTS exam_seating_arrangements CASCADE;
DROP TABLE IF EXISTS exam_rooms CASCADE;
DROP TABLE IF EXISTS exam_cycles CASCADE;
DROP TABLE IF EXISTS admin_recent_activities CASCADE;
DROP TABLE IF EXISTS audio_tracks CASCADE;
DROP TABLE IF EXISTS motivation_items CASCADE;
DROP TABLE IF EXISTS meditation_sessions CASCADE;
DROP TABLE IF EXISTS fitness_workouts CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;
DROP TABLE IF EXISTS academic_semester_progress CASCADE;
DROP TABLE IF EXISTS digital_id_cards CASCADE;
DROP TABLE IF EXISTS academic_settings CASCADE;
DROP TABLE IF EXISTS teacher_subject_allocations CASCADE;
DROP TABLE IF EXISTS course_plans CASCADE;
DROP TABLE IF EXISTS transaction_records CASCADE;
DROP TABLE IF EXISTS personal_notes CASCADE;
DROP TABLE IF EXISTS personal_subtasks CASCADE;
DROP TABLE IF EXISTS personal_tasks CASCADE;
DROP TABLE IF EXISTS community_messages CASCADE;
DROP TABLE IF EXISTS community_groups CASCADE;
DROP TABLE IF EXISTS campus_events CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS student_marks CASCADE;
DROP TABLE IF EXISTS exam_slots CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS semesters CASCADE;
DROP TABLE IF EXISTS teacher_timetables CASCADE;
DROP TABLE IF EXISTS student_timetables CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS teacher_bills CASCADE;
DROP TABLE IF EXISTS student_bills CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS subject_slots CASCADE;
DROP TABLE IF EXISTS teacher_subjects CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==============================================================================
-- 1. USERS & PROFILES
-- ==============================================================================
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin', 'parent', 'examination_controller')),
    college_name VARCHAR(255) DEFAULT 'CampusSync University',
    department VARCHAR(100),
    branch VARCHAR(100),
    semester INTEGER,
    roll_number VARCHAR(50),
    employee_id VARCHAR(50),
    admission_year VARCHAR(50),
    joining_date DATE,
    designation VARCHAR(100),
    qualification VARCHAR(255),
    experience_years INTEGER,
    office_room VARCHAR(50),
    salary NUMERIC(12, 2),
    gpa NUMERIC(4, 2),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
    address TEXT,
    parent_name VARCHAR(255),
    parent_phone VARCHAR(50),
    date_of_birth DATE,
    session VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. ACADEMIC STRUCTURE & BRANCHES
-- ==============================================================================
CREATE TABLE branches (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    duration VARCHAR(50) DEFAULT '4 years',
    total_credits INTEGER DEFAULT 180,
    semesters INTEGER DEFAULT 8,
    capacity INTEGER DEFAULT 400,
    current_students INTEGER DEFAULT 320,
    core_subjects_count INTEGER DEFAULT 28,
    elective_subjects_count INTEGER DEFAULT 12,
    general_subjects_count INTEGER DEFAULT 8,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE academic_settings (
    id SERIAL PRIMARY KEY,
    min_credits_per_semester INTEGER DEFAULT 18,
    max_credits_per_semester INTEGER DEFAULT 26,
    min_credits_for_graduation INTEGER DEFAULT 180,
    min_attendance INTEGER DEFAULT 75,
    passing_grade INTEGER DEFAULT 50,
    gpa_scale INTEGER DEFAULT 10,
    max_subjects_per_teacher INTEGER DEFAULT 4,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. COURSES & CURRICULUM
-- ==============================================================================
CREATE TABLE courses (
    id VARCHAR(100) PRIMARY KEY,
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE SET NULL,
    semester INTEGER,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    credits INTEGER DEFAULT 4,
    description TEXT,
    instructor VARCHAR(255),
    schedule VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(50) DEFAULT 'core' CHECK (type IN ('core', 'elective', 'online', 'extracurricular')),
    category VARCHAR(100),
    difficulty VARCHAR(50) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    duration VARCHAR(100),
    provider VARCHAR(100),
    rating NUMERIC(3, 2),
    enrolled INTEGER DEFAULT 0,
    max_seats INTEGER DEFAULT 60,
    prerequisites TEXT[],
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_enrollments (
    id SERIAL PRIMARY KEY,
    student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    grade VARCHAR(50) DEFAULT 'In Progress',
    UNIQUE(student_id, course_id)
);

CREATE TABLE teacher_subject_allocations (
    id SERIAL PRIMARY KEY,
    teacher_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    enrolled_students INTEGER DEFAULT 45,
    max_capacity INTEGER DEFAULT 60,
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_plans (
    id VARCHAR(100) PRIMARY KEY,
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    total_credits INTEGER DEFAULT 20,
    enrolled_students INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. ATTENDANCE & SCHEDULE SLOTS
-- ==============================================================================
CREATE TABLE teacher_subjects (
    id VARCHAR(100) PRIMARY KEY,
    teacher_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    semester INTEGER NOT NULL,
    branch VARCHAR(100) NOT NULL,
    total_classes INTEGER DEFAULT 45,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subject_slots (
    id VARCHAR(100) PRIMARY KEY,
    subject_id VARCHAR(100) REFERENCES teacher_subjects(id) ON DELETE CASCADE,
    day VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type VARCHAR(50) DEFAULT 'lecture' CHECK (type IN ('lecture', 'lab', 'tutorial')),
    room VARCHAR(50)
);

CREATE TABLE attendance_records (
    id VARCHAR(100) PRIMARY KEY,
    student_id TEXT,
    student_name VARCHAR(255),
    subject_id VARCHAR(100) REFERENCES teacher_subjects(id) ON DELETE CASCADE,
    subject_name VARCHAR(255),
    date DATE NOT NULL,
    slot VARCHAR(100),
    status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    marked_by VARCHAR(255) DEFAULT 'Faculty',
    marked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. BILLING, PAYROLL & FEES
-- ==============================================================================
CREATE TABLE student_bills (
    id VARCHAR(100) PRIMARY KEY,
    student_id TEXT,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'tuition',
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
    due_date DATE NOT NULL,
    payment_date DATE,
    receipt_no VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teacher_bills (
    id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    teacher_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'salary',
    amount NUMERIC(12, 2) NOT NULL,
    base_pay NUMERIC(12, 2),
    allowances NUMERIC(12, 2),
    deductions NUMERIC(12, 2),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('paid', 'pending')),
    due_date DATE NOT NULL,
    payment_date DATE,
    receipt_no VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. TIMETABLES (WEEKLY SCHEDULE)
-- ==============================================================================
CREATE TABLE student_timetables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50) NOT NULL,
    day INTEGER NOT NULL CHECK (day BETWEEN 0 AND 5), -- 0: MON, 5: SAT
    location VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'Theory',
    code VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teacher_timetables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    students_batch VARCHAR(255) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50) NOT NULL,
    day INTEGER NOT NULL CHECK (day BETWEEN 0 AND 5),
    location VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'Theory',
    code VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. EXAMS, EXAM SLOTS & ACADEMIC MARKS
-- ==============================================================================
CREATE TABLE semesters (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    exam_types TEXT[] DEFAULT ARRAY['midterm', 'endterm', 'sessional', 'practical'],
    branches TEXT[] DEFAULT ARRAY['CSE', 'ECE', 'ME', 'CE']
);

CREATE TABLE exam_cycles (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    term VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    marks_submission_deadline TIMESTAMPTZ NOT NULL,
    results_publish_date TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'evaluation', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_rooms (
    id VARCHAR(100) PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    building VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 40,
    rows_count INTEGER NOT NULL DEFAULT 8,
    cols_count INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exams (
    id VARCHAR(100) PRIMARY KEY,
    cycle_id VARCHAR(100) REFERENCES exam_cycles(id) ON DELETE SET NULL,
    course VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    semester INTEGER NOT NULL,
    branch VARCHAR(50) NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    location VARCHAR(100) NOT NULL,
    max_marks INTEGER DEFAULT 100,
    instructor VARCHAR(255),
    instructor_id VARCHAR(100),
    topics TEXT[],
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_slots (
    id VARCHAR(100) PRIMARY KEY,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    capacity INTEGER DEFAULT 120,
    is_available BOOLEAN DEFAULT TRUE,
    exam_id VARCHAR(100) REFERENCES exams(id) ON DELETE SET NULL
);

CREATE TABLE exam_seating_arrangements (
    id SERIAL PRIMARY KEY,
    exam_id VARCHAR(100) REFERENCES exams(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    room_id VARCHAR(100) REFERENCES exam_rooms(id) ON DELETE CASCADE,
    seat_code VARCHAR(50) NOT NULL,
    bench_number INTEGER NOT NULL,
    attended_status VARCHAR(50) DEFAULT 'present' CHECK (attended_status IN ('present', 'absent', 'malpractice')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

CREATE TABLE exam_invigilators (
    id SERIAL PRIMARY KEY,
    exam_id VARCHAR(100) REFERENCES exams(id) ON DELETE CASCADE,
    teacher_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    room_id VARCHAR(100) REFERENCES exam_rooms(id) ON DELETE CASCADE,
    reporting_time TIME NOT NULL,
    duty_status VARCHAR(50) DEFAULT 'assigned' CHECK (duty_status IN ('assigned', 'confirmed', 'swapped', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_hall_tickets (
    id SERIAL PRIMARY KEY,
    cycle_id VARCHAR(100) REFERENCES exam_cycles(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    is_eligible BOOLEAN DEFAULT TRUE,
    debar_reason TEXT,
    attendance_percentage NUMERIC(5,2) DEFAULT 85.00,
    fee_cleared BOOLEAN DEFAULT TRUE,
    qr_token TEXT,
    downloaded_at TIMESTAMPTZ,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cycle_id, student_id)
);

CREATE TABLE exam_malpractices (
    id SERIAL PRIMARY KEY,
    exam_id VARCHAR(100) REFERENCES exams(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    reported_by TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    incident_description TEXT NOT NULL,
    evidence_attachment TEXT,
    status VARCHAR(50) DEFAULT 'under_investigation' CHECK (status IN ('under_investigation', 'penalized', 'exonerated')),
    verdict TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_revaluations (
    id SERIAL PRIMARY KEY,
    student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    course_code VARCHAR(50) NOT NULL,
    original_marks NUMERIC(5, 2) NOT NULL,
    revised_marks NUMERIC(5, 2),
    assigned_evaluator_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'rejected')),
    remarks TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE student_marks (
    id SERIAL PRIMARY KEY,
    student_id TEXT,
    student_name VARCHAR(255) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits INTEGER DEFAULT 4,
    internal_marks NUMERIC(5, 2) NOT NULL,
    external_marks NUMERIC(5, 2) NOT NULL,
    total_marks NUMERIC(5, 2) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    grade_point NUMERIC(4, 2) NOT NULL,
    slot_id VARCHAR(100),
    is_published BOOLEAN DEFAULT FALSE,
    moderation_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. ACADEMIC PROGRESS & ACHIEVEMENTS
-- ==============================================================================
CREATE TABLE academic_semester_progress (
    id SERIAL PRIMARY KEY,
    student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    sgpa NUMERIC(4, 2) NOT NULL,
    credits INTEGER DEFAULT 20,
    status VARCHAR(50) DEFAULT 'Completed'
);

CREATE TABLE student_achievements (
    id SERIAL PRIMARY KEY,
    student_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. ASSIGNMENTS
-- ==============================================================================
CREATE TABLE assignments (
    id VARCHAR(100) PRIMARY KEY,
    slot_id VARCHAR(100),
    course VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('pending', 'submitted', 'overdue', 'published', 'draft')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    type VARCHAR(50) DEFAULT 'assignment',
    submission_type VARCHAR(100) DEFAULT 'PDF Report',
    max_points INTEGER DEFAULT 100,
    progress INTEGER DEFAULT 0,
    grade VARCHAR(50),
    feedback TEXT,
    submissions_count INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 25,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. DIGITAL ID CARDS
-- ==============================================================================
CREATE TABLE digital_id_cards (
    id SERIAL PRIMARY KEY,
    profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    card_type VARCHAR(50) NOT NULL CHECK (card_type IN ('student', 'teacher', 'admin')),
    section VARCHAR(50),
    roll_number VARCHAR(50),
    employee_id VARCHAR(50),
    admission_year VARCHAR(50),
    valid_until VARCHAR(50),
    blood_group VARCHAR(50),
    emergency_contact VARCHAR(50),
    hostel_block VARCHAR(50),
    room_number VARCHAR(50),
    library_id VARCHAR(50),
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date VARCHAR(50),
    office_room VARCHAR(50),
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. ANNOUNCEMENTS
-- ==============================================================================
CREATE TABLE announcements (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    category VARCHAR(100) DEFAULT 'General',
    target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'teachers', 'admin')),
    date TIMESTAMPTZ DEFAULT NOW(),
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 12. CAMPUS EVENTS
-- ==============================================================================
CREATE TABLE campus_events (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    attendees INTEGER DEFAULT 0,
    max_attendees INTEGER DEFAULT 100,
    is_registered BOOLEAN DEFAULT FALSE,
    type VARCHAR(100) NOT NULL,
    is_past BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 13. COMMUNITY GROUPS & MESSAGES
-- ==============================================================================
CREATE TABLE community_groups (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    members_count INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT TRUE,
    semester VARCHAR(50) DEFAULT 'All',
    description TEXT,
    link VARCHAR(255),
    last_message TEXT,
    last_message_time VARCHAR(50),
    created_at DATE DEFAULT CURRENT_DATE,
    icon_url TEXT,
    target_audience VARCHAR(50) DEFAULT 'student',
    created_by VARCHAR(50) DEFAULT 'admin'
);

CREATE TABLE community_messages (
    id VARCHAR(100) PRIMARY KEY,
    group_id VARCHAR(100) REFERENCES community_groups(id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'text',
    sender VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    time VARCHAR(50) NOT NULL,
    avatar VARCHAR(50),
    read_count INTEGER DEFAULT 0,
    total_members INTEGER DEFAULT 24,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 14. PERSONAL TASKS & SUBTASKS
-- ==============================================================================
CREATE TABLE personal_tasks (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(50) DEFAULT 'assignment' CHECK (category IN ('assignment', 'exam', 'project', 'study', 'personal', 'extracurricular')),
    subject VARCHAR(100),
    due_date TIMESTAMPTZ,
    estimated_time INTEGER, -- minutes
    actual_time INTEGER,
    notes TEXT,
    tags TEXT[],
    is_starred BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE personal_subtasks (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES personal_tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

-- ==============================================================================
-- 15. NOTES & STUDY MATERIALS
-- ==============================================================================
CREATE TABLE personal_notes (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[],
    favorite BOOLEAN DEFAULT FALSE,
    priority VARCHAR(50) DEFAULT 'medium',
    color VARCHAR(50) DEFAULT '#dbeafe',
    font_size INTEGER DEFAULT 16,
    word_count INTEGER DEFAULT 0,
    study_materials JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 16. EXPENSES & TRANSACTIONS
-- ==============================================================================
CREATE TABLE transaction_records (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
    date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 17. BLOG POSTS
-- ==============================================================================
CREATE TABLE blog_posts (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_avatar TEXT,
    author_role VARCHAR(100) NOT NULL,
    published_at DATE NOT NULL,
    read_time INTEGER DEFAULT 5,
    category VARCHAR(100) NOT NULL,
    tags TEXT[],
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 18. STUDENT WELLNESS & FOCUS TOOLS
-- ==============================================================================
CREATE TABLE fitness_workouts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL, -- minutes
    calories INTEGER NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    exercises TEXT[] NOT NULL,
    color VARCHAR(100)
);

CREATE TABLE meditation_sessions (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    video_id VARCHAR(100),
    instructions TEXT[],
    benefits TEXT[] NOT NULL,
    tags TEXT[] NOT NULL,
    color VARCHAR(100)
);

CREATE TABLE motivation_items (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    video_id VARCHAR(100),
    quote TEXT,
    author VARCHAR(255),
    story TEXT,
    tags TEXT[] NOT NULL,
    color VARCHAR(100)
);

CREATE TABLE audio_tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    favorite BOOLEAN DEFAULT FALSE
);

CREATE TABLE admin_recent_activities (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    time_label VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 19. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subject_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_semester_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE motivation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_recent_activities ENABLE ROW LEVEL SECURITY;

-- Grant wide access policies for smooth front-end linking
DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public access %I" ON %I;', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public access %I" ON %I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
    END LOOP;
END $$;


-- ==============================================================================
-- 20. POPULATE HARDCODED MOCK DATA (COMPLETE SEED SCRIPT)
-- ==============================================================================

-- 20.1 PROFILES
INSERT INTO profiles (id, name, email, phone, role, department, branch, semester, roll_number, employee_id, admission_year, joining_date, designation, qualification, experience_years, office_room, salary, gpa, status, address, parent_name, parent_phone)
VALUES
-- Students
('20CS001', 'Aarav Sharma', 'aarav.sharma@college.edu', '+91 9876543210', 'student', 'Computer Science', 'Computer Science', 6, '20CS001', NULL, '2020', NULL, NULL, NULL, NULL, NULL, NULL, 8.50, 'active', '123 Main Street, New Delhi, India', 'Rajesh Sharma', '+91 9876543211'),
('20CS014', 'Neha Patel', 'neha@college.edu', '+91 9876543212', 'student', 'Computer Science', 'Computer Science', 6, '20CS014', NULL, '2020', NULL, NULL, NULL, NULL, NULL, NULL, 9.10, 'active', '456 Park Avenue, Mumbai, India', 'Amit Patel', '+91 9876543213'),
('20EC014', 'Neha Patel', 'neha.patel@college.edu', '+91 9876543212', 'student', 'Electronics & Communication', 'Electronics & Communication', 4, '20EC014', NULL, '2020', NULL, NULL, NULL, NULL, NULL, NULL, 9.10, 'active', '456 Park Avenue, Mumbai, India', 'Amit Patel', '+91 9876543213'),
('20ME023', 'Rahul Gupta', 'rahul.gupta@college.edu', '+91 9876543214', 'student', 'Mechanical Engineering', 'Mechanical Engineering', 8, '20ME023', NULL, '2020', NULL, NULL, NULL, NULL, NULL, NULL, 7.80, 'active', '789 Tech Hub, Bangalore, India', 'Suresh Gupta', '+91 9876543215'),
('21CS045', 'Priya Singh', 'priya.singh@college.edu', '+91 9876543216', 'student', 'Computer Science', 'Computer Science', 4, '21CS045', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 8.90, 'active', '321 Innovation Drive, Pune, India', 'Vikash Singh', '+91 9876543217'),
('21IT067', 'Arjun Kumar', 'arjun.kumar@college.edu', '+91 9876543218', 'student', 'Information Technology', 'Information Technology', 2, '21IT067', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 6.50, 'inactive', '654 Silicon Valley, Chennai, India', 'Manoj Kumar', '+91 9876543219'),
('20CE089', 'Sneha Reddy', 'sneha.reddy@college.edu', '+91 9876543220', 'student', 'Civil Engineering', 'Civil Engineering', 6, '20CE089', NULL, '2020', NULL, NULL, NULL, NULL, NULL, NULL, 8.20, 'active', '987 Construction Lane, Hyderabad, India', 'Ravi Reddy', '+91 9876543221'),
('CS-001', 'Arjun Patel', 'arjun.patel@student.edu', '+91 9876543210', 'student', 'Computer Science', 'Computer Science', 6, 'CS21001', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 8.50, 'active', '123 Tech Street, Mumbai', 'Rajesh Patel', '+91 9876543211'),
('CS-P001', 'Ravi Sharma', 'ravi.sharma@alumni.edu', '+91 9876543220', 'student', 'Computer Science', 'Computer Science', 8, 'CS20001', NULL, '2020', NULL, NULL, NULL, NULL, NULL, NULL, 9.10, 'graduated', '456 Alumni Lane, Delhi', 'Suresh Sharma', '+91 9876543221'),
('std1', 'Alice Johnson', 'alice@university.edu', '+91 9876543201', 'student', 'Computer Science', 'Computer Science Engineering', 3, 'CS21001', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 8.70, 'active', 'Campus Hostel 1', 'Mark Johnson', '+91 9876543202'),
('std2', 'Bob Smith', 'bob@university.edu', '+91 9876543203', 'student', 'Computer Science', 'Computer Science Engineering', 3, 'CS21002', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 8.10, 'active', 'Campus Hostel 2', 'Adam Smith', '+91 9876543204'),
('std3', 'Carol Davis', 'carol@university.edu', '+91 9876543205', 'student', 'Computer Science', 'Computer Science Engineering', 3, 'CS21003', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 9.00, 'active', 'Campus Hostel 1', 'Brian Davis', '+91 9876543206'),
('std4', 'David Wilson', 'david@university.edu', '+91 9876543207', 'student', 'Computer Science', 'Computer Science Engineering', 3, 'CS21004', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 7.90, 'active', 'Campus Hostel 3', 'Carl Wilson', '+91 9876543208'),
('std5', 'Eva Brown', 'eva@university.edu', '+91 9876543209', 'student', 'Computer Science', 'Computer Science Engineering', 3, 'CS21005', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 8.40, 'active', 'Campus Hostel 2', 'Daniel Brown', '+91 9876543210'),
('std6', 'Frank Miller', 'frank@university.edu', '+91 9876543211', 'student', 'Computer Science', 'Computer Science Engineering', 3, 'CS21006', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 8.30, 'active', 'Campus Hostel 3', 'Frank Miller Sr.', '+91 9876543212'),
('std7', 'Grace Lee', 'grace@university.edu', '+91 9876543213', 'student', 'Computer Science', 'Computer Science Engineering', 4, 'CS20001', NULL, '2020', NULL, NULL, NULL, NULL, NULL, NULL, 9.30, 'active', 'Campus Hostel 1', 'George Lee', '+91 9876543214'),
('std8', 'Henry Taylor', 'henry@university.edu', '+91 9876543215', 'student', 'Computer Science', 'Computer Science Engineering', 4, 'CS20002', NULL, '2020', NULL, NULL, NULL, NULL, NULL, NULL, 8.00, 'active', 'Campus Hostel 2', 'Harold Taylor', '+91 9876543216'),
('1', 'Demo User', 'demo@university.edu', '+91 9999999999', 'student', 'Computer Science', 'Computer Science Engineering', 6, 'CS21001', NULL, '2021', NULL, NULL, NULL, NULL, NULL, NULL, 8.65, 'active', 'Campus Hostel 3, Room 402', 'Guardian User', '+91 9999999998'),

-- Teachers
('EMP-001', 'Prof. John Doe', 'john.doe@college.edu', '+91 9876543230', 'teacher', 'Computer Science', NULL, NULL, NULL, 'EMP-001', NULL, '2018-07-15', 'Professor', 'Ph.D in Computer Science', 12, 'CS-201', 85000, NULL, 'active', 'Staff Quarters Block A', NULL, NULL),
('EMP-012', 'Dr. Priya Menon', 'priya.menon@college.edu', '+91 9876543231', 'teacher', 'Electronics & Communication', NULL, NULL, NULL, 'EMP-012', NULL, '2019-08-20', 'Associate Professor', 'Ph.D in Electronics Engineering', 8, 'ECE-105', 75000, NULL, 'active', 'Staff Quarters Block B', NULL, NULL),
('EMP-023', 'Prof. Rajesh Kumar', 'rajesh.kumar@college.edu', '+91 9876543232', 'teacher', 'Mechanical Engineering', NULL, NULL, NULL, 'EMP-023', NULL, '2015-06-10', 'Professor', 'Ph.D in Mechanical Engineering', 15, 'ME-301', 90000, NULL, 'active', 'Staff Quarters Block A', NULL, NULL),
('EMP-034', 'Dr. Anita Singh', 'anita.singh@college.edu', '+91 9876543233', 'teacher', 'Civil Engineering', NULL, NULL, NULL, 'EMP-034', NULL, '2020-01-15', 'Assistant Professor', 'Ph.D in Civil Engineering', 6, 'CE-202', 65000, NULL, 'active', 'Staff Quarters Block C', NULL, NULL),
('EMP-045', 'Prof. Suresh Patel', 'suresh.patel@college.edu', '+91 9876543234', 'teacher', 'Information Technology', NULL, NULL, NULL, 'EMP-045', NULL, '2017-09-01', 'Associate Professor', 'M.Tech in Information Technology', 10, 'IT-150', 70000, NULL, 'inactive', 'Staff Quarters Block B', NULL, NULL),
('T001', 'Dr. Sarah Johnson', 'sarah.johnson@college.edu', '+91 9876543250', 'teacher', 'Computer Science', NULL, NULL, NULL, 'EMP001', NULL, '2015-08-01', 'Professor', 'Ph.D Computer Science', 10, 'CS-101', 85000, NULL, 'active', 'Staff Quarters Block A-1', NULL, NULL),
('T002', 'Prof. Michael Brown', 'michael.brown@college.edu', '+91 9876543251', 'teacher', 'Electronics & Communication', NULL, NULL, NULL, 'EMP002', NULL, '2017-07-15', 'Associate Professor', 'M.Tech Electronics', 8, 'EC-201', 72000, NULL, 'active', 'Staff Quarters Block B-4', NULL, NULL),
('T003', 'Dr. Emily Davis', 'emily.davis@college.edu', '+91 9876543252', 'teacher', 'Mechanical Engineering', NULL, NULL, NULL, 'EMP003', NULL, '2019-01-10', 'Assistant Professor', 'Ph.D Mechanical', 5, 'ME-102', 78000, NULL, 'active', 'Staff Quarters Block C-2', NULL, NULL),
('T004', 'Prof. Robert Wilson', 'robert.wilson@college.edu', '+91 9876543253', 'teacher', 'Mathematics', NULL, NULL, NULL, 'EMP004', NULL, '2010-06-01', 'Professor', 'Ph.D Mathematics', 15, 'MA-105', 92000, NULL, 'active', 'Staff Quarters Block A-3', NULL, NULL),
('T005', 'Dr. Lisa Anderson', 'lisa.anderson@college.edu', '+91 9876543254', 'teacher', 'Physics', NULL, NULL, NULL, 'EMP005', NULL, '2018-09-15', 'Associate Professor', 'Ph.D Physics', 7, 'PH-202', 74000, NULL, 'active', 'Staff Quarters Block B-1', NULL, NULL),

-- Admins
('admin_001', 'Campus Admin', 'admin@campussync.edu', '+91 9876543999', 'admin', 'Administration', NULL, NULL, NULL, 'ADM-001', NULL, '2010-01-01', 'Chief Administrator', 'M.B.A', 15, 'ADM-101', 120000, NULL, 'active', 'Admin Block, Campus Sync', NULL, NULL),

-- Examination Controller
('coe_001', 'Dr. K. R. Ramanathan', 'coe@campussync.edu', '+91 98450 11223', 'examination_controller', 'Office of the Controller of Examinations', NULL, NULL, NULL, 'COE-001', NULL, '2012-05-10', 'Controller of Examinations', 'Ph.D in Computer Science & Engineering', 22, 'ADM-108', 135000, NULL, 'active', 'Admin Block, Campus Sync', NULL, NULL)
ON CONFLICT (id) DO NOTHING;


-- 20.2 BRANCHES & SETTINGS
INSERT INTO branches (id, name, code, description, duration, total_credits, semesters, capacity, current_students, core_subjects_count, elective_subjects_count, general_subjects_count, status)
VALUES
('cse', 'Computer Science and Engineering', 'CSE', 'Learn programming, algorithms, software development, and computer systems', '4 years', 180, 8, 400, 320, 28, 12, 8, 'Active'),
('ece', 'Electrical and Computer Engineering', 'ECE', 'Electronics, signal processing, and embedded systems', '4 years', 180, 8, 350, 280, 26, 14, 8, 'Active'),
('me', 'Mechanical Engineering', 'ME', 'Design, manufacturing, and thermal systems', '4 years', 180, 8, 300, 240, 25, 12, 8, 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO academic_settings (min_credits_per_semester, max_credits_per_semester, min_credits_for_graduation, min_attendance, passing_grade, gpa_scale, max_subjects_per_teacher)
VALUES (18, 26, 180, 75, 50, 10, 4);


-- 20.3 COURSES
INSERT INTO courses (id, branch_id, semester, name, code, credits, description, instructor, schedule, location, type, difficulty, duration, provider, rating, enrolled, max_seats, prerequisites, status)
VALUES
-- CSE Semester 1
('cse-101', 'cse', 1, 'Programming Fundamentals', 'CSE101', 4, 'Introduction to programming concepts using C/C++', 'Dr. Sarah Johnson', 'Mon, Wed, Fri 9:00 AM - 10:00 AM', 'CS Building Room 101', 'core', 'Beginner', NULL, NULL, NULL, 45, 60, NULL, 'Active'),
('math-101', 'cse', 1, 'Engineering Mathematics I', 'MATH101', 4, 'Calculus, differential equations, and linear algebra', 'Prof. Michael Chen', 'Tue, Thu 10:00 AM - 11:30 AM', 'Math Building Room 205', 'core', 'Intermediate', NULL, NULL, NULL, 52, 60, NULL, 'Active'),
('phy-101', 'cse', 1, 'Physics for Engineers', 'PHY101', 3, 'Mechanics, thermodynamics, and electromagnetism', 'Dr. Emily Rodriguez', 'Mon, Wed 2:00 PM - 3:30 PM', 'Physics Lab 301', 'core', 'Intermediate', NULL, NULL, NULL, 38, 50, NULL, 'Active'),
('eng-101', 'cse', 1, 'Technical Communication', 'ENG101', 2, 'Written and oral communication skills for engineers', 'Prof. David Wilson', 'Fri 1:00 PM - 3:00 PM', 'Liberal Arts 102', 'core', 'Beginner', NULL, NULL, NULL, 40, 50, NULL, 'Active'),

-- CSE Semester 2
('cse-102', 'cse', 2, 'Object Oriented Programming', 'CSE102', 4, 'Object-oriented programming concepts using Java', 'Dr. Lisa Park', 'Mon, Wed, Fri 10:00 AM - 11:00 AM', 'CS Building Room 102', 'core', 'Intermediate', NULL, NULL, NULL, 42, 55, ARRAY['CSE101'], 'Active'),
('cse-103', 'cse', 2, 'Data Structures', 'CSE103', 4, 'Arrays, linked lists, stacks, queues, trees, and graphs', 'Prof. Kevin Zhang', 'Tue, Thu 11:00 AM - 12:30 PM', 'CS Building Room 201', 'core', 'Intermediate', NULL, NULL, NULL, 38, 50, ARRAY['CSE101'], 'Active'),
('math-102', 'cse', 2, 'Engineering Mathematics II', 'MATH102', 4, 'Advanced calculus and numerical methods', 'Dr. Robert Kim', 'Mon, Wed 1:00 PM - 2:30 PM', 'Math Building Room 210', 'core', 'Advanced', NULL, NULL, NULL, 35, 45, ARRAY['MATH101'], 'Active'),

-- CSE Semester 3
('cse-201', 'cse', 3, 'Database Management Systems', 'CSE201', 4, 'Database design, SQL, and database administration', 'Dr. Maria Gonzalez', 'Mon, Wed, Fri 9:00 AM - 10:00 AM', 'CS Building Room 301', 'core', 'Intermediate', NULL, NULL, NULL, 33, 40, ARRAY['CSE103'], 'Active'),
('cse-202', 'cse', 3, 'Computer Networks', 'CSE202', 3, 'Network protocols, architecture, and security', 'Prof. James Liu', 'Tue, Thu 2:00 PM - 3:30 PM', 'CS Building Room 302', 'core', 'Advanced', NULL, NULL, NULL, 28, 35, ARRAY['CSE102'], 'Active'),

-- ECE Semester 1
('ece-101', 'ece', 1, 'Circuit Analysis', 'ECE101', 4, 'Basic electrical circuits and analysis techniques', 'Dr. Jennifer Adams', 'Mon, Wed, Fri 8:00 AM - 9:00 AM', 'ECE Building Room 101', 'core', 'Beginner', NULL, NULL, NULL, 35, 45, NULL, 'Active'),
('ece-102', 'ece', 1, 'Digital Logic Design', 'ECE102', 3, 'Boolean algebra, logic gates, and digital circuits', 'Prof. Thomas Brown', 'Tue, Thu 10:00 AM - 11:30 AM', 'ECE Building Room 201', 'core', 'Intermediate', NULL, NULL, NULL, 40, 50, NULL, 'Active'),

-- ME Semester 1
('me-101', 'me', 1, 'Engineering Graphics', 'ME101', 3, 'Technical drawing and CAD fundamentals', 'Prof. Sandra Lee', 'Mon, Wed 1:00 PM - 3:00 PM', 'ME Building Room 101', 'core', 'Beginner', NULL, NULL, NULL, 30, 40, NULL, 'Active'),

-- Online Courses
('online-1', NULL, NULL, 'Full Stack Web Development', 'WEB001', 0, 'Complete web development bootcamp covering HTML, CSS, JavaScript, React, and Node.js', 'Coursera Instructors', 'Self-paced', 'Online', 'online', 'Intermediate', '12 weeks', 'Coursera', 4.80, 15420, 99999, NULL, 'Active'),
('online-2', NULL, NULL, 'Machine Learning Specialization', 'ML001', 0, 'Comprehensive machine learning course covering algorithms, neural networks, and deep learning', 'Andrew Ng', 'Self-paced', 'Online', 'online', 'Advanced', '16 weeks', 'Coursera', 4.90, 25300, 99999, NULL, 'Active'),
('online-3', NULL, NULL, 'Data Science with Python', 'DS001', 0, 'Learn data analysis, visualization, and machine learning with Python', 'Udemy Instructors', 'Self-paced', 'Online', 'online', 'Intermediate', '10 weeks', 'Udemy', 4.70, 8200, 99999, NULL, 'Active'),
('online-4', NULL, NULL, 'Digital Marketing Fundamentals', 'DM001', 0, 'SEO, social media marketing, and digital advertising strategies', 'Google Experts', 'Self-paced', 'Online', 'online', 'Beginner', '8 weeks', 'Google Academy', 4.60, 12500, 99999, NULL, 'Active'),

-- Extracurricular Courses
('extra-1', NULL, NULL, 'Photography Club Workshop', 'PHOTO001', 0, 'Learn photography basics, composition, and digital editing', 'Club Mentors', 'Saturdays 2:00 PM - 4:00 PM', 'Art Building Studio 1', 'extracurricular', 'Beginner', '6 weeks', NULL, NULL, 25, 30, NULL, 'Active'),
('extra-2', NULL, NULL, 'Entrepreneurship Bootcamp', 'ENT001', 0, 'Business planning, pitch development, and startup fundamentals', 'Industry Experts', 'Fridays 6:00 PM - 8:00 PM', 'Business Center Room 301', 'extracurricular', 'Intermediate', '8 weeks', NULL, NULL, 18, 25, NULL, 'Active'),
('extra-3', NULL, NULL, 'Robotics Team Training', 'ROB001', 0, 'Robot design, programming, and competition preparation', 'Dr. Alex Kumar', 'Weekends 10:00 AM - 2:00 PM', 'Engineering Lab 401', 'extracurricular', 'Advanced', '12 weeks', NULL, NULL, 15, 20, NULL, 'Active'),
('extra-4', NULL, NULL, 'Public Speaking Mastery', 'SPEAK001', 0, 'Develop confidence and skills in public speaking and presentation', 'Communication Experts', 'Sundays 3:00 PM - 5:00 PM', 'Auditorium 2', 'extracurricular', 'Beginner', '4 weeks', NULL, NULL, 20, 30, NULL, 'Active')
ON CONFLICT (id) DO NOTHING;

-- 20.4 COURSE ENROLLMENTS & TEACHER ALLOCATIONS
INSERT INTO course_enrollments (student_id, course_id, progress, grade)
VALUES
('1', 'cse-101', 100, 'A'),
('1', 'cse-102', 100, 'A+'),
('1', 'cse-103', 85, 'A'),
('1', 'cse-201', 70, 'In Progress'),
('1', 'online-1', 45, 'In Progress'),
('1', 'extra-1', 90, 'Completed')
ON CONFLICT DO NOTHING;

INSERT INTO teacher_subject_allocations (teacher_id, course_id, semester, enrolled_students, max_capacity)
VALUES
('T001', 'cse-101', 1, 45, 60),
('T001', 'cse-103', 2, 42, 50),
('T001', 'cse-201', 3, 33, 40)
ON CONFLICT DO NOTHING;


-- 20.5 ATTENDANCE SUBJECTS & SLOTS
INSERT INTO teacher_subjects (id, teacher_id, name, code, semester, branch, total_classes)
VALUES
('sub1', 'T001', 'Data Structures and Algorithms', 'CS301', 3, 'Computer Science Engineering', 45),
('sub2', 'T001', 'Database Management Systems', 'CS302', 3, 'Computer Science Engineering', 40),
('sub3', 'T001', 'Operating Systems', 'CS303', 3, 'Computer Science Engineering', 38),
('sub4', 'T002', 'Web Development', 'CS304', 4, 'Computer Science Engineering', 42)
ON CONFLICT (id) DO NOTHING;

INSERT INTO subject_slots (id, subject_id, day, start_time, end_time, type, room)
VALUES
('slot1', 'sub1', 'Monday', '09:00', '10:00', 'lecture', 'CS-101'),
('slot2', 'sub1', 'Wednesday', '11:00', '12:00', 'lecture', 'CS-101'),
('slot3', 'sub1', 'Friday', '14:00', '17:00', 'lab', 'Lab-A'),
('slot4', 'sub2', 'Tuesday', '10:00', '11:00', 'lecture', 'Room-101'),
('slot5', 'sub2', 'Thursday', '15:00', '16:00', 'lecture', 'Room-101'),
('slot6', 'sub3', 'Monday', '14:00', '15:00', 'lecture', 'Room-205'),
('slot7', 'sub3', 'Tuesday', '16:00', '19:00', 'lab', 'Lab-B'),
('slot8', 'sub4', 'Monday', '14:00', '15:00', 'lecture', 'Lab-A'),
('slot9', 'sub4', 'Wednesday', '16:00', '19:00', 'lab', 'Lab-A')
ON CONFLICT (id) DO NOTHING;

INSERT INTO attendance_records (id, student_id, student_name, subject_id, subject_name, date, slot, status, marked_by)
VALUES
('att1', '1', 'Demo User', 'sub1', 'Data Structures and Algorithms', CURRENT_DATE - INTERVAL '1 day', 'Monday 09:00-10:00', 'present', 'Dr. Sarah Johnson'),
('att2', '1', 'Demo User', 'sub2', 'Database Management Systems', CURRENT_DATE - INTERVAL '2 days', 'Tuesday 10:00-11:00', 'present', 'Dr. Sarah Johnson'),
('att3', '1', 'Demo User', 'sub3', 'Operating Systems', CURRENT_DATE - INTERVAL '3 days', 'Monday 14:00-15:00', 'late', 'Prof. John Doe'),
('att4', '1', 'Demo User', 'sub1', 'Data Structures and Algorithms', CURRENT_DATE - INTERVAL '5 days', 'Wednesday 11:00-12:00', 'present', 'Dr. Sarah Johnson'),
('att5', '1', 'Demo User', 'sub1', 'Data Structures and Algorithms', CURRENT_DATE - INTERVAL '7 days', 'Friday 14:00-17:00', 'absent', 'Dr. Sarah Johnson'),
('att6', 'std1', 'Alice Johnson', 'sub1', 'Data Structures and Algorithms', CURRENT_DATE - INTERVAL '1 day', 'Monday 09:00-10:00', 'present', 'Dr. Sarah Johnson'),
('att7', 'std2', 'Bob Smith', 'sub1', 'Data Structures and Algorithms', CURRENT_DATE - INTERVAL '1 day', 'Monday 09:00-10:00', 'present', 'Dr. Sarah Johnson'),
('att8', 'std3', 'Carol Davis', 'sub1', 'Data Structures and Algorithms', CURRENT_DATE - INTERVAL '1 day', 'Monday 09:00-10:00', 'present', 'Dr. Sarah Johnson'),
('att9', 'std4', 'David Wilson', 'sub1', 'Data Structures and Algorithms', CURRENT_DATE - INTERVAL '1 day', 'Monday 09:00-10:00', 'late', 'Dr. Sarah Johnson'),
('att10', 'std5', 'Eva Brown', 'sub1', 'Data Structures and Algorithms', CURRENT_DATE - INTERVAL '1 day', 'Monday 09:00-10:00', 'present', 'Dr. Sarah Johnson')
ON CONFLICT (id) DO NOTHING;


-- 20.6 STUDENT & TEACHER BILLING
INSERT INTO student_bills (id, student_id, description, category, amount, status, due_date, payment_date, receipt_no, created_at)
VALUES
('STU-2024-001', '1', 'Semester 8 Tuition Fee', 'tuition', 75000, 'paid', '2024-07-15', '2024-07-10', 'RCP-STU-001', '2024-06-01T00:00:00Z'),
('STU-2024-002', '1', 'Library Fee', 'library', 2000, 'pending', '2024-08-15', NULL, NULL, '2024-07-01T00:00:00Z'),
('STU-2024-003', '1', 'Lab Fee - Computer Science', 'lab', 5000, 'overdue', '2024-07-01', NULL, NULL, '2024-06-15T00:00:00Z'),
('STU-2024-004', '1', 'Sports Fee', 'sports', 1500, 'pending', '2024-09-01', NULL, NULL, '2024-08-01T00:00:00Z'),
('STU-2024-005', '1', 'Hostel Fee - Q1', 'accommodation', 25000, 'paid', '2024-07-31', '2024-07-25', 'RCP-STU-002', '2024-06-20T00:00:00Z'),
('TUI-2024-001', '20CS001', 'Semester 8 Tuition Fee', 'tuition', 75000, 'paid', '2024-07-15', '2024-07-10', 'RCP-STU-001', '2024-06-01T00:00:00Z'),
('LAB-2024-002', '20EC014', 'Computer Science Lab Fee', 'lab', 8500, 'pending', '2024-08-15', NULL, NULL, '2024-07-01T00:00:00Z'),
('ACC-2024-003', '20ME023', 'Hostel Accommodation Fee', 'accommodation', 45000, 'overdue', '2024-07-01', NULL, NULL, '2024-06-15T00:00:00Z'),
('LIB-2024-004', '21CS045', 'Library Fee', 'library', 2000, 'pending', '2024-09-01', NULL, NULL, '2024-08-01T00:00:00Z'),
('SPT-2024-005', '20CE089', 'Sports Fee - Annual', 'sports', 3500, 'paid', '2024-07-31', '2024-07-25', 'RCP-STU-002', '2024-06-20T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO teacher_bills (id, employee_id, teacher_id, description, category, amount, base_pay, allowances, deductions, status, due_date, payment_date, receipt_no, created_at)
VALUES
('SAL-2024-001', 'EMP001', 'T001', 'June Salary - Dr. Sarah Johnson', 'salary', 85000, 65000, 15000, 8000, 'paid', '2024-06-30', '2024-06-30', 'SAL-001', '2024-06-01T00:00:00Z'),
('SAL-2024-002', 'EMP002', 'T002', 'June Salary - Prof. Michael Brown', 'salary', 72000, 55000, 12000, 5000, 'paid', '2024-06-30', '2024-06-30', 'SAL-002', '2024-06-01T00:00:00Z'),
('SAL-2024-003', 'EMP003', 'T003', 'July Salary - Dr. Emily Davis', 'salary', 78000, 60000, 14000, 6000, 'pending', '2024-07-31', NULL, NULL, '2024-07-01T00:00:00Z'),
('BON-2024-001', 'EMP001', 'T001', 'Research Excellence Bonus', 'bonus', 25000, NULL, NULL, NULL, 'paid', '2024-06-15', '2024-06-15', 'BON-001', '2024-06-10T00:00:00Z'),
('OVT-2024-001', 'EMP002', 'T002', 'Overtime - Extra Classes', 'overtime', 12000, NULL, NULL, NULL, 'pending', '2024-07-20', NULL, NULL, '2024-07-15T00:00:00Z'),
('SAL-2024-04', 'EMP2024001', 'EMP-001', 'April Salary', 'salary', 62000, 55000, 12000, 5000, 'paid', '2024-04-30', '2024-04-30', 'TS-2024-04', '2024-04-01T00:00:00Z'),
('SAL-2024-05', 'EMP2024001', 'EMP-001', 'May Salary', 'salary', 62000, 55000, 12000, 5000, 'paid', '2024-05-31', '2024-05-31', 'TS-2024-05', '2024-05-01T00:00:00Z'),
('SAL-2024-06', 'EMP2024001', 'EMP-001', 'June Salary', 'salary', 62000, 55000, 12000, 5000, 'pending', '2024-06-30', NULL, NULL, '2024-06-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;


-- 20.7 TIMETABLES
INSERT INTO student_timetables (id, name, instructor, start_time, end_time, day, location, type, code, description)
VALUES
(1, 'CSE2001-LTP-AB02-016-ALL', 'Dr. Smith', '08:30', '10:00', 0, 'A11', 'Theory', 'A11-CSE2001-LTP-AB02-016-ALL', 'Computer Science Engineering Theory'),
(2, 'SCD3009-LTP-AB02-216-ALL', 'Prof. Johnson', '10:05', '11:35', 0, 'B11', 'Lab', 'B11-SCD3009-LTP-AB02-216-ALL', 'Software Development Lab'),
(3, 'CSE3003-LTP-AB02-019-ALL', 'Dr. Wilson', '11:40', '13:10', 0, 'C11', 'Theory', 'C11-CSE3003-LTP-AB02-019-ALL', 'Computer Science Theory'),
(4, 'CDS3005-LP-AB02-403-ALL', 'Dr. Brown', '16:25', '17:55', 0, 'B21', 'Practical', 'B21-CDS3005-LP-AB02-403-ALL', 'Data Science Practical'),
(5, 'UHV0002-LT-CR-015-ALL', 'Prof. Taylor', '08:30', '10:00', 1, 'D11', 'Theory', 'D11-UHV0002-LT-CR-015-ALL', 'Universal Human Values'),
(6, 'MAT3002-LT-AB-127-ALL', 'Dr. Davis', '11:40', '13:10', 1, 'F11', 'Theory', 'F11-MAT3002-LT-AB-127-ALL', 'Mathematics Theory'),
(7, 'CDS3005-LP-AB02-403-ALL', 'Dr. Lee', '14:50', '16:20', 1, 'E14', 'Practical', 'E14-CDS3005-LP-AB02-403-ALL', 'Data Science Practical')
ON CONFLICT (id) DO NOTHING;

INSERT INTO teacher_timetables (id, name, students_batch, start_time, end_time, day, location, type, code, description)
VALUES
(1, 'CSE2001-LTP-AB02-016-ALL', 'AB02 Batch (32 students)', '08:30', '10:00', 0, 'A11', 'Theory', 'A11-CSE2001-LTP-AB02-016-ALL', 'Computer Science Engineering Theory'),
(2, 'SCD3009-LTP-AB02-216-ALL', 'AB02 Batch (28 students)', '10:05', '11:35', 0, 'B11', 'Lab', 'B11-SCD3009-LTP-AB02-216-ALL', 'Software Development Lab'),
(3, 'CSE3003-LTP-AB02-019-ALL', 'AB02 Batch (30 students)', '11:40', '13:10', 0, 'C11', 'Theory', 'C11-CSE3003-LTP-AB02-019-ALL', 'Computer Science Theory'),
(4, 'CDS3005-LP-AB02-403-ALL', 'AB02 Batch (25 students)', '16:25', '17:55', 0, 'B21', 'Practical', 'B21-CDS3005-LP-AB02-403-ALL', 'Data Science Practical'),
(5, 'UHV0002-LT-CR-015-ALL', 'CR Batch (45 students)', '08:30', '10:00', 1, 'D11', 'Theory', 'D11-UHV0002-LT-CR-015-ALL', 'Universal Human Values'),
(6, 'MAT3002-LT-AB-127-ALL', 'AB Batch (35 students)', '11:40', '13:10', 1, 'F11', 'Theory', 'F11-MAT3002-LT-AB-127-ALL', 'Mathematics Theory'),
(7, 'CDS3005-LP-AB02-403-ALL', 'AB02 Batch (25 students)', '14:50', '16:20', 1, 'E14', 'Practical', 'E14-CDS3005-LP-AB02-403-ALL', 'Data Science Practical')
ON CONFLICT (id) DO NOTHING;


-- 20.8 SEMESTERS, EXAMS & MARKS
INSERT INTO semesters (id, name, start_date, end_date, is_active, exam_types, branches)
VALUES
(1, '1st Semester', '2024-07-01', '2024-11-30', true, ARRAY['midterm', 'endterm', 'sessional', 'practical'], ARRAY['CSE', 'ECE', 'ME', 'CE']),
(2, '2nd Semester', '2024-12-01', '2025-04-30', false, ARRAY['midterm', 'endterm', 'sessional', 'practical'], ARRAY['CSE', 'ECE', 'ME', 'CE'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO exams (id, course, course_code, semester, branch, exam_type, date, time, duration, location, max_marks, instructor, instructor_id, topics, status)
VALUES
('1', 'Data Structures and Algorithms', 'CSE201', 1, 'CSE', 'midterm', '2024-08-15', '09:00', 180, 'Hall A', 100, 'Dr. Smith', 'inst_001', ARRAY['Arrays', 'Linked Lists', 'Stacks', 'Queues'], 'scheduled'),
('2', 'Database Management Systems', 'CSE301', 1, 'CSE', 'endterm', '2024-08-20', '14:00', 180, 'Hall B', 100, 'Dr. Johnson', 'inst_002', ARRAY['SQL', 'Normalization', 'Transactions'], 'scheduled')
ON CONFLICT (id) DO NOTHING;

INSERT INTO exam_slots (id, date, time_slot, location, capacity, is_available, exam_id)
VALUES
('slot_1', '2024-08-15', '09:00-12:00', 'Hall A', 120, false, '1'),
('slot_2', '2024-08-15', '14:00-17:00', 'Hall A', 120, true, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO student_marks (student_id, student_name, semester, course_code, course_name, credits, internal_marks, external_marks, total_marks, grade, grade_point, slot_id)
VALUES
-- 6th Semester
('1', 'Demo User', '6th Semester', 'CS301', 'Database Management Systems', 4, 28, 75, 103, 'A+', 10.0, 'CS301-MON-10'),
('1', 'Demo User', '6th Semester', 'CS302', 'Software Engineering', 4, 25, 70, 95, 'A', 9.0, 'CS302-TUE-2'),
('1', 'Demo User', '6th Semester', 'CS303', 'Computer Networks', 4, 30, 68, 98, 'A', 9.0, 'CS303-WED-11'),
('1', 'Demo User', '6th Semester', 'CS304', 'Operating Systems', 4, 27, 72, 99, 'A', 9.0, 'CS304-THU-3'),
('1', 'Demo User', '6th Semester', 'CS305', 'Web Technologies', 3, 29, 78, 107, 'A+', 10.0, NULL),
-- 5th Semester
('1', 'Demo User', '5th Semester', 'CS201', 'Data Structures & Algorithms', 4, 26, 74, 100, 'A', 9.0, NULL),
('1', 'Demo User', '5th Semester', 'CS202', 'Object Oriented Programming', 4, 28, 76, 104, 'A+', 10.0, NULL),
('1', 'Demo User', '5th Semester', 'CS203', 'Computer Organization', 3, 24, 65, 89, 'B+', 8.0, NULL),
('1', 'Demo User', '5th Semester', 'CS204', 'Discrete Mathematics', 3, 27, 70, 97, 'A', 9.0, NULL),
('1', 'Demo User', '5th Semester', 'CS205', 'Digital Logic Design', 3, 25, 68, 93, 'A', 9.0, NULL),
-- UploadMarks Seed
('20CS001', 'Aarav Sharma', '6th Semester', 'CS301', 'Database Management Systems', 4, 28, 75, 103, 'A+', 10.0, 'CS301-MON-10'),
('20CS014', 'Neha Patel', '6th Semester', 'CS301', 'Database Management Systems', 4, 25, 70, 95, 'A', 9.0, 'CS301-MON-10');


-- 20.9 ACADEMIC PROGRESS & ACHIEVEMENTS
INSERT INTO academic_semester_progress (student_id, semester, sgpa, credits, status)
VALUES
('1', 1, 8.20, 20, 'Completed'),
('1', 2, 8.40, 20, 'Completed'),
('1', 3, 8.70, 20, 'Completed'),
('1', 4, 8.50, 20, 'Completed'),
('1', 5, 9.10, 20, 'Completed'),
('1', 6, 8.80, 20, 'In Progress'),
('1', 7, 0.00, 20, 'Upcoming'),
('1', 8, 0.00, 20, 'Upcoming');

INSERT INTO student_achievements (student_id, title, semester, description)
VALUES
('1', 'Dean''s List', 'Semester 5', 'Top 5% academic performance'),
('1', 'Academic Excellence', 'Semester 3', 'SGPA above 8.5 maintained'),
('1', 'Perfect Attendance', 'Semester 2', '100% lecture attendance');


-- 20.10 ASSIGNMENTS
INSERT INTO assignments (id, slot_id, course, title, description, due_date, status, priority, type, submission_type, max_points, progress, grade, feedback, submissions_count, total_students)
VALUES
('assign-1', 'CS301-MON-10', 'CS301', 'Binary Trees Implementation', 'Implement basic binary tree operations', '2024-07-25', 'pending', 'high', 'project', 'Code + Report', 100, 60, NULL, NULL, 18, 25),
('assign-2', 'CS301-MON-10', 'CS301', 'Sorting Algorithms Quiz', 'Multiple choice quiz on sorting algorithms', '2024-07-28', 'draft', 'medium', 'quiz', 'Online Quiz', 50, 0, NULL, NULL, 0, 25),
('assign-3', 'CS302-TUE-2', 'CS302', 'Database Design Project', 'Design a database for library management system', '2024-07-30', 'published', 'high', 'project', 'PDF + SQL', 150, 40, NULL, NULL, 12, 18),
('assign-4', 'CS303-WED-11', 'CS303', 'Requirements Analysis', 'Analyze requirements for given software project', '2024-08-05', 'published', 'medium', 'homework', 'Word / PDF', 80, 20, NULL, NULL, 15, 22),
('assign-stu-2', NULL, 'CHEM205', 'Organic Chemistry Lab Report', 'Write a detailed report on the synthesis experiment', '2024-07-22', 'pending', 'medium', 'assignment', 'PDF Report', 50, 80, NULL, NULL, 10, 25),
('assign-stu-3', NULL, 'ENG205', 'Literature Essay', 'Analyze themes in contemporary world literature', '2024-07-20', 'submitted', 'low', 'assignment', 'Essay', 75, 100, 'A-', 'Excellent analysis of themes and writing style.', 25, 25),
('assign-stu-4', NULL, 'MATH201', 'Linear Algebra Problem Set', 'Solve problems 1-20 from Chapter 5', '2024-07-18', 'overdue', 'high', 'assignment', 'Handwritten/PDF', 30, 0, NULL, NULL, 5, 25),
('assign-stu-5', NULL, 'PHYS201', 'Physics Lab Quiz', 'Online quiz covering laboratory procedures', '2024-07-30', 'pending', 'medium', 'assignment', 'Online Quiz', 25, 0, NULL, NULL, 8, 25)
ON CONFLICT (id) DO NOTHING;


-- 20.11 DIGITAL ID CARDS
INSERT INTO digital_id_cards (profile_id, card_type, section, roll_number, employee_id, admission_year, valid_until, blood_group, emergency_contact, hostel_block, room_number, library_id, department, designation, joining_date, office_room)
VALUES
('1', 'student', 'A', 'CS21001', NULL, '2021', '2025-06-30', 'O+', '+91 9999999998', 'Block C', '402', 'LIB-2021-089', 'Computer Science', NULL, NULL, NULL),
('EMP-001', 'teacher', NULL, NULL, 'EMP-001', NULL, '2028-07-15', 'A+', '+91 9876543239', NULL, NULL, 'LIB-FAC-001', 'Computer Science', 'Professor', '2018-07-15', 'CS-201'),
('admin_001', 'admin', NULL, NULL, 'ADM-001', NULL, '2030-01-01', 'B+', '+91 9876543998', NULL, NULL, 'LIB-ADM-001', 'Administration', 'Chief Administrator', '2010-01-01', 'ADM-101')
ON CONFLICT (profile_id) DO NOTHING;


-- 20.12 ANNOUNCEMENTS
INSERT INTO announcements (id, title, content, author, priority, category, target_audience, date, attachments)
VALUES
('ann-admin-1', 'University Rankings Update', 'We are proud to announce that our university has moved up 5 positions in the national rankings.', 'Administration', 'high', 'General', 'all', '2024-01-15T10:00:00Z', '[{"name": "Rankings_Report_2024.pdf", "size": "1.2 MB", "type": "pdf"}]'::jsonb),
('ann-admin-2', 'New Campus Facilities Opening', 'The new sports complex and library extension will be opened next month. Student access will begin from February 1st.', 'Facilities Management', 'medium', 'Infrastructure', 'all', '2024-01-12T09:00:00Z', '[]'::jsonb),
('ann-stu-1', 'Mid-term Examination Schedule Released', 'The mid-term examination schedule for all branches has been finalized. Please check your respective timetables.', 'Academic Office', 'high', 'Academic', 'students', '2024-01-15T08:30:00Z', '[{"name": "Exam_Schedule_2024.pdf", "size": "245 KB", "type": "pdf"}]'::jsonb),
('ann-stu-2', 'Library Timing Changes', 'Due to maintenance work, the library will remain closed on weekends for the next two weeks.', 'Library Department', 'medium', 'General', 'students', '2024-01-12T14:00:00Z', '[]'::jsonb),
('ann-stu-3', 'New Research Scholarship Applications Open', 'Applications for research scholarships are now open for final year students. Apply before the deadline.', 'Research Department', 'high', 'Opportunities', 'students', '2024-01-10T11:00:00Z', '[{"name": "Scholarship_Guidelines.pdf", "size": "180 KB", "type": "pdf"}, {"name": "Application_Form.docx", "size": "95 KB", "type": "doc"}]'::jsonb),
('ann-tea-1', 'Assignment Submission Reminder', 'Reminder: Data Structures assignment is due this Friday. Please submit via the portal.', 'Prof. John Smith', 'medium', 'Academic', 'students', '2024-01-14T16:00:00Z', '[]'::jsonb),
('ann-tea-2', 'Class Rescheduled - Algorithm Design', 'Tomorrow''s Algorithm Design class has been moved to Friday 2 PM due to a faculty meeting.', 'Prof. John Smith', 'high', 'Schedule', 'students', '2024-01-13T12:00:00Z', '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;


-- 20.13 CAMPUS EVENTS
INSERT INTO campus_events (id, title, description, date, time, location, category, organizer, attendees, max_attendees, is_registered, type, is_past)
VALUES
('1', 'Computer Science Department Seminar', 'Latest trends in artificial intelligence and machine learning', '2024-07-28', '14:00', 'Tech Building Auditorium', 'Academic', 'CS Department', 45, 100, true, 'Seminar', false),
('2', 'Student Orientation Week', 'Welcome new students and introduce campus resources', '2024-08-01', '09:00', 'Main Campus', 'Social', 'Student Affairs', 150, 200, false, 'Orientation', false),
('3', 'Career Fair 2024', 'Meet with top employers and explore career opportunities', '2024-08-15', '10:00', 'Student Center', 'Career', 'Career Services', 200, 500, true, 'Fair', false),
('4', 'Research Symposium', 'Undergraduate research presentations', '2024-07-20', '13:00', 'Science Building', 'Academic', 'Research Office', 80, 120, false, 'Symposium', true)
ON CONFLICT (id) DO NOTHING;


-- 20.14 COMMUNITY GROUPS & MESSAGES
INSERT INTO community_groups (id, name, members_count, active, semester, description, link, last_message, last_message_time, created_at, icon_url, target_audience, created_by)
VALUES
('1', 'Computer Science - Sem 3', 24, true, 'Semester 3', 'Discussion group for CS third semester students', 'https://community.com/cs-sem3', 'Hey everyone! Anyone solved the algorithm assignment?', '10:40 AM', '2024-01-15', 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=400&fit=crop&crop=face', 'student', 'admin'),
('2', 'Mathematics - Sem 2', 18, false, 'Semester 2', 'Math study group for second semester', 'https://community.com/math-sem2', 'Thanks for the calculus notes!', 'Yesterday', '2024-01-10', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face', 'student', 'teacher'),
('3', 'Physics Lab - Sem 4', 31, true, 'Semester 4', 'Physics lab discussion and help', 'https://community.com/physics-sem4', 'Lab report submission deadline is tomorrow', '2:15 PM', '2024-01-20', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop&crop=face', 'student', 'admin'),
('4', 'Engineering Drawing - Sem 1', 45, true, 'Semester 1', 'Help with technical drawing assignments', 'https://community.com/ed-sem1', 'Can someone explain projection methods?', '9:30 AM', '2024-01-05', 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop&crop=face', 'student', 'teacher'),
('5', 'Faculty Meeting - Q1', 8, true, 'All', 'Quarterly faculty coordination meeting', 'https://community.com/faculty-q1', 'Next meeting agenda uploaded', '11:30 AM', '2024-01-18', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop&crop=face', 'teacher', 'admin'),
('6', 'Department Heads', 5, true, 'All', 'Department coordination and planning', 'https://community.com/dept-heads', 'Budget planning for next semester', 'Yesterday', '2024-01-20', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=400&fit=crop&crop=face', 'admin-teacher', 'admin'),
('7', 'Administrative Team', 3, true, 'All', 'Internal admin coordination and policy discussions', 'https://community.com/admin-team', 'New policy draft ready for review', '2 hours ago', '2024-01-15', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'admin', 'admin'),
('8', 'Academic Excellence Program', 42, true, 'All', 'Collaborative space for teachers and top-performing students', 'https://community.com/academic-excellence', 'Research project proposals due next week', '1 hour ago', '2024-01-18', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=face', 'teacher-student', 'admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO community_messages (id, group_id, type, sender, message, time, avatar, read_count, total_members)
VALUES
('1', '1', 'text', 'John Doe', 'Hey everyone! Anyone solved the algorithm assignment?', '10:30 AM', 'JD', 15, 24),
('2', '1', 'text', 'Jane Smith', 'Yes! I can help with that. Which part are you stuck on?', '10:35 AM', 'JS', 12, 24),
('3', '1', 'text', 'Demo User', 'I am working on the binary tree part, especially deletion.', '10:40 AM', 'DU', 10, 24)
ON CONFLICT (id) DO NOTHING;


-- 20.15 PERSONAL TASKS & SUBTASKS
INSERT INTO personal_tasks (id, user_id, title, description, completed, priority, category, subject, due_date, estimated_time, notes, tags, is_starred, created_at)
VALUES
(1, '1', 'Computer Science Assignment - Data Structures', 'Implement binary search tree with insertion, deletion, and traversal methods', false, 'urgent', 'assignment', 'Computer Science', '2024-12-25 23:59:59Z', 180, 'Focus on balanced tree implementation', ARRAY['programming', 'algorithms'], true, '2024-12-15 10:00:00Z'),
(2, '1', 'Mathematics Midterm Exam', 'Calculus II - Integration techniques and applications', false, 'high', 'exam', 'Mathematics', '2024-12-23 23:59:59Z', 240, 'Review integration by parts and partial fractions', ARRAY['calculus', 'integration'], true, '2024-12-10 10:00:00Z'),
(3, '1', 'Physics Lab Report', 'Electromagnetic induction experiment analysis', true, 'medium', 'assignment', 'Physics', '2024-12-20 23:59:59Z', 120, 'Include error analysis section', ARRAY['lab', 'experiment'], false, '2024-12-12 10:00:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO personal_subtasks (task_id, title, completed)
VALUES
(1, 'Design tree structure', true),
(1, 'Implement insertion method', false),
(1, 'Implement deletion method', false),
(1, 'Add traversal methods', false),
(1, 'Write test cases', false),
(2, 'Review Chapter 7', true),
(2, 'Practice integration techniques', false),
(2, 'Solve past exam papers', false)
ON CONFLICT (id) DO NOTHING;


-- 20.16 PERSONAL NOTES
INSERT INTO personal_notes (id, user_id, title, content, category, tags, favorite, priority, color, font_size, word_count, study_materials, created_at, updated_at, last_accessed)
VALUES
(1, '1', 'Computer Science Lecture 1', 'Introduction to algorithms and data structures. Big O notation explains time complexity and helps us analyze algorithm efficiency. Arrays provide constant-time access but insertion can be costly. Linked lists offer efficient insertion but slower access times.', 'Computer Science', ARRAY['algorithms', 'data-structures', 'big-o'], true, 'high', '#dbeafe', 16, 45, '[{"id": 1, "type": "link", "title": "Big O Cheat Sheet", "content": "https://www.bigocheatsheet.com/", "description": "Comprehensive reference for algorithm complexities", "createdAt": "2024-01-20"}]'::jsonb, '2024-01-20T10:00:00Z', '2024-01-20T10:00:00Z', '2024-01-22T10:00:00Z'),
(2, '1', 'Mathematics - Calculus Notes', 'Derivatives and integrals form the foundation of calculus. The fundamental theorem of calculus connects these two concepts. Derivatives measure rates of change, while integrals calculate areas under curves. Chain rule is essential for composite functions.', 'Mathematics', ARRAY['calculus', 'derivatives', 'integrals'], false, 'medium', '#dcfce7', 16, 42, '[]'::jsonb, '2024-01-19T10:00:00Z', '2024-01-19T10:00:00Z', '2024-01-21T10:00:00Z')
ON CONFLICT (id) DO NOTHING;


-- 20.17 TRANSACTIONS / EXPENSES
INSERT INTO transaction_records (user_id, category, amount, type, date, description)
VALUES
('1', 'Food', 240, 'expense', '2025-01-15', 'Canteen lunch & snacks'),
('1', 'Transport', 85, 'expense', '2025-01-15', 'Auto to college'),
('1', 'Books', 1200, 'expense', '2025-01-14', 'Engineering textbooks'),
('1', 'Food', 180, 'expense', '2025-01-14', 'Tea & samosas'),
('1', 'Entertainment', 350, 'expense', '2025-01-13', 'Movie with friends'),
('1', 'Pocket Money', 5000, 'income', '2025-01-12', 'Monthly allowance from home'),
('1', 'Food', 450, 'expense', '2025-01-12', 'Hostel mess fee'),
('1', 'Transport', 120, 'expense', '2025-01-11', 'Ola ride to mall'),
('1', 'Stationery', 280, 'expense', '2025-01-10', 'Notebooks & pens'),
('1', 'Entertainment', 199, 'expense', '2025-01-09', 'Netflix subscription'),
('1', 'Tuition', 1500, 'expense', '2025-01-08', 'Extra classes fee'),
('1', 'Food', 320, 'expense', '2025-01-07', 'Pizza night with roommates'),
('1', 'Food', 180, 'expense', '2024-12-28', 'Coffee with friends'),
('1', 'Transport', 95, 'expense', '2024-12-27', 'Bus fare'),
('1', 'Entertainment', 299, 'expense', '2024-12-25', 'Christmas celebration'),
('1', 'Pocket Money', 4500, 'income', '2024-12-15', 'Monthly allowance'),
('1', 'Books', 800, 'expense', '2024-11-20', 'Reference books'),
('1', 'Food', 320, 'expense', '2024-11-18', 'Restaurant dinner'),
('1', 'Transport', 150, 'expense', '2024-11-15', 'Monthly bus pass'),
('1', 'Pocket Money', 4500, 'income', '2024-11-10', 'Monthly allowance');


-- 20.18 BLOG POSTS
INSERT INTO blog_posts (id, title, excerpt, content, author_name, author_avatar, author_role, published_at, read_time, category, tags, image_url, likes, comments, featured)
VALUES
('1', 'Mastering Time Management: The Ultimate Student Guide', 'Discover proven strategies to balance your academic workload, social life, and personal development.', 'Time management is crucial for academic success. Developing consistent study habits and scheduling breaks enhances productivity.', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', 'Academic Advisor', '2024-01-15', 8, 'Study Tips', ARRAY['productivity', 'time-management', 'student-life'], 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800', 342, 28, true),
('2', 'The Science of Effective Note-Taking', 'Explore research-backed methods for taking notes that actually help you learn and retain information better.', 'Effective note-taking is an art and science. Techniques like Cornell method and mind mapping help synthesize knowledge.', 'Dr. Michael Torres', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Psychology Professor', '2024-01-12', 6, 'Learning', ARRAY['note-taking', 'memory', 'study-methods'], 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800', 256, 19, false),
('3', 'Building Your Professional Network as a Student', 'Start building meaningful professional relationships early in your academic career with these practical networking strategies.', 'Networking is not just for professionals. Connecting with alumni, attending conferences, and participating in hackathons gives you an edge.', 'Emma Rodriguez', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'Career Counselor', '2024-01-10', 5, 'Career', ARRAY['networking', 'career-development', 'professional-skills'], 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800', 189, 15, false),
('4', 'Mental Health and Academic Success', 'Understanding the connection between mental wellness and academic performance, plus practical tips for maintaining balance.', 'Mental health is fundamental to academic success. Prioritize sleep, exercise, and seeking counseling support when overwhelmed.', 'Dr. James Kim', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Counseling Psychologist', '2024-01-08', 7, 'Wellness', ARRAY['mental-health', 'wellness', 'stress-management'], 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800', 423, 45, false),
('5', 'Technology Tools Every Student Should Know', 'A comprehensive guide to digital tools and apps that can revolutionize your study experience and boost productivity.', 'Technology can be a game-changer for students. From Notion and Obsidian to AI research assistants and code sandboxes.', 'Alex Johnson', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Tech Educator', '2024-01-05', 9, 'Technology', ARRAY['technology', 'productivity-tools', 'digital-learning'], 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800', 298, 32, false),
('6', 'Study Abroad: Making the Most of Your Experience', 'Essential tips for international students and those planning to study abroad, from cultural adaptation to academic success.', 'Studying abroad is a transformative experience that broadens horizons, enhances language skills, and fosters independence.', 'Maria Santos', 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150', 'International Programs Coordinator', '2024-01-03', 6, 'International', ARRAY['study-abroad', 'international-education', 'cultural-exchange'], 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', 167, 12, false)
ON CONFLICT (id) DO NOTHING;


-- 20.19 WELLNESS, FITNESS, MOTIVATION, AUDIO TRACKS
INSERT INTO fitness_workouts (name, duration, calories, difficulty, description, exercises, color)
VALUES
('5-min Stretch', 5, 20, 'Easy', 'Gentle stretching to relieve tension and improve flexibility', ARRAY['Neck rolls', 'Shoulder shrugs', 'Back stretch', 'Hip circles'], 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'),
('15-min HIIT', 15, 150, 'Hard', 'High-intensity interval training for maximum calorie burn', ARRAY['Burpees', 'Mountain climbers', 'Jump squats', 'Push-ups'], 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'),
('Desk Exercises', 10, 50, 'Medium', 'Quick exercises you can do right at your desk', ARRAY['Desk push-ups', 'Calf raises', 'Seated twists', 'Leg extensions'], 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800');

INSERT INTO meditation_sessions (id, title, description, type, duration, video_id, instructions, benefits, tags, color)
VALUES
('1', 'Morning Mindfulness', 'Start your day with clarity and intention through this gentle 10-minute guided meditation.', 'guided', '10 min', 'inpok4MKVLM', NULL, ARRAY['Reduces stress', 'Improves focus', 'Enhances mood'], ARRAY['Morning', 'Beginner', 'Guided'], 'from-amber-400/20 to-orange-500/20'),
('2', '4-7-8 Breathing Technique', 'A powerful breathing technique to calm your nervous system and reduce anxiety instantly.', 'breathing', '5 min', NULL, ARRAY['Exhale completely through your mouth', 'Close your mouth and inhale through your nose for 4 counts', 'Hold your breath for 7 counts', 'Exhale through your mouth for 8 counts', 'Repeat the cycle 3-4 times'], ARRAY['Reduces anxiety', 'Improves sleep', 'Calms mind'], ARRAY['Breathing', 'Quick', 'Anxiety Relief'], 'from-blue-400/20 to-cyan-500/20'),
('3', 'Deep Sleep Meditation', 'Drift into peaceful sleep with this calming guided meditation designed for bedtime.', 'guided', '20 min', 'aEqlQvczMJQ', NULL, ARRAY['Better sleep', 'Relaxation', 'Stress relief'], ARRAY['Sleep', 'Evening', 'Relaxation'], 'from-indigo-500/20 to-purple-600/20'),
('4', 'Ocean Waves Meditation', 'Let the soothing sounds of ocean waves wash away your stress and tension.', 'music', '30 min', 'fn3KWM1kuAw', NULL, ARRAY['Deep relaxation', 'Stress relief', 'Mental clarity'], ARRAY['Nature', 'Ambient', 'Long'], 'from-teal-400/20 to-blue-600/20'),
('5', 'Mindful Walking', 'Transform your daily walk into a meditation practice with mindful awareness.', 'mindfulness', '15 min', NULL, ARRAY['Start walking at a comfortable, slow pace', 'Pay attention to the lifting and falling of your feet', 'Notice the sights and sounds around you', 'Bring wandering thoughts back to each physical step'], ARRAY['Grounding', 'Mind-body connection', 'Gentle movement'], ARRAY['Walking', 'Active', 'Mindfulness'], 'from-emerald-400/20 to-teal-500/20')
ON CONFLICT (id) DO NOTHING;

INSERT INTO motivation_items (id, title, description, type, video_id, quote, author, story, tags, color)
VALUES
('1', 'The Power of Yet', 'Transform your mindset from ''I can''t'' to ''I can''t yet'' and unlock unlimited potential.', 'video', 'hiiEeMN7vbQ', NULL, NULL, NULL, ARRAY['Growth', 'Mindset', 'Potential'], 'from-purple-600/20 to-pink-600/20'),
('2', 'Believe in Yourself', 'The only person you are destined to become is the person you decide to be.', 'quote', NULL, 'The only person you are destined to become is the person you decide to be.', 'Ralph Waldo Emerson', NULL, ARRAY['Self-belief', 'Destiny', 'Choice'], 'from-blue-600/20 to-cyan-600/20'),
('3', 'Overcoming Challenges', 'Every challenge is an opportunity to grow stronger and wiser.', 'video', 'mgmVOuLgFB0', NULL, NULL, NULL, ARRAY['Resilience', 'Growth', 'Strength'], 'from-green-600/20 to-emerald-600/20'),
('4', 'The Art of Persistence', 'Success is not final, failure is not fatal: it is the courage to continue that counts.', 'quote', NULL, 'Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', NULL, ARRAY['Persistence', 'Courage', 'Success'], 'from-orange-600/20 to-red-600/20'),
('5', 'Finding Your Purpose', 'Discover what drives you and align your actions with your deepest values.', 'video', 'u4ZoJKF_VuA', NULL, NULL, NULL, ARRAY['Purpose', 'Values', 'Direction'], 'from-indigo-600/20 to-purple-600/20'),
('6', 'The Growth Story', 'A bamboo tree grows 90 feet in just 6 weeks, but it takes 5 years to build its root system first.', 'story', NULL, NULL, 'Ancient Chinese Wisdom', 'A Chinese bamboo tree is planted and watered for years without any visible growth above ground. For five long years, nothing seems to happen. Then, in the sixth year, it suddenly shoots up 90 feet in just 6 weeks. It grew 90 feet in 5 years of developing a deep root system. Keep watering your dreams even when you cannot see the immediate growth.', ARRAY['Patience', 'Growth', 'Foundation'], 'from-teal-600/20 to-green-600/20')
ON CONFLICT (id) DO NOTHING;

INSERT INTO audio_tracks (title, artist, album, duration, genre, favorite)
VALUES
('Lo-fi Study Beat', 'Chill Beats', 'Study Session Vol. 1', '3:03', 'Lo-fi', true),
('Deep Focus', 'Ambient Works', 'Concentration', '4:00', 'Ambient', false),
('Midnight Coding', 'Code Tunes', 'Late Night Sessions', '3:30', 'Electronic', true),
('Jazz Coffee', 'Morning Blend', 'Cafe Sounds', '4:15', 'Jazz', false),
('Classical Study', 'Academia', 'Focus Classical', '5:20', 'Classical', true);


-- 20.20 ADMIN RECENT ACTIVITIES
INSERT INTO admin_recent_activities (type, title, description, time_label, status)
VALUES
('subject_created', 'New subject ''Advanced Algorithms'' created', 'Added to Computer Science - Semester 6', '2 hours ago', 'completed'),
('teacher_allocated', 'Dr. Sarah Johnson assigned to Data Structures', 'Allocation for Semester 2', '4 hours ago', 'completed'),
('course_plan_updated', 'Course plan updated for CSE Semester 3', 'Added 2 new elective subjects', '6 hours ago', 'completed'),
('pending_allocation', '5 subjects pending teacher allocation', 'Requires immediate attention', '1 day ago', 'completed');


-- 20.21 EXAMINATION CONTROLLER (CoE) DATA
INSERT INTO exam_cycles (id, name, academic_year, term, start_date, end_date, marks_submission_deadline, results_publish_date, status)
VALUES 
('CYCLE-2024-ODD', 'Autumn End-Semester Examination 2024-25', '2024-2025', 'Odd Semester', '2024-11-20', '2024-12-05', NOW() + INTERVAL '5 days', NOW() + INTERVAL '12 days', 'evaluation'),
('CYCLE-2025-EVEN', 'Spring Mid-Semester Examination 2024-25', '2024-2025', 'Even Semester', '2025-03-10', '2025-03-22', NOW() + INTERVAL '45 days', NOW() + INTERVAL '60 days', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO exam_rooms (id, room_number, building, capacity, rows_count, cols_count, is_active)
VALUES 
('ROOM-LH101', 'LH-101', 'Aryabhatta Lecture Hall Complex', 40, 8, 5, true),
('ROOM-LH102', 'LH-102', 'Aryabhatta Lecture Hall Complex', 40, 8, 5, true),
('ROOM-CSLAB1', 'CS-LAB-1', 'Turing Computing Center', 30, 6, 5, true),
('ROOM-ECLAB2', 'EC-LAB-2', 'Tesla Electronics Block', 30, 6, 5, true)
ON CONFLICT (id) DO NOTHING;

UPDATE exams SET cycle_id = 'CYCLE-2024-ODD' WHERE cycle_id IS NULL;

INSERT INTO exam_hall_tickets (cycle_id, student_id, is_eligible, debar_reason, attendance_percentage, fee_cleared, qr_token)
VALUES 
('CYCLE-2024-ODD', '1', true, NULL, 88.50, true, 'HT-2024-ODD-STD001-VERIFIED'),
('CYCLE-2024-ODD', '20CS001', true, NULL, 92.00, true, 'HT-2024-ODD-20CS001-VERIFIED'),
('CYCLE-2024-ODD', 'std1', true, NULL, 81.20, true, 'HT-2024-ODD-STD1-VERIFIED'),
('CYCLE-2024-ODD', '20CS002', false, 'Attendance below required threshold (62.4% < 75%)', 62.40, true, NULL),
('CYCLE-2024-ODD', '20CS003', false, 'Outstanding tuition fee balance exceeding limit (₹45,000)', 84.00, false, NULL)
ON CONFLICT (cycle_id, student_id) DO NOTHING;

INSERT INTO exam_seating_arrangements (exam_id, student_id, room_id, seat_code, bench_number, attended_status)
VALUES 
('1', '1', 'ROOM-LH101', 'R1-C1', 1, 'present'),
('1', '20CS001', 'ROOM-LH101', 'R1-C3', 2, 'present'),
('1', 'std1', 'ROOM-LH101', 'R2-C2', 4, 'present'),
('2', '1', 'ROOM-LH102', 'R1-C2', 1, 'present'),
('2', '20CS001', 'ROOM-LH102', 'R2-C1', 3, 'present')
ON CONFLICT (exam_id, student_id) DO NOTHING;

INSERT INTO exam_invigilators (exam_id, teacher_id, room_id, reporting_time, duty_status, notes)
VALUES 
('1', 'T001', 'ROOM-LH101', '08:30:00', 'confirmed', 'Chief Invigilator - LH101'),
('1', 'EMP-001', 'ROOM-LH102', '08:30:00', 'assigned', 'Assistant Invigilator'),
('2', 'T001', 'ROOM-LH102', '13:30:00', 'assigned', 'Chief Invigilator - LH102')
ON CONFLICT DO NOTHING;

INSERT INTO exam_malpractices (exam_id, student_id, reported_by, incident_description, status, verdict)
VALUES 
('1', '20CS002', 'T001', 'Possession of unauthorized electronic smartwatch during Data Structures examination.', 'penalized', 'Disciplinary Committee verdict: Exam cancelled for current subject and letter of reprimand issued.')
ON CONFLICT DO NOTHING;

INSERT INTO exam_revaluations (student_id, course_code, original_marks, revised_marks, assigned_evaluator_id, status, remarks)
VALUES 
('1', 'CS301', 75.00, 82.00, 'T001', 'resolved', 'Recalculation corrected in Question 4(b); +7 marks awarded.')
ON CONFLICT DO NOTHING;

UPDATE student_marks 
SET is_published = true, moderation_applied = false 
WHERE semester = '5th Semester' OR semester = '5';

-- ==============================================================================
-- END OF MASTER SCHEMA & SEED SCRIPT
-- ==============================================================================
