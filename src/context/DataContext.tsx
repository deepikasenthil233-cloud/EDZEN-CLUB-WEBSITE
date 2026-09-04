import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EventItem,
  EventRegistration,
  ContestItem,
  QuestionItem,
  ContestSubmission,
  CertificateItem,
  ResourceItem,
  AnnouncementItem,
  NotificationItem,
  IdeaSubmission,
  EventFeedback,
  AuditLog,
  ActivityLog,
  SystemSettings
} from '../types';
import {
  MOCK_EVENTS,
  MOCK_CONTESTS,
  MOCK_QUESTIONS,
  MOCK_CERTIFICATES,
  MOCK_RESOURCES,
  MOCK_ANNOUNCEMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_AUDIT_LOGS,
  LocalStateEngine
} from '../services/supabase';
import { useAuth } from './AuthContext';

interface DataContextType {
  events: EventItem[];
  eventRegistrations: EventRegistration[];
  contests: ContestItem[];
  questions: Record<string, QuestionItem[]>;
  submissions: ContestSubmission[];
  certificates: CertificateItem[];
  resources: ResourceItem[];
  bookmarkedResourceIds: string[];
  announcements: AnnouncementItem[];
  notifications: NotificationItem[];
  ideas: IdeaSubmission[];
  feedbacks: EventFeedback[];
  auditLogs: AuditLog[];
  activityLogs: ActivityLog[];
  settings: SystemSettings;
  
  // Actions
  registerForEvent: (eventId: string) => void;
  checkInQrPass: (qrPassCode: string) => { success: boolean; message: string };
  addEvent: (event: EventItem) => void;
  addContest: (contest: ContestItem, questList: QuestionItem[]) => void;
  submitContestAnswers: (contestId: string, answers: Record<string, string>, timeTakenSec: number) => { score: number; totalMarks: number; xpEarned: number };
  toggleBookmarkResource: (resourceId: string) => void;
  incrementDownloadCount: (resourceId: string) => void;
  addResource: (resource: ResourceItem) => void;
  addAnnouncement: (announcement: AnnouncementItem) => void;
  submitIdea: (title: string, description: string, category: string) => void;
  updateIdeaStatus: (ideaId: string, status: IdeaSubmission['status'], comment?: string) => void;
  submitFeedback: (eventId: string, rating: number, comments: string, suggestions?: string, anonymous?: boolean) => void;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  uploadCertificate: (cert: CertificateItem) => void;
  addAuditLog: (action: string, details: string) => void;
  awardXp: (amount: number, reason: string) => void;
  deleteEvent: (eventId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateProfile } = useAuth();

