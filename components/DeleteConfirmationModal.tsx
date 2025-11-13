"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Eliminar foto",
  message = "Estàs segur que vols eliminar aquesta foto? Aquesta acció no es pot desfer.",
  confirmText = "Eliminar",
  cancelText = "Cancel·lar"
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl border-2 border-destructive/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-destructive/10 p-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="ml-auto h-8 w-8 rounded-full p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Message */}
        <p className="mb-6 text-muted-foreground">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}