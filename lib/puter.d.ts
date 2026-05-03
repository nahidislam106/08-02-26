// file: lib/puter.d.ts
interface PuterAIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface PuterAIOptions {
  model: string
  stream?: boolean
}

interface PuterAI {
  chat(
    messages: PuterAIMessage[],
    options?: PuterAIOptions
  ): Promise<AsyncIterable<string> | string>
}

interface Puter {
  ai: {
    chat(
      messages: PuterAIMessage[],
      options?: PuterAIOptions
    ): Promise<AsyncIterable<string> | string>
  }
}

declare global {
  interface Window {
    puter?: Puter
    waitForPuter?: () => Promise<Puter | undefined>
  }
}

export {}
