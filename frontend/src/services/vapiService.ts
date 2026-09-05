import Vapi from '@vapi-ai/web'

export interface VapiTranscriptMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

let vapiInstance: Vapi | null = null

/**
 * Returns the configured Vapi public key
 */
export function getVapiPublicKey(): string {
  return import.meta.env.VITE_VAPI_PUBLIC_KEY || ''
}

/**
 * Returns the optional configured Vapi assistant ID
 */
export function getVapiAssistantId(): string {
  return import.meta.env.VITE_VAPI_ASSISTANT_ID || ''
}

/**
 * Checks if Vapi is configured with a valid public key
 */
export function isVapiConfigured(): boolean {
  const key = getVapiPublicKey()
  return Boolean(key && key.trim() && key !== 'YOUR_VAPI_PUBLIC_KEY_HERE')
}

/**
 * Initializes and returns a singleton Vapi instance
 */
export function getVapiClient(): Vapi | null {
  const publicKey = getVapiPublicKey()
  if (!publicKey || publicKey === 'YOUR_VAPI_PUBLIC_KEY_HERE') {
    return null
  }

  if (!vapiInstance) {
    vapiInstance = new Vapi(publicKey)
  }
  return vapiInstance
}

/**
 * Reset Vapi client instance (e.g. on key change or cleanup)
 */
export function resetVapiClient(): void {
  if (vapiInstance) {
    try {
      vapiInstance.stop()
    } catch {
      // Ignore
    }
    vapiInstance = null
  }
}