  const [events, setEvents] = useState<EventItem[]>(() => LocalStateEngine.get('events', MOCK_EVENTS));
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(() => LocalStateEngine.get('event_registrations', []));
  const [contests, setContests] = useState<ContestItem[]>(() => LocalStateEngine.get('contests', MOCK_CONTESTS));
  const [questions, setQuestions] = useState<Record<string, QuestionItem[]>>(() => LocalStateEngine.get('questions', MOCK_QUESTIONS));
  const [submissions, setSubmissions] = useState<ContestSubmission[]>(() => LocalStateEngine.get('submissions', []));
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => LocalStateEngine.get('certificates', MOCK_CERTIFICATES));
  const [resources, setResources] = useState<ResourceItem[]>(() => LocalStateEngine.get('resources', MOCK_RESOURCES));
  const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState<string[]>(() => LocalStateEngine.get('bookmarks', []));
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => LocalStateEngine.get('announcements', MOCK_ANNOUNCEMENTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => LocalStateEngine.get('notifications', MOCK_NOTIFICATIONS));
  const [ideas, setIdeas] = useState<IdeaSubmission[]>(() => LocalStateEngine.get('ideas', []));
  const [feedbacks, setFeedbacks] = useState<EventFeedback[]>(() => LocalStateEngine.get('feedbacks', []));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => LocalStateEngine.get('audit_logs', MOCK_AUDIT_LOGS));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => LocalStateEngine.get('activity_logs', []));

  const [settings] = useState<SystemSettings>({
    club_name: 'EDGEZEN AI Club',
    club_logo_url: '/logo.svg',
    maintenance_mode: false,
    xp_event_attend: 10,
    xp_contest_participate: 25,
    xp_contest_winner: 100,
    xp_volunteer: 20,
    xp_idea_approved: 40,
    email_notifications_enabled: true,
    qr_attendance_expiry_minutes: 180
  });

  // Sync to local storage
  useEffect(() => LocalStateEngine.set('events', events), [events]);
  useEffect(() => LocalStateEngine.set('event_registrations', eventRegistrations), [eventRegistrations]);
  useEffect(() => LocalStateEngine.set('contests', contests), [contests]);
  useEffect(() => LocalStateEngine.set('questions', questions), [questions]);
  useEffect(() => LocalStateEngine.set('submissions', submissions), [submissions]);
  useEffect(() => LocalStateEngine.set('certificates', certificates), [certificates]);
  useEffect(() => LocalStateEngine.set('resources', resources), [resources]);
  useEffect(() => LocalStateEngine.set('bookmarks', bookmarkedResourceIds), [bookmarkedResourceIds]);
  useEffect(() => LocalStateEngine.set('announcements', announcements), [announcements]);
  useEffect(() => LocalStateEngine.set('notifications', notifications), [notifications]);
  useEffect(() => LocalStateEngine.set('ideas', ideas), [ideas]);
  useEffect(() => LocalStateEngine.set('feedbacks', feedbacks), [feedbacks]);
  useEffect(() => LocalStateEngine.set('audit_logs', auditLogs), [auditLogs]);
  useEffect(() => LocalStateEngine.set('activity_logs', activityLogs), [activityLogs]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setEvents(prev => {
      const updatedEvents = prev.map(event => event.event_date < today && event.status === 'upcoming'
        ? { ...event, status: 'completed' as const }
        : event
      );
      return updatedEvents.some((event, index) => event !== prev[index]) ? updatedEvents : prev;
    });
  }, []);

  const addAuditLog = (action: string, details: string) => {
    if (!currentUser) return;
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      user_name: currentUser.full_name,
      user_role: currentUser.role,
      action,
      details,
      created_at: new Date().toLocaleString()
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const awardXp = (amount: number, reason: string) => {
    if (!currentUser) return;
    const newXp = currentUser.xp + amount;
    const newLevel = Math.min(100, Math.floor(newXp / 100) + 1);
    updateProfile({ xp: newXp, level: newLevel });

    // Add activity log
    const act: ActivityLog = {
      id: `act-${Date.now()}`,
      user_id: currentUser.id,
      title: `Earned +${amount} XP`,
      description: reason,
      timestamp: new Date().toLocaleDateString(),
      type: 'profile'
    };
    setActivityLogs(prev => [act, ...prev]);

    // Add notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: currentUser.id,
      title: `+${amount} XP Awarded! ⚡`,
      message: `You earned ${amount} XP for: ${reason}`,
      type: 'badge',
      is_read: false,
      created_at: 'Just now'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const registerForEvent = (eventId: string) => {
    if (!currentUser) return;
    const existing = eventRegistrations.find(r => r.event_id === eventId && r.student_id === currentUser.id);
    if (existing) return;

    const event = events.find(e => e.id === eventId);
    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      event_id: eventId,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_email: currentUser.college_email,
      register_number: currentUser.register_number,
      qr_pass_code: `PASS-${eventId.toUpperCase()}-${currentUser.register_number}`,
      status: 'confirmed',
      checked_in: false,
      registered_at: new Date().toISOString()
    };

    setEventRegistrations(prev => [...prev, newReg]);
    if (event) {
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registered_count: e.registered_count + 1 } : e));
    }

    addAuditLog('EVENT_REGISTER', `Registered for event: ${event?.title || eventId}`);
    awardXp(10, `Registered for event ${event?.title}`);
  };

  const checkInQrPass = (qrPassCode: string): { success: boolean; message: string } => {
    const reg = eventRegistrations.find(r => r.qr_pass_code.toLowerCase() === qrPassCode.trim().toLowerCase());
    if (!reg) {
      return { success: false, message: 'Invalid or unrecognized QR Event Pass code.' };
    }
    if (reg.checked_in) {
      return { success: false, message: `Student ${reg.student_name} was ALREADY checked in for this event.` };
    }

    setEventRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, checked_in: true, checked_in_at: new Date().toISOString() } : r));
    addAuditLog('QR_ATTENDANCE_CHECKIN', `Marked attendance for ${reg.student_name} (${reg.register_number})`);
    
    return {
      success: true,
      message: `Successfully checked in ${reg.student_name} (${reg.register_number})! +10 XP awarded.`
    };
  };

  const addEvent = (newEvent: EventItem) => {
    setEvents(prev => [newEvent, ...prev]);
    addAuditLog('CREATE_EVENT', `Created new event: ${newEvent.title}`);
  };

  const deleteEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      addAuditLog('DELETE_EVENT', `Deleted event: ${event.title}`);
    }
  };

  const addContest = (newContest: ContestItem, questList: QuestionItem[]) => {
    setContests(prev => [newContest, ...prev]);
    setQuestions(prev => ({ ...prev, [newContest.id]: questList }));
    addAuditLog('CREATE_CONTEST', `Created weekly contest: ${newContest.title}`);
  };

  const submitContestAnswers = (contestId: string, answers: Record<string, string>, timeTakenSec: number) => {
    if (!currentUser) return { score: 0, totalMarks: 100, xpEarned: 0 };
    const qList = questions[contestId] || [];
    let calculatedScore = 0;
    let totalMarks = 0;

    qList.forEach(q => {
      totalMarks += q.marks;
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const correctAns = (q.correct_answer || '').trim().toLowerCase();
      if (q.question_type === 'mcq') {
        if (userAns === correctAns) {
          calculatedScore += q.marks;
        } else if (userAns && q.negative_marks) {
          calculatedScore -= q.negative_marks;
        }
      } else {
        // Descriptive or coding keyword matching auto-evaluation demo fallback
        if (userAns.length > 10) {
          calculatedScore += Math.floor(q.marks * 0.9);
        }
      }
    });

    calculatedScore = Math.max(0, calculatedScore);
    const contest = contests.find(c => c.id === contestId);
    const baseReward = contest ? contest.xp_reward : 25;
    const isWinner = calculatedScore >= (contest?.passing_marks || 50);
    const totalXp = baseReward + (isWinner ? (contest?.winner_xp_bonus || 50) : 0);

    const sub: ContestSubmission = {
      id: `sub-${Date.now()}`,
      contest_id: contestId,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      answers,
      score: calculatedScore,
      total_marks: totalMarks || 100,
      time_taken_seconds: timeTakenSec,
      evaluated: true,
      submitted_at: new Date().toISOString()
    };

    setSubmissions(prev => [...prev, sub]);
    awardXp(totalXp, `Completed Contest: ${contest?.title || 'Weekly Contest'}`);
    addAuditLog('SUBMIT_CONTEST', `Submitted contest ${contest?.title} with score ${calculatedScore}/${totalMarks}`);

    return { score: calculatedScore, totalMarks: totalMarks || 100, xpEarned: totalXp };
  };

  const toggleBookmarkResource = (resourceId: string) => {
    setBookmarkedResourceIds(prev => 
      prev.includes(resourceId) ? prev.filter(id => id !== resourceId) : [...prev, resourceId]
    );
  };

  const incrementDownloadCount = (resourceId: string) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, download_count: r.download_count + 1 } : r));
  };

  const addResource = (resource: ResourceItem) => {
    setResources(prev => [resource, ...prev]);
    addAuditLog('UPLOAD_RESOURCE', `Uploaded resource: ${resource.title}`);
  };

  const addAnnouncement = (ann: AnnouncementItem) => {
    setAnnouncements(prev => [ann, ...prev]);
    addAuditLog('PUBLISH_ANNOUNCEMENT', `Published announcement: ${ann.title}`);
  };

  const submitIdea = (title: string, description: string, category: string) => {
    if (!currentUser) return;
    const idea: IdeaSubmission = {
      id: `idea-${Date.now()}`,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      title,
      description,
      category,
      status: 'pending',
      created_at: new Date().toLocaleDateString()
    };
    setIdeas(prev => [idea, ...prev]);
    awardXp(10, 'Submitted new event/project idea');
  };

  const updateIdeaStatus = (ideaId: string, status: IdeaSubmission['status'], comment?: string) => {
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status, admin_comment: comment } : i));
    if (status === 'approved') {
      const idea = ideas.find(i => i.id === ideaId);
      if (idea) {
        addAuditLog('APPROVE_IDEA', `Approved student idea: ${idea.title}`);
      }
    }
  };

  const submitFeedback = (eventId: string, rating: number, comments: string, suggestions?: string, anonymous: boolean = false) => {
    if (!currentUser) return;
    const event = events.find(e => e.id === eventId);
    const fb: EventFeedback = {
      id: `fb-${Date.now()}`,
      event_id: eventId,
      event_title: event?.title || 'Club Event',
      student_id: currentUser.id,
      student_name: anonymous ? 'Anonymous Member' : currentUser.full_name,
      rating,
      comments,
      suggestions,
      anonymous,
      created_at: new Date().toLocaleDateString()
    };
    setFeedbacks(prev => [fb, ...prev]);
    awardXp(10, 'Submitted event feedback');
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const uploadCertificate = (cert: CertificateItem) => {
    setCertificates(prev => [cert, ...prev]);
    addAuditLog('UPLOAD_CERTIFICATE', `Uploaded certificate: ${cert.title} for ${cert.student_name}`);
  };

  return (
    <DataContext.Provider value={{
      events,
      eventRegistrations,
      contests,
      questions,
      submissions,
      certificates,
      resources,
      bookmarkedResourceIds,
      announcements,
      notifications,
      ideas,
      feedbacks,
      auditLogs,
      activityLogs,
      settings,
      registerForEvent,
      checkInQrPass,
      addEvent,
      deleteEvent,
      addContest,
      submitContestAnswers,
      toggleBookmarkResource,
      incrementDownloadCount,
      addResource,
      addAnnouncement,
      submitIdea,
      updateIdeaStatus,
      submitFeedback,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      uploadCertificate,
      addAuditLog,
      awardXp
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
