/**
 * Groq LLM Client-Side Service
 * High-speed, zero-hallucination academic reasoning engine grounded strictly in live ERP state.
 */

export interface GroundedUserContext {
  role: string
  name: string
  id: string
  department: string
  semester: number | string
  serializedErpJson: string
}

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqChatOptions {
  model?: string
  temperature?: number
  max_tokens?: number
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const PROD_GROQ_MODEL = 'openai/gpt-oss-120b'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'
const FALLBACK_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'groq/compound-mini']

/**
 * Checks if the Groq API key is present in Vite environment
 */
export function isGroqConfigured(): boolean {
  const apiKey = (import.meta.env.VITE_GROQ_API_KEY || '').trim()
  return Boolean(apiKey && apiKey !== 'YOUR_GROQ_API_KEY_HERE')
}

/**
 * Builds the strict grounded system prompt for NEXORA AskAI
 */
export function buildGroundedSystemPrompt(context: GroundedUserContext): string {
  return `You are "NEXORA Assistant" (AskAI), the official academic assistant for the NEXORA campus ERP.

CURRENT USER CONTEXT:
- Role: ${context.role || 'Student'}
- Name: ${context.name || 'Anonymous'} (${context.id || 'N/A'})
- Department: ${context.department || 'N/A'}
- Semester: ${context.semester || 'N/A'}
- Live ERP Data:
${context.serializedErpJson}

RULES:
1. Base your answers strictly on the provided Live ERP Data and user role. Never make up grades, dates, or attendance numbers.
2. If the data is absent from the context, state: "I don't have that record in your current file. Please consult your department office."
3. No filler text or conversational fluff ("As an AI...", "I'd be glad to help..."). Give direct, concise, and structured answers.
4. For students, protect privacy and provide actionable next steps.`
}

/**
 * Sends a chat completion request directly to the Groq API from the browser
 */
export async function sendGroqChatMessage(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userPrompt: string,
  context: GroundedUserContext,
  options?: GroqChatOptions
): Promise<string> {
  const apiKey = (import.meta.env.VITE_GROQ_API_KEY || '').trim()
  if (!apiKey) {
    throw new Error('Groq API Key is not configured. Please set VITE_GROQ_API_KEY in your .env file or Vercel Environment Variables.')
  }

  const primaryModel = options?.model || import.meta.env.VITE_GROQ_MODEL || PROD_GROQ_MODEL || DEFAULT_MODEL
  const temperature = options?.temperature ?? 0.2
  const max_tokens = options?.max_tokens ?? 800

  const systemPrompt = buildGroundedSystemPrompt(context)

  // Map conversation history (keep last 6 messages to stay concise)
  const conversationHistory: GroqMessage[] = messages.slice(-6).map((msg) => ({
    role: msg.role,
    content: msg.content
  }))

  const requestBody = (modelName: string) => ({
    model: modelName,
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userPrompt }
    ],
    temperature,
    max_tokens
  })

  // Prioritize configured model, followed by tested fallbacks
  const candidateModels = [primaryModel, ...FALLBACK_MODELS.filter(m => m !== primaryModel)]

  let lastError: Error | null = null
  for (let i = 0; i < candidateModels.length; i++) {
    const currentModel = candidateModels[i]
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody(currentModel))
      })

      if (!response.ok) {
        let errorDetail = ''
        try {
          const errJson = await response.json()
          errorDetail = errJson?.error?.message || JSON.stringify(errJson)
        } catch {
          errorDetail = await response.text()
        }

        // If the model is not found (404) or decommissioned (400), try fallback models
        if ((response.status === 404 || response.status === 400) && i < candidateModels.length - 1) {
          console.warn(`[Groq Failover] Model '${currentModel}' returned status ${response.status}. Trying '${candidateModels[i + 1]}'`)
          continue
        }

        throw new Error(`Groq API Error (${response.status}): ${errorDetail}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        throw new Error('Received an empty response from Groq LLM.')
      }

      return content.trim()
    } catch (err: any) {
      lastError = err
      if (err?.message?.includes('model') && i < candidateModels.length - 1) {
        continue
      }
      throw err
    }
  }

  throw lastError || new Error('Failed to obtain a response from Groq LLM.')
}
