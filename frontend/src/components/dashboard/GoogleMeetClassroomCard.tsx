import React, { useState } from 'react'
import { Video, ExternalLink, Copy, Check, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import lecturePreviewImg from '@/assets/bento/lecture-preview.jpg'
import { useGoogleMeet } from '@/hooks/useGoogleMeet'

interface GoogleMeetClassroomCardProps {
  userRole?: 'student' | 'teacher' | 'admin'
  courseCode?: string
}

export const GoogleMeetClassroomCard: React.FC<GoogleMeetClassroomCardProps> = ({
  userRole = 'student',
  courseCode
}) => {
  const { activeMeet } = useGoogleMeet()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(activeMeet.meetUrl)
    setCopied(true)
    toast.success('Google Meet link copied to clipboard', {
      description: activeMeet.meetUrl
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleJoinMeet = () => {
    window.open(activeMeet.meetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="rounded-[28px] overflow-hidden shadow-sm border border-[#F5D5E2] relative group min-h-[320px] sm:min-h-[350px] flex flex-col justify-between select-none font-serif">
      {/* Authentic Classroom Photography Background */}
      <img
        src={lecturePreviewImg}
        alt="Active Classroom Lecture"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />

      {/* Gentle, cinematic vignette gradient (cleaner, less muddy) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50 pointer-events-none" />

      {/* TOP BAR: Clean & Minimalist Header */}
      <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#C85A32] text-white px-2.5 py-0.5 rounded-full font-serif shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
          </span>
          <span className="text-xs text-white/90 font-serif font-medium">
            {courseCode || activeMeet.courseCode} Section A
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#241411]/60 backdrop-blur-md border border-[#44251F] px-3 py-1 rounded-full text-xs text-white/90">
          <Users className="h-3 w-3 text-emerald-400" />
          <span>{activeMeet.activeParticipants} Online</span>
        </div>
      </div>

      {/* BOTTOM AREA: Title, Subtitle, and Sleek Floating Capsule Bar */}
      <div className="relative z-10 p-5 sm:p-6 space-y-4">
        {/* Title & Metadata */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif leading-snug drop-shadow-sm">
            {activeMeet.topic}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-serif pt-1">
            {activeMeet.instructor} • {activeMeet.room}
          </p>
        </div>

        {/* Unified Frosted Glass Action Capsule (Warm Espresso-Terracotta) */}
        <div className="bg-[#241411]/85 backdrop-blur-xl border border-[#44251F] rounded-2xl sm:rounded-full p-2 sm:pl-4 sm:pr-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xl">
          {/* Left: Google Meet URL with quick copy */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-4.5 h-4.5" viewBox="0 0 48 48" fill="none">
                <path d="M24 24L38 34V14L24 24Z" fill="#00AA4F" />
                <path d="M10 33.5C10 35.433 11.567 37 13.5 37H26.5C28.433 37 30 35.433 30 33.5V14.5C30 12.567 28.433 11 26.5 11H13.5C11.567 11 10 12.567 10 14.5V33.5Z" fill="#00832D" />
                <path d="M10 14.5V26.5L24 24L10 14.5Z" fill="#006622" />
                <path d="M24 24L30 20V28L24 24Z" fill="#2684FC" />
                <path d="M26.5 11H13.5C11.567 11 10 12.567 10 14.5L24 24L30 14.5C30 12.567 28.433 11 26.5 11Z" fill="#FFBA00" />
                <path d="M10 33.5C10 35.433 11.567 37 13.5 37H26.5C28.433 37 30 35.433 30 33.5L24 24L10 33.5Z" fill="#EA4335" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-[#D8B4AD] font-serif">Google Meet</div>
              <div className="text-xs font-mono font-medium text-white/90 truncate">
                {activeMeet.meetCode}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy Meet Link"
              className="p-1.5 rounded-lg text-[#D8B4AD] hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-1"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Right: Direct Join Button */}
          <Button
            onClick={handleJoinMeet}
            className="rounded-full bg-[#341B16] hover:bg-[#43231D] text-white border border-[#4E2A23] font-serif font-bold text-xs h-10 px-5 gap-2 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer shrink-0"
          >
            <Video className="h-3.5 w-3.5 text-emerald-400" />
            <span>{userRole === 'teacher' ? 'Join as Host' : 'Join Google Meet'}</span>
            <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GoogleMeetClassroomCard
