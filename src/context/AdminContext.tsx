import React, { createContext, useState } from 'react';
export const AdminContextData = createContext<any>(null);
export default function AdminContext({children}:any) {
    const [AdminUser,setAdminUser] = useState(null);
  return (
    <AdminContextData.Provider value={{
        AdminUser,setAdminUser,
    }}>
        {children}
    </AdminContextData.Provider>
  )
}