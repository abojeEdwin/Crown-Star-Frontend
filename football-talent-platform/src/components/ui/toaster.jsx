import { useToastContext } from "../../contexts/ToastContext"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "./toast"

export function Toaster() {
  const { toasts, dismiss } = useToastContext()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3 max-w-sm w-full sm:max-w-sm">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="animate-in slide-in-from-right-full duration-300"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <Toast variant={toast.variant}>
            <div className="grid gap-1 flex-1">
              {toast.title && (
                <ToastTitle className="font-semibold text-sm">{toast.title}</ToastTitle>
              )}
              {toast.description && (
                <ToastDescription className="text-sm opacity-90">{toast.description}</ToastDescription>
              )}
            </div>
            <ToastClose onClick={() => dismiss(toast.id)} />
          </Toast>
        </div>
      ))}
    </div>
  )
}
