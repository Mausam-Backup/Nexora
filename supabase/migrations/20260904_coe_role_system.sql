-- ==============================================================================
-- CAMPUS SYNC - EXAMINATION CONTROLLER (CoE) ROLE & SYSTEM MIGRATION SCRIPT
-- File: supabase/migrations/20260904_coe_role_system.sql
-- Description: Idempotent migration script that:
--   1. Updates profiles role constraint to include 'examination_controller'
--   2. Seeds demo CoE user profile (coe_001)
--   3. Adds cycle_id to exams, and is_published/moderation_applied to student_marks
--   4. Creates exam_cycles, exam_rooms, exam_seating_arrangements,
--      exam_invigilators, exam_hall_tickets, exam_malpractices, exam_revaluations
--   5. Configures Row Level Security (RLS) policies
--   6. Seeds comprehensive mock data for existing students and teachers
-- ==============================================================================

-- 1. ALTER PROFILES TABLE ROLE CHECK CONSTRAINT
DO $$
BEGIN
    -- Drop existing check constraint on role if present
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    
    -- Re-add with 'examination_controller' included
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
        CHECK (role IN ('student', 'teacher', 'admin', 'parent', 'examination_controller'));
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table profiles does not exist yet. Please run main db.sql first.';
END $$;

-- 2. SEED DEMO EXAMINATION CONTROLLER PROFILE
INSERT INTO profiles (
    id, name, email, phone, role, college_name, department, designation, 
    qualification, experience_years, office_room, status, created_at
) VALUES (
    'coe_001',
    'Dr. K. R. Ramanathan',
    'coe@campussync.edu',
    '+91 98450 11223',
    'examination_controller',
    'CampusSync University',
    'Office of the Controller of Examinations',
    'Controller of Examinations',
    'Ph.D. in Computer Science & Engineering',
    22,
    'Admin Block - Room 108',
    'active',
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'examination_controller',
    designation = 'Controller of Examinations',
    department = 'Office of the Controller of Examinations';

-- 3. UPDATE EXISTING TABLES
DO $$
BEGIN
    -- Add cycle_id to exams
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exams' AND column_name = 'cycle_id'
    ) THEN
        ALTER TABLE exams ADD COLUMN cycle_id VARCHAR(100);
    END IF;

    -- Add is_published to student_marks
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_marks' AND column_name = 'is_published'
    ) THEN
        ALTER TABLE student_marks ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add moderation_applied to student_marks
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_marks' AND column_name = 'moderation_applied'
    ) THEN
        ALTER TABLE student_marks ADD COLUMN moderation_applied BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 4. CREATE NEW CoE TABLES

