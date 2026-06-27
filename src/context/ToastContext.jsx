import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const toast = useCallback(
    (message, type = 'ok') => {
      const id = (idRef.current += 1)
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => dismiss(id), 2600)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-[fadeIn_.15s_ease-out] rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-soft ${
              t.type === 'err' ? 'bg-rose-600' : 'bg-slate-800 dark:bg-slate-700'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Returns a toast(message, type?) function. No-op if used outside the provider.
export function useToast() {
  const ctx = useContext(ToastContext)
  return ctx?.toast ?? (() => {})
}
