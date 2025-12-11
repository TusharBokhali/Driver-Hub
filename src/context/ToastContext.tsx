import React, { createContext, useState } from 'react';
export const ToastShow = createContext<any>(null);
export default function ToastContext({children}:any) {
    const [Toast,setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'info'
  })
  return (
    <ToastShow.Provider value={{Toast,setToast}}>
        {children}
    </ToastShow.Provider>
  )
}