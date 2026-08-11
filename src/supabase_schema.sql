-- ====================================================================
-- EDGEZEN AI CLUB MANAGEMENT & STUDENT ENGAGEMENT PLATFORM
-- PRODUCTION POSTGRESQL SCHEMA FOR SUPABASE
-- ====================================================================

-- 1. EXTENSIONS & COMPATIBILITY
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure auth schema & users table exists for standalone PostgreSQL / Docker compatibility
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    register_number TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    college_email TEXT UNIQUE NOT NULL,
    member_id TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'faculty_coordinator', 'student_coordinator', 'student_member')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'inactive')),
    avatar_url TEXT,
    bio TEXT,
    skills TEXT[],
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    streak_weeks INT DEFAULT 1,
    profile_completion_pct INT DEFAULT 85,
    joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    phone TEXT,
    areas_of_interest TEXT[],
    notification_preferences JSONB DEFAULT '{"email": true, "in_app": true, "contests": true, "events": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT NOT NULL,
    venue TEXT NOT NULL,
    max_participants INT DEFAULT 100,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    poster_url TEXT,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    xp_reward INT DEFAULT 10,
    registered_count INT DEFAULT 0,
    qr_code_secret TEXT UNIQUE DEFAULT uuid_generate_v4()::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EVENT REGISTRATIONS & ATTENDANCE
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    qr_pass_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, student_id)
);

-- 5. WEEKLY CONTESTS TABLE
CREATE TABLE IF NOT EXISTS public.contests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    duration_minutes INT DEFAULT 30,
    total_marks INT DEFAULT 100,
    passing_marks INT DEFAULT 50,
    xp_reward INT DEFAULT 25,
    winner_xp_bonus INT DEFAULT 100,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    poster_url TEXT,
    status TEXT DEFAULT 'live' CHECK (status IN ('upcoming', 'live', 'completed', 'draft')),
    instructions TEXT[],
    allowed_attempts INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CONTEST QUESTIONS
CREATE TABLE IF NOT EXISTS public.contest_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'coding', 'descriptive', 'file_upload', 'image')),
    options JSONB,
    correct_answer TEXT NOT NULL,
    marks INT DEFAULT 10,
    negative_marks INT DEFAULT 0,
    explanation TEXT,
    tags TEXT[]
);

-- 7. CONTEST SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.contest_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score INT DEFAULT 0,
    total_marks INT DEFAULT 100,
    time_taken_seconds INT DEFAULT 0,
    rank INT,
    evaluated BOOLEAN DEFAULT TRUE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contest_id, student_id)
);

-- 8. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Participation', 'Winner', 'Runner-Up', 'Volunteer', 'Organizer', 'Workshop', 'Appreciation')),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    issue_date DATE NOT NULL,
    certificate_number TEXT UNIQUE NOT NULL,
    qr_hash TEXT UNIQUE NOT NULL,
    file_url TEXT NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'generated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. RESOURCE LIBRARY
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    external_link TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    download_count INT DEFAULT 0,
    file_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. RESOURCE BOOKMARKS
CREATE TABLE IF NOT EXISTS public.resource_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource_id, student_id)
);

-- 11. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_role TEXT,
    target_dept TEXT,
    banner_url TEXT,
    posted_by TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. IDEAS SUBMISSION PORTAL
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. EVENT FEEDBACK
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT NOT NULL,
    suggestions TEXT,
    anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- 17. INITIAL SETTINGS SEED
INSERT INTO public.system_settings (key, value) VALUES
('platform_config', '{
    "club_name": "EDGEZEN AI Club",
    "maintenance_mode": false,
    "xp_event_attend": 10,
    "xp_contest_participate": 25,
    "xp_contest_winner": 100,
    "xp_volunteer": 20,
    "xp_idea_approved": 40,
    "email_notifications_enabled": true,
    "qr_attendance_expiry_minutes": 180
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 18. AUTOMATIC TRIGGER FOR XP LEVEL UP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level := LEAST(100, GREATEST(1, FLOOR(NEW.xp / 100) + 1));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_user_level_update
BEFORE UPDATE OF xp ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_user_level();