-- 4.1 Exam Cycles
CREATE TABLE IF NOT EXISTS exam_cycles (
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

-- 4.2 Exam Rooms / Examination Halls
CREATE TABLE IF NOT EXISTS exam_rooms (
    id VARCHAR(100) PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    building VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 40,
    rows_count INTEGER NOT NULL DEFAULT 8,
    cols_count INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.3 Seating Arrangements
CREATE TABLE IF NOT EXISTS exam_seating_arrangements (
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

-- 4.4 Invigilators
CREATE TABLE IF NOT EXISTS exam_invigilators (
    id SERIAL PRIMARY KEY,
    exam_id VARCHAR(100) REFERENCES exams(id) ON DELETE CASCADE,
    teacher_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    room_id VARCHAR(100) REFERENCES exam_rooms(id) ON DELETE CASCADE,
    reporting_time TIME NOT NULL,
    duty_status VARCHAR(50) DEFAULT 'assigned' CHECK (duty_status IN ('assigned', 'confirmed', 'swapped', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.5 Hall Tickets & Eligibility Gatekeeper
CREATE TABLE IF NOT EXISTS exam_hall_tickets (
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

-- 4.6 Exam Malpractices (Unfair Means - UFM Desk)
CREATE TABLE IF NOT EXISTS exam_malpractices (
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

-- 4.7 Exam Revaluations
CREATE TABLE IF NOT EXISTS exam_revaluations (
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

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE exam_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_seating_arrangements ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_invigilators ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_hall_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_malpractices ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_revaluations ENABLE ROW LEVEL SECURITY;

-- CoE and Admin full access helper function
CREATE OR REPLACE FUNCTION auth_user_role() 
RETURNS TEXT AS $$
    SELECT role FROM profiles WHERE id = auth.uid()::text;
$$ LANGUAGE sql STABLE;

-- Exam Cycles: CoE & Admin have ALL; Teachers & Students have SELECT
DROP POLICY IF EXISTS "CoE and Admin full access on exam_cycles" ON exam_cycles;
CREATE POLICY "CoE and Admin full access on exam_cycles" 
ON exam_cycles FOR ALL 
USING (auth_user_role() IN ('admin', 'examination_controller'));

DROP POLICY IF EXISTS "Teachers and Students read exam_cycles" ON exam_cycles;
CREATE POLICY "Teachers and Students read exam_cycles" 
ON exam_cycles FOR SELECT 
USING (true);

-- Exam Rooms: CoE & Admin full; all read
DROP POLICY IF EXISTS "CoE and Admin full access on exam_rooms" ON exam_rooms;
CREATE POLICY "CoE and Admin full access on exam_rooms" 
ON exam_rooms FOR ALL 
USING (auth_user_role() IN ('admin', 'examination_controller'));

DROP POLICY IF EXISTS "Everyone read active exam_rooms" ON exam_rooms;
CREATE POLICY "Everyone read active exam_rooms" 
ON exam_rooms FOR SELECT 
USING (is_active = true);

-- Exam Seating: CoE & Admin full; Students read own; Teachers read for invigilated rooms
DROP POLICY IF EXISTS "CoE and Admin full access on seating" ON exam_seating_arrangements;
CREATE POLICY "CoE and Admin full access on seating" 
ON exam_seating_arrangements FOR ALL 
USING (auth_user_role() IN ('admin', 'examination_controller'));

DROP POLICY IF EXISTS "Students read own seating" ON exam_seating_arrangements;
CREATE POLICY "Students read own seating" 
ON exam_seating_arrangements FOR SELECT 
USING (student_id = auth.uid()::text);

DROP POLICY IF EXISTS "Teachers read assigned room seating" ON exam_seating_arrangements;
CREATE POLICY "Teachers read assigned room seating" 
ON exam_seating_arrangements FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM exam_invigilators 
        WHERE exam_invigilators.room_id = exam_seating_arrangements.room_id 
        AND exam_invigilators.teacher_id = auth.uid()::text
    )
);

-- Invigilators: CoE & Admin full; Teachers read own duties
DROP POLICY IF EXISTS "CoE and Admin full access on invigilators" ON exam_invigilators;
CREATE POLICY "CoE and Admin full access on invigilators" 
ON exam_invigilators FOR ALL 
USING (auth_user_role() IN ('admin', 'examination_controller'));

DROP POLICY IF EXISTS "Teachers view own invigilation duties" ON exam_invigilators;
CREATE POLICY "Teachers view own invigilation duties" 
ON exam_invigilators FOR SELECT 
USING (teacher_id = auth.uid()::text);

-- Hall Tickets: CoE & Admin full; Students view own if eligible
DROP POLICY IF EXISTS "CoE and Admin full access on hall tickets" ON exam_hall_tickets;
CREATE POLICY "CoE and Admin full access on hall tickets" 
ON exam_hall_tickets FOR ALL 
USING (auth_user_role() IN ('admin', 'examination_controller'));

DROP POLICY IF EXISTS "Students read own hall tickets" ON exam_hall_tickets;
CREATE POLICY "Students read own hall tickets" 
ON exam_hall_tickets FOR SELECT 
USING (student_id = auth.uid()::text);

-- Malpractices: CoE & Admin full; Teachers can INSERT incident reports
DROP POLICY IF EXISTS "CoE and Admin full access on malpractices" ON exam_malpractices;
CREATE POLICY "CoE and Admin full access on malpractices" 
ON exam_malpractices FOR ALL 
USING (auth_user_role() IN ('admin', 'examination_controller'));

DROP POLICY IF EXISTS "Teachers can report malpractices" ON exam_malpractices;
CREATE POLICY "Teachers can report malpractices" 
ON exam_malpractices FOR INSERT 
WITH CHECK (reported_by = auth.uid()::text);

-- Student Marks: CoE & Admin full ALL; Teachers INSERT/UPDATE before deadline; Students SELECT ONLY if published
DROP POLICY IF EXISTS "CoE and Admin full access on student_marks" ON student_marks;
CREATE POLICY "CoE and Admin full access on student_marks" 
ON student_marks FOR ALL 
USING (auth_user_role() IN ('admin', 'examination_controller'));

DROP POLICY IF EXISTS "Teachers insert update marks" ON student_marks;
CREATE POLICY "Teachers insert update marks" 
ON student_marks FOR ALL 
USING (auth_user_role() = 'teacher');

DROP POLICY IF EXISTS "Students select published marks" ON student_marks;
CREATE POLICY "Students select published marks" 
ON student_marks FOR SELECT 
USING (is_published = true AND student_id = auth.uid()::text);

-- 6. SEED COMPREHENSIVE MOCK DATA
-- 6.1 Exam Cycles
INSERT INTO exam_cycles (
    id, name, academic_year, term, start_date, end_date, 
    marks_submission_deadline, results_publish_date, status
) VALUES 
(
    'CYCLE-2024-ODD',
    'Autumn End-Semester Examination 2024-25',
    '2024-2025',
    'Odd Semester',
    '2024-11-20',
    '2024-12-05',
    NOW() + INTERVAL '5 days',
    NOW() + INTERVAL '12 days',
    'evaluation'
),
(
    'CYCLE-2025-EVEN',
    'Spring Mid-Semester Examination 2024-25',
    '2024-2025',
    'Even Semester',
    '2025-03-10',
    '2025-03-22',
    NOW() + INTERVAL '45 days',
    NOW() + INTERVAL '60 days',
    'active'
) ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    marks_submission_deadline = EXCLUDED.marks_submission_deadline;

-- 6.2 Exam Rooms
INSERT INTO exam_rooms (id, room_number, building, capacity, rows_count, cols_count, is_active)
VALUES 
('ROOM-LH101', 'LH-101', 'Aryabhatta Lecture Hall Complex', 40, 8, 5, true),
('ROOM-LH102', 'LH-102', 'Aryabhatta Lecture Hall Complex', 40, 8, 5, true),
('ROOM-CSLAB1', 'CS-LAB-1', 'Turing Computing Center', 30, 6, 5, true),
('ROOM-ECLAB2', 'EC-LAB-2', 'Tesla Electronics Block', 30, 6, 5, true)
ON CONFLICT (id) DO UPDATE SET
    capacity = EXCLUDED.capacity,
    is_active = EXCLUDED.is_active;

-- 6.3 Update existing exams with cycle_id
UPDATE exams SET cycle_id = 'CYCLE-2024-ODD' WHERE cycle_id IS NULL;

-- 6.4 Hall Tickets Seed (for demo students '1', '20CS001', 'std1')
INSERT INTO exam_hall_tickets (
    cycle_id, student_id, is_eligible, debar_reason, attendance_percentage, fee_cleared, qr_token
) VALUES 
('CYCLE-2024-ODD', '1', true, NULL, 88.50, true, 'HT-2024-ODD-STD001-VERIFIED'),
('CYCLE-2024-ODD', '20CS001', true, NULL, 92.00, true, 'HT-2024-ODD-20CS001-VERIFIED'),
('CYCLE-2024-ODD', 'std1', true, NULL, 81.20, true, 'HT-2024-ODD-STD1-VERIFIED'),
('CYCLE-2024-ODD', '20CS002', false, 'Attendance below required threshold (62.4% < 75%)', 62.40, true, NULL),
('CYCLE-2024-ODD', '20CS003', false, 'Outstanding tuition fee balance exceeding limit (₹45,000)', 84.00, false, NULL)
ON CONFLICT (cycle_id, student_id) DO UPDATE SET
    is_eligible = EXCLUDED.is_eligible,
    attendance_percentage = EXCLUDED.attendance_percentage,
    fee_cleared = EXCLUDED.fee_cleared;

-- 6.5 Seating Arrangements Seed
INSERT INTO exam_seating_arrangements (
    exam_id, student_id, room_id, seat_code, bench_number, attended_status
) VALUES 
('1', '1', 'ROOM-LH101', 'R1-C1', 1, 'present'),
('1', '20CS001', 'ROOM-LH101', 'R1-C3', 2, 'present'),
('1', 'std1', 'ROOM-LH101', 'R2-C2', 4, 'present'),
('2', '1', 'ROOM-LH102', 'R1-C2', 1, 'present'),
('2', '20CS001', 'ROOM-LH102', 'R2-C1', 3, 'present')
ON CONFLICT (exam_id, student_id) DO UPDATE SET
    room_id = EXCLUDED.room_id,
    seat_code = EXCLUDED.seat_code,
    bench_number = EXCLUDED.bench_number;

-- 6.6 Exam Invigilators Seed
INSERT INTO exam_invigilators (
    exam_id, teacher_id, room_id, reporting_time, duty_status, notes
) VALUES 
('1', 'T001', 'ROOM-LH101', '08:30:00', 'confirmed', 'Chief Invigilator - LH101'),
('1', 'EMP-001', 'ROOM-LH102', '08:30:00', 'assigned', 'Assistant Invigilator'),
('2', 'T001', 'ROOM-LH102', '13:30:00', 'assigned', 'Chief Invigilator - LH102')
ON CONFLICT DO NOTHING;

-- 6.7 Exam Malpractices Seed
INSERT INTO exam_malpractices (
    exam_id, student_id, reported_by, incident_description, status, verdict
) VALUES 
(
    '1',
    '20CS002',
    'T001',
    'Possession of unauthorized electronic smartwatch during Data Structures examination.',
    'penalized',
    'Disciplinary Committee verdict: Exam cancelled for current subject and letter of reprimand issued.'
)
ON CONFLICT DO NOTHING;

-- 6.8 Exam Revaluations Seed
INSERT INTO exam_revaluations (
    student_id, course_code, original_marks, revised_marks, assigned_evaluator_id, status, remarks
) VALUES 
(
    '1',
    'CS301',
    75.00,
    82.00,
    'T001',
    'resolved',
    'Recalculation corrected in Question 4(b); +7 marks awarded.'
)
ON CONFLICT DO NOTHING;

-- 6.9 Mark some sample student marks as published for demo
UPDATE student_marks 
SET is_published = true, moderation_applied = false 
WHERE semester = '5th Semester' OR semester = '5';
