import { createContext, useContext, useEffect } from "react"

type Theme = "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: "light"
  setTheme: (theme: string) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("dark")
    root.classList.add("light")
    try {
      localStorage.setItem("campussync-ui-theme", "light")
      localStorage.setItem("vite-ui-theme", "light")
    } catch {
      // ignore
    }
  }, [])

  const value = {
    theme: "light" as const,
    setTheme: () => {
      // Dark mode completely removed - always remain light
      const root = window.document.documentElement
      root.classList.remove("dark")
      root.classList.add("light")
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}