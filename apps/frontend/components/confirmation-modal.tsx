"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} className="px-4 py-2">
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
