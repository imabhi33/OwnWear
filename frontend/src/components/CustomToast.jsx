import React from 'react';
import { Toaster } from 'sonner';

export default function CustomToast() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          border: '2px solid',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        },
        className: 'custom-toast',
        duration: 3000,
        success: {
          style: {
            borderColor: '#10b981',
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          },
          icon: '✅',
        },
        error: {
          style: {
            borderColor: '#ef4444',
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          },
          icon: '❌',
        },
        warning: {
          style: {
            borderColor: '#f59e0b',
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          },
          icon: '⚠️',
        },
        info: {
          style: {
            borderColor: '#3b82f6',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          },
          icon: 'ℹ️',
        },
      }}
    />
  );
}
