import React, { createContext, useState } from 'react';

export const User:any = createContext<any>(null);
export default function UserContext({children}:any) {
    const [user,setUser] = useState<any>(null);
    const [CurrentBookData,setCurrentBookData] = useState(null);
    const [AllFavorites,setAllFavorites] = useState<any>([]);
    const [GlobalBooking,setGlobalBooking] = useState<any>(null);
  return (
    <User.Provider value={{user,setUser,CurrentBookData,setCurrentBookData,AllFavorites,setAllFavorites,GlobalBooking,setGlobalBooking}}>
        {
            children
        }
    </User.Provider>
  )
}