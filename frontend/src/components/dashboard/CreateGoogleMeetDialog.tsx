import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Video, Plus, Check, Sparkles } from 'lucide-react'
import { useGoogleMeet } from '@/hooks/useGoogleMeet'
import { toast } from 'sonner'

interface CreateGoogleMeetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateGoogleMeetDialog: React.FC<CreateGoogleMeetDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { activeMeet, createMeet } = useGoogleMeet()
  const [courseCode, setCourseCode] = useState('CS301')
  const [courseName, setCourseName] = useState('Database Management Systems')
  const [topic, setTopic] = useState('B-Tree & Indexing Relational Optimization')
  const [meetUrl, setMeetUrl] = useState('https://meet.google.com/nex-dbms-2025')
  const [instructor, setInstructor] = useState('Prof. Rajesh Iyer')
  const [room, setRoom] = useState('LH-101 Digital Amphitheatre')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetUrl.trim() || !topic.trim()) {
      toast.error('Please enter a valid Google Meet link and lecture topic')
      return
    }

    createMeet({
      courseCode,
      courseName,
      topic,
      meetUrl,
      instructor,
      room
    })

    toast.success('Active Google Meet Classroom Published!', {
      description: `Course ${courseCode} live meet updated across all student and faculty dashboards.`
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md font-serif bg-[#FDF2F5] border border-[#F5D5E2] rounded-[28px] text-neutral-900 shadow-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#241411] text-white border border-[#44251F] flex items-center justify-center shadow-xs">
              <Video className="h-4 w-4 text-emerald-400" />
            </div>
            <DialogTitle className="text-lg font-bold font-serif text-neutral-900">
              Create Active Google Meet Classroom
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-neutral-600 font-serif">
            Broadcast a live Google Meet classroom session to all student and faculty dashboards in real time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-serif text-neutral-700">Course Code</Label>
              <Input
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CS301"
                className="bg-white border-[#F5D5E2] text-xs h-9 font-serif"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-serif text-neutral-700">Instructor Name</Label>
              <Input
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="e.g. Prof. Rajesh Iyer"
                className="bg-white border-[#F5D5E2] text-xs h-9 font-serif"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-serif text-neutral-700">Course Full Title</Label>
            <Input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. Database Management Systems"
              className="bg-white border-[#F5D5E2] text-xs h-9 font-serif"
              required
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-serif text-neutral-700">Lecture Topic / Active Module</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. B-Tree & Indexing Relational Optimization"
              className="bg-white border-[#F5D5E2] text-xs h-9 font-serif"
              required
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-serif text-neutral-700">Google Meet URL or Code</Label>
            <Input
              value={meetUrl}
              onChange={(e) => setMeetUrl(e.target.value)}
              placeholder="https://meet.google.com/xxx-yyyy-zzz"
              className="bg-white border-[#F5D5E2] text-xs h-9 font-serif font-mono"
              required
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-serif text-neutral-700">Designated Lecture Hall</Label>
            <Input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. LH-101 Digital Amphitheatre"
              className="bg-white border-[#F5D5E2] text-xs h-9 font-serif"
              required
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full border-[#F5D5E2] bg-white text-xs font-serif"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] text-xs font-bold font-serif px-5 cursor-pointer shadow-xs"
            >
              <Video className="h-3.5 w-3.5 mr-1 text-emerald-400" />
              Publish Live Google Meet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGoogleMeetDialog
