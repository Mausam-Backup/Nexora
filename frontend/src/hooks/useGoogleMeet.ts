import { useState, useEffect, useCallback } from 'react'
import { meetService, ActiveGoogleMeetClassroom, DEFAULT_ACTIVE_MEET } from '@/services/meetService'

export function useGoogleMeet() {
  const [activeMeet, setActiveMeetState] = useState<ActiveGoogleMeetClassroom>(() => meetService.getActiveMeet())

  useEffect(() => {
    const unsubscribe = meetService.onMeetChange((newMeet) => {
      setActiveMeetState(newMeet)
    })
    return unsubscribe
  }, [])

  const updateActiveMeet = useCallback((meet: ActiveGoogleMeetClassroom) => {
    meetService.setActiveMeet(meet)
    setActiveMeetState(meet)
  }, [])

  const createMeet = useCallback((params: {
    courseCode: string
    courseName: string
    topic: string
    meetUrl: string
    instructor: string
    room?: string
  }) => {
    let code = params.meetUrl
    if (code.includes('meet.google.com/')) {
      code = code.split('meet.google.com/')[1].split('?')[0]
    }
    const newMeet: ActiveGoogleMeetClassroom = {
      id: `meet-${params.courseCode.toLowerCase()}-${Date.now()}`,
      courseCode: params.courseCode,
      courseName: params.courseName,
      topic: params.topic,
      meetUrl: params.meetUrl.startsWith('http') ? params.meetUrl : `https://meet.google.com/${params.meetUrl}`,
      meetCode: code,
      instructor: params.instructor,
      room: params.room || 'Digital Amphitheatre LH-101',
      activeParticipants: Math.floor(Math.random() * 20) + 45,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'live'
    }
    meetService.setActiveMeet(newMeet)
    setActiveMeetState(newMeet)
    return newMeet
  }, [])

  return {
    activeMeet,
    updateActiveMeet,
    createMeet
  }
}
