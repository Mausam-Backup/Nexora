import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/components/ui/badge'

interface ChatMessageContentProps {
  content: string
  role: 'user' | 'assistant'
}

export const ChatMessageContent: React.FC<ChatMessageContentProps> = ({ content, role }) => {
  if (role === 'user') {
    return <div className="text-sm whitespace-pre-wrap leading-relaxed">{content}</div>
  }

  return (
    <div className="text-sm leading-relaxed space-y-2 prose-invert max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-border/70 bg-card/50 shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/80 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider border-b border-border/70">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/40 text-foreground">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/40 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => {
            const textValue = String(children).trim()
            // Enhance grade badges (like A+, O, A, B)
            const isGrade = ['A+', 'A', 'O', 'B+', 'B', 'C', 'S', '10', '9', '8'].includes(textValue)
            return (
              <td className="px-3 py-2 text-xs whitespace-nowrap">
                {isGrade ? (
                  <Badge variant="outline" className="font-mono font-semibold py-0 px-1.5 text-[11px] bg-primary/10 text-primary border-primary/20">
                    {children}
                  </Badge>
                ) : (
                  children
                )}
              </td>
            )
          },
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed text-sm">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="my-2 space-y-1.5 list-disc pl-5 text-sm">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 space-y-1.5 list-decimal pl-5 text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          code: ({ inline, children }: any) => {
            return inline ? (
              <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs font-semibold text-primary">
                {children}
              </code>
            ) : (
              <div className="my-2.5 rounded-lg bg-zinc-950 p-3 font-mono text-xs text-zinc-100 overflow-x-auto border border-zinc-800">
                <code>{children}</code>
              </div>
            )
          },
          hr: () => <hr className="my-3 border-border/50" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/60 pl-3 italic text-muted-foreground my-2 text-xs">
              {children}
            </blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
