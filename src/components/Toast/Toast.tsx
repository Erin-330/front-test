import { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ message, onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const id = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(id)
  }, [duration, onClose])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <div className="pointer-events-auto max-w-md rounded-md bg-gray-900/95 px-4 py-3 text-sm text-white shadow-lg">
        {message}
      </div>
    </div>
  )
}
