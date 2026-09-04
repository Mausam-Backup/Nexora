export interface ActiveGoogleMeetClassroom {
  id: string
  courseCode: string
  courseName: string
  meetUrl: string
  meetCode: string
  instructor: string
  room: string
  activeParticipants: number
  startTime: string
  status: 'live' | 'scheduled' | 'ended'
  topic: string
}

const MEET_STORAGE_KEY = 'campussync-active-google-meet-v1'
const MEET_CHANNEL_NAME = 'campussync_meet_bus'

export const DEFAULT_ACTIVE_MEET: ActiveGoogleMeetClassroom = {
  id: 'meet-cs301-live',
  courseCode: 'CS301',
  courseName: 'Database Management Systems',
  topic: 'B-Tree & Indexing Relational Optimization',
  meetUrl: 'https://meet.google.com/nex-dbms-2025',
  meetCode: 'nex-dbms-2025',
  instructor: 'Prof. Rajesh Iyer',
  room: 'LH-101 Digital Amphitheatre',
  activeParticipants: 58,
  startTime: '09:30 AM',
  status: 'live'
}

class GoogleMeetService {
  private channel: BroadcastChannel | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(MEET_CHANNEL_NAME)
      } catch (e) {
        console.warn('BroadcastChannel not supported for meet bus', e)
      }
    }
  }

  getActiveMeet(): ActiveGoogleMeetClassroom {
    if (typeof window === 'undefined') return DEFAULT_ACTIVE_MEET
    const saved = localStorage.getItem(MEET_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse active Google Meet:', e)
      }
    }
    return DEFAULT_ACTIVE_MEET
  }

  setActiveMeet(meet: ActiveGoogleMeetClassroom) {
    if (typeof window === 'undefined') return
    localStorage.setItem(MEET_STORAGE_KEY, JSON.stringify(meet))
    this.channel?.postMessage({ type: 'MEET_UPDATE', meet })
  }

  onMeetChange(callback: (meet: ActiveGoogleMeetClassroom) => void): () => void {
    if (typeof window === 'undefined') return () => {}

    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'MEET_UPDATE' && event.data?.meet) {
        callback(event.data.meet)
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === MEET_STORAGE_KEY && e.newValue) {
        try {
          callback(JSON.parse(e.newValue))
        } catch (err) {
          console.error('Storage meet parse error:', err)
        }
      }
    }

    this.channel?.addEventListener('message', handleBroadcast)
    window.addEventListener('storage', handleStorage)

    return () => {
      this.channel?.removeEventListener('message', handleBroadcast)
      window.removeEventListener('storage', handleStorage)
    }
  }
}

export const meetService = new GoogleMeetService()
