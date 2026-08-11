export type UserRole = 'super_admin' | 'faculty_coordinator' | 'student_coordinator' | 'student_member';

export type UserStatus = 'active' | 'pending' | 'suspended' | 'inactive';

export interface UserProfile {
  id: string;
  full_name: string;
  register_number: string;
  department: string;
  year: string; // e.g. "III Year"
  college_email: string;
  member_id: string; // e.g. "EDGEZEN2026001"
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  xp: number;
  level: number;
  streak_weeks: number;
  profile_completion_pct: number;
  joined_date: string;
  phone?: string;
  areas_of_interest?: string[];
  notification_preferences?: {
    email: boolean;
    in_app: boolean;
    contests: boolean;
    events: boolean;
  };
}

export type EventCategory = 'AI & ML' | 'Bootcamp' | 'Cyber Security' | 'Hackathon' | 'Workshop' | 'Guest Talk' | 'Seminar';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  event_date: string; // YYYY-MM-DD
  event_time: string;
  venue: string;
  max_participants: number;
  registration_deadline: string;
  organizer_id: string;
  organizer_name: string;
  poster_url: string;
  status: EventStatus;
  xp_reward: number;
  registered_count: number;
  created_at: string;
  qr_code_secret?: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  register_number: string;
  qr_pass_code: string;
  status: 'confirmed' | 'cancelled' | 'attended';
  checked_in: boolean;
  checked_in_at?: string;
  registered_at: string;
}

export type ContestCategory = 'Artificial Intelligence' | 'Machine Learning' | 'Cyber Security' | 'Python' | 'Data Science' | 'Web Development' | 'Prompt Engineering' | 'Logical Aptitude';

export type ContestDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type ContestStatus = 'upcoming' | 'live' | 'completed' | 'draft';

export interface ContestItem {
  id: string;
  title: string;
  description: string;
  category: ContestCategory;
  difficulty: ContestDifficulty;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  xp_reward: number;
  winner_xp_bonus: number;
  start_time: string;
  end_time: string;
  poster_url: string;
  status: ContestStatus;
  instructions: string[];
  allowed_attempts: number;
  created_at: string;
}

export type QuestionType = 'mcq' | 'coding' | 'descriptive' | 'file_upload' | 'image';

export interface QuestionItem {
  id: string;
  contest_id: string;
  question_text: string;
  question_type: QuestionType;
  options?: string[]; // for MCQ
  correct_answer: string;
  marks: number;
  negative_marks?: number;
  explanation?: string;
  tags?: string[];
}

export interface ContestSubmission {
  id: string;
  contest_id: string;
  student_id: string;
  student_name: string;
  answers: Record<string, string>; // questionId -> answer
  score: number;
  total_marks: number;
  time_taken_seconds: number;
  rank?: number;
  evaluated: boolean;
  submitted_at: string;
}

export type CertificateType = 'Participation' | 'Winner' | 'Runner-Up' | 'Volunteer' | 'Organizer' | 'Workshop' | 'Appreciation';

export interface CertificateItem {
  id: string;
  title: string;
  category: CertificateType;
  student_id: string;
  student_name: string;
  register_number: string;
  event_name: string;
  issue_date: string;
  certificate_number: string; // e.g. "CERT-EDGE-2026-902"
  qr_hash: string;
  file_url: string;
  status: 'available' | 'pending' | 'generated';
  created_at: string;
}

export type ResourceCategory = 
  | 'Artificial Intelligence'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Data Science'
  | 'Python Programming'
  | 'Cyber Security'
  | 'Web Development'
  | 'Cloud Computing'
  | 'Prompt Engineering'
  | 'Research Papers'
  | 'Placement Materials';

export type FileType = 'PDF' | 'PPT' | 'DOCX' | 'ZIP' | 'Video' | 'GitHub' | 'Source Code';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  file_type: FileType;
  file_url: string;
  external_link?: string;
  uploaded_by: string;
  download_count: number;
  file_size?: string;
  created_at: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  target_role?: string;
  target_dept?: string;
  banner_url?: string;
  posted_by: string;
  created_at: string;
  expires_at?: string;
  priority: 'normal' | 'urgent';
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'event' | 'contest' | 'certificate' | 'announcement' | 'badge' | 'system';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface IdeaSubmission {
  id: string;
  student_id: string;
  student_name: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  admin_comment?: string;
  created_at: string;
}

export interface EventFeedback {
  id: string;
  event_id: string;
  event_title: string;
  student_id: string;
  student_name: string;
  rating: number; // 1 to 5
  comments: string;
  suggestions?: string;
  anonymous: boolean;
  created_at: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'achievement' | 'contest' | 'attendance' | 'volunteer' | 'special';
  unlocked_at?: string;
  is_unlocked?: boolean;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'event' | 'contest' | 'certificate' | 'profile' | 'badge' | 'attendance';
}

export interface AuditLog {
  id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  details: string;
  ip_address?: string;
  created_at: string;
}

export interface SystemSettings {
  club_name: string;
  club_logo_url: string;
  maintenance_mode: boolean;
  xp_event_attend: number;
  xp_contest_participate: number;
  xp_contest_winner: number;
  xp_volunteer: number;
  xp_idea_approved: number;
  email_notifications_enabled: boolean;
  qr_attendance_expiry_minutes: number;
}
