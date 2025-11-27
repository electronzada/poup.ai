'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { CheckCircle2 } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const isSuccess = variant === 'success'
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 w-full">
              {isSuccess && (
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              )}
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle className={isSuccess ? "text-green-900 dark:text-green-100" : ""}>{title}</ToastTitle>}
                {description && (
                  <ToastDescription className={isSuccess ? "text-green-800 dark:text-green-200" : ""}>
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className={isSuccess ? "text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100" : ""} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
