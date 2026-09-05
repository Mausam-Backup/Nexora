import { useState, useEffect, useRef, useCallback } from 'react'
import { getVapiClient, isVapiConfigured, getVapiAssistantId } from '@/services/vapiService'

export interface UseVapiOptions {
  onSpeechMessage?: (role: 'user' | 'assistant', transcript: string) => void
  onError?: (error: Error | string) => void
}

export function useVapi(options?: UseVapiOptions) {
  const [callActive, setCallActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [activeTranscript, setActiveTranscript] = useState('')
  const [activeSpeakerRole, setActiveSpeakerRole] = useState<'user' | 'assistant' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const vapi = getVapiClient()
    if (!vapi) return

    const handleCallStart = () => {
      setIsConnecting(false)
      setCallActive(true)
      setIsListening(true)
      setError(null)
    }

    const handleCallEnd = () => {
      setCallActive(false)
      setIsConnecting(false)
      setIsSpeaking(false)
      setIsListening(false)
      setActiveTranscript('')
      setActiveSpeakerRole(null)
      setVolumeLevel(0)
    }

    const handleSpeechStart = () => {
      setIsSpeaking(true)
    }

    const handleSpeechEnd = () => {
      setIsSpeaking(false)
    }

    const handleVolumeLevel = (volume: number) => {
      setVolumeLevel(volume)
    }

    const handleMessage = (message: any) => {
      if (!message) return

      // Handle transcript events
      if (message.type === 'transcript') {
        const role = message.role === 'user' ? 'user' : 'assistant'
        const text = message.transcript || ''
        const transcriptType = message.transcriptType // 'partial' | 'final'

        setActiveSpeakerRole(role)
        setActiveTranscript(text)

        if (transcriptType === 'final' && text.trim()) {
          optionsRef.current?.onSpeechMessage?.(role, text.trim())
          setActiveTranscript('')
        }
      }

      // Handle conversation updates
      if (message.type === 'conversation-update' && Array.isArray(message.messages)) {
        // Can inspect if needed
      }
    }

    const handleError = (err: any) => {
      console.error('Vapi Voice Error:', err)
      const errorMsg = typeof err === 'string' ? err : err?.message || 'Voice session encounter an error.'
      setError(errorMsg)
      setIsConnecting(false)
      optionsRef.current?.onError?.(errorMsg)
    }

    vapi.on('call-start', handleCallStart)
    vapi.on('call-end', handleCallEnd)
    vapi.on('speech-start', handleSpeechStart)
    vapi.on('speech-end', handleSpeechEnd)
    vapi.on('volume-level', handleVolumeLevel)
    vapi.on('message', handleMessage)
    vapi.on('error', handleError)

    return () => {
      vapi.off('call-start', handleCallStart)
      vapi.off('call-end', handleCallEnd)
      vapi.off('speech-start', handleSpeechStart)
      vapi.off('speech-end', handleSpeechEnd)
      vapi.off('volume-level', handleVolumeLevel)
      vapi.off('message', handleMessage)
      vapi.off('error', handleError)
    }
  }, [])

  const startCall = useCallback(async (systemPromptOverride?: string) => {
    setError(null)
    if (!isVapiConfigured()) {
      const err = 'Vapi Public Key is not configured. Please set VITE_VAPI_PUBLIC_KEY in your .env file.'
      setError(err)
      optionsRef.current?.onError?.(err)
      return
    }

    const vapi = getVapiClient()
    if (!vapi) {
      const err = 'Failed to initialize Vapi Web SDK client.'
      setError(err)
      optionsRef.current?.onError?.(err)
      return
    }

    try {
      setIsConnecting(true)
      const assistantId = getVapiAssistantId()

      if (assistantId) {
        // Start with existing Assistant ID and runtime variable overrides
        await vapi.start(assistantId, {
          variableValues: {
            systemPrompt: systemPromptOverride || '',
            liveErpContext: systemPromptOverride || '',
          },
        })
      } else {
        // Start with inline Assistant configuration powered by Llama 3 on Groq
        await vapi.start({
          name: 'NEXORA Assistant',
          model: {
            provider: 'groq',
            model: 'llama-3.3-70b-versatile',
            messages: systemPromptOverride ? [
              {
                role: 'system',
                content: systemPromptOverride
              }
            ] : undefined
          },
          voice: {
            provider: '11labs',
            voiceId: '21m00Tcm4TlvDq8ikWAM' // Rachel voice
          },
          firstMessage: "Hello! I'm NEXORA Assistant. Ask me anything about your timetable, attendance, marks, or fees."
        } as any)
      }
    } catch (err: any) {
      console.error('Error starting Vapi call:', err)
      setIsConnecting(false)
      const msg = err?.message || 'Failed to start voice call'
      setError(msg)
      optionsRef.current?.onError?.(msg)
    }
  }, [])

  const stopCall = useCallback(async () => {
    const vapi = getVapiClient()
    if (!vapi) return
    try {
      await vapi.stop()
    } catch (err) {
      console.error('Error stopping Vapi call:', err)
    } finally {
      setCallActive(false)
      setIsConnecting(false)
      setIsSpeaking(false)
      setIsListening(false)
      setActiveTranscript('')
      setActiveSpeakerRole(null)
      setVolumeLevel(0)
    }
  }, [])

  const toggleCall = useCallback(async (systemPromptOverride?: string) => {
    if (callActive || isConnecting) {
      await stopCall()
    } else {
      await startCall(systemPromptOverride)
    }
  }, [callActive, isConnecting, startCall, stopCall])

  return {
    callActive,
    isConnecting,
    isSpeaking,
    isListening,
    volumeLevel,
    activeTranscript,
    activeSpeakerRole,
    error,
    isConfigured: isVapiConfigured(),
    startCall,
    stopCall,
    toggleCall
  }
}
