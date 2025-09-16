import React from 'react';
import { Toaster } from 'sonner';

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          color: 'black',
        },
        className: 'border border-gray-200 rounded-lg shadow-lg',
      }}
    />
  );
}