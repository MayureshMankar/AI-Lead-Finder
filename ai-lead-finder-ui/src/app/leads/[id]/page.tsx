'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Lead {
  id: string;
  position: string;
  company: string;
  location: string;
  url: string;
  status: string;
  tags: string[];
  description?: string;
  salary?: string;
  requirements?: string[];
  benefits?: string[];
  contact_info?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
  platform: string;
  response_received?: boolean;
  response_date?: string;
  follow_up_date?: string;
  custom_fields?: { key: string; value: string }[];
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingLead, setLoadingLead] = useState(false);
  const [dark, setDark] = useState(true);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [followUpDate, setFollowUpDate] = useState<Date | null>(null);
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<{ key: string; value: string }[]>([]);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tagLoading, setTagLoading] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [tagSuccess, setTagSuccess] = useState<string | null>(null);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);
  const [loadingEmailHistory, setLoadingEmailHistory] = useState(false);
  const [markingResponse, setMarkingResponse] = useState(false);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [leadScore, setLeadScore] = useState<number>(0);
  const [duplicateLeads, setDuplicateLeads] = useState<any[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    type: 'follow_up'
  });

  const toggleDarkMode = () => setDark(!dark);
  const isLight = !dark;

  const gradient = isLight
    ? "from-[var(--primary-light)] via-[var(--muted-light)] to-[var(--accent-light)]"
    : "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  const borderStyle = isLight ? "1px solid #ddd" : "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

  const followUpRef = useRef<any>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement(document.body);
    }
  }, []);

  useEffect(() => {
    const fetchLead = async () => {
      setLoadingLead(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          console.log('LEAD DATA:', data); // <--- Add this line
          // Defensive mapping: fill missing fields with placeholders
          setLead({
            id: data.id,
            position: data.position || 'N/A',
            company: data.company || 'N/A',
            location: data.location || 'N/A',
            url: data.url || '',
            status: data.status || 'new',
            tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
            description: data.description || '',
            salary: data.salary || '',
            requirements: data.requirements || [],
            benefits: data.benefits || [],
            contact_info: data.contact_info || {},
            notes: data.notes || '',
            created_at: data.created_at || '',
            updated_at: data.updated_at || '',
            platform: data.platform || '',
            response_received: data.response_received || false,
            response_date: data.response_date || '',
            follow_up_date: data.follow_up_date || '',
            custom_fields: data.custom_fields || [],
          });
          setNotes(data.notes || '');
          if (data.follow_up_date) {
            setFollowUpDate(new Date(data.follow_up_date));
          }
          if (data.custom_fields) {
            setCustomFields(data.custom_fields);
          }
        } else {
          // Generate mock data for demo
          setLead(generateMockLead());
        }
      } catch {
        setLead(generateMockLead());
      } finally {
        setLoadingLead(false);
      }
    };

    const fetchEmailHistory = async () => {
      setLoadingEmailHistory(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5001/api/leads/${id}/emails`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setEmailHistory(data.emails || []);
        } else {
          // Mock email history for demo
          setEmailHistory([
            {
              id: 1,
              subject: "Application for Senior Software Engineer",
              sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: "sent",
              template_used: "Initial Outreach"
            },
            {
              id: 2,
              subject: "Follow-up: Senior Software Engineer Position",
              sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: "sent",
              template_used: "Follow-up"
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch email history:', error);
        setEmailHistory([]);
      } finally {
        setLoadingEmailHistory(false);
      }
    };

    const fetchActivityLog = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5001/api/leads/${id}/activity`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setActivityLog(data.activities || []);
        } else {
          // Generate mock activity log
          const mockActivities = [
            {
              id: 1,
              type: 'created',
              description: 'Lead created',
              timestamp: lead?.created_at || new Date().toISOString(),
              user: user?.username || 'You'
            },
            {
              id: 2,
              type: 'status_changed',
              description: `Status changed to ${lead?.status}`,
              timestamp: lead?.updated_at || new Date().toISOString(),
              user: user?.username || 'You'
            },
            ...(lead?.notes ? [{
              id: 3,
              type: 'note_added',
              description: 'Note added',
              timestamp: lead?.updated_at || new Date().toISOString(),
              user: user?.username || 'You'
            }] : []),
            ...(lead?.follow_up_date ? [{
              id: 4,
              type: 'follow_up_scheduled',
              description: `Follow-up scheduled for ${new Date(lead.follow_up_date).toLocaleDateString()}`,
              timestamp: lead?.updated_at || new Date().toISOString(),
              user: user?.username || 'You'
            }] : [])
          ];
          setActivityLog(mockActivities);
        }
      } catch (error) {
        console.error('Failed to fetch activity log:', error);
        setActivityLog([]);
      }
    };

    if (id && isAuthenticated) {
      fetchLead();
      fetchEmailHistory();
      fetchActivityLog();
      calculateLeadScore();
      checkForDuplicates();
      fetchCalendarEvents();
    }
  }, [id, isAuthenticated, lead?.created_at, lead?.updated_at, lead?.notes, lead?.follow_up_date, user?.username]);

  useEffect(() => {
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const generateMockLead = (): Lead => ({
    id: id as string,
    position: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA (Remote)",
    url: "https://linkedin.com/jobs/view/123456",
    status: "active",
    tags: ["React", "TypeScript", "Full-stack", "Remote"],
    description: "We're looking for a Senior Software Engineer to join our growing team. You'll be responsible for building scalable web applications and mentoring junior developers.",
    salary: "$120,000 - $180,000",
    requirements: [
      "5+ years of experience in software development",
      "Strong knowledge of React, TypeScript, and Node.js",
      "Experience with cloud platforms (AWS, GCP)",
      "Excellent communication and leadership skills"
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible work hours and remote work",
      "Professional development budget"
    ],
    contact_info: {
      email: "hiring@techcorp.com",
      linkedin: "https://linkedin.com/in/techcorp-hiring"
    },
    notes: "Great company culture, interesting tech stack. Follow up in 3 days.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platform: "linkedin",
    response_received: false,
    follow_up_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    custom_fields: []
  });

  const updateLeadStatus = async (newStatus: string) => {
    if (!lead) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLead({ ...lead, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const saveNotes = async () => {
    if (!lead) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      if (res.ok) {
        setLead({ ...lead, notes });
        setSuccessMsg('Notes saved!');
        setTimeout(() => setSuccessMsg(''), 2000);
        setEditingNotes(false);
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = () => {
    // Deep copy lead to avoid mutation bugs
    if (lead) {
      setEditForm(JSON.parse(JSON.stringify(lead)));
    } else {
      setEditForm({});
    }
    setEditModalOpen(true);
  };
  const closeEditModal = () => setEditModalOpen(false);
  const openDeleteConfirm = () => setDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setDeleteConfirmOpen(false);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    if (!lead) return;
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      // Prepare payload with requirements/benefits as arrays
      const reqVal: unknown = editForm.requirements;
      const benVal: unknown = editForm.benefits;
      const payload = {
        ...editForm,
        requirements: Array.isArray(reqVal)
          ? reqVal
          : typeof reqVal === "string"
          ? reqVal.split(",").map((r: string) => r.trim()).filter(Boolean)
          : [],
        benefits: Array.isArray(benVal)
          ? benVal
          : typeof benVal === "string"
          ? benVal.split(",").map((b: string) => b.trim()).filter(Boolean)
          : [],
        contact_info: editForm.contact_info || {},
        custom_fields: editForm.custom_fields || [],
      };
      const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        console.log('Backend response after edit:', updated);
        
        // Ensure all fields are properly set
        const updatedLead = {
          ...updated,
          description: updated.description || '',
          salary: updated.salary || '',
          requirements: Array.isArray(updated.requirements) ? updated.requirements : [],
          benefits: Array.isArray(updated.benefits) ? updated.benefits : [],
          contact_info: updated.contact_info || {},
          tags: Array.isArray(updated.tags)
            ? updated.tags
            : typeof updated.tags === "string"
              ? updated.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
              : [],
        };
        
        console.log('Setting lead state to:', updatedLead);
        console.log('Description in updated lead:', updatedLead.description);
        console.log('Salary in updated lead:', updatedLead.salary);
        console.log('Requirements in updated lead:', updatedLead.requirements);
        console.log('Benefits in updated lead:', updatedLead.benefits);
        
        setLead(updatedLead);
        
        // Force a re-render by updating the notes state as well
        setNotes(updatedLead.notes || '');
        
        // If the backend response is missing key fields, trigger a refetch
        if (!updated.description && !updated.salary && (!updated.requirements || updated.requirements.length === 0) && (!updated.benefits || updated.benefits.length === 0)) {
          console.log('Backend response missing job details, will refetch on next render...');
          // Force a re-render by updating a dependency
          setLead(prev => prev ? { ...prev, updated_at: new Date().toISOString() } : null);
        }
        
        setSuccessMsg('Lead updated successfully!');
        setTimeout(() => setSuccessMsg(''), 2000);
        closeEditModal();
      } else {
        const errorData = await res.json();
        setError(errorData.msg || errorData.error || 'Failed to save edits.');
      }
    } catch (error) {
      setError('Failed to save edits.');
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async () => {
    if (!lead) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        router.push('/leads');
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const saveFollowUpDate = async () => {
    if (!lead) return;
    setSavingFollowUp(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ follow_up_date: followUpDate ? followUpDate.toISOString() : null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLead({
          ...updated,
          tags: Array.isArray(updated.tags)
            ? updated.tags
            : typeof updated.tags === "string"
              ? updated.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
              : [],
        });
        setSuccessMsg('Follow-up reminder saved!');
        setTimeout(() => setSuccessMsg(''), 2000);
        setEditingNotes(false); // Close notes editor if it was open

        // Schedule browser notification
        if (Notification && Notification.permission === "granted" && followUpDate) {
          const delay = new Date(followUpDate).getTime() - Date.now();
          if (delay > 0) {
            setTimeout(() => {
              new Notification("Follow-up Reminder", {
                body: `It's time to follow up on lead: ${lead?.position} at ${lead?.company}`,
              });
            }, delay);
          }
        }
      }
    } catch (error) {
      console.error('Failed to save follow-up date:', error);
    } finally {
      setSavingFollowUp(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Mock activity timeline data
  // const activityTimeline = [
  //   { type: 'created', label: 'Lead created', date: lead?.created_at },
  //   { type: 'status', label: `Status set to ${lead?.status}`, date: lead?.updated_at },
  //   ...(lead?.notes ? [{ type: 'note', label: 'Note added', date: lead?.updated_at }] : []),
  //   // Add more events as needed
  // ];

  const calculateLeadScore = () => {
    if (!lead) return;
    
    let score = 0;
    
    // Base score for having a lead
    score += 10;
    
    // Company size/quality (mock scoring)
    if (lead.company && lead.company.toLowerCase().includes('inc')) score += 5;
    if (lead.company && lead.company.toLowerCase().includes('corp')) score += 5;
    if (lead.company && lead.company.toLowerCase().includes('tech')) score += 3;
    
    // Location scoring
    if (lead.location && lead.location.toLowerCase().includes('remote')) score += 8;
    if (lead.location && (lead.location.toLowerCase().includes('san francisco') || lead.location.toLowerCase().includes('new york'))) score += 5;
    
    // Status scoring
    if (lead.status === 'active') score += 10;
    if (lead.status === 'pending') score += 5;
    if (lead.status === 'contacted') score += 8;
    
    // Response scoring
    if (lead.response_received) score += 15;
    
    // Notes scoring (engagement)
    if (lead.notes && lead.notes.length > 50) score += 5;
    
    // Follow-up scoring
    if (lead.follow_up_date) score += 3;
    
    // Contact info scoring
    if (lead.contact_info?.email) score += 5;
    if (lead.contact_info?.linkedin) score += 3;
    
    // Tags scoring
    if (lead.tags && lead.tags.length > 0) score += lead.tags.length * 2;
    
    setLeadScore(Math.min(score, 100)); // Cap at 100
  };

  const checkForDuplicates = async () => {
    if (!lead) return;
    setLoadingDuplicates(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/leads/duplicates?company=${encodeURIComponent(lead.company)}&position=${encodeURIComponent(lead.position)}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDuplicateLeads(data.duplicates || []);
      } else {
        // Mock duplicate detection
        const mockDuplicates = [
          {
            id: 'duplicate-1',
            position: lead.position,
            company: lead.company,
            location: 'New York, NY',
            status: 'active',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            similarity: 85
          },
          {
            id: 'duplicate-2',
            position: lead.position,
            company: lead.company,
            location: 'Remote',
            status: 'pending',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            similarity: 92
          }
        ];
        setDuplicateLeads(mockDuplicates);
      }
    } catch (error) {
      console.error('Failed to check duplicates:', error);
      setDuplicateLeads([]);
    } finally {
      setLoadingDuplicates(false);
    }
  };

  const fetchCalendarEvents = async () => {
    if (!lead) return;
    setLoadingCalendar(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/leads/${id}/calendar`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCalendarEvents(data.events || []);
      } else {
        // Mock calendar events
        const mockEvents = [
          {
            id: 1,
            title: `Follow-up: ${lead.position}`,
            date: lead.follow_up_date || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'follow_up',
            description: `Follow up with ${lead.company} regarding ${lead.position} position`
          },
          {
            id: 2,
            title: `Interview: ${lead.position}`,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'interview',
            description: `Interview with ${lead.company} for ${lead.position} position`
          }
        ];
        setCalendarEvents(mockEvents);
      }
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      setCalendarEvents([]);
    } finally {
      setLoadingCalendar(false);
    }
  };

  const addCalendarEvent = async () => {
    if (!newEvent.title.trim()) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/leads/${id}/calendar`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        const data = await res.json();
        setCalendarEvents([...calendarEvents, data.event]);
        setNewEvent({ title: '', date: new Date(), type: 'follow_up' });
        setShowCalendarModal(false);
        setSuccessMsg('Calendar event added!');
        setTimeout(() => setSuccessMsg(''), 2000);
      }
    } catch (error) {
      console.error('Failed to add calendar event:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'High Priority';
    if (score >= 60) return 'Medium Priority';
    if (score >= 40) return 'Low Priority';
    return 'Very Low Priority';
  };

  if (loading) {
    return (
              <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isLight ? "transparent" : "black", color: "var(--text)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-dark)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loadingLead) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: isLight ? "transparent" : "black", color: "var(--text)" }}>
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-dark)]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: isLight ? "transparent" : "black", color: "var(--text)" }}>
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-2">Error Loading Lead</h1>
            <p className="text-red-500 mb-4">{error}</p>
            <Link
              href="/leads"
              className="px-6 py-3 bg-[var(--accent-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Back to Leads
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: isLight ? "transparent" : "black", color: "var(--text)" }}>
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold mb-2">Lead Not Found</h1>
            <p className="mb-4">The lead you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/leads"
              className="px-6 py-3 bg-[var(--accent-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Back to Leads
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tagsArray: string[] = Array.isArray(lead.tags)
    ? lead.tags as string[]
    : typeof lead.tags === "string"
    ? (lead.tags as string).split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  // Replace the sendEmail function/button with navigation to the email page
  const handleGoToEmailPage = () => {
    if (lead && lead.id) {
      router.push(`/email?leadId=${lead.id}`);
    }
  };

  // Custom fields handlers
  const addCustomField = () => {
    if (!newFieldKey.trim()) return;
    setCustomFields([...customFields, { key: newFieldKey, value: newFieldValue }]);
    setNewFieldKey('');
    setNewFieldValue('');
  };
  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  // Tag handlers
  const addTag = async () => {
    if (!newTag.trim() || tagsArray.includes(newTag.trim())) return;
    const updatedTags = [...tagsArray, newTag.trim()];
    setTagLoading(true);
    setTagError(null);
    setTagSuccess(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags: updatedTags }),
      });
      if (res.ok) {
        setLead({ ...lead, tags: updatedTags });
        setSuccessMsg('Tag added!');
        setTimeout(() => setSuccessMsg(''), 2000);
        setTagSuccess('Tag added!');
        setNewTag('');
      } else {
        setTagError('Failed to add tag.');
      }
    } catch {
      setTagError('Failed to add tag.');
    } finally {
      setTagLoading(false);
      setTimeout(() => setTagSuccess(null), 1500);
    }
  };
  const removeTag = async (tag: string) => {
    const updatedTags = tagsArray.filter((t: string) => t !== tag);
    setTagLoading(true);
    setTagError(null);
    setTagSuccess(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags: updatedTags }),
      });
      if (res.ok) {
        setLead({ ...lead, tags: updatedTags });
        setSuccessMsg('Tag removed!');
        setTimeout(() => setSuccessMsg(''), 2000);
        setTagSuccess('Tag removed!');
      } else {
        setTagError('Failed to remove tag.');
      }
    } catch {
      setTagError('Failed to remove tag.');
    } finally {
      setTagLoading(false);
      setTimeout(() => setTagSuccess(null), 1500);
    }
  };

  const saveAnalyticsEdit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const reqVal: unknown = editForm.requirements;
      const benVal: unknown = editForm.benefits;
      const payload = {
        ...editForm,
        requirements: typeof reqVal === 'string'
          ? reqVal.split(',').map((r: string) => r.trim()).filter(Boolean)
          : Array.isArray(reqVal)
            ? reqVal
            : String(reqVal).split(',').map((r: string) => r.trim()).filter(Boolean),
        benefits: typeof benVal === 'string'
          ? benVal.split(',').map((b: string) => b.trim()).filter(Boolean)
          : Array.isArray(benVal)
            ? benVal
            : String(benVal).split(',').map((b: string) => b.trim()).filter(Boolean),
        contact_info: editForm.contact_info || {},
        custom_fields: editForm.custom_fields || [],
      };
      const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setLead({
          ...updated,
          tags: Array.isArray(updated.tags)
            ? updated.tags
            : typeof updated.tags === "string"
              ? updated.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
              : [],
        });
        setEditForm(updated);
        setSuccessMsg('Analytics saved!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.msg || errorData.error || 'Failed to save edits.');
      }
    } catch (error) {
      setError('Failed to save edits.');
    } finally {
      setSaving(false);
    }
  };

  const markResponseReceived = async () => {
    if (!lead) return;
    setMarkingResponse(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5001/api/lead/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          response_received: true,
          response_date: new Date().toISOString()
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLead({
          ...updated,
          response_received: true,
          response_date: new Date().toISOString()
        });
        setSuccessMsg('Response marked as received!');
        setTimeout(() => setSuccessMsg(''), 2000);
      }
    } catch (error) {
      console.error('Failed to mark response:', error);
    } finally {
      setMarkingResponse(false);
    }
  };

  return (
    <>
      <Navigation />
      {successMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
          {successMsg}
        </div>
      )}
      <div className="min-h-screen font-sans w-full max-w-6xl mx-auto px-6 pt-20 relative z-0 transition-all duration-1000" style={{ color: "var(--text)" }}>
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start min-h-[80vh] py-10">
          {/* Main Content (2 columns) */}
          <div className={`lg:col-span-2 ${((!lead.description && !lead.salary && (!lead.requirements || lead.requirements.length === 0) && (!lead.benefits || lead.benefits.length === 0)) && !(lead.contact_info && (lead.contact_info.email || lead.contact_info.phone || lead.contact_info.linkedin))) ? '' : 'space-y-8'}`}>
            {/* Header */}
            <div className="mb-4">
              <Link href="/leads" className="text-sm text-[var(--accent-dark)] hover:underline mb-2 inline-block">← Back to Leads</Link>
              <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>{lead.position}</h1>
              <p className="text-lg" style={{ color: "var(--text-muted-dark)" }}>{lead.company} • {lead.location}</p>
            </div>
            {/* Lead Summary Card */}
            <div className="glass-neumorphic p-8 rounded-3xl mb-4">
              <h2 className="text-xl font-semibold mb-2 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Lead Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Left column: ID, Position, Company */}
                <div className="space-y-1">
                  <div><b>ID:</b> {lead.id}</div>
                  <div><b>Position:</b> {lead.position}</div>
                  <div><b>Company:</b> {lead.company}</div>
                </div>
                {/* Right column: Location, Status, URL */}
                <div className="space-y-1">
                  <div><b>Location:</b> {lead.location}</div>
                  <div><b>Status:</b> {lead.status}</div>
                  <div><b>URL:</b> {lead.url ? <a href={lead.url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-dark)] underline">View Job</a> : 'N/A'}</div>
                </div>
              </div>
              <div className="mt-2"><b>Tags:</b> {lead.tags && lead.tags.length > 0 ? lead.tags.join(', ') : 'None'}</div>
            </div>

            {/* Conditionally render Notes, Timeline, Communication Tools, Analytics, and Custom Fields cards together in a 2-column grid below the Lead Summary Card if Job Details and Contact Info are not available. Remove these cards from the sidebar in this case. */}
            {!(lead.description || lead.salary || (lead.requirements && lead.requirements.length > 0) || (lead.benefits && lead.benefits.length > 0)) &&
             !(lead.contact_info && (lead.contact_info.email || lead.contact_info.phone || lead.contact_info.linkedin)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Notes Card */}
                <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                  <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                    background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>Notes</h2>
                  {editingNotes ? (
                    <div className="space-y-3">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                        style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                        placeholder="Add your notes here..."
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={saveNotes}
                          disabled={saving}
                          className="px-4 py-2 bg-[var(--accent-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingNotes(false);
                            setNotes(lead.notes || '');
                          }}
                          className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                          style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                      {notes || "No notes added yet."}
                    </div>
                  )}
                </div>
                {/* Timeline Card */}
                <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                  <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                    background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>Timeline</h2>
                  <div className="space-y-3">
                    {activityLog.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                        <div>
                          <div className="text-sm font-medium">{activity.description}</div>
                          <div className="text-xs" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Communication Tools Card */}
                <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                  <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                    background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>Communication Tools</h2>
                  
                  {/* Response Tracking */}
                  <div className="mb-4 p-3 rounded-lg border" style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Response Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.response_received 
                          ? 'bg-green-900/20 text-green-400' 
                          : 'bg-yellow-900/20 text-yellow-400'
                      }`}>
                        {lead.response_received ? 'Received' : 'Pending'}
                      </span>
                    </div>
                    {lead.response_received && lead.response_date && (
                      <div className="text-xs" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        Received on: {new Date(lead.response_date).toLocaleDateString()}
                      </div>
                    )}
                    {!lead.response_received && (
                      <button
                        onClick={markResponseReceived}
                        disabled={markingResponse}
                        className="w-full px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {markingResponse ? 'Marking...' : 'Mark Response Received'}
                      </button>
                    )}
                  </div>

                  {/* Email History */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Email History</h3>
                    {loadingEmailHistory ? (
                      <div className="text-xs text-center py-2">Loading...</div>
                    ) : emailHistory.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {emailHistory.map((email) => (
                          <div key={email.id} className="text-xs p-2 rounded border" style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}>
                            <div className="font-medium">{email.subject}</div>
                            <div style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                              {new Date(email.sent_at).toLocaleDateString()} • {email.template_used}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-center py-2" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        No emails sent yet
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleGoToEmailPage}
                    disabled={sendingEmail}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm mb-2 disabled:opacity-50"
                  >
                    {sendingEmail ? 'Sending...' : '📧 Send Outreach'}
                  </button>
                  {emailStatus && <div className="text-sm mt-2 text-center text-green-700 dark:text-green-300">{emailStatus}</div>}
                </div>
                {/* Analytics Card */}
                <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                  <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                    background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>Analytics</h2>
                  <div className="text-sm mb-4">
                    <div><b>Time since saved:</b> {lead.created_at ? Math.round((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)) + ' days' : 'N/A'}</div>
                    <div><b>Status:</b> {lead.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={openEditModal} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">Edit</button>
                    <button onClick={saveAnalyticsEdit} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">Save</button>
                    <button onClick={openDeleteConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">Delete</button>
                  </div>
                </div>
              </div>
            )}
            {/* Job Details Card */}
            <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
              <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Job Details</h2>
              {(!lead.description && !lead.salary && (!lead.requirements || lead.requirements.length === 0) && (!lead.benefits || lead.benefits.length === 0)) && (
                <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
                  <b>Note:</b> No job details available. You can add description, salary, requirements, and benefits using the Edit button.
                </div>
              )}
              {lead.description && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm leading-relaxed" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                    {lead.description}
                  </p>
                </div>
              )}
              {lead.salary && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Salary Range</h3>
                  <p className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                    {lead.salary}
                  </p>
                </div>
              )}
              {lead.requirements && lead.requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {lead.requirements.map((req, index) => (
                      <li key={index} className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lead.benefits && lead.benefits.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Benefits</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {lead.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Contact Info Card */}
            <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
              <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Contact Information</h2>
              {(!lead.contact_info || (!lead.contact_info.email && !lead.contact_info.phone && !lead.contact_info.linkedin)) && (
                <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
                  <b>Note:</b> No contact information available. You can add email, phone, and LinkedIn using the Edit button.
                </div>
              )}
              <div className="space-y-3">
                {lead.contact_info?.email && (
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📧</span>
                    <a
                      href={`mailto:${lead.contact_info.email}`}
                      className="text-[var(--accent-dark)] hover:underline"
                    >
                      {lead.contact_info.email}
                    </a>
                  </div>
                )}
                {lead.contact_info?.phone && (
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📞</span>
                    <a
                      href={`tel:${lead.contact_info.phone}`}
                      className="text-[var(--accent-dark)] hover:underline"
                    >
                      {lead.contact_info.phone}
                    </a>
                  </div>
                )}
                {lead.contact_info?.linkedin && (
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💼</span>
                    <a
                      href={lead.contact_info.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-dark)] hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
            {/* Analytics Card */}
            <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden mt-8">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
              <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Analytics</h2>
              <div className="text-sm mb-4">
                <div><b>Time since saved:</b> {lead.created_at ? Math.round((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)) + ' days' : 'N/A'}</div>
                <div><b>Status:</b> {lead.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={openEditModal} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">Edit</button>
                <button onClick={saveAnalyticsEdit} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">Save</button>
                <button onClick={openDeleteConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">Delete</button>
              </div>
            </div>
          </div>
          {/* Sidebar (1 column) */}
          <div className="flex flex-col gap-8">
            {/* Status & Actions Card */}
            <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
              <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Status & Actions</h2>
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Update Status</label>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(e.target.value)}
                      className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                      style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                    >
                      <option value="new">New</option>
                      <option value="active">Active</option>
                      <option value="contacted">Contacted</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Follow-up Reminder</label>
                    <DatePicker
                      ref={followUpRef}
                      selected={followUpDate}
                      onChange={(date) => setFollowUpDate(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                      placeholderText="Set follow-up date"
                    />
                    <button
                      onClick={saveFollowUpDate}
                      disabled={savingFollowUp}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {savingFollowUp ? 'Saving...' : 'Save Reminder'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleGoToEmailPage}
                      disabled={sendingEmail}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {sendingEmail ? 'Sending...' : '📧 Send Outreach'}
                    </button>
                    <button
                      onClick={() => followUpRef.current && followUpRef.current.setFocus && followUpRef.current.setFocus()}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      type="button"
                    >
                      📅 Schedule Follow-up
                    </button>
                    <button
                      onClick={saveAnalyticsEdit}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      type="button"
                    >
                      📊 Add to Analytics
                    </button>
                    {emailStatus && <div className="text-xs text-green-700 dark:text-green-300 mt-1">{emailStatus}</div>}
                  </div>
                </div>
            </div>
            {/* Tags Card */}
            <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
              <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Tags</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tagsArray.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-2 text-xs text-red-500" disabled={tagLoading}>✕</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="p-1 rounded border flex-1"
                    disabled={tagLoading}
                  />
                  <button onClick={addTag} className="px-2 py-1 bg-blue-500 text-white rounded" disabled={tagLoading}>Add</button>
                </div>
                {tagLoading && <div className="text-xs text-blue-500 mt-1">Updating tags...</div>}
                {tagError && <div className="text-xs text-red-500 mt-1">{tagError}</div>}
                {tagSuccess && <div className="text-xs text-green-600 mt-1">{tagSuccess}</div>}
            </div>

            {/* Lead Score Card */}
            <div className="glass-neumorphic p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
              <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Lead Score</h2>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(leadScore)}`}>
                  {leadScore}/100
                </div>
                <div className="text-sm font-medium mb-3">{getScoreLabel(leadScore)}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${leadScore}%`,
                      background: leadScore >= 80 ? '#10B981' : leadScore >= 60 ? '#F59E0B' : leadScore >= 40 ? '#F97316' : '#EF4444'
                    }}
                  ></div>
                </div>
                <div className="text-xs" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                  Based on company, location, status, and engagement
                </div>
              </div>
            </div>

            {/* Duplicate Detection Card */}
            <div className="glass-neumorphic p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
              <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Similar Leads</h2>
              {loadingDuplicates ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-dark)] mx-auto"></div>
                </div>
              ) : duplicateLeads.length > 0 ? (
                <div className="space-y-3">
                  {duplicateLeads.slice(0, 3).map((duplicate) => (
                    <div key={duplicate.id} className="p-3 rounded-lg border" style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}>
                      <div className="text-sm font-medium">{duplicate.position}</div>
                      <div className="text-xs" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        {duplicate.company} • {duplicate.location}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          duplicate.status === 'active' ? 'bg-green-900/20 text-green-400' :
                          duplicate.status === 'pending' ? 'bg-yellow-900/20 text-yellow-400' :
                          'bg-red-900/20 text-red-400'
                        }`}>
                          {duplicate.status}
                        </span>
                        <span className="text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded">
                          {duplicate.similarity}% match
                        </span>
                      </div>
                    </div>
                  ))}
                  {duplicateLeads.length > 3 && (
                    <div className="text-center">
                      <button className="text-xs text-[var(--accent-dark)] hover:underline">
                        View {duplicateLeads.length - 3} more...
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                    No similar leads found
                  </div>
                </div>
              )}
            </div>

            {/* Calendar Integration Card */}
            <div className="glass-neumorphic p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text" style={{
                  background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>Calendar</h2>
                <button
                  onClick={() => setShowCalendarModal(true)}
                  className="text-xs bg-[var(--accent-dark)] text-white px-2 py-1 rounded hover:bg-opacity-90 transition-colors"
                >
                  + Add Event
                </button>
              </div>
              {loadingCalendar ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-dark)] mx-auto"></div>
                </div>
              ) : calendarEvents.length > 0 ? (
                <div className="space-y-3">
                  {calendarEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="p-3 rounded-lg border" style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}>
                      <div className="text-sm font-medium">{event.title}</div>
                      <div className="text-xs" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs mt-1" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        {event.type === 'follow_up' ? '📅 Follow-up' : event.type === 'interview' ? '🎯 Interview' : '📝 Event'}
                      </div>
                    </div>
                  ))}
                  {calendarEvents.length > 3 && (
                    <div className="text-center">
                      <button className="text-xs text-[var(--accent-dark)] hover:underline">
                        View {calendarEvents.length - 3} more events...
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                    No calendar events
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        {/* Modals and other sections remain, but update their container classes to glass-neumorphic, rounded-3xl, and modern styles as above */}
        {/* Edit Modal */}
        <Modal
          isOpen={editModalOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Lead"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-50"
        >
          <div className="bg-[var(--card-dark)] text-[var(--text)] border border-[var(--border-dark)] rounded-2xl p-6 w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <h2 className="text-2xl font-bold mb-4">Edit Lead</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input name="position" value={editForm.position || ''} onChange={handleEditChange} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input name="company" value={editForm.company || ''} onChange={handleEditChange} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input name="location" value={editForm.location || ''} onChange={handleEditChange} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input name="url" value={editForm.url || ''} onChange={handleEditChange} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={editForm.status || ''} onChange={handleEditSelectChange} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]">
                  <option value="new">New</option>
                  <option value="active">Active</option>
                  <option value="contacted">Contacted</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <input name="salary" value={editForm.salary || ''} onChange={handleEditChange} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" rows={3} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Requirements (comma separated)</label>
                <input name="requirements" value={Array.isArray(editForm.requirements) ? editForm.requirements.join(', ') : (editForm.requirements || '')} onChange={e => setEditForm({ ...editForm, requirements: e.target.value.split(',').map((r: string) => r.trim()).filter(Boolean) })} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Benefits (comma separated)</label>
                <input name="benefits" value={Array.isArray(editForm.benefits) ? editForm.benefits.join(', ') : (editForm.benefits || '')} onChange={e => setEditForm({ ...editForm, benefits: e.target.value.split(',').map((b: string) => b.trim()).filter(Boolean) })} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email</label>
                  <input name="contact_info.email" value={editForm.contact_info?.email || ''} onChange={e => setEditForm({ ...editForm, contact_info: { ...editForm.contact_info, email: e.target.value } })} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Phone</label>
                  <input name="contact_info.phone" value={editForm.contact_info?.phone || ''} onChange={e => setEditForm({ ...editForm, contact_info: { ...editForm.contact_info, phone: e.target.value } })} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact LinkedIn</label>
                  <input name="contact_info.linkedin" value={editForm.contact_info?.linkedin || ''} onChange={e => setEditForm({ ...editForm, contact_info: { ...editForm.contact_info, linkedin: e.target.value } })} className="w-full p-2 rounded border mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Custom Fields</label>
                <div className="space-y-2">
                  {(editForm.custom_fields && Array.isArray(editForm.custom_fields) ? editForm.custom_fields : []).map((field, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        className="p-2 rounded border flex-1 mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]"
                        placeholder="Key"
                        value={field.key}
                        onChange={e => {
                          const updated = [...(editForm.custom_fields || [])];
                          updated[idx] = { ...updated[idx], key: e.target.value };
                          setEditForm({ ...editForm, custom_fields: updated });
                        }}
                      />
                      <input
                        className="p-2 rounded border flex-1 mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]"
                        placeholder="Value"
                        value={field.value}
                        onChange={e => {
                          const updated = [...(editForm.custom_fields || [])];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setEditForm({ ...editForm, custom_fields: updated });
                        }}
                      />
                      <button
                        className="text-red-500 px-2"
                        onClick={() => {
                          const updated = [...(editForm.custom_fields || [])];
                          updated.splice(idx, 1);
                          setEditForm({ ...editForm, custom_fields: updated });
                        }}
                        type="button"
                      >✕</button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input
                      className="p-2 rounded border flex-1 mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]"
                      placeholder="New Key"
                      value={newFieldKey}
                      onChange={e => setNewFieldKey(e.target.value)}
                    />
                    <input
                      className="p-2 rounded border flex-1 mb-2 bg-[var(--input-dark)] text-[var(--text)] border-[var(--border-dark)]"
                      placeholder="New Value"
                      value={newFieldValue}
                      onChange={e => setNewFieldValue(e.target.value)}
                    />
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                      type="button"
                      onClick={() => {
                        if (!newFieldKey.trim()) return;
                        setEditForm({
                          ...editForm,
                          custom_fields: [...(editForm.custom_fields || []), { key: newFieldKey, value: newFieldValue }],
                        });
                        setNewFieldKey('');
                        setNewFieldValue('');
                      }}
                    >Add</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSaveEdit} disabled={saving} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={closeEditModal} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">Cancel</button>
            </div>
          </div>
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteConfirmOpen}
          onRequestClose={closeDeleteConfirm}
          contentLabel="Delete Lead"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl relative">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p className="text-lg mb-4">Are you sure you want to delete this lead? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={closeDeleteConfirm} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors text-sm">Cancel</button>
              <button onClick={deleteLead} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">Delete</button>
            </div>
          </div>
        </Modal>
        <style jsx>{`
          @keyframes pattern-float {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
        `}</style>
      </div>

      {/* Calendar Modal */}
      <Modal
        isOpen={showCalendarModal}
        onRequestClose={() => setShowCalendarModal(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-semibold mb-4">Add Calendar Event</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-2 rounded border"
                placeholder="e.g., Follow-up call"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Event Type</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="w-full p-2 rounded border"
              >
                <option value="follow_up">Follow-up</option>
                <option value="interview">Interview</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date & Time</label>
              <DatePicker
                selected={newEvent.date}
                onChange={(date) => setNewEvent({ ...newEvent, date: date || new Date() })}
                showTimeSelect
                dateFormat="Pp"
                className="w-full p-2 rounded border"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addCalendarEvent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Event
              </button>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
