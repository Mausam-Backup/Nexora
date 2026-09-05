import { useState, useEffect, useRef, useCallback } from 'react'
import { getVapiClient, resetVapiClient, isVapiConfigured, getVapiAssistantId } from '@/services/vapiService'

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

  const watchdogRef = useRef<NodeJS.Timeout | null>(null)
  const isConnectingRef = useRef(false)
  isConnectingRef.current = isConnecting

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current)
      watchdogRef.current = null
    }
  }, [])

  useEffect(() => {
    const vapi = getVapiClient()
    if (!vapi) return

    const handleCallConnected = () => {
      clearWatchdog()
      setIsConnecting(false)
      setCallActive(true)
      setIsListening(true)
      setError(null)
    }

    const handleCallEnd = () => {
      clearWatchdog()
      setCallActive(false)
      setIsConnecting(false)
      setIsSpeaking(false)
      setIsListening(false)
      setActiveTranscript('')
      setActiveSpeakerRole(null)
      setVolumeLevel(0)
    }

    const handleCallStartFailed = (err: any) => {
      clearWatchdog()
      setCallActive(false)
      setIsConnecting(false)
      const errorMsg = err?.error || err?.message || 'Failed to start voice call. Please verify microphone permission.'
      setError(errorMsg)
      optionsRef.current?.onError?.(errorMsg)
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
    }

    const handleError = (err: any) => {
      console.warn('Vapi Voice Warning/Error:', err)
      const errorMsg = typeof err === 'string' ? err : err?.message || err?.error || 'Voice session encounter an error.'
      setError(errorMsg)
      setIsConnecting(false)
      optionsRef.current?.onError?.(errorMsg)
    }

    vapi.on('call-start', handleCallConnected)
    vapi.on('call-start-success', handleCallConnected)
    vapi.on('call-start-failed', handleCallStartFailed)
    vapi.on('call-end', handleCallEnd)
    vapi.on('speech-start', handleSpeechStart)
    vapi.on('speech-end', handleSpeechEnd)
    vapi.on('volume-level', handleVolumeLevel)
    vapi.on('message', handleMessage)
    vapi.on('error', handleError)

    return () => {
      clearWatchdog()
      vapi.off('call-start', handleCallConnected)
      vapi.off('call-start-success', handleCallConnected)
      vapi.off('call-start-failed', handleCallStartFailed)
      vapi.off('call-end', handleCallEnd)
      vapi.off('speech-start', handleSpeechStart)
      vapi.off('speech-end', handleSpeechEnd)
      vapi.off('volume-level', handleVolumeLevel)
      vapi.off('message', handleMessage)
      vapi.off('error', handleError)
    }
  }, [clearWatchdog])

  const stopCall = useCallback(async () => {
    clearWatchdog()
    setIsConnecting(false)
    setCallActive(false)
    setIsSpeaking(false)
    setIsListening(false)
    setActiveTranscript('')
    setActiveSpeakerRole(null)
    setVolumeLevel(0)

    try {
      const vapi = getVapiClient()
      if (vapi) {
        await vapi.stop()
      }
    } catch (err) {
      console.error('Error stopping Vapi call:', err)
    } finally {
      resetVapiClient()
    }
  }, [clearWatchdog])

  const startCall = useCallback(async (systemPromptOverride?: string) => {
    setError(null)
    clearWatchdog()

    if (!isVapiConfigured()) {
      const err = 'Vapi Public Key is not configured. Please set VITE_VAPI_PUBLIC_KEY in your .env file.'
      setError(err)
      optionsRef.current?.onError?.(err)
      return
    }

    // Always reset client to ensure fresh clean connection state
    resetVapiClient()
    const vapi = getVapiClient()
    if (!vapi) {
      const err = 'Failed to initialize Vapi Web SDK client.'
      setError(err)
      optionsRef.current?.onError?.(err)
      return
    }

    try {
      setIsConnecting(true)

      // Watchdog timeout: abort if connection hangs past 15 seconds (e.g. unhandled mic dialog)
      watchdogRef.current = setTimeout(() => {
        if (isConnectingRef.current) {
          const timeoutMsg = 'Voice connection timed out. Please allow microphone access in your browser and try again.'
          setError(timeoutMsg)
          optionsRef.current?.onError?.(timeoutMsg)
          stopCall()
        }
      }, 15000)

      const assistantId = getVapiAssistantId()

      if (assistantId) {
        // Start with existing Assistant ID with concise overrides
        const result = await vapi.start(assistantId, {
          variableValues: {
            systemPrompt: (systemPromptOverride || '').slice(0, 800),
            liveErpContext: (systemPromptOverride || '').slice(0, 800),
          },
        })

        if (!result) {
          clearWatchdog()
          setIsConnecting(false)
          const failMsg = 'Could not start voice session. Please ensure your microphone is enabled in your browser.'
          setError(failMsg)
          optionsRef.current?.onError?.(failMsg)
          return
        }

        // Successfully initiated call
        clearWatchdog()
        setIsConnecting(false)
        setCallActive(true)
        setIsListening(true)
      } else {
        // Fallback inline assistant
        const result = await vapi.start({
          name: 'NEXORA Assistant',
          model: {
            provider: 'groq',
            model: 'llama-3.3-70b-versatile',
            messages: systemPromptOverride ? [
              {
                role: 'system',
                content: systemPromptOverride.slice(0, 800)
              }
            ] : undefined
          },
          voice: {
            provider: '11labs',
            voiceId: '21m00Tcm4TlvDq8ikWAM'
          },
          firstMessage: "Hello! I'm NEXORA Voice Assistant. Ask me anything about your timetable, attendance, marks, or fees."
        } as any)

        if (!result) {
          clearWatchdog()
          setIsConnecting(false)
          const failMsg = 'Could not start voice session. Please check microphone permissions.'
          setError(failMsg)
          optionsRef.current?.onError?.(failMsg)
          return
        }

        clearWatchdog()
        setIsConnecting(false)
        setCallActive(true)
        setIsListening(true)
      }
    } catch (err: any) {
      clearWatchdog()
      console.error('Error starting Vapi call:', err)
      setIsConnecting(false)
      setCallActive(false)
      const msg = err?.message || 'Failed to start voice call. Please check microphone access.'
      setError(msg)
      optionsRef.current?.onError?.(msg)
      resetVapiClient()
    }
  }, [clearWatchdog, stopCall])

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
