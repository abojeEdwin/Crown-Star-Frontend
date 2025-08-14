import React, { createContext, useContext } from "react"
import { useToast } from "../hooks/use-toast"

const ToastContext = createContext({})

export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }) {
  const toastHook = useToast()
  
  return (
    <ToastContext.Provider value={toastHook}>
      {children}
    </ToastContext.Provider>
  )
}
