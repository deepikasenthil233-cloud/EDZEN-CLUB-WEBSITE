import { createClient } from '@supabase/supabase-js';
import { 
  UserProfile, 
  EventItem, 
  ContestItem, 
  CertificateItem, 
  ResourceItem, 
  AnnouncementItem, 
  NotificationItem, 
  IdeaSubmission, 
  EventFeedback, 
  BadgeItem, 
  AuditLog, 
  EventRegistration,
  QuestionItem,
  ContestSubmission
} from '../types';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// INITIAL REALTISTIC DEMO SEED DATA (NO PLACEHOLDERS)
// ============================================================================

export const MOCK_USERS: UserProfile[] = [];

export const MOCK_EVENTS: EventItem[] = [];

export const MOCK_CONTESTS: ContestItem[] = [];

export const MOCK_QUESTIONS: Record<string, QuestionItem[]> = {};

export const MOCK_CERTIFICATES: CertificateItem[] = [];

export const MOCK_RESOURCES: ResourceItem[] = [];

export const MOCK_ANNOUNCEMENTS: AnnouncementItem[] = [];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [];

export const MOCK_BADGES: BadgeItem[] = [];

export const MOCK_AUDIT_LOGS: AuditLog[] = [];

// ============================================================================
// DYNAMIC LOCAL STORAGE PERSISTENCE ENGINE
// ============================================================================

export class LocalStateEngine {
  private static getKey(table: string): string {
    return `edgezen_db_${table}`;
  }

  public static get<T>(table: string, fallback: T): T {
    try {
      const data = localStorage.getItem(this.getKey(table));
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  public static set<T>(table: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(table), JSON.stringify(value));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  }
}
