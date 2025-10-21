import React, { createContext, useState } from 'react';

export const User:any = createContext<any>(null);
export default function UserContext({children}:any) {
    const [user,setUser] = useState<any>(null);
    const [CurrentBookData,setCurrentBookData] = useState(null);
    const [AllFavorites,setAllFavorites] = useState<any>([]);
  return (
    <User.Provider value={{user,setUser,CurrentBookData,setCurrentBookData,AllFavorites,setAllFavorites}}>
        {
            children
        }
    </User.Provider>
  )
}