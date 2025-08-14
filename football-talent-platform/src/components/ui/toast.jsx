import * as React from "react"
import { cn } from "../../lib/utils"

const Toast = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border border-indigo-300 shadow-lg",
    destructive: "bg-gradient-to-r from-red-500 to-pink-600 text-white border border-red-300 shadow-lg",
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border border-emerald-300 shadow-lg",
    info: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-300 shadow-lg"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg p-4 shadow-xl transition-all duration-300 ease-in-out transform translate-x-0 animate-in slide-in-from-right-full hover:shadow-2xl backdrop-blur-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-white/80 opacity-100 transition-opacity hover:text-white hover:bg-white/20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
))
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

export { Toast, ToastAction, ToastClose, ToastTitle, ToastDescription }
